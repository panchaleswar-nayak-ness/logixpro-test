import { Component, Inject, OnInit } from '@angular/core';
import { DialogConstants, ResponseStrings, Style } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { BpNumberSelectionComponent } from '../bp-number-selection/bp-number-selection.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { AlertConfirmationComponent } from '../alert-confirmation/alert-confirmation.component';
import { HttpStatusCode } from '@angular/common/http';
import { FullToteRequest, ValidateToteRequest } from 'src/app/common/Model/bulk-transactions';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';

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
    this.iBulkProcessApiService.BatchNextTote().subscribe((res: number) => {
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
        this.data.PutNewToteQty = parseInt(resp);
        this.data.PutFullToteQty = this.data.transactionQuantity - parseInt(resp);
      }
    });
  }

  CreateNextToteID() {
    this.data.NewToteID = this.NextToteID;
  }

  putAllInNewTote() {
    this.data.PutNewToteQty = this.data.PutNewToteQty + this.data.PutFullToteQty;
    this.data.PutFullToteQty = 0;
  }

  async validtote($event: Event) {
    if (($event.target as HTMLInputElement).value) {
      let paylaod: ValidateToteRequest = new ValidateToteRequest();
      paylaod.toteid = ($event.target as HTMLInputElement).value;
      let res = await this.iBulkProcessApiService.validtote(paylaod);
      if (res?.status == HttpStatusCode.NoContent) {
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
        dialogRef.afterClosed().subscribe(() => {
          ($event.target as HTMLInputElement).value = "";
        });
      }
    }
  }

  async done() {
    if (this.data.NewToteID != "") {
      let payload: FullToteRequest = new FullToteRequest();
      payload.NewToteID = this.data.NewToteID;
      payload.NewToteQTY = parseInt(this.data.PutNewToteQty);
      payload.FullToteID = this.data.toteId;
      payload.FullToteQTY= this.data.PutFullToteQty;
      payload.Id = this.data.id;
      let res: any = await this.iBulkProcessApiService.fullTote(payload);
      if (res?.status == HttpStatusCode.Ok) {
        this.dialogRef.close(payload);
        const dialogRef1 = this.global.OpenDialog(ConfirmationDialogComponent, {
          height: 'auto',
          width: Style.w560px,
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
          data: {
            message: `Touch ‘Yes’ to Print Label(s) Now. Touch ‘No’ to continue without printing tote labels.`,
            heading: 'Print Tote Label(s) Now?',
            buttonFields: true
          },
        });
        dialogRef1.afterClosed().subscribe(async (resp: any) => {
          if (resp == ResponseStrings.Yes) {
            // List and Lable
          }
        });
      }
    }
  }
}
