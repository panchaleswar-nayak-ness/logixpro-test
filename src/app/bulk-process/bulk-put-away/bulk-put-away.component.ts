import { HttpStatusCode } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BmToteidEntryComponent } from 'src/app/admin/dialogs/bm-toteid-entry/bm-toteid-entry.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BatchesByIdRequest, BatchesRequest, BatchesResponse, BulkPreferences, CreateBatchRequest, OrderBatchToteQtyRequest, OrderBatchToteQtyResponse, OrderResponse, OrdersRequest, TotesRequest, TotesResponse, WorkstationPreference } from 'src/app/common/Model/bulk-transactions';
import { DialogConstants, ResponseStrings, Style } from 'src/app/common/constants/strings.constants';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-bulk-put-away',
  templateUrl: './bulk-put-away.component.html',
  styleUrls: ['./bulk-put-away.component.scss']
})
export class BulkPutAwayComponent implements OnInit {
  ifAllowed:boolean;
  verifyBulkPutAway: boolean = false;
  status: any = {}
  view: string = "";
  NextToteID: any;
  ordersDisplayedColumns: string[] = ['batchPickId', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
  selectedOrdersDisplayedColumns: string[] = ['orderNumber', 'toteNumber'];
  orders: any = [];
  Prefernces: WorkstationPreference;
  selectedOrders: any = [];
  nextBatchId: string = '';
  batchSeleted: boolean = false;
  IsBatch: boolean = false;
  public iBulkProcessApiService: IBulkProcessApiService;
  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    private global: GlobalService
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
  }

  ngOnInit(): void {
    this.bulkPutAwayOrderBatchToteQty();
    this.getworkstationbulkzone();
    this.BatchNextTote();
    this.ifAllowed = false;
  }

