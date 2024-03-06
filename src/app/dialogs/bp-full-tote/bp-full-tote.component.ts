import { Component, Inject, OnInit } from '@angular/core';
import { DialogConstants, Style } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { BpNumberSelectionComponent } from '../bp-number-selection/bp-number-selection.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { AlertConfirmationComponent } from '../alert-confirmation/alert-confirmation.component';

@Component({
  selector: 'app-bp-full-tote',
  templateUrl: './bp-full-tote.component.html',
  styleUrls: ['./bp-full-tote.component.scss']
})
export class BpFullToteComponent implements OnInit {

  NextToteID: any;

  public iBulkProcessApiService: IBulkProcessApiService;
  constructor(
    public dialogRef: MatDialogRef<BpFullToteComponent>,
    public bulkProcessApiService: BulkProcessApiService,
    private global: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
  }

  ngOnInit(): void {
    this.data.NewToteID = "";
    this.data.PutNewToteQty = 0;
    this.data.PutFullToteQty = this.data.transactionQuantity;
    this.BatchNextTote();
  }

  BatchNextTote() {
    this.iBulkProcessApiService.BatchNextTote().subscribe((res: any) => {
      this.NextToteID = res;
    })
  }

  openNumberSelection() {
    const dialogRef1: any = this.global.OpenDialog(BpNumberSelectionComponent, {
      height: 'auto',
      width: Style.w402px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        completedQuantity: this.data.PutNewToteQty,
        from: "qunatity put in new tote"
      }
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if (resp) {
        this.data.PutNewToteQty = resp;
        this.data.PutFullToteQty = this.data.PutFullToteQty - resp;
      }
    });
  }

  CreateNextToteID() {
    this.data.NewToteID = this.NextToteID;
  }

  putAllInNewTote() {
    this.data.PutNewToteQty = this.data.PutFullToteQty;
  }

  async validtote($event: any) {
    if ($event.target.value) {
      var obj = {
        toteid: $event.target.value
      }
      let res: any = await this.iBulkProcessApiService.validtote(obj);
      if (res?.status == 204) {
        const dialogRef: any = this.global.OpenDialog(AlertConfirmationComponent, {
          height: 'auto',
          width: Style.w786px,
          data: {
            message: 'The Tote ID you have entered is not valid. please re-enter the Tote ID or see your supervisor for assistance.',
            heading: 'Invalid Tote ID!'
          },
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
          $event.target.value = null;
        });
      }
    }
  }

  async done() {
    if (this.data.NewToteID != "") {
      var payload = {
        "ToteId": this.data.NewToteID,
        "OrderNumber": this.data.orderNumber,
        "Type": "pick",
        "newToteQTY": this.data.PutNewToteQty
      }
      let res: any = await this.iBulkProcessApiService.validtote(payload);
      if (res?.status == 201) {
        this.dialogRef.close(true);
      }
    }
  }
}
