import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
 
import labels from '../../labels/labels.json'
import { AuthService } from 'src/app/init/auth.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
@Component({
  selector: 'app-transaction-qty-edit',
  templateUrl: './transaction-qty-edit.component.html',
  styleUrls: []
})
export class TransactionQtyEditComponent implements OnInit {
  @ViewChild('field_focus') field_focus: ElementRef;

  public userData: any;
  public iAdminApiService: IAdminApiService;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private Api: ApiFuntions,
    private adminApiService: AdminApiService,
    
    private dialog:MatDialog,
    public dialogRef: MatDialogRef<TransactionQtyEditComponent>,
    private authService: AuthService,
    private globalService: GlobalService
  ) { 
    this.iAdminApiService = adminApiService;
  }

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
    this.iAdminApiService.TransactionQtyReplenishmentUpdate(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.globalService.ShowToastr('success',labels.alert.success, 'Success!');
        this.dialog.closeAll();
        this.dialogRef.close(this.data);
      } else {
        this.globalService.ShowToastr('error',res.responseMessage, 'Error!');
        this.dialog.closeAll();
      }
    });
  }
}
