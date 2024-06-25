import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BmToteidEntryComponent } from 'src/app/admin/dialogs/bm-toteid-entry/bm-toteid-entry.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BatchesRequest, BatchesResponse, BulkPreferences, BulkZone, CreateBatchRequest, OrderBatchToteQtyRequest, OrderBatchToteQtyResponse, OrderLineResource, OrderResponse, OrdersRequest, QuickPickOrdersRequest, TotesRequest, TotesResponse } from 'src/app/common/Model/bulk-transactions';
import { DialogConstants, ResponseStrings, Style, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { SharedService } from 'src/app/common/services/shared.service';
import {forkJoin} from "rxjs";
import {Observable} from "rxjs/internal/Observable";
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { SpinnerService } from 'src/app/common/init/spinner.service';

@Component({
  selector: 'app-bulk-transaction',
  templateUrl: './bulk-transaction.component.html',
  styleUrls: ['./bulk-transaction.component.scss']
})
export class BulkTransactionComponent implements OnInit {

  verifyBulks: boolean = false;
  status: OrderBatchToteQtyResponse = new OrderBatchToteQtyResponse();
  view: string = "";
  NextToteID: number;
  ordersDisplayedColumns: string[] = [];
  selectedOrdersDisplayedColumns: string[] = ['orderNumber', 'toteNumber'];
  orders: any = [];
  originalOrders: any = [];
  Prefernces: BulkPreferences;
  selectedOrders: any = [];
  nextBatchId: string = '';
  batchSeleted: boolean = false;
  orderLines: OrderLineResource[] = [];
  url:string;
  IsBatch:any = false;
  public iBulkProcessApiService: IBulkProcessApiService;
  public iAdminApiService: IAdminApiService;
  allowQuickPick: boolean = false;
  defaultQuickPick: boolean = false;
  isQuickPick:boolean = false;
  bulkZones: BulkZone[] = [];
  isZoneSelected:boolean = false;
  stopAssigningLocations = false;

  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    private global: GlobalService,
    private route:Router,
    private sharedService: SharedService,
    private spinnerService: SpinnerService,
    public adminApiService: AdminApiService
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
    this.iAdminApiService = adminApiService;
    this.url = route.url.split("/")[2].replace("Bulk","");
  }

  ngOnInit(): void {
    if(this.url == "Pick"){
      this.WorkstationSetupInfo();
    }
    else{
      this.bulkOrderBatchToteQty();
    }
    this.getworkstationbulkzone();
    localStorage.removeItem("verifyBulks");
  }

  public WorkstationSetupInfo() {
    this.iAdminApiService.WorkstationSetupInfo().subscribe((res) => {
      if (res.isExecuted && res.data) {
        // this.allowQuickPick = res.data.pfSettings.filter((x) => x.pfName == "Quick Pick")[0].pfSetting == 1 ? true : false;
        this.defaultQuickPick = res.data.pfSettings.filter((x) => x.pfName == "Default Quick Pick")[0].pfSetting == 1 ? true : false;
        if(!this.allowQuickPick) this.defaultQuickPick = false;
        this.isQuickPick = this.defaultQuickPick;
        this.quickPickViewChange();
      }
    })
  }

  quickPickViewChange(){
    if(this.isQuickPick){
      this.quickPickOrders();
    }
    else{
      this.bulkOrderBatchToteQty();
    }
  }

  quickPickOrders(){
    let payload: QuickPickOrdersRequest = new QuickPickOrdersRequest();
    payload.start = 0;
    payload.size = 5000;
    this.iBulkProcessApiService.bulkPickOrdersQuickpick(payload).subscribe((res) => {
      this.selectedOrders = [];
      this.status.batchCount = 0;
      this.status.toteCount = 0;
      this.status.orderCount = 0;
      this.status.orderLinesCount = 0;
      this.orders = res;
      this.originalOrders = res;
      this.status.orderCount = res.length;
      this.view = "order";
      this.ordersDisplayedColumns = ['orderNumber', 'lineCount', 'priority', 'requiredDate', 'details', 'actions'];
      this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber', 'actions'];
    })
  }

  async ProcessQuickPick(){
    let OTIDs:number[] = [];
    this.selectedOrders.forEach((x) => {
      x.orderLines.forEach((orderLine:OrderLineResource) => {
        OTIDs.push(orderLine.id);
      });
    });
    this.iBulkProcessApiService.bulkPickOrdersLocationAssignment(OTIDs).subscribe(async (res: BulkPreferences) => {
      this.showLoader();
      await this.bulkPickBulkZone();
      await this.checkForZone(OTIDs[0]);
      if(!this.stopAssigningLocations){
        if(this.isZoneSelected){
          this.Process();
        }
        else{
          this.WorkstationSetupInfo();
          this.global.ShowToastr(ToasterType.Error, "Zone not selected", ToasterTitle.Error);
        }
      }
      this.hideLoader();
    })
  }

  async bulkPickBulkZone() {
    let res = await this.iBulkProcessApiService.bulkPickBulkZone();
    if (res?.status == HttpStatusCode.Ok) {
      this.bulkZones = res.body;
    }
  }

  async checkForZone(orderId: number | undefined) {
    if (this.Prefernces.systemPreferences.shortPickFindNewLocation && this.Prefernces.systemPreferences.displayEob) {
      for (let i = 0; i < 10; i++) {
        if(!this.stopAssigningLocations){
          await new Promise(resolve => setTimeout(resolve, 2000));
          const res = await this.iAdminApiService.orderline(orderId).toPromise();
          if (res?.status == HttpStatusCode.Ok) {
            if (res.zone && res.zone != ""){
              let zonesSelected = this.bulkZones.map((element) => element.zone);
              if(zonesSelected.includes(res.zone)) this.isZoneSelected = true;
            }
          } else if (res?.status == HttpStatusCode.NoContent){
            return;
          }
        }
      }
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.stopAssigningLocations = true;
  }

  showLoader() {
    this.spinnerService.assigningLocations = true;
  }

  hideLoader() {
    this.spinnerService.assigningLocations = false;
  }

  bulkOrderBatchToteQty() {
    this.batchSeleted = false;
    forkJoin([
      this.bulkBatchesObservable(),
      this.bulkTotesObservable(),
      this.bulkOrdersObservable()
    ]).subscribe({
      next: ([batchesResult, totesResult, ordersResult]) => {
        this.selectedOrders = [];
        this.status.batchCount = batchesResult.length;
        this.status.toteCount = totesResult.length;
        this.status.orderCount = ordersResult.length;
        if (this.status.batchCount > 0) {
          this.orders = batchesResult;
          this.originalOrders = batchesResult;
          this.view = "batch";
          this.ordersDisplayedColumns = ['batchId', 'lineCount', 'priority', 'actions'];
          this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber'];
        }
        else if (this.status.toteCount > 0) {
          this.orders = totesResult;
          this.originalOrders = totesResult;
          this.view = "tote";
          this.ordersDisplayedColumns = ['toteId', 'lineCount', 'priority', 'requiredDate', 'details', 'actions'];
          this.selectedOrdersDisplayedColumns = ['toteId', 'toteNumber','actions'];
        }
        else {
          this.orders = ordersResult;
          this.originalOrders = ordersResult;
          this.view = "order";
          this.ordersDisplayedColumns = ['orderNumber', 'lineCount', 'priority', 'requiredDate', 'details', 'actions'];
          this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber', 'actions'];
        }
      },
      error: (error) => {
        console.error('An error occurred:', error);
      }
    });
  }

  bulkBatchesObservable(): Observable<BatchesResponse[]> {
    let payload: BatchesRequest = new BatchesRequest();
    payload.type = this.capitalizeWords(this.url);
    payload.start = 0;
    payload.size = 5000;
    payload.includeChildren = "false";
    return this.iBulkProcessApiService.bulkPickBatches(payload);
  }

  bulkTotesObservable(): Observable<TotesResponse[]> {
    let payload: TotesRequest = new TotesRequest();
    payload.type = this.capitalizeWords(this.url);
    payload.start = 0;
    payload.size = 5000;
    payload.status = "open";
    payload.area = " ";
    return this.iBulkProcessApiService.bulkPickTotes(payload);
  }

  bulkOrdersObservable(): Observable<OrderResponse[]> {
    let payload: OrdersRequest = new OrdersRequest();
    payload.type = this.capitalizeWords(this.url);
    payload.start = 0;
    payload.size = 5000;
    payload.status = "open";
    payload.area = " ";
    return this.iBulkProcessApiService.bulkPickOrders(payload);
  }

  Process() {
    if (this.Prefernces?.workstationPreferences?.pickToTotes && this.url == "Pick") this.OpenNextToteId();
    else if (this.Prefernces?.workstationPreferences?.putAwayFromTotes && this.url == "PutAway") this.OpenNextToteId();
    else this.changeVisibiltyVerifyBulk(false);
  }

  changeVisibiltyVerifyBulk(event: boolean) {
    if (event) {
      if(this.url == "Pick"){
        this.WorkstationSetupInfo();
      }
      else{
        this.bulkOrderBatchToteQty();
      }
      localStorage.removeItem("verifyBulks");
    }
    this.verifyBulks = !this.verifyBulks;
    localStorage.setItem("verifyBulks",this.verifyBulks.toString());
  }

  changeView(event: string) {
    this.view = event;
    this.selectedOrders = [];
    this.status.orderLinesCount = 0;
    if (event == "batch") {
      this.bulkBatchesObservable().subscribe((res) => this.orders = res);
      this.ordersDisplayedColumns = ['batchId', 'lineCount', 'priority', 'actions'];
      this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber'];
    }
    else if (event == "tote") {
      this.bulkTotesObservable().subscribe((res) => this.orders = res);
      this.ordersDisplayedColumns = ['toteId', 'lineCount', 'priority', 'requiredDate', 'details', 'actions'];
      this.selectedOrdersDisplayedColumns = ['toteId', 'toteNumber', 'actions'];
    }
    else if (event == "order") {
      this.bulkOrdersObservable().subscribe((res) => this.orders = res);
      this.ordersDisplayedColumns = ['orderNumber', 'lineCount', 'priority', 'requiredDate', 'details', 'actions'];
      this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber', 'actions'];
    }
    this.batchSeleted = false;
  }

  capitalizeWords(inputString: string) {
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
    this.orderLines = this.sortByLocation(this.orderLines);
  }

  sortByLocation(data) {
    // Sorts the array in ascending order based on the 'location' property
    return data.sort((a, b) => {
        // Normalize the location strings to ensure accurate sorting
        let locA = a.location.toUpperCase(); // to handle case-insensitivity
        let locB = b.location.toUpperCase(); // to handle case-insensitivity
        if (locA < locB) return -1;
        if (locA > locB) return 1;
        return 0; // if the locations are equal
    });
}

  OpenNextToteId() {
    const dialogRefTote = this.global.OpenDialog(BmToteidEntryComponent, {
      height: DialogConstants.auto,
      width: '990px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        selectedOrderList: this.selectedOrders,
        nextToteID: this.NextToteID,
        BulkProcess: true,
        autoPrintPickToteLabels: this.Prefernces?.workstationPreferences?.autoPrintPickToteLabels,
        view: this.view,
        type: this.url
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
        localStorage.setItem("verifyBulks",this.verifyBulks.toString());
      }
    });
  }

  removeOrder(event) {
    this.orderLines = [];
    if (this.view == "tote") {
      //this.orders = [event, ...this.orders];
      const index = this.originalOrders.findIndex(x => x===event);
      this.orders.splice(index, 0, event);
      this.orders = [...this.orders];
      this.selectedOrders = this.selectedOrders.filter((element) => element.toteId != event.toteId);
    }
    else if (this.view == "order") {
      //this.orders = [event, ...this.orders];
      const index = this.originalOrders.findIndex(x => x===event);
      this.orders.splice(index, 0, event);
      this.orders = [...this.orders];
      this.selectedOrders = this.selectedOrders.filter((element) => element.orderNumber != event.orderNumber);
    }
    this.status.orderLinesCount = this.status.orderLinesCount - event.lineCount;
    this.selectedOrders.forEach((element, index) => { element.toteNumber = index + 1; this.orderLines = this.orderLines.concat(element.orderLines)});
    this.orderLines = this.sortByLocation(this.orderLines);
  }

  appendAll() {
    this.orderLines = [];
    this.selectedOrders = [...this.selectedOrders, ...this.orders];
    this.selectedOrders.forEach((element, index) => { element.toteNumber = index + 1; this.status.orderLinesCount = this.status.orderLinesCount + element.lineCount; this.orderLines = this.orderLines.concat(element.orderLines); });
    this.orderLines = this.sortByLocation(this.orderLines);
    this.orders = [];
  }

  getworkstationbulkzone() {
    this.iBulkProcessApiService.bulkPreferences().subscribe((res: BulkPreferences) => this.Prefernces = res)
  }

  removeAll() {
    if (this.view == "batch") {
      this.bulkBatchesObservable().subscribe((res) => {
        this.orders = res;
        this.selectedOrders = [];
      })
    }
    else {
      while(this.selectedOrders.length > 0)
        this.removeOrder(this.selectedOrders[0]);
    }
    this.batchSeleted = false;
    this.status.orderLinesCount = 0;
    this.orderLines = [];
  }

  async printDetailList() {
    const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
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
      if (res == ResponseStrings.Yes) {}
      else if (res == ResponseStrings.No) {}
      else if (res == ResponseStrings.Cancel)
        if (this.view != "batch") await this.createBatchNow();
    });
  }

  async createBatchNow($event = false) {
    this.IsBatch = $event;
    let res = await this.iBulkProcessApiService.BatchesNextBatchID();
    if (res?.status == HttpStatusCode.Ok) {
      this.nextBatchId = res.body;
      const dialogRef1 = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: DialogConstants.auto,
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
      height: DialogConstants.auto,
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
      if (resp == ResponseStrings.Yes) {}
      this.selectedOrders = [];
      this.bulkOrderBatchToteQty();
    });
  }

}

