import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import labels from '../../labels/labels.json'
import { AuthService } from 'src/app/init/auth.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
@Component({
  selector: 'app-transaction-qty-edit',
  templateUrl: './transaction-qty-edit.component.html',
  styleUrls: []
})
export class TransactionQtyEditComponent implements OnInit {
  @ViewChild('field_focus') field_focus: ElementRef;

  public userData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private Api: ApiFuntions,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TransactionQtyEditComponent>,
    private authService: AuthService,
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }
 
  ngAfterViewInit(): void {
    this.field_focus.nativeElement.focus();
  }
  // transactionQuantityChange(value: any) {
  //   let high:any = this.data.availableQuantity > this.data.replenishmentQuantity ? this.data.replenishmentQuantity : this.data.availableQuantity;
  //   return this.globalService.setNumericInRange(value, 0, high);
  // }

  transactionQuantityChange(event: any) {
    if(this.data.transactionQuantity > this.data.replenishmentQuantity){
      this.data.transactionQuantity = parseInt(this.data.transactionQuantity.toString().substring(0,this.data.replenishmentQuantity.toString().length - 1));
    }
  }
  

  transactionQtyReplenishmentUpdate() {
    let payload: any = {
      "rP_ID": this.data.rP_ID,
      "transactionQuantity": this.data.transactionQuantity,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    }
    this.Api.TransactionQtyReplenishmentUpdate(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.toastr.success(labels.alert.success, 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        this.dialog.closeAll();
        this.dialogRef.close(this.data);
      } else {
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        this.dialog.closeAll();
      }
    });
  }
}
