import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
 
import { AuthService } from '../../../../app/init/auth.service'; 
import labels from '../../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

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
    private adminApiService: AdminApiService,
     
    private global:GlobalService,
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
          this.global.ShowToastr('success',labels.alert.delete, 'Success!');
        }
      },
      (error) => {
        this.dialogRef.close("No");
        this.global.ShowToastr('error',labels.alert.went_worng, 'Error!');
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
