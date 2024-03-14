import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BmToteidEntryComponent } from 'src/app/admin/dialogs/bm-toteid-entry/bm-toteid-entry.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogConstants, ResponseStrings, Style } from 'src/app/common/constants/strings.constants';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-bulk-pick',
  templateUrl: './bulk-pick.component.html',
  styleUrls: ['./bulk-pick.component.scss']
})
export class BulkPickComponent implements OnInit {

  verifyBulkPicks: boolean = false;
  status: any = {}
  view: string = "";
  NextToteID: any;
  ordersDisplayedColumns: string[] = ['batchPickId', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
  selectedOrdersDisplayedColumns: string[] = ['orderNumber', 'toteNumber'];
  orders: any = [];
  Prefernces: any;
  selectedOrders: any = [];
  nextBatchId: string = '';
  batchSeleted: boolean = false;
  public iBulkProcessApiService: IBulkProcessApiService;
  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    private global: GlobalService
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
  }

  ngOnInit(): void {
    this.bulkPickoOrderBatchToteQty();
    this.getworkstationbulkzone();
    this.BatchNextTote();
  }

  bulkPickoOrderBatchToteQty() {
    let paylaod = {
      "type": 'pick'
    }
    this.iBulkProcessApiService.bulkPickoOrderBatchToteQty(paylaod).subscribe((res: any) => {
      if (res) {
        this.status = res;
        this.status.linesCount = 0;
        if (this.status.batchCount > 0) {
          this.bulkPickBatches();
          this.view = "batch";
          this.ordersDisplayedColumns = ['batchPickId', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
          this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber'];
        }
        else if (this.status.toteCount > 0) {
          this.bulkPickTotes();
          this.view = "tote";
          this.ordersDisplayedColumns = ['toteId', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
          this.selectedOrdersDisplayedColumns = ['toteId', 'toteNumber', 'actions'];
        }
        else {
          this.bulkPickOrders();
          this.view = "order";
          this.ordersDisplayedColumns = ['orderNumber', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
          this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber', 'actions'];
        }
      }
    });
  }

  bulkPickBatches() {
    let paylaod = {
      "type": 'pick',
      "start": 0,
      "size": 5000,
      "includeChildren": "false"
    }
    this.iBulkProcessApiService.bulkPickBatches(paylaod).subscribe((res: any) => {
      if (res) {
        this.orders = res;
        this.selectedOrders = [];
      }
    });
  }

  bulkPickTotes() {
    let paylaod = {
      "type": 'pick',
      "start": 0,
      "size": 5000,
      "status": "open",
      "area": " "
    }
    this.iBulkProcessApiService.bulkPickTotes(paylaod).subscribe((res: any) => {
      if (res) {
        this.orders = res;
        this.selectedOrders = [];
      }
    });
  }

  bulkPickOrders() {
    let paylaod = {
      "type": 'pick',
      "start": 0,
      "size": 5000,
      "status": "open",
      "area": " "
    }
    this.iBulkProcessApiService.bulkPickOrders(paylaod).subscribe((res: any) => {
      if (res) {
        this.orders = res;
        this.selectedOrders = [];
      }
    });
  }

  pickProcess() {
    if (this.Prefernces?.pickToTotes) this.OpenNextToteId();
    else this.changeVisibiltyVerifyBulk(false);
  }

  changeVisibiltyVerifyBulk(event: any) {
    if (event) {
      this.bulkPickoOrderBatchToteQty();
    }
    this.verifyBulkPicks = !this.verifyBulkPicks;
  }

  changeView(event: any) {
    this.view = event;
    if (event == "batch") {
      this.ordersDisplayedColumns = ['batchPickId', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
      this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber'];
      this.bulkPickBatches();
    }
    else if (event == "tote") {
      this.ordersDisplayedColumns = ['toteId', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
      this.selectedOrdersDisplayedColumns = ['toteId', 'toteNumber', 'actions'];
      this.bulkPickTotes();
    }
    else if (event == "order") {
      this.ordersDisplayedColumns = ['orderNumber', 'transactionQuantity', 'priority', 'requiredDate', 'actions'];
      this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber', 'actions'];
      this.bulkPickOrders();
    }
    this.status.linesCount = 0;
    this.batchSeleted = false;
  }

  selectOrder(event: any) {
    event.toteNumber = this.selectedOrders.length + 1;
    if (this.view == "batch") {
      let paylaod = {
        "type": 'pick',
        "batchpickid": event.batchPickId,
        "status": "open",
      }
      this.iBulkProcessApiService.bulkPickBatchId(paylaod).subscribe((res: any) => {
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
        this.verifyBulkPicks = !this.verifyBulkPicks;
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
    this.iBulkProcessApiService.bulkPreferences().subscribe((res: any) => {
      this.Prefernces = res.workstationPreferences[0];
    })
  }

  BatchNextTote() {
    this.iBulkProcessApiService.BatchNextTote().subscribe((res: any) => {
      this.NextToteID = res;
    })
  }

  removeAll() {
    if (this.view == "batch") this.bulkPickBatches();
    else this.orders = [...this.orders, ...this.selectedOrders];
    this.selectedOrders = [];
    this.status.linesCount = 0;
    this.batchSeleted = false;
  }

  async printDetailList(event: any) {
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

  async createBatchNow() {
    let res: any = await this.iBulkProcessApiService.BatchesNextBatchID();
    if (res?.status == HttpStatusCode.Ok) {
      this.nextBatchId = res.body;
      const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
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
          let payload = {
            "BatchData": this.selectedOrders.map((x: any, index: any) => ({ orderNumber: x.orderNumber, toteNumber: x.toteNumber })),
            "nextBatchID": this.nextBatchId,
            "transactionType": "Pick"
          }
          let res2: any = await this.iBulkProcessApiService.BulkPickCreateBatch(payload);
          if (res2?.status == HttpStatusCode.Ok) {
            this.printItemLabelsNow();
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
      this.bulkPickoOrderBatchToteQty();
    });
  }

}

