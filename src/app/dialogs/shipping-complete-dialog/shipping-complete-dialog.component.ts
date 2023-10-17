import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalService } from 'src/app/common/services/global.service';
import { IConsolidationApi } from 'src/app/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/services/consolidation-api/consolidation-api.service';

@Component({
  selector: 'app-shipping-complete-dialog',
  templateUrl: './shipping-complete-dialog.component.html',
  styleUrls: ['./shipping-complete-dialog.component.scss']
})
export class ShippingCompleteDialogComponent implements OnInit {

  displayedColumns1: string[] = ['itemNumber', 'lineNumber', 'toteID', 'transactionQuantity', 'completedQuantity', 'containerID', 'shipQuantity', 'completedTime'];
  displayedColumns2: string[] = ['containerID', 'carrierName', 'trackingNumber', 'freight', 'freight1', 'freight2', 'weight', 'length', 'width', 'height', 'cube', 'completedTime'];
  dataSourceList: any;
  tableData1: any = new MatTableDataSource([]);
  tableData2: any = new MatTableDataSource([]);
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('MatSort1') sort1: MatSort;
  @ViewChild('MatSort2') sort2: MatSort;

  public IconsolidationAPI : IConsolidationApi;

  constructor(
    public consolidationAPI : ConsolidationApiService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _liveAnnouncer1: LiveAnnouncer,
    private global : GlobalService,
    private _liveAnnouncer2: LiveAnnouncer
  ) { this.IconsolidationAPI = consolidationAPI; }

  ngOnInit(): void {
    this.viewShipping(this.data.orderNumber);
  }

  viewShipping(orderNumber: any, loader: boolean = false) {
    this.IconsolidationAPI.viewShipping({ orderNum: orderNumber }).subscribe((res: any) => {
      if (res.isExecuted )
      {
        if (res.data) {
          this.tableData1 = new MatTableDataSource(res.data.packTable);
          this.tableData1.paginator = this.paginator1;
          this.tableData2 = new MatTableDataSource(res.data.shipTable);
          this.tableData2.paginator = this.paginator2;
        } else {
          this.tableData1 = new MatTableDataSource([]);
          this.tableData2 = new MatTableDataSource([]);
        }


      }

      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("viewShipping",res.responseMessage);

      }
    });
  }

  //Sorting
  announceSortChange1(sortState: Sort) {
    sortState.active = this.displayedColumns1.filter((x: any) => x == sortState.active)[0];
    if (sortState.direction) {
      this._liveAnnouncer1.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer1.announce('Sorting cleared');
    }
    this.tableData1.sort = this.sort1;
  }

  announceSortChange2(sortState: Sort) {
    sortState.active = this.displayedColumns2.filter((x: any) => x == sortState.active)[0];
    if (sortState.direction) {
      this._liveAnnouncer2.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer2.announce('Sorting cleared');
    }
    this.tableData2.sort = this.sort2;
  }
}
