import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import labels from '../../../labels/labels.json';
import { data } from 'jquery';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-send-tran-history',
  templateUrl: './send-tran-history.component.html',
  styleUrls: ['./send-tran-history.component.scss'],
})
export class SendTranHistoryComponent implements OnInit {
  dialogData;

  constructor(
    public dialogRef: MatDialogRef<SendTranHistoryComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) data,
    private Api: ApiFuntions
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {}

  sendTranHistory() {
    let payload = {
      userName: this.dialogData.user,
      wsid: this.dialogData.wsid,
    };
    this.Api.SendCompletedToTH(payload).subscribe(
      (res: any) => {
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
      (error) => {
        this.toastr.error(labels.alert.went_worng, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
        this.dialogRef.close({ isExecuted: false });
      }
    );
  }
}
