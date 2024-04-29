import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { WorkStationSetupResponse } from 'src/app/common/Model/bulk-transactions';
import { SetTimeout } from 'src/app/common/constants/numbers.constants';
import { DialogConstants, ResponseStrings, Style, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { BpFullToteComponent } from 'src/app/dialogs/bp-full-tote/bp-full-tote.component';
import { BpNumberSelectionComponent } from 'src/app/dialogs/bp-number-selection/bp-number-selection.component';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';

@Component({
  selector: 'app-verify-bulk-count',
  templateUrl: './verify-bulk-count.component.html',
  styleUrls: ['./verify-bulk-count.component.scss']
})
export class VerifyBulkCountComponent implements OnInit {
  @Output() back = new EventEmitter<any>();
  @Input() orderLines: any = [];
  OldSelectedList: any = [];
  filteredData: any = [];
  @Input() NextToteID: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() ordersDisplayedColumns: string[] = ["ItemNo", "Description", "LineNo", "Whse", "Location", "LotNo", "SerialNo", "OrderNo", "OrderQty", "CompletedQty", "ToteID", "Action"];
  suggestion: string = "";
  SearchString: string = "";
  taskCompleted: boolean = false;
  workstationPreferences: WorkStationSetupResponse;
  public iBulkProcessApiService: IBulkProcessApiService;
  public iAdminApiService: IAdminApiService;

  @ViewChild('openAction') openAction: MatSelect;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    public adminApiService: AdminApiService,
    private global: GlobalService
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {

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
    this.OldSelectedList = this.orderLines;
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
      this.filteredData = this.OldSelectedList.filter(function (str) { return str.itemNumber.startsWith($event); });
      if (this.filteredData.length > 0) this.suggestion = this.filteredData[0].itemNumber;
      else this.suggestion = ""
    } else this.suggestion = "";
  }

  backButton() {
    const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: `Transaction verification is currently underway.
        Leaving will remove transactions, otherwise continue with transaction verification`,
        heading: 'Verify Bulk Count',
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
    });
  }

  numberSelection(element) {
    debugger;
    // element.NextToteID = this.NextToteID;
    // const dialogRef1: any = this.global.OpenDialog(BpNumberSelectionComponent, {
    //   height: 'auto',
    //   width: Style.w402px,
    //   autoFocus: DialogConstants.autoFocus,
    //   disableClose: true,
    //   data: {
    //     completedQuantity: element.completedQuantity,
    //     from: "completed quantity"
    //   }
    // });
    // dialogRef1.afterClosed().subscribe(async (resp: any) => {
    //   if (resp.type == ResponseStrings.Yes) {
    //     let payload: UpdateLocationQuantityRequest = new UpdateLocationQuantityRequest();
    //     payload.invMapId = element.invMapId;
    //     payload.locationQty = 0;
    //     let res: any = await this.iBulkProcessApiService.updateLocationQuantity(payload);
    //     if (res?.status == HttpStatusCode.Ok) {
    //       this.global.ShowToastr(ToasterType.Success, "Record Updated Successfully", ToasterTitle.Success);
    //     }
    //     element.completedQuantity = resp.newQuantity;
    //   }
    //   else if (resp.type == ResponseStrings.No) {
    //     const dialogRef: any = this.global.OpenDialog(InputFilterComponent, {
    //       height: DialogConstants.auto,
    //       width: '480px',
    //       data: {
    //         FilterColumnName: 'Enter the Location Quantity after this Count',
    //         dynamicText: 'Enter Location Quantity'
    //       },
    //       autoFocus: DialogConstants.autoFocus,
    //       disableClose: true,
    //     });
    //     dialogRef.afterClosed().subscribe(async (result: any) => {
    //       let payload: UpdateLocationQuantityRequest = new UpdateLocationQuantityRequest();
    //       payload.invMapId = element.invMapId;
    //       payload.locationQty = parseInt(result.SelectedItem);
    //       let res: any = await this.iBulkProcessApiService.updateLocationQuantity(payload);
    //       if (res?.status == HttpStatusCode.Ok) {
    //         this.global.ShowToastr(ToasterType.Success, "Record Updated Successfully", ToasterTitle.Success);
    //       }
    //     });
    //     element.completedQuantity = resp.newQuantity;
    //   }
    // });
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

  fullTote(element: any,i:any=null) {
    const dialogRef1: any = this.global.OpenDialog(BpFullToteComponent, {
      height: 'auto',
      width: Style.w786px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: element
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if(resp){
        this.orderLines.filteredData[i].toteId = resp.NewToteID;
        this.orderLines.filteredData[i].transactionQuantity = resp.NewToteQTY;
      }
    });
  }

  showNoRemainingCounts() {
    const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: `There are no remaining counts for the selected orders.`,
        message2: `Please move the order to Packaging/Shipping.`,
        heading: 'No Remaining Counts',
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
      if(row != element){
        element.selected = false;
      }
    });
    const selectedRow = this.orderLines.filteredData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }
}
