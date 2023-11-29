import { LiveAnnouncer } from '@angular/cdk/a11y';
import labels from 'src/app/common/labels/labels.json';
import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {  } from '../../dialogs/delete-confirmation/delete-confirmation.component';

import { AuthService } from 'src/app/common/init/auth.service'; 
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

import { error } from 'jquery';
import { ConfirmationMessages, ToasterTitle, ToasterType ,LiveAnnouncerMessage,ResponseStrings,DialogConstants,Style,UniqueConstants,Column,ColumnDef} from 'src/app/common/constants/strings.constants';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { LaLocationAssignmentQuantitiesComponent } from '../../dialogs/la-location-assignment-quantities/la-location-assignment-quantities.component';

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
  
  // oldleftTable:any = [];
  // public totalCount: any;
   public searchOrderLeft: string = '';
   public searchOrderRight: string = '';
 // setTime:any =false;

  displayedColumnsRight: string[] = ['orderNumber'  , UniqueConstants.itemCount, UniqueConstants.Priority, 'requiredDate',ColumnDef.Actions];
  displayedColumnsLeft: string[] = ['orderNumber', UniqueConstants.itemCount, UniqueConstants.Priority, 'requiredDate',ColumnDef.Actions];

  leftTable:any = new MatTableDataSource([]);
  rightTable:any = new MatTableDataSource([]);

  constructor(private _liveAnnouncer: LiveAnnouncer ,
              private global:GlobalService ,
              private authService : AuthService,
              private Api: ApiFuntions,
              private adminApiService: AdminApiService,
              ) {
                this.iAdminApiService = adminApiService;
              }


  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('matSort') leftSort: MatSort;
  @ViewChild('matSort1') RightSort: MatSort;
  @ViewChild('deleteAction') quarantineTemp: TemplateRef<any>;

  @ViewChild('addOrder') addOrderTemp: TemplateRef<any>;
  @Output() newItemEvent = new EventEmitter<Event>(); 

  public userData: any;

  ngOnInit(): void {
    this.userData = this.authService.userData()
    this.openLAQ();
  }

  announceSortChangeLeftTable(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.leftTable.sort = this.leftSort;    
  }
  announceSortChangeRightTable(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.rightTable.sort = this.RightSort;    
  }

  quarantineDialog(): void {
    if(this.rightTable.data.length > 0){
      let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
      disableClose:true,
        data: {
          heading: 'Mark Selected Orders for COUNT Location Assignment?',
          message: 'Do you want to mark these orders for location assignment?',
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === ResponseStrings.Yes) {
          this.locationAssignment()
        }
      })
    }
    else{
      this.global.ShowToastr(ToasterType.Error,"There were no orders selected for location assignment marking", ConfirmationMessages.NoOrdersSelected);
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
     this.global.ShowToastr(ToasterType.Success,"Your details have been added", ToasterTitle.Success);
     }
     else{
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      console.log("LocationAssignmentOrderInsert",res.responseMessage);
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
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
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
  

  applyLeftFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); 
    this.leftTable.filter = filterValue; 
  }


  applyRightFilter(filterValue: string) {
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
