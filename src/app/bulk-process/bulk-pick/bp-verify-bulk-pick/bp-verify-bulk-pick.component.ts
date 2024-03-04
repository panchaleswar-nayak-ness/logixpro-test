import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogConstants, ResponseStrings, Style, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { BpFullToteComponent } from 'src/app/dialogs/bp-full-tote/bp-full-tote.component';
import { BpNumberSelectionComponent } from 'src/app/dialogs/bp-number-selection/bp-number-selection.component';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';

@Component({
  selector: 'app-bp-verify-bulk-pick',
  templateUrl: './bp-verify-bulk-pick.component.html',
  styleUrls: ['./bp-verify-bulk-pick.component.scss']
})
export class BpVerifyBulkPickComponent implements OnInit {
  @Output() back = new EventEmitter<any>();
  @Input() SelectedList: any = [];
  @Input() NextToteID: any;
  @Input() ordersDisplayedColumns: string[] = ["OrderNo", "ItemNo", "Description", "LineNo", "Location", "LotNo", "SerialNo", "Whse", "OrderQty", "CompletedQty", "ToteID", "Action"];

  SearchString: any;
  public iBulkProcessApiService: IBulkProcessApiService;
  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    private global: GlobalService
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
  }

  ngOnInit(): void {
    this.SelectedList = new MatTableDataSource(
      this.SelectedList
    );
    // this.CopyAllOrder();
  }

  ViewByLocation() {
    var list = this.SelectedList.filteredData.sort((a, b) => b.location.localeCompare(a.location));
    this.SelectedList = new MatTableDataSource(list);
  }

  ViewByOrderItem() {
    var list = this.SelectedList.filteredData.sort((a, b) => b.orderNumber.localeCompare(a.orderNumber) && a.itemNumber.localeCompare(b.itemNumber));
    this.SelectedList = new MatTableDataSource(list);
  }
  Search($event:any){ 
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
        heading: 'Verify Bulk Pick',
        buttonFields: true,
      },
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if (resp == ResponseStrings.Yes) {
        this.back.emit();
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
            FilterColumnName: 'Enter the Location Quantity after this Pick',
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
    // let payload: any = {
    //   "otid": 13503889,
    //   "pickqty": 0,
    //   "toteID": "",
    //   "serialNumber": "",
    //   "lotNumber": "",
    //   "pickedQty": 4,
    //   "countQty": 0
    // };
    // let res: any = await this.iBulkProcessApiService.bulkPickTaskComplete(payload);
    // if (res?.status == 200) {
    //   this.global.ShowToastr(ToasterType.Success, "Task Completed Successfully", ToasterTitle.Success);
    // }
  }
}
