import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BmToteidEntryComponent } from 'src/app/admin/dialogs/bm-toteid-entry/bm-toteid-entry.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BatchesRequest, BatchesResponse, BulkPreferences, BulkZone, CreateBatchRequest, EmergencyPickOrdersRequest, OrderBatchToteQtyResponse, OrderLineResource, OrderResponse, OrdersRequest, QuickPickOrdersRequest, TotesRequest, TotesResponse } from 'src/app/common/Model/bulk-transactions';
import { ConfirmationHeadings, ConfirmationMessages, DialogConstants, localStorageKeys, PrintReports, ResponseStrings, Style, ToasterMessages, ToasterType, ToasterTitle, ConsoleErrorMessages} from 'src/app/common/constants/strings.constants';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { forkJoin, Subject, take, takeUntil } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { SpinnerService } from 'src/app/common/init/spinner.service';
import { BATCH_DISPLAYED_COLUMNS, BulkTransactionType, BulkTransactionView, ORDER_DISPLAYED_COLUMNS, SELECTED_BATCH_DISPLAYED_COLUMNS, SELECTED_ORDER_DISPLAYED_COLUMNS, SELECTED_TOTE_DISPLAYED_COLUMNS, TOTE_DISPLAYED_COLUMNS } from 'src/app/common/constants/bulk-process/bulk-transactions';
import { ApiResponse, ApiResult } from 'src/app/common/types/CommonTypes';
import { GeneralSetup } from 'src/app/common/Model/preferences';
import { PrintApiService } from 'src/app/common/services/print-api/print-api.service';
import { IPrintApiService } from 'src/app/common/services/print-api/print-api-interface';
import { BmSlaperLabelSplitEntryComponent } from 'src/app/admin/dialogs/bm-slaper-label-split-entry/bm-slaper-label-split-entry.component';
import { LocationZone } from 'src/app/common/interface/admin/location-zones.interface';
import { EmergencyAlertService } from 'src/app/common/services/emergency-pick/emergency-alert-service';
import { PagingRequest } from 'src/app/common/interface/ccdiscrepancies/PagingRequest';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-bulk-transaction',
  templateUrl: './bulk-transaction.component.html',
  styleUrls: ['./bulk-transaction.component.scss']
})
export class BulkTransactionComponent implements OnInit {

