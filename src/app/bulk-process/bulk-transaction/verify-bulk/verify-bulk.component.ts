import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import {
  BulkPreferences,
  OrderLineResource,
  TaskCompleteNewRequest,
  WorkStationSetupResponse,
  DialogResponse,
  FullToteResponse,
  OrderLineWithSelection
} from 'src/app/common/Model/bulk-transactions';
import { SetTimeout } from 'src/app/common/constants/numbers.constants';
import { ConfirmationHeadings, ConfirmationMessages, DialogConstants, Placeholders, ResponseStrings, Style, ToasterMessages, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { BpFullToteComponent } from 'src/app/dialogs/bp-full-tote/bp-full-tote.component';
import { BpNumberSelectionComponent } from 'src/app/dialogs/bp-number-selection/bp-number-selection.component';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';
import { PickRemainingComponent } from '../pick-remaining/pick-remaining.component';
import { SpinnerService } from 'src/app/common/init/spinner.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { MatTooltip } from '@angular/material/tooltip';
import { PrintApiService } from 'src/app/common/services/print-api/print-api.service';
import {CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { firstValueFrom } from 'rxjs';
import { ApiResponse} from 'src/app/common/types/CommonTypes';
import { DisplayEOBResponse } from 'src/app/common/types/bulk-process/bulk-transactions';
import { BulkTransactionType } from 'src/app/common/constants/bulk-process/bulk-transactions';
import { UpdateOTsNewBatchIdRequest } from '../../../common/Model/bulk-transactions';

@Component({
  selector: 'app-verify-bulk',
  templateUrl: './verify-bulk.component.html',
  styleUrls: ['./verify-bulk.component.scss']
})
export class VerifyBulkComponent implements OnInit {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  itemNumber: string = this.fieldMappings.itemNumber;
  placeholders = Placeholders;
  @Output() back = new EventEmitter<boolean>();
  @Input() orderLines;
  @Input() Prefernces: BulkPreferences;
  @Input() bulkTransactionType: string;
  @Input() isSlapperLabelFlow: boolean = false; // New flag to identify slapper label flow
  IsLoading: boolean = true;
  OldSelectedList: any = [];
  taskCompleteNewRequest: TaskCompleteNewRequest[] = [];
  filteredData: any = [];
  @Input() NextToteID: number;
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() ordersDisplayedColumns: string[] = ["ItemNo", "Description", "LineNo", "Whse", "Location", "LotNo", "SerialNo", "OrderNo", "OrderQty", "CompletedQty", "ToteID", "Action"];
  suggestion: string = "";
  SearchString: string = "";
  taskCompleted: boolean = false;
  backSubscription;
  backCount: number = 0;
  workstationPreferences: WorkStationSetupResponse;
  @Input() isBatchIdGenerationEnabled:boolean;
  public iBulkProcessApiService: IBulkProcessApiService;
  public iAdminApiService: IAdminApiService;
  public commonApiService: CommonApiService;

  @ViewChild('openAction') openAction: MatSelect;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    public adminApiService: AdminApiService,
    private CommonApiService:CommonApiService,
    private readonly global: GlobalService,
    private readonly spinnerService: SpinnerService,
    private readonly sharedService: SharedService,
    private readonly printApiService: PrintApiService
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
    this.iAdminApiService = adminApiService;
    this.commonApiService=CommonApiService;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.orderLines.forEach(element => {
        this.taskCompleteNewRequest.push({
          id: element.id,
          completedQty: 0,
          newLocationQty: -1
        });
        element.completedQuantity = 0;
      });

      this.backSubscription = this.sharedService.verifyBulkTransBackObserver.subscribe((data: any) => {
        this.backCount++;
        this.backButton();
      });

      // Make sure all order lines have consistent Batch ID assignment
      this.validateOrderLines();

      if (this.isBatchIdGenerationEnabled && !this.orderLines[0].batchId) {
        var request = new UpdateOTsNewBatchIdRequest();
        this.orderLines.forEach(orderLine => {
          request.openTransactionIds.push(orderLine.id);
        });

        // Need this because the await on the API call below causes 'this' context to be lost,
        // resulting in an error when trying to access this.orderLines
        const locOrderLines: OrderLineResource[] = Array.from(this.orderLines);

        var newBatchId = await this.iBulkProcessApiService.UpdateOTsNewBatchIdRequest(request);

        locOrderLines.forEach(orderLine => {
          orderLine.batchId = newBatchId;
        });
      }

    } catch (error) {
      console.log(error);
      this.global.ShowToastr(
        ToasterType.Error,
        ToasterMessages.SomethingWentWrong,
        ToasterTitle.Error
      );
    }
  }

  private validateOrderLines() {
    if (this.orderLines?.length === 0)
      throw new Error('No order lines.');

    if (!(this.orderLines.every(item => !item.batchId || item.batchId === '') || this.orderLines.every(item => item.batchId && item.batchId !== '')))
      throw new Error('Inconsistent Batch ID assignment in order lines.');
  }

  ngOnDestroy() {
    this.backSubscription.unsubscribe();
  }

  addItem($event: any = null) {
    this.SearchString = this.suggestion;
    if (!$event) this.Search(this.SearchString);
    if ($event) {
      let filterValue = this.suggestion.trim().toLowerCase();
      this.orderLines.filter = filterValue;
      this.filteredData = []
    }
  }

  ngAfterViewInit() {
    this.processOrderLinesData();
    this.initializeComponent();
  }

  private processOrderLinesData() {
    if (this.isSlapperLabelFlow) {
      this.processSlapperLabelFlow();
    } else {
      this.processStandardFlow();
    }
  }

  private processSlapperLabelFlow() {
    const flatOrderLines = this.flattenOrderLines();
    this.createSearchList(flatOrderLines);
    this.orderLines = new MatTableDataSource(flatOrderLines);
  }

  private processStandardFlow() {
    // Preserve existing functionality - use orderLines as is
    this.OldSelectedList = this.orderLines;
    this.orderLines = new MatTableDataSource(this.orderLines);
    this.orderLines.paginator = this.paginator;
  }

  private flattenOrderLines(): OrderLineResource[] {
    let flatOrderLines: OrderLineResource[] = [];

    if (this.orderLines && this.orderLines.length > 0 && this.orderLines[0].orderLines) {
      // Nested structure - flatten the orderLines arrays
      this.orderLines.forEach((order: { orderLines?: OrderLineResource[] }) => {
        if (order.orderLines && order.orderLines.length > 0) {
          flatOrderLines.push(...order.orderLines);
        }
      });
    } else {
      // Flat structure - use as is
      flatOrderLines = this.orderLines;
    }

    return flatOrderLines;
  }

  private createSearchList(flatOrderLines: OrderLineResource[]) {
    // Create search list for filtering (deduplicate by itemNumber for search suggestions)
    const map = new Map();
    flatOrderLines.forEach((obj: OrderLineResource) => {
      if (!map.has(obj.itemNumber)) {
        map.set(obj.itemNumber, obj);
      }
    });
    this.OldSelectedList = Array.from(map.values());
  }

  private initializeComponent() {
    this.orderLines.paginator = this.paginator;
    this.getWorkstationSetupInfo();
    setTimeout(() => {
      this.searchBoxField?.nativeElement.focus();
    }, SetTimeout['500Milliseconds']);
  }

  getWorkstationSetupInfo() {
    this.iAdminApiService.WorkstationSetupInfo().subscribe((res) => {
      if (res.isExecuted && res.data) {
        this.workstationPreferences = res.data;
      }
    })
  }

  ViewByLocation() {
    var list = this.orderLines.filteredData.sort((a, b) => a.location.localeCompare(b.location));
    this.orderLines = new MatTableDataSource(list);
    this.orderLines.paginator = this.paginator;
  }

  ClearSearch() {
    this.suggestion = '';
    this.SearchString = '';
    this.filteredData = [];
    this.orderLines.filter = "";
  }

  ViewByOrderItem() {
    var list = this.orderLines.filteredData.sort((a, b) => a.orderNumber.localeCompare(b.orderNumber) || a.itemNumber.localeCompare(b.itemNumber));
    this.orderLines = new MatTableDataSource(list);
    this.orderLines.paginator = this.paginator;
  }

  Search($event: any) {
    if ($event.length > 0) {
      //this.filteredData = this.OldSelectedList.filter(function (str) { return str.itemNumber.toLowerCase().startsWith($event.toLowerCase()); });
      this.filteredData = this.OldSelectedList.filter((function () {
        const seen = new Set();
        return function (str: OrderLineResource) {
          const itemNumberLower = str.itemNumber.toLowerCase();
          if (!seen.has(itemNumberLower) && itemNumberLower.startsWith($event.toLowerCase())) {
            seen.add(itemNumberLower);
            return true;
          }
          return false;
        };
      })());

      if (this.filteredData.length > 0) this.suggestion = this.filteredData[0].itemNumber;
      else this.suggestion = ""
    } else this.suggestion = ""
  }

  backButton() {
    if (this.backCount < 2) {
      const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          message: `Transaction verification is currently underway.
          Leaving will remove transactions, otherwise continue with transaction verification`,
          heading: `Verify Bulk ${this.bulkTransactionType}`,
          buttonFields: true,
          customButtonText: true,
          btn1Text: 'Continue Verification',
          btn2Text: 'Leave Anyway'
        },
      });
      dialogRef1.afterClosed().subscribe(async (resp: string) => {
        if (resp != ResponseStrings.Yes) {
          this.back.emit(this.taskCompleted);
        }
        this.backCount = 0;
      });
    }
  }

  numberSelection(element: OrderLineResource & { NextToteID?: number }) {
    element.NextToteID = this.NextToteID;
    let record = this.taskCompleteNewRequest.find((x: TaskCompleteNewRequest) => x.id == element.id);

    const dialogRef1: any = this.global.OpenDialog(BpNumberSelectionComponent, {
      height: 'auto',
      width: Style.auto,
      minWidth: Style.auto,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        url: this.bulkTransactionType,
        completedQuantity: element.completedQuantity,
        transactionQuantity: element.transactionQuantity,
        from: "completed quantity"
      }
    });
    dialogRef1.afterClosed().subscribe(async (resp: DialogResponse) => {
      if (record == undefined) {
        return;
      }
      // ResponseString is the users response to Location Empty dialog
      // Dialog is only shown is Zero Location Qty Check is turned on and the url is Pick
      if (resp.type == ResponseStrings.Yes) {
        record.newLocationQty = 0;
        element.completedQuantity = resp.newQuantity || 0;
      }
      else if (resp.type == ResponseStrings.No) {
        const dialogRef: any = this.global.OpenDialog(InputFilterComponent, {
          height: DialogConstants.auto,
          width: '480px',
          data: {
            FilterColumnName: `Enter the Location Quantity after this ${this.bulkTransactionType}`,
            dynamicText: 'Enter Location Quantity'
          },
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(async (result: DialogResponse) => {
          if (record == undefined || resp.type == undefined) {
            return;
          }
          record.newLocationQty = parseInt(result.SelectedItem || '0');
          element.completedQuantity = resp.newQuantity || 0;
        });
      } else if (resp.type == ResponseStrings.Cancel) {
        element.completedQuantity = resp.newQuantity || 0;
      } else if (resp.type == null) {
        // When completed quantity equals or exceeds order quantity, no location empty dialog was shown
        element.completedQuantity = resp.newQuantity || 0;
      } else {
        record.newLocationQty = resp.newQuantity || 0;
        element.completedQuantity = resp.newQuantity || 0;
      }
    });
  }

  ResetAllCompletedQty() {
    this.orderLines.filteredData.forEach(element => {
      element.completedQuantity = 0;
    });
  }

  CopyAllOrder() {
    this.orderLines.filteredData.forEach(element => {
      element.completedQuantity = element.transactionQuantity;
    });
  }

  fullTote(element: any, i: any = null) {
    const dialogRef1: any = this.global.OpenDialog(BpFullToteComponent, {
      height: DialogConstants.auto,
      width: Style.w786px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: element
    });
    let toteId = this.orderLines.filteredData[i].toteId;
    dialogRef1.afterClosed().subscribe(async (resp: FullToteResponse) => {
      if (resp) {
        this.orderLines.filteredData.forEach((element: any) => {
          if (element.toteId == toteId) {
            element.toteId = resp.NewToteID;
          }
        });
        this.orderLines.filteredData[i].transactionQuantity = resp.NewToteQTY;
        this.orderLines.filteredData[i].completedQuantity = resp.NewToteQTY;
        this.orderLines.filteredData[i].id = resp.Id;
        this.taskCompleteNewRequest.push({
          id: resp.Id,
          completedQty: 0,
          newLocationQty: -1
        });
      }
    });
  }

  async taskComplete(orderLines: OrderLineResource[]) {
    const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: `You will now confirm the actual Completed Quantities entered are correct!`,
        message2: `
        'No' changes may be made after posting!
        Touch 'Yes' to continue.`,
        heading: 'Post Completed Quantity?',
        buttonFields: true,
      },
    });
    dialogRef1.afterClosed().subscribe(async (resp: string) => {
      if (resp == ResponseStrings.Yes) {        
        let ordersNew: TaskCompleteNewRequest[] = new Array();
        orderLines.forEach((orderLine: OrderLineResource) => {
          let record = this.taskCompleteNewRequest.find((r: TaskCompleteNewRequest) => r.id == orderLine.id);
          if (record) {
            record.completedQty =orderLine.completedQuantity;
            ordersNew.push(record);
          }
        });
        
        let res = await this.iBulkProcessApiService.bulkPickTaskComplete(ordersNew);
        if (res?.status == HttpStatusCode.Ok) {
          if (this.bulkTransactionType == BulkTransactionType.PICK && res?.body.length > 0) {
            await this.TaskCompleteEOB(res?.body);
          }
          else {
            this.taskCompleteFinished();
          }
        }
      }
    });
  }
  
  getNextBatchID(): Promise<string> {
    return firstValueFrom(this.commonApiService.NextBatchID())
      .then((res: ApiResponse<string>) => {
        if (res?.data && res?.isExecuted) {
          return res.data;
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.SomethingWentWrong,
            ToasterTitle.Error
          );
          return ''; // fallback if response is invalid
        }
      })
      .catch((error) => {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.SomethingWentWrong,
          ToasterTitle.Error
        );
        return ''; // fallback if observable throws
      });
  }

