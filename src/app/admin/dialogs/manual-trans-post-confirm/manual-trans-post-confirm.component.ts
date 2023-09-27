import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import labels from '../../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-manual-trans-post-confirm',
  templateUrl: './manual-trans-post-confirm.component.html',
  styleUrls: [],
})
export class ManualTransPostConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private toastr: ToastrService,
    private Api: ApiFuntions
  ) {}

  
  confirmOK() {
    let payload = {
      orderNumber: this.data.orderNumber,
      toteID:  this.data.toteId,
      username: this.data.userName,
      wsid: this.data.wsid,
    };
    this.Api.ManualOrdersPost(payload).subscribe(
      (res: any) => {
        if (res.isExecuted) {
          this.toastr.success(labels.alert.delete, 'Success!', {
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
      (error) => {}
    );
  }
}
