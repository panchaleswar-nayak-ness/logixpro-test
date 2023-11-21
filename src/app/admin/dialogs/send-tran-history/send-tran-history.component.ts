import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 
import labels from 'src/app/common/labels/labels.json';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';

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
    public adminApiService: AdminApiService,
    @Inject(MAT_DIALOG_DATA) data,
    public Api: ApiFuntions
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
          this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success
          );
          this.dialogRef.close({ isExecuted: true });
        } else { 
          this.global.ShowToastr(ToasterType.Error,labels.alert.went_worng, ToasterTitle.Error
          );
          console.log("SendCompletedToTH",res.responseMessage);
          this.dialogRef.close({ isExecuted: false });
          
          
        }
      },
      error: (error) => {
        this.global.ShowToastr(ToasterType.Error
          ,labels.alert.went_worng, ToasterTitle.Error
        );
        this.dialogRef.close({ isExecuted: false });
      }}
    );
  }
}