async validateTaskComplete() {
    let isZeroCompletedQuantity: boolean = false;
    this.orderLines.filteredData.forEach((x: OrderLineResource) => {
      if (x.completedQuantity == 0) isZeroCompletedQuantity = true;
    });
    if (isZeroCompletedQuantity) {
      const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: DialogConstants.auto,
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          message: `There is a completed quantity of ZERO for one or more line items!`,
          message2: `Touch 'Yes' to to leave the transactions open.
          Touch 'No' to complete with zero quantity.
          Touch Cancel to continue verification.`,
          heading: 'Zero Completed Quantity - Leave Open?',
          buttonFields: true,
          threeButtons: true
        },
      });
      dialogRef1.afterClosed().subscribe(async (res: string) => {
        if (res == ResponseStrings.Yes) await this.taskComplete(this.orderLines.filteredData.filter((x: OrderLineResource) => x.completedQuantity > 0));
        else if (res == ResponseStrings.No) await this.taskComplete(this.orderLines.filteredData);
      });
    }
    else await this.taskComplete(this.orderLines.filteredData);
  }

  async TaskCompleteEOB(orderId: number[]) {
    let order = this.orderLines.filteredData.filter(x => (x.transactionQuantity > x.completedQuantity));
    if (order.length > 0) {
      this.showLoader();
      await this.checkForZone(orderId[0]);
      this.hideLoader();
    }

    if (this.Prefernces.systemPreferences.displayEob) {
      this.showLoader();
      await this.callEndOfBatch(order);
      this.hideLoader();
    }
    else this.taskCompleteFinished();
  }

  async checkForZone(orderId: number | undefined) {
    if (this.Prefernces.systemPreferences.shortPickFindNewLocation && this.Prefernces.systemPreferences.displayEob) {
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
        const res: any = await this.iAdminApiService.orderline(orderId).toPromise();
        if (res?.status == HttpStatusCode.Ok) {
          if (res.zone != "" && res.zone) return;
        } else if (res?.status == HttpStatusCode.NoContent) return;
      }
    }
  }

  async callEndOfBatch(order: any[]) {
    const orderNumbers: string[] = Array.from(new Set(order.map(item => item.orderNumber)));
    const res: DisplayEOBResponse[] = await this.iAdminApiService.endofbatch({ orderNumbers: orderNumbers }).toPromise();
    if (res.length > 0) {
      const dialogRef1: any = this.global.OpenDialog(PickRemainingComponent, {
        height: 'auto',
        width: Style.w786px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: res
      });
      dialogRef1.afterClosed().subscribe(() => this.taskCompleteFinished());
    } else this.taskCompleteFinished();
  }

  showLoader() {
    this.spinnerService.IsLoader = true;
  }

  hideLoader() {
    this.spinnerService.IsLoader = false;
  }

  taskCompleteFinished() {
    this.taskCompleted = true;
    this.back.emit(this.taskCompleted);
    this.global.ShowToastr(ToasterType.Success, ToasterMessages.RecordUpdatedSuccessful, ToasterTitle.Success);
  }

  showNoRemainings() {
    const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: `There are no remaining ${this.bulkTransactionType}s for the selected orders.`,
        message2: `Please move the order to Packaging/Shipping.`,
        heading: `No Remaining ${this.bulkTransactionType}s`,
        singleButton: true
      },
    });
    dialogRef1.afterClosed().subscribe(async (resp: string) => {
      if (resp == ResponseStrings.Yes) this.back.emit(this.taskCompleted);
    });
  }

  generateTranscAction(event: any) {
    this.openAction?.options.forEach((data: MatOption) => data.deselect());
  }

  selectRow(row: any) {
    this.orderLines.filteredData.forEach(element => {
      if (row != element) {
        (element as OrderLineWithSelection).selected = false;
      }
    });
    const selectedRow = this.orderLines.filteredData.find((x: any) => x === row) as OrderLineWithSelection;
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }

  printAllToteLabels() {
    if(this.isSlapperLabelFlow) {
      this.printOffCarouselPickItemLabels();
    } else {
      if (this.bulkTransactionType != BulkTransactionType.COUNT) {
        let orderNumbers = this.orderLines.filteredData.map(o => o['orderNumber']);
        let toteIds = this.orderLines.filteredData.map(o => o['toteId']);
        this.iAdminApiService.PrintTotes(orderNumbers, toteIds, this.bulkTransactionType);
      }
    }
  }

  printBulkTraveler() {
    const dialogRef1 = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: ConfirmationMessages.PrintBatchOrOrders,
        heading: ConfirmationHeadings.PrintBatchOrOrders,
        buttonFields: true,
        threeButtons: true
      },
    });

    dialogRef1.afterClosed().subscribe(async (res: string) => {
      if (res) {
        let transIDs = this.isSlapperLabelFlow ?
          this.orderLines.filteredData.filter(o => !o.isPartialCase).map(o => o.id) :
          this.orderLines.filteredData.map(o => o['id']);

        if (res == ResponseStrings.Yes) {
          this.printApiService.PrintBulkTraveler(transIDs);
        }
        else if (res == ResponseStrings.No) {
          this.printApiService.PrintBulkTransactionsTravelerOrder(transIDs);
        }
      }
    });
  }

  printSingleToteLabel(index: number) {
    if (this.isSlapperLabelFlow) {
      let labelId = this.orderLines.filteredData[index].id;
      this.printOffCarouselPickItemLabels(labelId);
    } else {
      const transactionType = this.bulkTransactionType;
      let orderNumber: string[] = [this.orderLines.filteredData[index].orderNumber || ''];
      let toteId: string[] = [this.orderLines.filteredData[index].toteId || ''];
      this.iAdminApiService.PrintTotes(orderNumber, toteId, transactionType, index);
    }
  }

  printOffCarouselPickItemLabels(index: number = -1) {
    let dlgMessage = '';
    let dlgHeading = '';
    let transIDs: number[] = [];

    if (index == -1) {
      // All labels
      dlgMessage = ConfirmationMessages.PrintOffCarouselPickItemLabels;
      dlgHeading = ConfirmationHeadings.PrintOffCarouselPickItemLabels;
      transIDs = this.orderLines.filteredData.filter(o => o.isPartialCase).map(o => o.id);
    } else {
      // Single label
      dlgMessage = ConfirmationMessages.PrintOffCarouselPickItemSingleLabel;
      dlgHeading = ConfirmationHeadings.PrintOffCarouselPickItemSingleLabel;
      transIDs.push(index);
    }

    const dialogRef1 = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: dlgMessage,
        heading: dlgHeading,
        buttonFields: true,
      },
    });
    dialogRef1.afterClosed().subscribe(async (res: string) => {
      if (res == ResponseStrings.Yes) {
        this.printApiService.PrintOCPItem(transIDs);
      }
    });
  }

  @ViewChild('tooltip') tooltip: MatTooltip;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.altKey && event.key === 't') {
      event.preventDefault();
      this.validateTaskComplete();
    }

    if (event.key === 'Alt') {
      event.preventDefault();
      this.tooltip.show();
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) {
    if (event.key === 'Alt') {
      event.preventDefault();
      this.tooltip.hide();
    }
  }
}
