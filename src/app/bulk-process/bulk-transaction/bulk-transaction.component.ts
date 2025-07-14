import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BmToteidEntryComponent } from 'src/app/admin/dialogs/bm-toteid-entry/bm-toteid-entry.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BatchesRequest, BatchesResponse, BulkPreferences, BulkZone, CreateBatchRequest, OrderBatchToteQtyResponse, OrderLineResource, OrderResponse, OrdersRequest, QuickPickOrdersRequest, TotesRequest, TotesResponse } from 'src/app/common/Model/bulk-transactions';
import { ConfirmationHeadings, ConfirmationMessages, DialogConstants, localStorageKeys, ResponseStrings, Style, ToasterMessages, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { forkJoin, take } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { SpinnerService } from 'src/app/common/init/spinner.service';
import { BATCH_DISPLAYED_COLUMNS, BulkTransactionType, BulkTransactionView, ORDER_DISPLAYED_COLUMNS, SELECTED_BATCH_DISPLAYED_COLUMNS, SELECTED_ORDER_DISPLAYED_COLUMNS, SELECTED_TOTE_DISPLAYED_COLUMNS, TOTE_DISPLAYED_COLUMNS } from 'src/app/common/constants/bulk-process/bulk-transactions';
import { ApiResponse } from 'src/app/common/types/CommonTypes';
import { GeneralSetup } from 'src/app/common/Model/preferences';

@Component({
  selector: 'app-bulk-transaction',
  templateUrl: './bulk-transaction.component.html',
  styleUrls: ['./bulk-transaction.component.scss']
})
export class BulkTransactionComponent implements OnInit {

  verifyBulks: boolean = false;
  status: OrderBatchToteQtyResponse = new OrderBatchToteQtyResponse();
  view: string;
  NextToteID: number;
  displayedColumns: string[] = [];
  selectedDisplayedColumns: string[] = [];
  orders: (OrderResponse | TotesResponse | BatchesResponse)[] = [];
  originalOrders: (OrderResponse | TotesResponse | BatchesResponse)[] = [];
  Prefernces: BulkPreferences;
  selectedOrders: (OrderResponse | TotesResponse)[] = [];
  nextBatchId: string = '';
  batchSeleted: boolean = false;
  orderLines: OrderLineResource[] = [];
  bulkTransactionType: string;
  bulkTransactionTypeAllCaps: string;
  IsBatch: boolean = false;
  allowQuickPick: boolean = false;
  defaultQuickPick: boolean = false;
  isQuickPick: boolean = false;
  isZoneSelected: boolean = false;
  generalSetupInfo: GeneralSetup;
  isBatchIdGenerationEnabled:boolean=false;
  public iBulkProcessApiService: IBulkProcessApiService;
  public iAdminApiService: IAdminApiService;
  // isViewLoaded Ensures that required data for both Quick Pick and non-Quick Pick flows is loaded before rendering UI components
  isViewLoaded:boolean = false;
  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    public adminApiService: AdminApiService,
    public readonly global: GlobalService,
    public readonly route: Router,
    private readonly spinnerService: SpinnerService
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
    this.iAdminApiService = adminApiService;
    this.bulkTransactionType = route.url.split("/")[2].replace("Bulk", "");
    this.bulkTransactionTypeAllCaps = this.global.insertSpaceInCamelOrPascal(this.bulkTransactionType);
  }

  ngOnInit(): void {
    if (this.bulkTransactionType == BulkTransactionType.PICK) {
      this.getGeneralSetupInfo();
    }
    else {
      this.isViewLoaded = true;
      this.bulkOrderBatchToteQty();
    }
    this.getworkstationbulkzone();
    localStorage.removeItem(localStorageKeys.VerifyBulks);
  }

  public getGeneralSetupInfo(): void {
  this.iAdminApiService.AdminCompanyInfo()
    .pipe(take(1))
    .subscribe({
      next: (res: ApiResponse<GeneralSetup>) => {
        if (res?.isExecuted && res.data) {
          this.generalSetupInfo = res.data;
          this.allowQuickPick = !!res.data.quickPicks;
          this.defaultQuickPick = !!res.data.defaultQuickPicks;
          if (!this.allowQuickPick) {
            this.defaultQuickPick = false;
          }
          this.isQuickPick = this.defaultQuickPick;
          this.isViewLoaded = true;
          this.quickPickViewChange();
        }
      },
      error: (err) => {
        console.error('Failed to fetch general setup info:', err);
      }
    });
}

  quickPickViewChange() {
    this.isQuickPick ? this.quickPickOrders() : this.bulkOrderBatchToteQty();
  }

  quickPickOrders() {
    let payload: QuickPickOrdersRequest = new QuickPickOrdersRequest();
    payload.start = 0;
    payload.size = 5000;
    this.iBulkProcessApiService.bulkPickOrdersQuickpick(payload).subscribe((res: OrderResponse[]) => {
      this.selectedOrders = [];
      this.status.batchCount = 0;
      this.status.toteCount = 0;
      this.status.orderCount = 0;
      this.status.orderLinesCount = 0;
      this.orders = res;
      this.originalOrders = res;
      this.status.orderCount = res.length;
      this.view = BulkTransactionView.ORDER;
      this.displayedColumns = ORDER_DISPLAYED_COLUMNS;
      this.selectedDisplayedColumns = SELECTED_ORDER_DISPLAYED_COLUMNS;
    })
  }

  async ProcessQuickPick() {
    let orderNumberSet: Set<string> = new Set();
    this.selectedOrders.forEach((x) => {
      x.orderLines.forEach((orderLine: OrderLineResource) => {
        orderNumberSet.add(orderLine.orderNumber);
      });
    });
    let orderNumbers: string[] = Array.from(orderNumberSet);
    this.iBulkProcessApiService.bulkPickOrdersLocationAssignment(orderNumbers).subscribe(async () => {
      this.showLoader();
      const locationAssigned:boolean = await this.bulkPickOrdersCheckLocationAssignment(orderNumbers);
      if (locationAssigned) {
        let offCarouselPicks = await this.bulkPickOrdersCheckOffCarouselPicks(orderNumbers);
        if(offCarouselPicks){
          this.showNoOffCarouselPicksMessage();
        }else{
          this.changeVisibiltyVerifyBulk(true);
        }
      }
      this.hideLoader();
    })
  }

  showNoOffCarouselPicksMessage(){
    this.selectedOrders = [];
    this.global.OpenDialog(ConfirmationDialogComponent, {
        height: DialogConstants.auto,
        width: Style.w600px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          message: ConfirmationMessages.NoOffCarouselPicks,
          heading: ConfirmationHeadings.NoOffCarouselPicksFound,
          hideCancel: true
        },
      });
  }

  async bulkPickOrdersCheckOffCarouselPicks(orderNumbers: string[]): Promise<boolean> {
    try {
      const res = await this.iBulkProcessApiService.bulkPickOrdersCheckOffCarouselPicks(orderNumbers);
      return typeof res?.body?.data === 'boolean' ? res.body.data : false;
    } catch (error) {
      return false;
    }
  }

  quickPickToNonQuickPick(){
    this.selectedOrders = [];
    this.isQuickPick = false;
    this.quickPickViewChange();
  }


  async bulkPickOrdersCheckLocationAssignment(orderNumbers: string[]): Promise<boolean> {
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
          const res = await this.iBulkProcessApiService.bulkPickOrdersCheckLocationAssignment(orderNumbers);
          if (res?.body?.data) {
            return true;
          }
        } catch {
          return false;
        }
      }
    return false;
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
          this.view = BulkTransactionView.BATCH
          this.displayedColumns = BATCH_DISPLAYED_COLUMNS;
          this.selectedDisplayedColumns = SELECTED_BATCH_DISPLAYED_COLUMNS;
           // We don't need to create a batch id manually as it is already created for batches
           this.isBatchIdGenerationEnabled=false;
        }
        else if (this.status.toteCount > 0) {
          this.orders = totesResult;
          this.originalOrders = totesResult;
          this.view = BulkTransactionView.TOTE;
          this.displayedColumns = TOTE_DISPLAYED_COLUMNS;
          this.selectedDisplayedColumns = SELECTED_TOTE_DISPLAYED_COLUMNS;
           // We don't need to create a batch id manually for totes
           this.isBatchIdGenerationEnabled=false;
        }
        else {
          this.orders = ordersResult;
          this.originalOrders = ordersResult;
          this.view = BulkTransactionView.ORDER;
          this.displayedColumns = ORDER_DISPLAYED_COLUMNS;
          this.selectedDisplayedColumns = SELECTED_ORDER_DISPLAYED_COLUMNS;
          // We need to create a batch id manually for orders
          this.isBatchIdGenerationEnabled=true;
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private buildBulkTransactionPayload<T extends { type: string; start: number; size: number }>(
    payload: T,
    overrides: Partial<T>
  ): T {
    payload.type = this.bulkTransactionTypeAllCaps;
    payload.start = 0;
    payload.size = 5000;
    return Object.assign(payload, overrides);
  }

  bulkBatchesObservable(): Observable<BatchesResponse[]> {
    const payload = this.buildBulkTransactionPayload(new BatchesRequest(), {
      includeChildren: "false"
    });
    return this.iBulkProcessApiService.bulkPickBatches(payload);
  }

  bulkTotesObservable(): Observable<TotesResponse[]> {
    const payload = this.buildBulkTransactionPayload(new TotesRequest(), {
      status: "open",
      area: " "
    });
    return this.iBulkProcessApiService.bulkPickTotes(payload);
  }

  bulkOrdersObservable(): Observable<OrderResponse[]> {
    const payload = this.buildBulkTransactionPayload(new OrdersRequest(), {
      status: "open",
      area: " "
    });
    return this.iBulkProcessApiService.bulkPickOrders(payload);
  }

  Process() {
    if (this.Prefernces?.workstationPreferences) {
      const { pickToTotes, putAwayFromTotes } = this.Prefernces.workstationPreferences;
      if (pickToTotes && this.bulkTransactionType === BulkTransactionType.PICK) {
          this.OpenNextToteId();
      } else if (putAwayFromTotes && this.bulkTransactionType === BulkTransactionType.PUT_AWAY) {
          this.OpenNextToteId();
      } else {
          this.changeVisibiltyVerifyBulk(false);
      }
    }
  }

  changeVisibiltyVerifyBulk(event: boolean) {
    if (event) {
      if (this.bulkTransactionType == BulkTransactionType.PICK) {
        this.getGeneralSetupInfo();
      }
      else {
        this.bulkOrderBatchToteQty();
      }
      localStorage.removeItem(localStorageKeys.VerifyBulks);
    }
    this.verifyBulks = !this.verifyBulks;
    localStorage.setItem(localStorageKeys.VerifyBulks, this.verifyBulks.toString());
  }

  changeView(event: string) {
    this.view = event;
    this.selectedOrders = [];
    this.status.orderLinesCount = 0;
    if (event == BulkTransactionView.BATCH) {
      this.bulkBatchesObservable().subscribe((res) => this.orders = res);
      this.displayedColumns = BATCH_DISPLAYED_COLUMNS;
      this.selectedDisplayedColumns = SELECTED_BATCH_DISPLAYED_COLUMNS;
      // We don't need to create a batch id manually as it is already created for batches
      this.isBatchIdGenerationEnabled=false;
    }
    else if (event == BulkTransactionView.TOTE) {
      this.bulkTotesObservable().subscribe((res) => this.orders = res);
      this.displayedColumns = TOTE_DISPLAYED_COLUMNS;
      this.selectedDisplayedColumns = SELECTED_TOTE_DISPLAYED_COLUMNS;
      // We don't need to create a batch id manually for totes
      this.isBatchIdGenerationEnabled=false;   
    }
    else if (event == BulkTransactionView.ORDER) {
      this.bulkOrdersObservable().subscribe((res) => this.orders = res);
      this.displayedColumns = ORDER_DISPLAYED_COLUMNS;
      this.selectedDisplayedColumns = SELECTED_ORDER_DISPLAYED_COLUMNS;
       // We need to create a batch id manually for orders
      this.isBatchIdGenerationEnabled=true;
    }
    this.batchSeleted = false;
  }

  selectOrder(event) {
    event.toteNumber = this.selectedOrders.length + 1;
    this.orderLines = [];
    if (this.view == BulkTransactionView.BATCH) {
      this.selectedOrders = event.orders;
      this.orders = this.orders.filter((element) => element.batchId != event.batchId);
      this.batchSeleted = true;
    }
    else if (this.view == BulkTransactionView.TOTE) {
      this.selectedOrders.forEach((element, index) => { element.toteNumber = index + 1 });
      this.selectedOrders = [...this.selectedOrders, event];
      this.orders = this.orders.filter((element) => {
        return 'toteId' in element && element.toteId !== event.toteId;
      });
    }
    else if (this.view == BulkTransactionView.ORDER) {
      this.selectedOrders.forEach((element, index) => { element.toteNumber = index + 1 });
      this.selectedOrders = [...this.selectedOrders, event];
      this.orders = this.orders.filter((element) => {
        return 'orderNumber' in element && element.orderNumber !== event.orderNumber;
      });
    }
    this.status.orderLinesCount = this.status.orderLinesCount + event.lineCount;
    this.selectedOrders.forEach((element) => { this.orderLines = this.orderLines.concat(element.orderLines) });
    this.orderLines = this.sortByLocation(this.orderLines);
  }

  sortByLocation(data:OrderLineResource[]) {
    return data.sort((a, b) => {
      const locA = (a.location ?? '').toUpperCase();
      const locB = (b.location ?? '').toUpperCase();
  
      if (locA < locB) return -1;
      if (locA > locB) return 1;
      return 0;
    });
  }

  OpenNextToteId() {
    const dialogRefTote = this.global.OpenDialog(BmToteidEntryComponent, {
      height: DialogConstants.auto,
      width: Style.w990px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        selectedOrderList: this.selectedOrders,
        nextToteID: this.NextToteID,
        BulkProcess: true,
        autoPrintPickToteLabels: this.Prefernces?.workstationPreferences?.autoPrintPickToteLabels,
        view: this.view,
        type: this.bulkTransactionType
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
        localStorage.setItem(localStorageKeys.VerifyBulks, this.verifyBulks.toString());
      }
    });
  }

  removeOrder(event: OrderResponse | TotesResponse | BatchesResponse) {
    this.orderLines = [];
  
    const index = this.originalOrders.findIndex(x => x === event);
    this.orders.splice(index, 0, event);
    this.orders = [...this.orders];
  
    if (this.view === BulkTransactionView.TOTE && 'toteId' in event) {
      this.selectedOrders = this.selectedOrders.filter((element): element is TotesResponse =>
        'toteId' in element && element.toteId !== event.toteId
      );
    }
    else if (this.view === BulkTransactionView.ORDER && 'orderNumber' in event) {
      this.selectedOrders = this.selectedOrders.filter((element): element is OrderResponse =>
        'orderNumber' in element && element.orderNumber !== event.orderNumber
      );
    }
  
    if ('lineCount' in event && typeof event.lineCount === 'number') {
      this.status.orderLinesCount = this.status.orderLinesCount - event.lineCount;
    }
  
    this.selectedOrders.forEach((element, index) => {
      element.toteNumber = index + 1;
      this.orderLines = this.orderLines.concat(element.orderLines ?? []);
    });
  
    this.orderLines = this.sortByLocation(this.orderLines);
  }
  

  appendAll() {
    this.orderLines = [];
    this.selectedOrders = [
      ...this.selectedOrders,
      ...this.orders.filter(
        (order): order is OrderResponse | TotesResponse => 'toteId' in order
      )
    ];
    this.selectedOrders.forEach((element, index) => { element.toteNumber = index + 1; this.status.orderLinesCount = this.status.orderLinesCount + element.lineCount; this.orderLines = this.orderLines.concat(element.orderLines); });
    this.orderLines = this.sortByLocation(this.orderLines);
    this.orders = [];
  }

  getworkstationbulkzone() {
    this.iBulkProcessApiService.bulkPreferences().subscribe((res: BulkPreferences) => this.Prefernces = res)
  }

  removeAll() {
    if (this.view == BulkTransactionView.BATCH) {
      this.bulkBatchesObservable().subscribe((res) => {
        this.orders = res;
        this.selectedOrders = [];
      })
    }
    else {
      while (this.selectedOrders.length > 0)
        this.removeOrder(this.selectedOrders[0]);
    }
    this.batchSeleted = false;
    this.status.orderLinesCount = 0;
    this.orderLines = [];
  }

  async printDetailList() {
    const dialogRef1 = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: ConfirmationMessages.TouchYesToPrintAllAsBatch,
        message2: ConfirmationMessages.TouchNoToPrintEachOrder,
        heading: ConfirmationHeadings.PrintBatchOrOrder,
        buttonFields: true,
        threeButtons: true
      },
    });
    dialogRef1.afterClosed().subscribe(async () => {
      if (this.view != BulkTransactionView.BATCH) await this.createBatchNow();
    });
  }

  async createBatchNow($event:boolean = false) {
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
          message: ConfirmationMessages.AssignOrdersToBatch(this.nextBatchId),
          heading: ConfirmationHeadings.CreateBatchNow,
          buttonFields: true
        },
      });
      dialogRef1.afterClosed().subscribe(async (resp: string) => {
        if (resp == ResponseStrings.Yes) {
          let payload: CreateBatchRequest = new CreateBatchRequest();
          payload.nextBatchID = this.nextBatchId;
          payload.transactionType = this.bulkTransactionTypeAllCaps;
          payload.BatchData = this.selectedOrders
            .filter(item => item.orderNumber !== undefined)
            .map(item => ({
              orderNumber: item.orderNumber as string,
              toteNumber: item.toteNumber.toString()
            }));
          let res2 = await this.iBulkProcessApiService.BulkPickCreateBatch(payload);
          if (res2?.status == HttpStatusCode.Ok) {
            if (!this.IsBatch) this.printItemLabelsNow();
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
    const dialogRef1 = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: ConfirmationMessages.TouchYesToPrintlabelForItemInBatch,
        heading: ConfirmationHeadings.PrintItemLabelsNow,
        buttonFields: true
      },
    });
    dialogRef1.afterClosed().subscribe(async () => {
      this.selectedOrders = [];
      this.bulkOrderBatchToteQty();
    });
  }

}

