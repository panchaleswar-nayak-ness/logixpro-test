import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import labels from '../../labels/labels.json';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-short-transaction',
  templateUrl: './short-transaction.component.html',
  styleUrls: []
})
export class ShortTransactionComponent implements OnInit {

  selectedTransaction: any;
  toteQuantity: any;
  @ViewChild('toteQty') toteQty: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private Api: ApiFuntions,
    public dialogRef: MatDialogRef<ShortTransactionComponent>,
    private globalService: GlobalService
  ) { }

  restrictKeyboard(event: KeyboardEvent) {
    const isNumericInput = event.key.match(/^[0-9]+$/);
    if (!isNumericInput && event.key !== "Backspace") {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.selectedTransaction = this.data.selectedTransaction;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.toteQty.nativeElement.focus();
    }, 200);
  }

  ShortTransaction() {
    if (this.toteQuantity >= 0 && this.toteQuantity < this.selectedTransaction.transactionQuantity) {
      if(!this.globalService.checkDecimal(this.toteQuantity)){
        this.toastr.error("Tote Quantity can not be in decimal", 'Error', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        return;
      }
      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          heading: 'Process Short',
          message: 'Short this transaction?',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'Yes') {
          let payload: any = {
            "otid": this.selectedTransaction.id,
            "shortQuantity": this.toteQuantity,
            "shortMethod": "Complete"
          }
          this.Api.shortTransaction(payload).subscribe((res: any) => {
            if (res.isExecuted) {
              this.dialogRef.close(res);
              this.toastr.success(labels.alert.update, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
            }
            else {
              this.toastr.error("An error occured when shorting this transaction", 'Error', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
            }
          });
        }
      });
    }
    else {
      this.toastr.error("Please enter a quantity that is greater than or equal to 0 and less than the transaction qty", 'Invalid Qty Entered', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      this.toteQuantity = undefined;
    }
  }

}
