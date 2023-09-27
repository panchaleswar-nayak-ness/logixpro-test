import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import labels from '../../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-send-tran-history',
  templateUrl: './send-tran-history.component.html',
  styleUrls: [],
})
export class SendTranHistoryComponent  {
  dialogData;

  constructor(
    public dialogRef: MatDialogRef<SendTranHistoryComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) data,
    private Api: ApiFuntions
  ) {
    this.dialogData = data;
  }

  

  sendTranHistory() {
    let payload = {
      userName: this.dialogData.user,
      wsid: this.dialogData.wsid,
    };
    this.Api.SendCompletedToTH(payload).subscribe(
      {next: (res: any) => {
        if (res.isExecuted) {
          this.toastr.success(labels.alert.success, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
          this.dialogRef.close({ isExecuted: true });
        } else { 
          this.toastr.error(labels.alert.went_worng, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
          this.dialogRef.close({ isExecuted: false });
        }
      },
      error: (error) => {
        this.toastr.error(labels.alert.went_worng, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
        this.dialogRef.close({ isExecuted: false });
      }}
    );
  }
}
