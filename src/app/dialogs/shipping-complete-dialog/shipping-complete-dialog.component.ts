import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalService } from 'src/app/common/services/global.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import {  LiveAnnouncerMessage ,ToasterTitle,ToasterType,TableConstant,ColumnDef} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-shipping-complete-dialog',
  templateUrl: './shipping-complete-dialog.component.html',
  styleUrls: ['./shipping-complete-dialog.component.scss'],
})
export class ShippingCompleteDialogComponent implements OnInit {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  ItemNumber: string = this.fieldMappings.itemNumber;
  UserField1:string = this.fieldMappings.userField1;
  UserField2:string = this.fieldMappings.userField2;
  UserField3:string = this.fieldMappings.userField3;
  UserField4:string = this.fieldMappings.userField4;
  UserField5:string = this.fieldMappings.userField5;
  UserField6:string = this.fieldMappings.userField6;
  UserField7:string = this.fieldMappings.userField7;
  UserField8:string = this.fieldMappings.userField8;
  UserField9:string = this.fieldMappings.userField9;
  UserField10:string = this.fieldMappings.userField10;

  displayedColumns1: string[] = [
    'itemNumber',
    TableConstant.LineNumber,
    ColumnDef.ToteID,
    ColumnDef.TransactionQuantity,
    TableConstant.completedQuantity,
    'containerID',
    'shipQuantity',
    'completedTime',
  ];
  displayedColumns2: string[] = [
    'containerID',
    'carrierName',
    'trackingNumber',
    'freight',
    'freight1',
    'freight2',
    'weight',
    'length',
    'width',
    'height',
    'cube',
    'completedTime',
    'userField1',
    'userField2',
    'userField3',
    'userField4',
    'userField5',
    'userField6',
    'userField7',
  ];
  dataSourceList: any;
  tableData1: any = new MatTableDataSource([]);
  tableData2: any = new MatTableDataSource([]);
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('MatSort1') sort1: MatSort;
  @ViewChild('MatSort2') sort2: MatSort;

  public IconsolidationAPI: IConsolidationApi;

  constructor(
    public consolidationAPI: ConsolidationApiService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private liveAnnouncer1: LiveAnnouncer,
    private global: GlobalService,
    private liveAnnouncer2: LiveAnnouncer
  ) {
    this.IconsolidationAPI = consolidationAPI;
  }

  ngOnInit(): void {
    this.viewShipping(this.data.orderNumber);
  }

  viewShipping(orderNumber: any, loader: boolean = false) {
    this.IconsolidationAPI.viewShipping({ orderNum: orderNumber }).subscribe(
      (res: any) => {
        if (res.isExecuted) {
          if (res.data) {
            this.tableData1 = new MatTableDataSource(res.data.packTable);
            this.tableData1.paginator = this.paginator1;
            this.tableData2 = new MatTableDataSource(res.data.shipTable);
            this.tableData2.paginator = this.paginator2;
          } else {
            this.tableData1 = new MatTableDataSource([]);
            this.tableData2 = new MatTableDataSource([]);
          }
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          ); 
        }
      }
    );
  }

  announceSortChange1(sortState: Sort) {
    sortState.active = this.displayedColumns1.filter(
      (x: any) => x == sortState.active
    )[0];
    if (sortState.direction) {
      this.liveAnnouncer1.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer1.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.tableData1.sort = this.sort1;
  }

  announceSortChange2(sortState: Sort) {
    sortState.active = this.displayedColumns2.filter(
      (x: any) => x == sortState.active
    )[0];
    if (sortState.direction) {
      this.liveAnnouncer2.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer2.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.tableData2.sort = this.sort2;
  }
}
