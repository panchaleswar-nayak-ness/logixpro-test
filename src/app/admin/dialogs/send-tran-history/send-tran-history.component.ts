import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 
import labels from '../../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-send-tran-history',
  templateUrl: './send-tran-history.component.html',
  styleUrls: [],
})
export class SendTranHistoryComponent  {
  dialogData;
  public iAdminApiService: IAdminApiService;
  constructor(
    public dialogRef: MatDialogRef<SendTranHistoryComponent>,
    
    private global:GlobalService,
    private adminApiService: AdminApiService,
    @Inject(MAT_DIALOG_DATA) data,
    private Api: ApiFuntions
  ) {
    this.iAdminApiService = adminApiService;
    this.dialogData = data;
  }

  

  sendTranHistory() {
    let payload = {
      userName: this.dialogData.user,
      wsid: this.dialogData.wsid,
    };
    this.iAdminApiService.SendCompletedToTH(payload).subscribe(
      {next: (res: any) => {
        if (res.isExecuted) {
          this.global.ShowToastr('success',labels.alert.success, 'Success!');
          this.dialogRef.close({ isExecuted: true });
        } else { 
          this.global.ShowToastr('error',labels.alert.went_worng, 'Error!');
          console.log("SendCompletedToTH",res.responseMessage);
          this.dialogRef.close({ isExecuted: false });
          
          
        }
      },
      error: (error) => {
        this.global.ShowToastr('error',labels.alert.went_worng, 'Error!');
        this.dialogRef.close({ isExecuted: false });
      }}
    );
  }
}