  bulkPutAwayOrderBatchToteQty() {
    let payload: OrderBatchToteQtyRequest = new OrderBatchToteQtyRequest();
    payload.type = 'Put Away'; 
    this.iBulkProcessApiService.bulkPickoOrderBatchToteQty(payload).subscribe((res: OrderBatchToteQtyResponse) => {
      if (res) {
        this.status = res;
        this.status.linesCount = 0;
        if (this.status.batchCount > 0) {
          this.bulkPutAwayBatches();
          this.view = "batch";
          this.ordersDisplayedColumns = ['batchPickId', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
          this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber'];
        }
        else if (this.status.toteCount > 0) {
          this.bulkPutAwayTotes();
          this.view = "tote";
          this.ordersDisplayedColumns = ['toteId', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
          this.selectedOrdersDisplayedColumns = ['toteId', 'toteNumber', 'actions'];
        }
        else {
          this.bulkPutAwayOrders();
          this.view = "order";
          this.ordersDisplayedColumns = ['orderNumber', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
          this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber', 'actions'];
        }
      }
    });
  }
  bulkPutAwayBatches() {
    let payload: BatchesRequest = new BatchesRequest();
    payload.type = "Put Away";
    payload.start = 0;
    payload.size = 5000;
    payload.includeChildren = "false";
    this.iBulkProcessApiService.bulkPickBatches(payload).subscribe((res: BatchesResponse[]) => {
      if (res) {
        this.orders = res;
        this.selectedOrders = [];
      }
    });
  }

  bulkPutAwayTotes() {
    let payload: TotesRequest = new TotesRequest();
    payload.type = "Put Away";
    payload.start = 0;
    payload.size = 5000;
    payload.status = "open";
    payload.area = " ";
    this.iBulkProcessApiService.bulkPickTotes(payload).subscribe((res: TotesResponse[]) => {
      if (res) {
        this.orders = res;
        this.selectedOrders = [];
      }
    });
  }

  bulkPutAwayOrders() {
    let payload: OrdersRequest = new OrdersRequest();
    payload.type = "Put Away";
    payload.start = 0;
    payload.size = 5000;
    payload.status = "open";
    payload.area = " ";
    this.iBulkProcessApiService.bulkPickOrders(payload).subscribe((res: OrderResponse[]) => {
      if (res) {
        this.orders = res;
        this.selectedOrders = [];
      }
    });
  }

  putawayProcess() {
    if (this.Prefernces?.pickToTotes) this.OpenNextToteId();
    else  this.changeVisibiltyVerifyBulk(false);  
  }

  changeVisibiltyVerifyBulk(event: any) {
    debugger
    if (event) {
    this.bulkPutAwayOrderBatchToteQty();
    }
    this.verifyBulkPutAway = !this.verifyBulkPutAway;
    this.ifAllowed = this.verifyBulkPutAway; 
  }

  changeView(event: any) {
    this.view = event;
    if (event == "batch") {
      this.ordersDisplayedColumns = ['batchPickId', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
      this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber'];
      this.bulkPutAwayBatches();
    }
    else if (event == "tote") {
      this.ordersDisplayedColumns = ['toteId', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
      this.selectedOrdersDisplayedColumns = ['toteId', 'toteNumber', 'actions'];
      this.bulkPutAwayTotes();
    }
    else if (event == "order") {
      this.ordersDisplayedColumns = ['orderNumber', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
      this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber', 'actions'];
      this.bulkPutAwayOrders();
    }
    this.status.linesCount = 0;
    this.batchSeleted = false;
  }

  selectOrder(event: any) {
    event.toteNumber = this.selectedOrders.length + 1;
    if (this.view == "batch") {
      let payload: BatchesByIdRequest = new BatchesByIdRequest();
      payload.type = "Put Away";
      payload.batchpickid = event.batchPickId;
      payload.status = "open";
      this.iBulkProcessApiService.bulkPickBatchId(payload).subscribe((res: BatchesResponse[]) => {
        if (res) {
          this.selectedOrders = res;
          this.selectedOrders.forEach((element: any, index: any) => { element.toteNumber = index + 1 });
          this.batchSeleted = true;
        }
      });
    }
    else {
      this.selectedOrders.forEach((element: any, index: any) => { element.toteNumber = index + 1 });
      this.selectedOrders = [...this.selectedOrders, event];
    }
    this.orders = this.orders.filter((x: any) => x.id != event.id);
    this.status.linesCount = this.status.linesCount + 1;
  }

  OpenNextToteId() {
    let dialogRefTote = this.global.OpenDialog(BmToteidEntryComponent, {
      height: 'auto',
      width: '990px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        selectedOrderList: this.selectedOrders,
        nextToteID: this.NextToteID,
        BulkProcess: true,
        view: this.view
      }
    });
    dialogRefTote.afterClosed().subscribe((result) => {
      if (result.length > 0) {
        this.selectedOrders = result;
        this.verifyBulkPutAway = !this.verifyBulkPutAway;
      }
    });
  }

  removeOrder(event: any) {
    this.orders = [...this.orders, event];
    this.selectedOrders = this.selectedOrders.filter((x: any) => x.id != event.id);
    this.selectedOrders.forEach((element: any, index: any) => { element.toteNumber = index + 1 });
    this.status.linesCount = this.status.linesCount - 1;
  }

  appendAll() {
    this.selectedOrders = [...this.selectedOrders, ...this.orders];
    this.selectedOrders.forEach((element: any, index: any) => { element.toteNumber = index + 1 });
    this.orders = [];
    this.status.linesCount = this.selectedOrders.length;
  }

  getworkstationbulkzone() {
    this.iBulkProcessApiService.bulkPreferences().subscribe((res: BulkPreferences) => {
      this.Prefernces = res.workstationPreferences[0];
    })
  }

  BatchNextTote() {
    this.iBulkProcessApiService.BatchNextTote().subscribe((res: number) => {
      this.NextToteID = res;
    })
  }

  removeAll() {
    if (this.view == "batch") this.bulkPutAwayBatches();
    else this.orders = [...this.orders, ...this.selectedOrders];
    this.selectedOrders = [];
    this.status.linesCount = 0;
    this.batchSeleted = false;
  }

  async printDetailList() {
    const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: `Touch 'Yes' to print all orders as a batch`,
        message2: `Touch 'No' to print a page for each order.`,
        heading: 'Print Batch Or Order',
        buttonFields: true,
        threeButtons: true
      },
    });
    dialogRef1.afterClosed().subscribe(async (res: any) => {
      if (res == ResponseStrings.Yes) {

      }
      else if (res == ResponseStrings.No) {

      }
      else if (res == ResponseStrings.Cancel) {
        if (this.view != "batch") await this.createBatchNow();
        
      }
    });
  }

  async createBatchNow($event:any = false) {
    this.IsBatch = $event;
    let res = await this.iBulkProcessApiService.BatchesNextBatchID();
    if (res?.status == HttpStatusCode.Ok) {
      this.nextBatchId = res.body;
      const dialogRef1 = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          message: `Touch ‘Yes’ to Assign the Selected Orders to Batch ID ${this.nextBatchId}. Touch ‘No’ to Cancel Batching.`,
          heading: 'Create Batch Now?',
          buttonFields: true
        },
      });
      dialogRef1.afterClosed().subscribe(async (resp: any) => {
        if (resp == ResponseStrings.Yes) {
          let payload: CreateBatchRequest = new CreateBatchRequest();
          payload.nextBatchID = this.nextBatchId;
          payload.transactionType = "Put Away";
          payload.BatchData = this.selectedOrders.map((item) => ({ orderNumber: item.orderNumber, toteNumber: item.toteNumber }));
          let res2 = await this.iBulkProcessApiService.BulkPickCreateBatch(payload);
          if (res2?.status == HttpStatusCode.Ok) {
            if(!this.IsBatch) this.printItemLabelsNow();
            else {
             this.selectedOrders = [];
             this.bulkPutAwayOrderBatchToteQty();
            }
          }
        }
      });
    }
  }

  printItemLabelsNow() {
    const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: `Touch ‘Yes’ to print a label for each item in this batch`,
        heading: 'Print Item Labels Now?',
        buttonFields: true
      },
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if (resp == ResponseStrings.Yes) {
      }
      this.selectedOrders = [];
      this.bulkPutAwayOrderBatchToteQty();
    });
  }

}

