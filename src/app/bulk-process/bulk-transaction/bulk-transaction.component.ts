import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { BmToteidEntryComponent } from 'src/app/admin/dialogs/bm-toteid-entry/bm-toteid-entry.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BatchesRequest, BatchesResponse, BulkPreferences, CreateBatchRequest, OrderBatchToteQtyRequest, OrderBatchToteQtyResponse, OrderLineResource, OrderResponse, OrdersRequest, TotesRequest, TotesResponse } from 'src/app/common/Model/bulk-transactions';
import { DialogConstants, ResponseStrings, Style } from 'src/app/common/constants/strings.constants';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-bulk-transaction',
  templateUrl: './bulk-transaction.component.html',
  styleUrls: ['./bulk-transaction.component.scss']
})
export class BulkTransactionComponent implements OnInit {
  ifAllowed: boolean;
 
  verifyBulks: boolean = false;
  status: OrderBatchToteQtyResponse;
  view: string = "";
  NextToteID: number;
  ordersDisplayedColumns: string[] = ['batchId', 'lineCount', 'priority', 'actions'];
  selectedOrdersDisplayedColumns: string[] = ['orderNumber', 'toteNumber'];
  orders: any = [];
  Prefernces: BulkPreferences;
  selectedOrders: any = [];
  nextBatchId: string = '';
  batchSeleted: boolean = false;
  orderLines: OrderLineResource[] = [];
  url:string;
  IsBatch:any = false;
  public iBulkProcessApiService: IBulkProcessApiService;
  
  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    private global: GlobalService,
    private route:Router
  ) { 
    this.iBulkProcessApiService = bulkProcessApiService;
    debugger
    this.url = route.url.split("/")[2].replace("Bulk","");
  }

  ngOnInit(): void {
    this.bulkOrderBatchToteQty();
    this.getworkstationbulkzone();
    this.BatchNextTote();
    this.ifAllowed = false;
  }

  bulkOrderBatchToteQty() {
    let payload: OrderBatchToteQtyRequest = new OrderBatchToteQtyRequest();
    payload.type = this.capitalizeWords(this.url);
    this.batchSeleted = false;
    this.iBulkProcessApiService.bulkPickoOrderBatchToteQty(payload).subscribe((res: OrderBatchToteQtyResponse) => {
      if (res) {
        this.orderLines = [];
        this.status = res;
        this.status.orderLinesCount = 0;
        if (this.status.batchCount > 0) {
          this.bulkBatches();
          this.view = "batch";
          this.ordersDisplayedColumns = ['batchId', 'lineCount', 'priority', 'actions'];
          this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber'];
        }
        else if (this.status.toteCount > 0) {
          this.bulkTotes();
          this.view = "tote";
          this.ordersDisplayedColumns = ['toteId', 'lineCount', 'priority', 'requiredDate', 'actions'];
          this.selectedOrdersDisplayedColumns = ['toteId', 'toteNumber', 'actions'];
        }
        else {
          this.bulkOrders();
          this.view = "order";
          this.ordersDisplayedColumns = ['orderNumber', 'lineCount', 'priority', 'requiredDate', 'actions'];
          this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber', 'actions'];
        }
      }
    });
  }

  bulkBatches() {
    let payload: BatchesRequest = new BatchesRequest();
    payload.type = this.capitalizeWords(this.url);
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

  bulkTotes() {
    let payload: TotesRequest = new TotesRequest();
    payload.type = this.capitalizeWords(this.url);
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

  bulkOrders() {
    let payload: OrdersRequest = new OrdersRequest();
    payload.type = this.capitalizeWords(this.url);
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

  Process() {
    if (this.Prefernces?.workstationPreferences?.pickToTotes) this.OpenNextToteId();
    else this.changeVisibiltyVerifyBulk(false);
  }

  changeVisibiltyVerifyBulk(event: boolean) {
    if (event) {
      this.bulkOrderBatchToteQty();
    }
    this.verifyBulks = !this.verifyBulks;
    this.ifAllowed = this.verifyBulks;
  }

  changeView(event: string) {
    this.view = event;
    this.orders = [];
    this.selectedOrders = [];
    if (event == "batch") {
      this.ordersDisplayedColumns = ['batchId', 'lineCount', 'priority', 'actions'];
      this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber'];
      this.bulkBatches();
    }
    else if (event == "tote") {
      this.ordersDisplayedColumns = ['toteId', 'lineCount', 'priority', 'requiredDate', 'actions'];
      this.selectedOrdersDisplayedColumns = ['toteId', 'toteNumber', 'actions'];
      this.bulkTotes();
    }
    else if (event == "order") {
      this.ordersDisplayedColumns = ['orderNumber', 'lineCount', 'priority', 'requiredDate', 'actions'];
      this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber', 'actions'];
      this.bulkOrders();
    }
    this.batchSeleted = false;
  }
   
  capitalizeWords(inputString) {
    // Use regular expression to insert space before each capital letter
    return inputString.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  selectOrder(event: any) {
    event.toteNumber = this.selectedOrders.length + 1;
    this.orderLines = [];
    if (this.view == "batch") {
      this.selectedOrders = event.orders;
      this.orders = this.orders.filter((element) => element.batchId != event.batchId);
      this.batchSeleted = true;
    }
    else if (this.view == "tote") {
      this.selectedOrders.forEach((element, index) => { element.toteNumber = index + 1 });
      this.selectedOrders = [...this.selectedOrders, event];
      this.orders = this.orders.filter((element) => element.toteId != event.toteId);
    }
    else if (this.view == "order") {
      this.selectedOrders.forEach((element, index) => { element.toteNumber = index + 1 });
      this.selectedOrders = [...this.selectedOrders, event];
      this.orders = this.orders.filter((element) => element.orderNumber != event.orderNumber);
    }
    this.status.orderLinesCount = this.status.orderLinesCount + event.lineCount;
    this.selectedOrders.forEach((element) => { this.orderLines = this.orderLines.concat(element.orderLines) });
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
        this.selectedOrders.forEach((order) => {
          order.orderLines.forEach((orderLine) => {
            orderLine.toteId = order.toteId;
          });
        });
        this.verifyBulks = !this.verifyBulks;
      }
    });
  }

  removeOrder(event) {
    this.orderLines = [];
    if (this.view == "tote") {
      this.orders = [event, ...this.orders];
      this.selectedOrders = this.selectedOrders.filter((element) => element.toteId != event.toteId);
    }
    else if (this.view == "order") {
      this.orders = [event, ...this.orders];
      this.selectedOrders = this.selectedOrders.filter((element) => element.orderNumber != event.orderNumber);
    }
    this.status.orderLinesCount = this.status.orderLinesCount - event.lineCount;
    this.selectedOrders.forEach((element, index) => { element.toteNumber = index + 1; this.orderLines = this.orderLines.concat(element.orderLines)});
  }

  appendAll() {
    this.orderLines = [];
    this.selectedOrders = [...this.selectedOrders, ...this.orders];
    this.selectedOrders.forEach((element, index) => { element.toteNumber = index + 1; this.status.orderLinesCount = this.status.orderLinesCount + element.lineCount; this.orderLines = this.orderLines.concat(element.orderLines); });
    this.orders = [];
  }

  getworkstationbulkzone() {
    this.iBulkProcessApiService.bulkPreferences().subscribe((res: BulkPreferences) => {
      this.Prefernces = res;
    })
  }

  BatchNextTote() {
    this.iBulkProcessApiService.BatchNextTote().subscribe((res: number) => {
      this.NextToteID = res;
    })
  }

  removeAll() {
    if (this.view == "batch") this.bulkBatches();
    else this.orders = [...this.orders, ...this.selectedOrders];
    this.selectedOrders = [];
    this.batchSeleted = false;
    this.status.orderLinesCount = 0;
    this.orderLines = [];
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

  async createBatchNow($event = false) {
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
          payload.transactionType = this.capitalizeWords(this.url);
          payload.BatchData = this.selectedOrders.map((item) => ({ orderNumber: item.orderNumber, toteNumber: item.toteNumber }));
          let res2 = await this.iBulkProcessApiService.BulkPickCreateBatch(payload);
          if (res2?.status == HttpStatusCode.Ok) {
            if(!this.IsBatch) this.printItemLabelsNow();
            else {
             this.selectedOrders = [];
             this.bulkOrderBatchToteQty();
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
      this.bulkOrderBatchToteQty();
    });
  }

}

