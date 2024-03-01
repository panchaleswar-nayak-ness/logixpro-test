import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  public iBulkProcessApiService: IBulkProcessApiService;
  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    private global: GlobalService
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
  }

  ngOnInit(): void {
    // this.CopyAllOrder();
  }

  ViewByLocation() {
    debugger;
    this.SelectedList = this.SelectedList.sort((a, b) => a.location - b.location);
  }

  ViewByOrderItem() {
    debugger
    this.SelectedList = this.SelectedList.sort((a, b) => (a.orderNumber - b.orderNumber) && (a.itemNumber - b.itemNumber));
  }

  backButton() {
    this.back.emit();
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
    this.SelectedList.forEach(element => {
      element.completedQuantity = 0;
    });
  }

  CopyAllOrder() {
    this.SelectedList.forEach(element => {
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
}
