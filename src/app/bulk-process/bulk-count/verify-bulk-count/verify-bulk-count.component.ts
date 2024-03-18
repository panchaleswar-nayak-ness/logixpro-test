import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
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
  @Input() SelectedList: any = [];
  @Input() NextToteID: any;
  @Input() ordersDisplayedColumns: string[] = ["ItemNo", "Description", "LineNo", "Whse", "Location", "LotNo", "SerialNo", "OrderNo", "OrderQty", "CompletedQty", "ToteID", "Action"];

  SearchString: any;
  taskCompleted: boolean = false;
  preferences: any;
  public iBulkProcessApiService: IBulkProcessApiService;
  public iAdminApiService: IAdminApiService;

  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    public adminApiService: AdminApiService,
    private global: GlobalService
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.SelectedList = new MatTableDataSource(
      this.SelectedList
    );
    this.companyInfo();
  }

  companyInfo() {
    this.iAdminApiService.WorkstationSetupInfo().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.preferences = res.data;
      }
    })
  }

  ViewByLocation() {
    var list = this.SelectedList.filteredData.sort((a, b) => b.location.localeCompare(a.location));
    this.SelectedList = new MatTableDataSource(list);
  }

  ViewByOrderItem() {
    var list = this.SelectedList.filteredData.sort((a, b) => b.orderNumber.localeCompare(a.orderNumber) && a.itemNumber.localeCompare(b.itemNumber));
    this.SelectedList = new MatTableDataSource(list);
  }
  Search($event: any) {
    let filterValue = $event.trim().toLowerCase(); // Remove leading and trailing whitespace & convert to lowercase
    this.SelectedList.filter = filterValue;
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
        customButtonText:true,
        btn1Text:'Continue Verification',
        btn2Text:'Leave Anyway'
      },
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if (resp != ResponseStrings.Yes) {
        this.back.emit(this.taskCompleted);
      }
    });
  }

  numberSelection(element) {
    console.log(element);
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
        let payload: any = {
          "InvMapId": element.invMapId,
          "locationqty": 0
        };
        let res: any = await this.iBulkProcessApiService.updateLocationQuantity(payload);
        if (res?.status == 200) {
          this.global.ShowToastr(ToasterType.Success, "Record Updated Successfully", ToasterTitle.Success);
        }
        element.completedQuantity = resp.newQuantity;
      }
      else if (resp.type == ResponseStrings.No) {
        const dialogRef: any = this.global.OpenDialog(InputFilterComponent, {
          height: DialogConstants.auto,
          width: '480px',
          data: {
            FilterColumnName: 'Enter the Location Quantity after this Put Away',
            dynamicText: 'Enter Location Quantity'
          },
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(async (result: any) => {
          let payload: any = {
            "InvMapId": element.invMapId,
            "locationqty": parseInt(result.SelectedItem)
          };
          let res: any = await this.iBulkProcessApiService.updateLocationQuantity(payload);
          if (res?.status == 200) {
            this.global.ShowToastr(ToasterType.Success, "Record Updated Successfully", ToasterTitle.Success);
          }
        });
        element.completedQuantity = resp.newQuantity;
      }
    });
  }

  ResetAllCompletedQty() {
    this.SelectedList.filteredData.forEach(element => {
      element.completedQuantity = 0;
    });
  }

  CopyAllOrder() {
    this.SelectedList.filteredData.forEach(element => {
      element.completedQuantity = element.transactionQuantity;
    });
  }

  fullTote(element: any) {
    const dialogRef1: any = this.global.OpenDialog(BpFullToteComponent, {
      height: 'auto',
      width: Style.w786px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: element
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
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
        let orders: any = [];
        this.SelectedList.filteredData.forEach((x: any) => {
          orders.push(
            {
              "otid": x.id,
              "toteID": x.toteId,
              "serialNumber": "",
              "lotNumber": x.lotNumber,
              "pickedQty": x.transactionQuantity,
              "countQty": x.completedQuantity
            }
          );
        });
        let res: any = await this.iBulkProcessApiService.bulkPickTaskComplete(orders);
        if (res?.status == 201) {
          this.taskCompleted = true;
          let offCarouselPickToteManifest: any = this.preferences.pfSettingsII.filter((x: any) => x.pfName == "Off Carousel Manifest")[0].pfSetting == 1 ? true : false;
          let autoPrintOffCarouselPickToteManifest: any = this.preferences.pfSettingsII.filter((x: any) => x.pfName == "Auto Tote Manifest")[0].pfSetting == 1 ? true : false;
          if (offCarouselPickToteManifest && autoPrintOffCarouselPickToteManifest) {
            // print report
            this.noRemainingPicks();
          }
          else if (offCarouselPickToteManifest) {
            const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
              height: 'auto',
              width: Style.w560px,
              autoFocus: DialogConstants.autoFocus,
              disableClose: true,
              data: {
                message: `Touch Yes to print a Tote Manifest.`,
                heading: 'Would you like to print a Tote Manifest?',
                buttonFields:true
              },
            });
            dialogRef1.afterClosed().subscribe(async (resp: any) => {
              if (resp == ResponseStrings.Yes) {
                // print report
              }
              this.noRemainingPicks();
            });
          }
          else {
            this.noRemainingPicks();
          }
        }
      }
    });
  }

  noRemainingPicks() {
    const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: `There are no remaining Put Aways for the selected orders.`,
        message2: `Please move the order to Packaging/Shipping.`,
        heading: 'No Remaining Put Aways',
        singleButton: true
      },
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if (resp == ResponseStrings.Yes) {
        this.back.emit(this.taskCompleted);
      }
    });
  }
}
