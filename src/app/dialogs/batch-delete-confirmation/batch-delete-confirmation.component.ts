import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import labels from '../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-batch-delete-confirmation',
  templateUrl: './batch-delete-confirmation.component.html',
  styleUrls: [],
})
export class BatchDeleteConfirmationComponent {
  isChecked = true;
  heading: '';
  message: '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private Api:ApiFuntions,
    private toastr: ToastrService
  ) {
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
      if (this.data.mode === 'deallocate_clear_batch') {
        this.Api.BatchTotesDelete(this.data.payload)
          .subscribe(
            (res: any) => {
              if (res?.isExecuted) {
                this.toastr.success(labels.alert.delete, 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.toastr.error('Something went wrong', 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close({isExecuted:false});
              }
            },
            (error) => {}
          );
      } else if (this.data.mode === 'delete_all_batch') {
     
        this.Api.AllBatchDelete()
          .subscribe(
            (res: any) => {
              if (res?.isExecuted) {
                this.toastr.success(labels.alert.delete, 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.toastr.error('Something went wrong', 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close({isExecuted:false});
              }
            },
            (error) => {}
          );
      } else {
        this.dialogRef.close({isExecuted:false});
      }
    }
  }
  CancelPopup(){
    this.dialogRef.close({isExecuted:false});
  }
}
