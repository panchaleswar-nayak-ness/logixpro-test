import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
 
import labels from '../../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-delete-confirmation-manual-transaction',
  templateUrl: './delete-confirmation-manual-transaction.component.html',
  styleUrls: [],
})
export class DeleteConfirmationManualTransactionComponent {
  isChecked = true;
  heading: '';
  message: '';
  public iAdminApiService: IAdminApiService;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    
    private Api: ApiFuntions,
    private global: GlobalService,
    private adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<any>
  ) {
    this.iAdminApiService = adminApiService;
    this.heading = data.heading;
    this.message = data.message;
  }

  checkOptions(event: MatCheckboxChange): void {
    if (event.checked) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
  }

  onConfirmdelete() {
    if (this.data) {
      if (this.data.mode === 'delete-trans') {
        let payload = {
          transID: this.data.element.id, 
        };
        this.iAdminApiService
          .TransactionDelete(payload)
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.global.ShowToastr('success',labels.alert.delete, 'Success!');
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.global.ShowToastr('error',labels.alert.went_worng, 'Error!');
                this.dialogRef.close({ isExecuted: false });
              }
            },
            (error) => {}
          );
      } else if (this.data.mode === 'delete-order') {
   
        let payload = {
          orderNumber: this.data.orderNumber, 
        };
 
        this.iAdminApiService
          .TransactionForOrderDelete(payload)
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.global.ShowToastr('success',labels.alert.delete, 'Success!');
                this.dialogRef.close({isExecuted:true})
              } else {
                this.global.ShowToastr('error',labels.alert.went_worng, 'Error!');
                this.dialogRef.close({isExecuted:false})
              }
            },
            (error) => {}
          );
      }
      else if (this.data.mode === 'delete-manual-transaction') { 
        let payload = {
          transID: this.data.transID, 
        };
        this.iAdminApiService.TransactionDelete(payload).subscribe(
          (res: any) => {
            if (res?.isExecuted) {
              this.global.ShowToastr('success',labels.alert.delete, 'Success!');
              this.dialogRef.close({ isExecuted: true });
            }else{
              this.global.ShowToastr('error',labels.alert.went_worng, 'Error!');
              this.dialogRef.close({ isExecuted: false });
            }
          },
          (error) => {}
        );
      }
    }
  }
}
