import { Component, Inject } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 
import labels from 'src/app/common/labels/labels.json'; 
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import {  ToasterTitle ,ToasterType,ToasterMessages} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-batch-delete-confirmation',
  templateUrl: './batch-delete-confirmation.component.html',
  styleUrls: [],
})
export class BatchDeleteConfirmationComponent {
  isChecked = true;
  heading: '';
  message: '';
  public iInductionManagerApi:IInductionManagerApiService; 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private global:GlobalService,
    public inductionManagerApi: InductionManagerApiService,
   ) { 
    this.heading = data.heading;
    this.message = data.message;
    this.iInductionManagerApi = inductionManagerApi;
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
        this.iInductionManagerApi.BatchTotesDelete(this.data.payload)
          .subscribe(
            (res: any) => {
              if (res?.isExecuted) {
                this.global.ShowToastr(ToasterType.Success,labels.alert.delete, ToasterTitle.Success);
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
                console.log("BatchTotesDelete",res.responseMessage);
                this.dialogRef.close({isExecuted:false});
              }
            },
            (error) => {}
          );
      } else if (this.data.mode === 'delete_all_batch') {
     
        this.iInductionManagerApi.AllBatchDelete()
          .subscribe(
            (res: any) => {
              if (res?.isExecuted) {
                this.global.ShowToastr(ToasterType.Success,labels.alert.delete, ToasterTitle.Success);
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
                console.log("AllBatchDelete",res.responseMessage);
                this.dialogRef.close({isExecuted:false});
              }
            },
            () => {}
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
