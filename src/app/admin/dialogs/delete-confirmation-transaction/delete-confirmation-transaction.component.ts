import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from '../../../../app/init/auth.service'; 
import labels from '../../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-delete-confirmation-transaction',
  templateUrl: './delete-confirmation-transaction.component.html',
})
export class DeleteConfirmationTransactionComponent implements OnInit {
  isChecked: boolean = true;
  public userData;
  public iAdminApiService: IAdminApiService;
  accessLevel = 'Selected Only';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private adminApiService: AdminApiService,
    private toastr: ToastrService, 
    public dialogRef: MatDialogRef<DeleteConfirmationTransactionComponent>,
    private authService: AuthService,
    private Api: ApiFuntions,
    private router: Router
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }


  onConfirmdelete() {
    let deletePayload = {
      transType: this.data.transType,
      orderNumber: this.data.orderNo,
      id: this.data.id,
      itemNumber: '',
      lineNumber: ''
    };

    this.iAdminApiService.DeleteOrder(deletePayload).subscribe(
      (res: any) => {
        if(res.isExecuted){
          this.dialogRef.close("Yes");
          this.toastr.success(labels.alert.delete, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
      },
      (error) => {
        this.dialogRef.close("No");
        this.toastr.error(labels.alert.went_worng, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
    );
  }
  checkOptions(event: MatCheckboxChange): void {
    if (event.checked) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
  }
}