  // Constants for pagination
  private readonly MAX_PAGE_SIZE = 10000; // Reduced from 500000 for better performance
  private readonly EMERGENCY_PAGE_SIZE = 500000; // Large size for emergency data since no search endpoint

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
  batchSelected: boolean = false;
  orderLines: OrderLineResource[] = [];
  bulkTransactionType: string;
  bulkTransactionTypeAllCaps: string;
  IsBatch: boolean = false;
  allowQuickPick: boolean = false;
  defaultQuickPick: boolean = false;
  isQuickPick: boolean = false;
  isEmergencyPick: boolean = false;
  hasEmergencyPick: boolean = false;
  isZoneSelected: boolean = false;
  generalSetupInfo: GeneralSetup;
  isBatchIdGenerationEnabled:boolean=false;
  isSlapperLabelFlow: boolean = false; // Track when we're in slapper label flow
  public iBulkProcessApiService: IBulkProcessApiService;
  public iAdminApiService: IAdminApiService;
  public iPrintApiService: IPrintApiService;
  // isViewLoaded Ensures that required data for both Quick Pick and non-Quick Pick flows is loaded before rendering UI components
  isViewLoaded:boolean = false;
  private destroy$ = new Subject<void>();
  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    public adminApiService: AdminApiService,
    public printApiService: PrintApiService,
    public readonly global: GlobalService,
    public readonly route: Router,
    private readonly spinnerService: SpinnerService,
    private readonly emergencyAlertService: EmergencyAlertService,
    private sharedService: SharedService
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
    this.iAdminApiService = adminApiService;
    this.iPrintApiService = printApiService;
    this.bulkTransactionType = route.url.split("/")[2].replace("Bulk", "");
    this.bulkTransactionTypeAllCaps = this.global.insertSpaceInCamelOrPascal(this.bulkTransactionType);
  }

  async ngOnInit() {
    await this.loadData();
    await this.onReload();
  }

  async onReload() {
    if (this.bulkTransactionType === BulkTransactionType.PICK) {
      this.sharedService.reloadBulkPick$
        .pipe(takeUntil(this.destroy$))
        .subscribe(async () => {
          await this.loadData();
          this.verifyBulks = false;
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadData(){
    if (this.bulkTransactionType == BulkTransactionType.PICK) {
      await this.getEmergencyOrdersInfo();
      this.getGeneralSetupInfo();
    }
    else {
      this.isViewLoaded = true;
      this.bulkOrderBatchToteQty();
    }
    this.getworkstationbulkzone();
    this.getLocationZone();
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
          this.pickViewChange();
        }
      },
      error: (err) => {
        console.error('Failed to fetch general setup info:', err);
      }
    });
}

  async handleEmergencyPickChange(isEmergencyPick: boolean) {
    this.isEmergencyPick = isEmergencyPick;
    
    if (this.isEmergencyPick) {
      // Emergency pick enabled - reset batchSelected and fetch counts first
      this.batchSelected = false;
      await this.getEmergencyOrdersInfo();
    } else {
      // Emergency pick disabled - reset counts
      this.status.orderCount = 0;
      this.status.toteCount = 0;
      this.status.batchCount = 0;
      this.batchSelected = false;
    }
    
    // Call pickViewChange() outside the if-else block to avoid duplication
    this.pickViewChange();
  }

  pickViewChange() {
    // Priority: Emergency > Quick Pick > Normal
    if (this.isEmergencyPick) {
      // Emergency mode has highest priority - show the view that has data first (batches > totes > orders)
      if (this.status.batchCount > 0) {
        // Batches have data - highest priority
        this.emergencyPickBatches();
      } else if (this.status.toteCount > 0) {
        // Totes have data - medium priority
        this.emergencyPickTotes();
      } else if (this.status.orderCount > 0) {
        // Orders have data - lowest priority
        this.emergencyPickOrders();
      } else {
        // No data - default to orders
        this.emergencyPickOrders();
      }
    } else if (this.isQuickPick) {
      // Quick pick mode - only when emergency is not enabled
      this.quickPickOrders();
    } else {
      // Normal mode - when both emergency and quick pick are disabled
      this.bulkOrderBatchToteQty();
    }
  }

  emergencyPickOrders() {
    let payload: PagingRequest = {
      selectedPage:0,
      pageSize: this.EMERGENCY_PAGE_SIZE // Large size for emergency data since no search endpoint
    };
    this.iBulkProcessApiService.getEmergencyPickOrders(payload).subscribe((res: ApiResult<OrderResponse[]>) => {
      this.selectedOrders = [];
      // Don't reset batchCount and toteCount - keep the emergency counts
      this.status.orderCount = 0;
      this.status.orderLinesCount = 0;
      this.orders = res.value ?? [];
      this.originalOrders = res.value ?? [];
      this.status.orderCount = res.value?.length ?? 0;
      this.view = BulkTransactionView.ORDER;
      this.displayedColumns = ORDER_DISPLAYED_COLUMNS;
      this.selectedDisplayedColumns = SELECTED_ORDER_DISPLAYED_COLUMNS;
    })
  }

  emergencyPickTotes() {
    let payload: PagingRequest = {
      selectedPage:0,
      pageSize: this.EMERGENCY_PAGE_SIZE // Large size for emergency data since no search endpoint
    };
    this.iBulkProcessApiService.getEmergencyPickTotes(payload).subscribe((res: ApiResult<TotesResponse[]>) => {
      this.selectedOrders = [];
      // Don't reset batchCount and orderCount - keep the emergency counts
      this.status.toteCount = 0;
      this.status.orderLinesCount = 0;
      this.orders = res.value ?? [];
      this.originalOrders = res.value ?? [];
      this.status.toteCount = res.value?.length ?? 0;
      this.view = BulkTransactionView.TOTE;
      this.displayedColumns = TOTE_DISPLAYED_COLUMNS;
      this.selectedDisplayedColumns = SELECTED_TOTE_DISPLAYED_COLUMNS;
    })
  }

  emergencyPickBatches() {
    let payload: PagingRequest = {
      selectedPage:0,
      pageSize: this.EMERGENCY_PAGE_SIZE // Large size for emergency data since no search endpoint
    };
    this.iBulkProcessApiService.getEmergencyPickBatches(payload).subscribe((res: ApiResult<BatchesResponse[]>) => {
      this.selectedOrders = [];
      // Don't reset orderCount and toteCount - keep the emergency counts
      this.status.batchCount = 0;
      this.status.orderLinesCount = 0;
      this.orders = res.value ?? [];
      this.originalOrders = res.value ?? [];
      this.status.batchCount = res.value?.length ?? 0;
      this.view = BulkTransactionView.BATCH;
      this.displayedColumns = BATCH_DISPLAYED_COLUMNS;
      this.selectedDisplayedColumns = SELECTED_BATCH_DISPLAYED_COLUMNS;
    })
  }

  quickPickOrders() {
    let payload: QuickPickOrdersRequest = new QuickPickOrdersRequest();
    payload.start = 0;
    payload.size = 500000;
    this.iBulkProcessApiService.bulkPickOrdersQuickpick(payload).subscribe((res: ApiResult<OrderResponse[]>) => {
      this.selectedOrders = [];
      this.status.batchCount = 0;
      this.status.toteCount = 0;
      this.status.orderCount = 0;
      this.status.orderLinesCount = 0;
      this.orders = res.value ?? [];
      this.originalOrders = res.value ?? [];
      this.status.orderCount = res.value?.length ?? 0;
      this.view = BulkTransactionView.ORDER;
      this.displayedColumns = ORDER_DISPLAYED_COLUMNS;
      this.selectedDisplayedColumns = SELECTED_ORDER_DISPLAYED_COLUMNS;
    })
  }
  
  async ProcessQuickPick() {
    if (!this.Prefernces || !this.Prefernces.workstationPreferences) {
      return;
    }
    const extractOrderNumbers = (orders: (OrderResponse | TotesResponse)[]): string[] =>
      orders.flatMap((x) => x.orderLines?.map((orderLine: OrderLineResource) => orderLine.orderNumber) || []);

    const orderNumbers = extractOrderNumbers(this.selectedOrders);

    const handleAfterLocationAssignment = async () => {
      const locationAssigned: boolean = await this.bulkPickOrdersCheckLocationAssignment(orderNumbers);
      if (locationAssigned) {
        const reprocessOrders = await this.GetOrdersMovedToReprocessAsync(orderNumbers);
        const assignedOrderLines = await this.getOrderLinesAssignedLocations(orderNumbers);

        // Filter out reprocess order lines
        this.orderLines = this.orderLines.filter(line => !reprocessOrders.includes(line.orderNumber));

        // Create a Map for quick lookup by id
        const assignedMap = new Map<number, { id: number; location: string | null }>(
          assignedOrderLines.map(line => [line.id, line])
        );

        // Update locations using the Map
        this.orderLines.forEach((line) => {
          const assignedLine = assignedMap.get(line.id);
          if (assignedLine?.location != null) {
            line.location = assignedLine.location;
          }
        });
        
        if (Array.isArray(assignedOrderLines) && Array.isArray(this.orderLines)) {
          const assignedLineIDSet = new Set(
            assignedOrderLines
              .filter(x => x?.id != null)
              .map(x => x.id)
          );
          this.orderLines = this.orderLines.filter(x => x?.id != null && assignedLineIDSet.has(x.id));
        }

        // Filter out reprocess orders
        const reprocessSet = new Set(reprocessOrders);

        const nonReprocessOrders = this.selectedOrders.filter(order =>
          (order.orderLines ?? []).every(line => !reprocessSet.has(line.orderNumber))
        );

        await this.printReprocessReportAfterAllocationIfRequired(reprocessOrders);
        const offCarouselPicks = await this.bulkPickOrdersCheckOffCarouselPicks(orderNumbers);
        if (offCarouselPicks) {
          this.showNoOffCarouselPicksMessage();
        } else {
          if (this.Prefernces?.workstationPreferences?.pickToTotes) {
            const dialogRefTote = this.global.OpenDialog(BmToteidEntryComponent, {
              height: DialogConstants.auto,
              width: Style.w990px,
              autoFocus: DialogConstants.autoFocus,
              disableClose: true,
              data: {
                selectedOrderList: nonReprocessOrders,
                nextToteID: this.NextToteID,
                BulkProcess: true,
                autoPrintPickToteLabels: this.Prefernces?.workstationPreferences?.autoPrintPickToteLabels,
                view: this.view,
                type: this.bulkTransactionType,
              },
            });
            dialogRefTote.afterClosed().subscribe((result) => {
              if (result && result.length > 0) {
                this.selectedOrders = result;
                this.selectedOrders.forEach((order) => {
                  order.orderLines?.forEach((orderLine) => {
                    orderLine.toteId = order.toteId;
                  });
                });
                this.changeVisibiltyVerifyBulk(true);
              }
            });
          } else {
            this.changeVisibiltyVerifyBulk(true);
          }
        }
      }
    };

    this.showLoader();
    try {
      if(! await this.bulkPickOrdersLocationAssignment(orderNumbers)) return;
      await handleAfterLocationAssignment();
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
    } finally {
      this.hideLoader();
    }
  }

  async bulkPickOrdersLocationAssignment(orderNumbers: string[]) {
    try {
      const res = await this.iBulkProcessApiService.bulkPickOrdersLocationAssignment(orderNumbers);
      if(res?.body?.isExecuted){
        return true;
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error,ToasterMessages.UnableToAssignLocation,ToasterTitle.Error);
      return false;
    }
    return false;
  }


  
  private async printReprocessReportAfterAllocationIfRequired(reprocessOrders: string[]): Promise<void> {
    try {
      if (!this.generalSetupInfo?.printReprocessReportAfterAllocation) return;
      if (Array.isArray(reprocessOrders) && reprocessOrders.length > 0) {
        await this.global.printReportForSelectedOrders(
          reprocessOrders,
          PrintReports.REPROCESS_TRANSACTIONS,
          false
        );
      }
    } catch (err) {
      console.error(ConsoleErrorMessages.ErrorPrintingReprocessReport, err);
      this.global.ShowToastr(ToasterType.Error,ToasterMessages.UnableToPrint,ToasterTitle.Error);
    }
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

  async GetOrdersMovedToReprocessAsync(orderNumbers: string[]): Promise<string[]> {
    if (!orderNumbers || orderNumbers.length === 0) {
      return [];
    }
    try {
      const res = await this.iBulkProcessApiService.GetOrdersMovedToReprocessAsync(orderNumbers);
      const data = res?.body?.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  async getOrderLinesAssignedLocations(orderNumbers: string[]) {
    if (!orderNumbers || orderNumbers.length === 0) {
      return [];
    }
    try {
      const res = await this.iBulkProcessApiService.getOrderLinesAssignedLocations(orderNumbers);
      const data = res?.body?.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(ConsoleErrorMessages.ErrorFindingAssignedOrderLines, error);
      return [];
    }
  }

  quickPickToNonQuickPick(){
    this.selectedOrders = [];
    this.isQuickPick = false;
    this.pickViewChange();
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

  async bulkOrderBatchToteQty() {
    this.batchSelected = false;

    forkJoin([
      this.bulkBatchesCountApi(),
      this.bulkTotesCountApi(),
      this.bulkOrdersCountApi()
    ]).subscribe({
      next: ([batchesCount, totesCount, ordersCount]) => {
        if (batchesCount > 0) {
          this.changeView(BulkTransactionView.BATCH);
        }
        else if (totesCount > 0) {
          this.changeView(BulkTransactionView.TOTE);
        }
        else {
          this.changeView(BulkTransactionView.ORDER);
        }
      }
    });    
  }

  async bulkOrdersCountApi(): Promise<number> {
    const payload = this.buildBulkTransactionPayload(new OrdersRequest(), {});
    const ordersCount = await this.iBulkProcessApiService.bulkPickOrdersCount(payload);
    this.status.orderCount = ordersCount.value ?? 0;
    return ordersCount.value ?? 0;
  }

  async bulkTotesCountApi(): Promise<number> {
    const payload = this.buildBulkTransactionPayload(new TotesRequest(), {});
    const totesCount = await this.iBulkProcessApiService.bulkPickTotesCount(payload);
    this.status.toteCount = totesCount.value ?? 0;
    return totesCount.value ?? 0;
  }
  
  async bulkBatchesCountApi(): Promise<number> {
    const payload = this.buildBulkTransactionPayload(new BatchesRequest(), {});
    const batchesCount = await this.iBulkProcessApiService.bulkPickBatchesCount(payload);
    this.status.batchCount = batchesCount.value ?? 0;
    return batchesCount.value ?? 0;
  }

  private buildBulkTransactionPayload<T extends { type: string; start: number; size: number }>(
    payload: T,
    overrides: Partial<T>
  ): T {
    payload.type = this.bulkTransactionTypeAllCaps;
    payload.start = 0;
    payload.size = 500000;
    return Object.assign(payload, overrides);
  }

  bulkBatchesObservable(): Observable<ApiResult<BatchesResponse[]>> {
    const payload = this.buildBulkTransactionPayload(new BatchesRequest(), {
      includeChildren: "false"
    });
    return this.iBulkProcessApiService.bulkPickBatches(payload);
  }

  bulkTotesObservable(): Observable<ApiResult<TotesResponse[]>> {
    const payload = this.buildBulkTransactionPayload(new TotesRequest(), {
      status: "open",
      area: " "
    });
    return this.iBulkProcessApiService.bulkPickTotes(payload);
  }

  bulkOrdersObservable(): Observable<ApiResult<OrderResponse[]>> {
    const payload = this.buildBulkTransactionPayload(new OrdersRequest(), {
      status: "open",
      area: " "
    });
    return this.iBulkProcessApiService.bulkPickOrders(payload);
  }

  async Process() {
    if (this.Prefernces?.workstationPreferences) {
      const { pickToTotes, putAwayFromTotes } = this.Prefernces.workstationPreferences;
      const shouldOpenSlapperLabel = await this.checkLocationZoneAndOpenSlapperLabel();
      if (pickToTotes && this.bulkTransactionType === BulkTransactionType.PICK) {      
        if(this.view == BulkTransactionView.ORDER && shouldOpenSlapperLabel) {
          this.OpenSlaperLabelNextToteId();
        } else {
          this.OpenNextToteId();
        }
      } else if (putAwayFromTotes && this.bulkTransactionType === BulkTransactionType.PUT_AWAY) {
        if(this.view == BulkTransactionView.ORDER && shouldOpenSlapperLabel) {
          this.OpenSlaperLabelNextToteId();
        } else {
          this.OpenNextToteId();
        }
      } else {
          this.changeVisibiltyVerifyBulk(false);
      }
    }
  }

  locationZone: LocationZone[] = [];
  getLocationZone() {
    this.iAdminApiService.LocationZone().subscribe({
      next: (res) => {
        if (res?.isExecuted && res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.locationZone = res.data;
        }
      }
    });
  }

  private async checkLocationZoneAndOpenSlapperLabel(): Promise<boolean> {
    let shouldOpenSlapperLabel = false;    
    try {
      const res: { body: BulkZone[]; status: number } = await this.iBulkProcessApiService.bulkPickBulkZone();      
      if (res.status == HttpStatusCode.Ok && Array.isArray(res.body)) {
        let allSlapperLabelZones = true;
        const returnedZones : string[] = res.body.map(x => x.zone);
        for (const rz of returnedZones) {
          const zoneData = this.locationZone.find(x => x.zone === rz);
          if (!zoneData?.caseLabel || zoneData.caseLabel.trim() === '')
            allSlapperLabelZones = false;
            break;
        };
        shouldOpenSlapperLabel = allSlapperLabelZones;
      }      

      return shouldOpenSlapperLabel;

    } catch (error) {
      console.error('Failed to fetch location zones:', error);
      return false;
    }
  }

  async changeVisibiltyVerifyBulk(event: boolean) {
    if (event) {
      if (this.bulkTransactionType == BulkTransactionType.PICK) {
        await this.getEmergencyOrdersInfo();
        this.getGeneralSetupInfo();
      }
      else {
        this.bulkOrderBatchToteQty();
      }
      localStorage.removeItem(localStorageKeys.VerifyBulks);
      // Reset the slapper label flow flag when closing verify-bulk
      this.isSlapperLabelFlow = false;
    }
    // Reset batchSeleted flag when coming back from verify-bulk screen
    this.batchSelected = false;
    this.verifyBulks = !this.verifyBulks;
    localStorage.setItem(localStorageKeys.VerifyBulks, this.verifyBulks.toString());
  }

  changeView(event: string) {
    this.view = event;
    this.selectedOrders = [];
    this.status.orderLinesCount = 0;
    // Reset slapper label flow flag when view changes
    this.isSlapperLabelFlow = false;
    
    // Handle emergency pick mode
    if (this.isEmergencyPick) {
      // Reset batchSelected flag when switching views in emergency mode
      this.batchSelected = false;
      switch (event) {
        case BulkTransactionView.BATCH:
          this.emergencyPickBatches();
          break;
        case BulkTransactionView.TOTE:
          this.emergencyPickTotes();
          break;
        case BulkTransactionView.ORDER:
          this.emergencyPickOrders();
          break;
      }
      return;
    }
    
    switch (event) {
      case BulkTransactionView.BATCH:
        this.bulkBatchesObservable()
          .pipe(take(1)) // Auto-unsubscribe after first emission
          .subscribe((res) => {
            this.orders = res.value ?? [];
            this.originalOrders = res.value ?? [];
          });
        this.displayedColumns = BATCH_DISPLAYED_COLUMNS;
        this.selectedDisplayedColumns = SELECTED_BATCH_DISPLAYED_COLUMNS;
        // We don't need to create a batch id manually as it is already created for batches
        this.isBatchIdGenerationEnabled = false;
        break;
        
      case BulkTransactionView.TOTE:
        this.bulkTotesObservable()
          .pipe(take(1)) // Auto-unsubscribe after first emission
          .subscribe((res) => {
            this.orders = res.value ?? [];
            this.originalOrders = res.value ?? [];
          });
        this.displayedColumns = TOTE_DISPLAYED_COLUMNS;
        this.selectedDisplayedColumns = SELECTED_TOTE_DISPLAYED_COLUMNS;
        // We don't need to create a batch id manually for totes
        this.isBatchIdGenerationEnabled = false;
        break;
        
      case BulkTransactionView.ORDER:
        this.bulkOrdersObservable()
          .pipe(take(1)) // Auto-unsubscribe after first emission
          .subscribe((res) => {
            this.orders = res.value ?? [];
            this.originalOrders = res.value ?? [];
          });
        this.displayedColumns = ORDER_DISPLAYED_COLUMNS;
        this.selectedDisplayedColumns = SELECTED_ORDER_DISPLAYED_COLUMNS;
        // We need to create a batch id manually for orders
        this.isBatchIdGenerationEnabled = true;
        break;
    }
    this.batchSelected = false;
  }

  getAllCount() {
    if (this.isEmergencyPick) {
      // In emergency pick mode, fetch emergency counts
      this.getEmergencyOrdersCount();
      this.getEmergencyTotesCount();
      this.getEmergencyBatchesCount();
    } else {
      // Normal mode - fetch all counts
      this.bulkOrdersCountApi();
      this.bulkTotesCountApi();
      this.bulkBatchesCountApi();
    }
  }

  selectOrder(event) {
    event.toteNumber = this.selectedOrders.length + 1;
    this.orderLines = [];
    // Reset slapper label flow flag when new orders are selected
    this.isSlapperLabelFlow = false;
    if (this.view == BulkTransactionView.BATCH) {
      this.selectedOrders = event.orders;
      this.orders = this.orders.filter((element) => element.batchId != event.batchId);
      this.batchSelected = true;
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

  OpenSlaperLabelNextToteId() {
    this.isSlapperLabelFlow = true; // Set flag to indicate we're in slapper label flow
    const dialogRefTote = this.global.OpenDialog(BmSlaperLabelSplitEntryComponent, {
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
      if (result && result.length > 0) {
        this.selectedOrders = result;
        // Clear orderLines and rebuild it from the nested structure
        this.orderLines = [];
        this.selectedOrders.forEach((order) => {
          order.orderLines.forEach((orderLine) => {
            orderLine.toteId = orderLine.toteId;
          });
          // Add all order lines to the flat orderLines array
          this.orderLines = this.orderLines.concat(order.orderLines);
        });
        this.iBulkProcessApiService.updateOpenTransactionsZoneCaseQuantity(this.orderLines);
        this.verifyBulks = !this.verifyBulks;
        localStorage.setItem(localStorageKeys.VerifyBulks, this.verifyBulks.toString());
      }
    });
  }

  removeOrder(event: OrderResponse | TotesResponse | BatchesResponse) {
    this.orderLines = [];
    // Reset slapper label flow flag when orders are removed
    this.isSlapperLabelFlow = false;
  
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
    // Reset slapper label flow flag when new orders are appended
    this.isSlapperLabelFlow = false;
  }

  getworkstationbulkzone() {
    this.iBulkProcessApiService.bulkPreferences().subscribe((res: BulkPreferences) => this.Prefernces = res)
  }

  removeAll() {
    if (this.view == BulkTransactionView.BATCH) {
      if (this.isEmergencyPick) {
        // In emergency mode, repopulate with emergency batches
        this.emergencyPickBatches();
      } else {
        // In normal mode, repopulate with normal batches
        this.bulkBatchesObservable()
          .pipe(take(1)) // Auto-unsubscribe after first emission
          .subscribe((res) => {
            this.orders = res.value ?? [];
            this.selectedOrders = [];
          });
      }
    }
    else if (this.view == BulkTransactionView.TOTE) {
      if (this.isEmergencyPick) {
        // In emergency mode, repopulate with emergency totes
        this.emergencyPickTotes();
      } else {
        // In normal mode, use optimized logic
        if (this.selectedOrders.length < this.originalOrders.length) {
          // Optimized: Reset arrays and update counts properly
          this.status.orderLinesCount = 0;
          this.orderLines = [];
          this.selectedOrders = [];
          this.orders = [...this.originalOrders];
        } else {
          this.orders = [...this.selectedOrders, ...this.orders];
          this.selectedOrders = [];
        }
      }
    }
    else if (this.view == BulkTransactionView.ORDER) {
      if (this.isEmergencyPick) {
        // In emergency mode, repopulate with emergency orders
        this.emergencyPickOrders();
      } else {
        // In normal mode, use optimized logic
        if (this.selectedOrders.length < this.originalOrders.length) {
          // Optimized: Reset arrays and update counts properly
          this.status.orderLinesCount = 0;
          this.orderLines = [];
          this.selectedOrders = [];
          this.orders = [...this.originalOrders];
        } else {
          this.orders = [...this.selectedOrders, ...this.orders];
          this.selectedOrders = [];
        }
      }
    }
    this.batchSelected = false;
    this.status.orderLinesCount = 0;
    this.orderLines = [];
    // Reset slapper label flow flag when all orders are removed
    this.isSlapperLabelFlow = false;
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

  async getEmergencyOrdersInfo() {
    try {
      const ordersRes = await this.iBulkProcessApiService.getEmergencyOrdersInfo();
      const hasEmergencyOrders = ordersRes?.body?.isSuccess && ordersRes?.body?.value?.hasPendingForWorkstation;
      
      this.hasEmergencyPick = hasEmergencyOrders;
      this.isEmergencyPick = hasEmergencyOrders; // Set the checkbox state
      
      if(this.isEmergencyPick){
        this.emergencyAlertService.snooze30s();
        // Fetch emergency orders, totes, and batches counts when emergency pick is enabled
        await this.getEmergencyOrdersCount();
        await this.getEmergencyTotesCount();
        await this.getEmergencyBatchesCount();
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
    }
  }

  async getEmergencyOrdersCount() {
    try {
      // Use the same API call as emergencyPickOrders but just get the count
      let payload: PagingRequest = {
        selectedPage: 0,
        pageSize: this.EMERGENCY_PAGE_SIZE // Large size for emergency data since no search endpoint
      };
      const ordersRes = await this.iBulkProcessApiService.getEmergencyPickOrders(payload).toPromise();
      this.status.orderCount = ordersRes?.value?.length || 0;
    } catch (error) {
      console.error('Failed to fetch emergency orders count:', error);
    }
  }

  async getEmergencyTotesCount() {
    try {
      const totesCountRes = await this.iBulkProcessApiService.getEmergencyTotesCount();
      if(totesCountRes?.body?.isSuccess) {
        this.status.toteCount = totesCountRes.body.value || 0;
      }
    } catch (error) {
      console.error('Failed to fetch emergency totes count:', error);
    }
  }

  async getEmergencyBatchesCount() {
    try {
      const batchesCountRes = await this.iBulkProcessApiService.getEmergencyBatchesCount();
      if(batchesCountRes?.body?.isSuccess) {
        this.status.batchCount = batchesCountRes.body.value || 0;
      }
    } catch (error) {
      console.error('Failed to fetch emergency batches count:', error);
    }
  }

  get showVerifyBulkButton(): boolean {
    return !this.isQuickPick || this.isEmergencyPick;
  }

  get showQuickPickButton(): boolean {
    return this.isQuickPick && !this.isEmergencyPick;
  }
}

