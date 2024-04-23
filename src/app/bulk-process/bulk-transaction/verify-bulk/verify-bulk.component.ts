import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BulkPreferences, OrderLineResource, TaskCompleteRequest, UpdateLocationQuantityRequest, WorkStationSetupResponse } from 'src/app/common/Model/bulk-transactions';
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
  IsLoading:boolean= true;
  OldSelectedList: any = [];
  filteredData: any = [];
  @Input() NextToteID: any; 
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() ordersDisplayedColumns: string[] = ["ItemNo", "Description", "LineNo", "Whse", "Location", "LotNo", "SerialNo", "OrderNo", "OrderQty", "CompletedQty", "ToteID", "Action"];
  suggestion: string = "";
  SearchString: string = "";
  taskCompleted: boolean = false;
  backSubscription;
  backCount:number = 0;
  workstationPreferences: WorkStationSetupResponse;
  public iBulkProcessApiService: IBulkProcessApiService;
  public iAdminApiService: IAdminApiService;

  @ViewChild('openAction') openAction: MatSelect;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    public adminApiService: AdminApiService,
    private global: GlobalService,
    private spinnerService:SpinnerService,
    private sharedService: SharedService,
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
    this.iAdminApiService = adminApiService;
  }
  
    ngOnInit(): void {
    this.orderLines.forEach(element => {
      element.completedQuantity = 0;
    });  
    this.backSubscription =  this.sharedService.verifyBulkTransBackObserver.subscribe((data: any) => {
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
      this.filteredData = this.OldSelectedList.filter((function() {
        const seen = new Set();
        return function(str) {
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
    if(this.backCount < 2){   
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
    const dialogRef1: any = this.global.OpenDialog(BpNumberSelectionComponent, {
      height: 'auto',
      width: Style.w402px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        completedQuantity: element.completedQuantity,
        from: "completed quantity"
      }
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if (resp.type == ResponseStrings.Yes) {
        let payload: UpdateLocationQuantityRequest = new UpdateLocationQuantityRequest();
        payload.invMapId = element.invMapId;
        payload.locationQty = 0;
        let res: any = await this.iBulkProcessApiService.updateLocationQuantity(payload);
        if (res?.status == HttpStatusCode.Ok) {
          this.global.ShowToastr(ToasterType.Success, "Record Updated Successfully", ToasterTitle.Success);
        }
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
          let payload: UpdateLocationQuantityRequest = new UpdateLocationQuantityRequest();
          payload.invMapId = element.invMapId;
          payload.locationQty = parseInt(result.SelectedItem);
          let res: any = await this.iBulkProcessApiService.updateLocationQuantity(payload);
          if (res?.status == HttpStatusCode.Ok) {
            this.global.ShowToastr(ToasterType.Success, "Record Updated Successfully", ToasterTitle.Success);
          }
        });
        element.completedQuantity = resp.newQuantity;
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

  async taskComplete() {
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
        let orders: TaskCompleteRequest[] = new Array();
        this.orderLines.filteredData.forEach((x: any) => {
          orders.push(
            {
              "id": x.id,
              "completedQty": x.completedQuantity
            }
          );
        });
        let res = await this.iBulkProcessApiService.bulkPickTaskComplete(orders);
        if (res?.status == HttpStatusCode.Ok) {
            // if(this.workstationPreferences)
              this.spinnerService.IsLoader = true;
          this.global.ShowToastr(ToasterType.Success, "Record Updated Successfully", ToasterTitle.Success);
          this.taskCompleted = true;
          
          let order = this.orderLines.filteredData.filter(x=> (x.transactionQuantity < x.completedQuantity));
          if(this.Prefernces.systemPreferences.shortPickFindNewLocation) {
            if(order.length > 0){
              let apiCalled = false;
                  for (let i = 0; i < 10 && !apiCalled; i++) { 
                        setTimeout(() => {
                            if (!apiCalled) {
                                this.iAdminApiService.orderline(order[0].id).subscribe((res: any) => {
                                    if (res.zone != "" && res.zone) {
                                        apiCalled = true;
                                    }
                                });
                            }
                        }, 2000 * i);
                    }
          }
           if(this.Prefernces.systemPreferences.shortPickFindNewLocation || this.Prefernces.systemPreferences.displayEob){ 
            setTimeout(() => {
              const orderNumbers: string[] = Array.from(new Set(order.map(item => item.orderNumber)));
              this.iAdminApiService.endofbatch({orderNumbers:orderNumbers}).subscribe((res: any) => {
                this.spinnerService.IsLoader = false;
                const dialogRef1: any = this.global.OpenDialog(PickRemainingComponent, {
                  height: 'auto',
                  width: Style.w786px,
                  autoFocus: DialogConstants.autoFocus,
                  disableClose: true,
                  data: res
                });
                dialogRef1.afterClosed().subscribe(async (resp: any) => { 
                    this.back.emit(this.taskCompleted); 
                });
              });
            }, this.Prefernces?.systemPreferences?.shortPickFindNewLocation ? 5000:0);

          }
          }
          else {
            this.back.emit(this.taskCompleted);
            this.spinnerService.IsLoader = false}
          
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
    if (!this.Prefernces.systemPreferences.zeroLocationQuantityCheck) {
      isZeroCompletedQuantity = false;
    }
    // if (['Put Away', 'Count'].indexOf(this.url) > -1) {
    //   isZeroCompletedQuantity = false;
    // }
    if (isZeroCompletedQuantity) {
      const dialogRef1 = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          message: `There is a completed quantity of ZERO for one or more lineitems!`,
          message2: `Touch 'Yes' to to leave the transactions open.
          Touch 'No' to complete with zero qunatities.
          Touch Cancel to continue varification.`,
          heading: 'Zero Completed Qunatity - Leave Open?',
          buttonFields: true,
          threeButtons: true
        },
      });
      dialogRef1.afterClosed().subscribe(async (res: string) => {
        if (res == ResponseStrings.Yes) {
          this.taskCompleted = true;
          this.back.emit(this.taskCompleted);
        }
        else if (res == ResponseStrings.No) {
          await this.taskComplete();
        }
      });
    }
    else {
      await this.taskComplete();
    }
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
