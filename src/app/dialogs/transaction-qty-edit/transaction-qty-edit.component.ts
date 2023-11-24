import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import labels from 'src/app/common/labels/labels.json';
import { AuthService } from 'src/app/common/init/auth.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import {  ToasterTitle ,ToasterType} from 'src/app/common/constants/strings.constants';
@Component({
  selector: 'app-transaction-qty-edit',
  templateUrl: './transaction-qty-edit.component.html',
  styleUrls: ['./transaction-qty-edit.component.scss'],
})
export class TransactionQtyEditComponent implements OnInit {
  @ViewChild('fieldFocus') fieldFocus: ElementRef;

  public userData: any;
  public iAdminApiService: IAdminApiService;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminApiService: AdminApiService,

    private dialog: MatDialog,
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
    this.fieldFocus?.nativeElement.focus();
  }

  transactionQuantityChange() {
    if (this.data.transactionQuantity > this.data.replenishmentQuantity) {
      this.data.transactionQuantity = parseInt(
        this.data.transactionQuantity
          .toString()
          .substring(0, this.data.replenishmentQuantity.toString().length - 1)
      );
    }
  }

  transactionQtyReplenishmentUpdate() {
    let payload: any = {
      rP_ID: this.data.rP_ID,
      transactionQuantity: this.data.transactionQuantity,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.iAdminApiService
      .TransactionQtyReplenishmentUpdate(payload)
      .subscribe((res: any) => {
        if (res.isExecuted && res.data) {
          this.globalService.ShowToastr(
            ToasterType.Success,
            labels.alert.success,
            ToasterTitle.Success
          );
          this.dialog.closeAll();
          this.dialogRef.close(this.data);
        } else {
          this.globalService.ShowToastr('error', res.responseMessage, 'Error!');
          this.dialog.closeAll(); 
        }
      });
  }
}
