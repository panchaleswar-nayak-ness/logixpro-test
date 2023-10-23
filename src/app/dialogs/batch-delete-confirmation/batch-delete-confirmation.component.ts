import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 
import labels from '../../labels/labels.json'; 
import { IInductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-batch-delete-confirmation',
  templateUrl: './batch-delete-confirmation.component.html',
  styleUrls: [],
})
export class BatchDeleteConfirmationComponent {
  isChecked = true;
  heading: '';
  message: '';
  public iinductionManagerApi:IInductionManagerApiService;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private global:GlobalService,
    private inductionManagerApi: InductionManagerApiService,
   ) { 
    this.heading = data.heading;
    this.message = data.message;
    this.iinductionManagerApi = inductionManagerApi;
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
        this.iinductionManagerApi.BatchTotesDelete(this.data.payload)
          .subscribe(
            (res: any) => {
              if (res?.isExecuted) {
                this.global.ShowToastr('success',labels.alert.delete, 'Success!');
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.global.ShowToastr('error','Something went wrong', 'Error!');
                console.log("BatchTotesDelete",res.responseMessage);
                this.dialogRef.close({isExecuted:false});
              }
            },
            (error) => {}
          );
      } else if (this.data.mode === 'delete_all_batch') {
     
        this.iinductionManagerApi.AllBatchDelete()
          .subscribe(
            (res: any) => {
              if (res?.isExecuted) {
                this.global.ShowToastr('success',labels.alert.delete, 'Success!');
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.global.ShowToastr('error','Something went wrong', 'Error!');
                console.log("AllBatchDelete",res.responseMessage);
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
