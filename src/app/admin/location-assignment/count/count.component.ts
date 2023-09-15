import { LiveAnnouncer } from '@angular/cdk/a11y';
import labels from '../../../labels/labels.json';
import { Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { LaLocationAssignmentQuantitiesComponent } from '../../dialogs/la-location-assignment-quantities/la-location-assignment-quantities.component';
import { AuthService } from 'src/app/init/auth.service'; 
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { left } from '@popperjs/core';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

export interface PeriodicElement {
  location: number;
  warehouse: string;
  zone: string;
  carousel: string;
  row: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {location: 10124, warehouse: '0110203C01', zone: '05', carousel: '14-Feb-2022',row:''},
// ];
@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss']
})
export class CountComponent implements OnInit {

  public userData: any;
  public totalCount: any;
  public searchOrder: string = '';
  public searchOrder1: string = '';

  // displayedColumns: string[] = ['location', 'warehouse', 'zone', 'carousel','row'];
  displayedColumns: string[] = ['orderNumber'  , 'itemCount', 'priority', 'requiredDate','actions'];
  displayedColumns1: string[] = ['orderNumber', 'itemCount', 'priority', 'requiredDate','actions'];
  
  OldleftTable:any = [];
  leftTable:any = new MatTableDataSource([]);
  rightTable:any = new MatTableDataSource([]);

  // dataSource = new MatTableDataSource([]);
  constructor(private _liveAnnouncer: LiveAnnouncer ,
              private dialog: MatDialog ,
              private authservice : AuthService,
              private Api: ApiFuntions,
              private toastr: ToastrService) {}

  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator1: MatPaginator;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator1') paginator1: MatPaginator;

 

  @ViewChild('matSort') sort: MatSort;
  @ViewChild('matSort1') sort1: MatSort;

  @ViewChild('deleteAction') quarantineTemp: TemplateRef<any>;

  @ViewChild('addOrder') addOrderTemp: TemplateRef<any>;
  @Output() newItemEvent = new EventEmitter<Event>();
  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    this.searchBoxField.nativeElement.focus();
  }

  ngOnInit(): void {
    this.userData = this.authservice.userData()
    this.openLAQ();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.leftTable.sort = this.sort;    
  }
  announceSortChange1(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.rightTable.sort = this.sort1;    
  }

  quarantineDialog(): void {
    if(this.rightTable.data.length > 0){
      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          heading: 'Mark Selected Orders for COUNT Location Assignment?',
          message: 'Do you want to mark these orders for location assignment?',
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Yes') {
          this.locationAssignment()
        }
      })
    }
    else{
      this.toastr.error("There were no orders selected for location assignment marking", 'No Orders Selected', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
  }

  locationAssignment(){

    let orders = this.rightTable.data.map((data) => data.orderNumber)
     
    let payload = {
      "transType": "count",
      "orders": orders,
      "userName" : this.userData.userName,
      "wsid": this.userData.wsid
    }
    this.Api.LocationAssignmentOrderInsert(payload).subscribe((res => {
     console.log(res.data.orders,'insertion')
     if(res.isExecuted){
      let testdata = res.data.orders
     this.rightTable.data = this.rightTable.data.filter((data) => !testdata.includes(data.orderNumber)) 
     this.toastr.success(labels.alert.success, 'Success!', {
      positionClass: 'toast-bottom-right',
      timeOut: 2000
    });
     }
     else{
      this.toastr.success(res.responseMessage, 'Success!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
     }
    }))
  }

  addOrdereDialog(): void {
    this.rightTable = new MatTableDataSource(this.rightTable.data.concat(this.leftTable.data));
    this.leftTable = new MatTableDataSource([]);
    this.leftTable.paginator = this.paginator
    this.rightTable.paginator = this.paginator1
  }

  deleteItem() {
    this.leftTable = new MatTableDataSource(this.leftTable.data.concat(this.rightTable.data));
    this.rightTable = new MatTableDataSource([]);
    this.leftTable.paginator = this.paginator
    this.rightTable.paginator = this.paginator1
  }
  
  openLAQ() {
    let payload = {
      "userName" : this.userData.userName,
      "wsid": this.userData.wsid
    }

    this.Api.GetTransactionTypeCounts(payload).subscribe((res =>{
    let dialogRef = this.dialog.open(LaLocationAssignmentQuantitiesComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {  
        'totalCount': res.data
      }
   
    
    })
    dialogRef.afterClosed().subscribe(result => {
      this.leftTable = new MatTableDataSource(result);
      this.leftTable.paginator = this.paginator
      this.newItemEvent.emit(result.tabIndex);
      
    })
  }))
    
  }

  add(e:any){
    this.rightTable = new MatTableDataSource(this.rightTable.data.concat(e));
    this.leftTable = new MatTableDataSource(this.leftTable.data.filter((data) => data.orderNumber != e.orderNumber));
    this.leftTable.paginator = this.paginator
    this.rightTable.paginator = this.paginator1
  }
  remove(e:any){
    this.leftTable = new MatTableDataSource(this.leftTable.data.concat(e));
    this.rightTable =new MatTableDataSource(this.rightTable.data.filter((data) => data.orderNumber != e.orderNumber));
    this.leftTable.paginator = this.paginator
    this.rightTable.paginator = this.paginator1
  }
  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); 
    this.leftTable.filter = filterValue; 
  }


  applyFilter1(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); 
    this.rightTable.filter = filterValue;
  }
  
  @ViewChild('table1') table1: MatTable<any>;

  @ViewChild('table2') table2: MatTable<any>;




ngAfterViewChecked(): void {

    if (this.table1) {

        this.table1.updateStickyColumnStyles();

    }

    if (this.table2) {

      this.table2.updateStickyColumnStyles();

  }

}

}
