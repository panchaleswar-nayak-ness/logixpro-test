import { LiveAnnouncer } from '@angular/cdk/a11y';
import labels from '../../../labels/labels.json';
import { Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {  } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { LaLocationAssignmentQuantitiesComponent } from '../../dialogs/la-location-assignment-quantities/la-location-assignment-quantities.component';
import { AuthService } from 'src/app/init/auth.service'; 
import {  } from 'jquery';

import {  } from '@popperjs/core';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

export interface PeriodicElement {
  location: number;
  warehouse: string;
  zone: string;
  carousel: string;
  row: string;
}

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss']
})
export class CountComponent implements OnInit {
  public iAdminApiService: IAdminApiService;
  public userData: any;
  public totalCount: any;
  public searchOrder: string = '';
  public searchOrder1: string = '';

  displayedColumns: string[] = ['orderNumber'  , 'itemCount', 'priority', 'requiredDate','actions'];
  displayedColumns1: string[] = ['orderNumber', 'itemCount', 'priority', 'requiredDate','actions'];
  
  OldleftTable:any = [];
  leftTable:any = new MatTableDataSource([]);
  rightTable:any = new MatTableDataSource([]);

  constructor(private _liveAnnouncer: LiveAnnouncer ,
              private global:GlobalService ,
              private authservice : AuthService,
              private Api: ApiFuntions,
              private adminApiService: AdminApiService,
              ) {
                this.iAdminApiService = adminApiService;
              }


  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator1') paginator1: MatPaginator;

 

  @ViewChild('matSort') sort: MatSort;
  @ViewChild('matSort1') sort1: MatSort;

  @ViewChild('deleteAction') quarantineTemp: TemplateRef<any>;

  @ViewChild('addOrder') addOrderTemp: TemplateRef<any>;
  @Output() newItemEvent = new EventEmitter<Event>();
  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  ngAfterViewInit() {
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
      let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
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
      this.global.ShowToastr('error',"There were no orders selected for location assignment marking", 'No Orders Selected');
    }
  }

  locationAssignment(){

    let orders = this.rightTable.data.map((data) => data.orderNumber)
     
    let payload = {
      "transType": "count",
      "orders": orders, 
    }
    this.iAdminApiService.LocationAssignmentOrderInsert(payload).subscribe((res => {
     console.log(res.data.orders,'insertion')
     if(res.isExecuted){
      let testdata = res.data.orders
     this.rightTable.data = this.rightTable.data.filter((data) => !testdata.includes(data.orderNumber)) 
     this.global.ShowToastr('success',labels.alert.success, 'Success!');
     }
     else{
      this.global.ShowToastr('success',res.responseMessage, 'Success!');
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
    }

    this.iAdminApiService.GetTransactionTypeCounts(payload).subscribe((res =>{
    let dialogRef:any = this.global.OpenDialog(LaLocationAssignmentQuantitiesComponent, {
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
