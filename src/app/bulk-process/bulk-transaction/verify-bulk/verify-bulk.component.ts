import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import {
  BulkPreferences,
  OrderLineResource,
  TaskCompleteNewRequest,
  WorkStationSetupResponse
} from 'src/app/common/Model/bulk-transactions';
import { SetTimeout } from 'src/app/common/constants/numbers.constants';
import { DialogConstants, ResponseStrings, Style, ToasterMessages, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
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

@Component({
  selector: 'app-verify-bulk',
  templateUrl: './verify-bulk.component.html',
  styleUrls: ['./verify-bulk.component.scss']
})
export class VerifyBulkComponent implements OnInit {
  @Output() back = new EventEmitter<any>();
  @Input() orderLines: any = [];
  @Input() Prefernces: BulkPreferences;
  @Input() url: any;
  IsLoading: boolean = true;
  OldSelectedList: any = [];
  taskCompleteNewRequest: TaskCompleteNewRequest [] = [];
  filteredData: any = [];
  @Input() NextToteID: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() ordersDisplayedColumns: string[] = ["ItemNo", "Description", "LineNo", "Whse", "Location", "LotNo", "SerialNo", "OrderNo", "OrderQty", "CompletedQty", "ToteID", "Action"];
  suggestion: string = "";
  SearchString: string = "";
  taskCompleted: boolean = false;
  backSubscription;
  backCount: number = 0;
  workstationPreferences: WorkStationSetupResponse;
  public iBulkProcessApiService: IBulkProcessApiService;
  public iAdminApiService: IAdminApiService;

  @ViewChild('openAction') openAction: MatSelect;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    public adminApiService: AdminApiService,
    private global: GlobalService,
    private spinnerService: SpinnerService,
    private sharedService: SharedService,
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
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
    const map = new Map();
    this.orderLines.forEach((obj: { itemNumber: any; }) => {
      if (!map.has(obj.itemNumber)) {
        map.set(obj.itemNumber, obj);
      }
    });
    this.OldSelectedList = Array.from(map.values());
    this.orderLines = new MatTableDataSource(
      this.orderLines
    );
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
        return function (str) {
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
    } else this.suggestion = "";
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
          heading: `Verify Bulk ${this.url}`,
          buttonFields: true,
          customButtonText: true,
          btn1Text: 'Continue Verification',
          btn2Text: 'Leave Anyway'
        },
      });
      dialogRef1.afterClosed().subscribe(async (resp: any) => {
        if (resp != ResponseStrings.Yes) {
          this.back.emit(this.taskCompleted);
        }
        this.backCount = 0;
      });
    }
  }

  numberSelection(element) {
    element.NextToteID = this.NextToteID;
    let record = this.taskCompleteNewRequest.find((x: TaskCompleteNewRequest) => x.id == element.id);

    const dialogRef1: any = this.global.OpenDialog(BpNumberSelectionComponent, {
      height: 'auto',
      width: Style.w402px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        url: this.url,
        completedQuantity: element.completedQuantity,
        from: "completed quantity"
      }
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if (record == undefined) {
        return;
      }
      // ResponseString is the users response to Location Empty dialog
      // Dialog is only shown is Zero Location Qty Check is turned on and the url is Pick
      if (resp.type == ResponseStrings.Yes) {
        record.newLocationQty = 0;
        element.completedQuantity = resp.newQuantity;
      }
      else if (resp.type == ResponseStrings.No) {
        const dialogRef: any = this.global.OpenDialog(InputFilterComponent, {
          height: DialogConstants.auto,
          width: '480px',
          data: {
            FilterColumnName: `Enter the Location Quantity after this ${this.url}`,
            dynamicText: 'Enter Location Quantity'
          },
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(async (result: any) => {
          if (record == undefined) {
            return;
          }
            record.newLocationQty = parseInt(result.SelectedItem);
            element.completedQuantity = resp.newQuantity;
        });
      } else if (resp.type == ResponseStrings.Cancel) {
        element.completedQuantity = resp.newQuantity;
      } else {
        record.newLocationQty = resp.newQuantity;
        element.completedQuantity = resp.newQuantity;      }
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
      height: 'auto',
      width: Style.w786px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: element
    });
    let toteId = this.orderLines.filteredData[i].toteId;
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if (resp) {
        this.orderLines.filteredData.forEach((element: any) => {
          if (element.toteId == toteId) {
            element.toteId = resp.NewToteID;
          }
        });
        this.orderLines.filteredData[i].transactionQuantity = resp.NewToteQTY;
        this.orderLines.filteredData[i].completedQuantity = resp.NewToteQTY;
        this.orderLines.filteredData[i].id = resp.Id;
      }
    });
  }

  async taskComplete(orderLines: OrderLineResource[]) {
    const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: `You will now confirm the actual Completed Quantities entered are correct!`,
        message2: `
        ‘No’ changes may be made after posting!
        Touch ‘Yes’ to continue.`,
        heading: 'Post Completed Quantity?',
        buttonFields: true,
      },
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if (resp == ResponseStrings.Yes) {
        let ordersNew: TaskCompleteNewRequest[] = new Array();
        orderLines.forEach((x: any) => {

          let record = this.taskCompleteNewRequest.find((r: TaskCompleteNewRequest) => r.id == x.id);
          if (record != undefined) {
            record.completedQty = parseInt(x.completedQuantity);
            ordersNew.push(record);
          }
        });

        let res = await this.iBulkProcessApiService.bulkPickTaskComplete(ordersNew);
        if (res?.status == HttpStatusCode.Ok) {
          if (this.url == "Pick") {
            await this.TaskCompleteEOB();
          }
          else {
            this.taskCompleteFinished();
          }
        }
      }
    });
  }

  async validateTaskComplete() {
    let isZeroCompletedQuantity: boolean = false;
    this.orderLines.filteredData.forEach((x: OrderLineResource) => {
      if (x.completedQuantity == 0) {
        isZeroCompletedQuantity = true;
      }
    });
    if (isZeroCompletedQuantity) {
      const dialogRef1 = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          message: `There is a completed quantity of ZERO for one or more line items!`,
          message2: `Touch 'Yes' to to leave the transactions open.
          Touch 'No' to complete with zero qunatities.
          Touch Cancel to continue varification.`,
          heading: 'Zero Completed Quantity - Leave Open?',
          buttonFields: true,
          threeButtons: true
        },
      });
      dialogRef1.afterClosed().subscribe(async (res: string) => {
        if (res == ResponseStrings.Yes) {
          await this.taskComplete(this.orderLines.filteredData.filter((x: OrderLineResource) => x.completedQuantity > 0));
        }
        else if (res == ResponseStrings.No) {
          await this.taskComplete(this.orderLines.filteredData);
        }
      });
    }
    else {
      await this.taskComplete(this.orderLines.filteredData);
    }
  }

  async TaskCompleteEOB() {
    let order = this.orderLines.filteredData.filter(x => (x.transactionQuantity > x.completedQuantity));
    if (order.length > 0) {
      this.showLoader(); // Spinner ko dikhao
      await this.checkForZone(order[0].id); // Check karo ki zone mil gaya hai ya nahi
      this.hideLoader(); // Spinner ko chhupao
    }

    if (this.Prefernces.systemPreferences.displayEob) {
      this.showLoader(); // Spinner ko dikhao
      await this.callEndOfBatch(order); // End of batch API call karo
      this.hideLoader(); // Spinner ko chhupao
    } else {
      this.taskCompleteFinished();
    }
  }

  async checkForZone(orderId: any) {
    if (this.Prefernces.systemPreferences.shortPickFindNewLocation && this.Prefernces.systemPreferences.displayEob) {
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
        const res: any = await this.iAdminApiService.orderline(orderId).toPromise();
        if (res.zone != "" && res.zone) return;
      }
    }
  }

  async callEndOfBatch(order: any[]) {
    const orderNumbers: string[] = Array.from(new Set(order.map(item => item.orderNumber)));
    const res: any = await this.iAdminApiService.endofbatch({ orderNumbers: orderNumbers }).toPromise();
    if (res.length > 0) {
      const dialogRef1: any = this.global.OpenDialog(PickRemainingComponent, {
        height: 'auto',
        width: Style.w786px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: res
      });
      dialogRef1.afterClosed().subscribe(async (resp: any) => {
        this.taskCompleteFinished();
      });
    } else {
      this.taskCompleteFinished();
    }
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
        message: `There are no remaining ${this.url}s for the selected orders.`,
        message2: `Please move the order to Packaging/Shipping.`,
        heading: `No Remaining ${this.url}s`,
        singleButton: true
      },
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if (resp == ResponseStrings.Yes) {
        this.back.emit(this.taskCompleted);
      }
    });
  }

  generateTranscAction(event: any) {
    this.openAction?.options.forEach((data: MatOption) => data.deselect());
  }

  selectRow(row: any) {
    this.orderLines.filteredData.forEach(element => {
      if (row != element) {
        element.selected = false;
      }
    });
    const selectedRow = this.orderLines.filteredData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }

}
