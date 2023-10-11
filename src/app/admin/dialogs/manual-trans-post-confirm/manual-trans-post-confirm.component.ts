import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import labels from '../../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';

@Component({
  selector: 'app-manual-trans-post-confirm',
  templateUrl: './manual-trans-post-confirm.component.html',
  styleUrls: [],
})
export class ManualTransPostConfirmComponent {
  public iAdminApiService: IAdminApiService;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,private adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<any>,
    private toastr: ToastrService,
    private Api: ApiFuntions
  ) {
    this.iAdminApiService = adminApiService;
  }

  
  confirmOK() {
    let payload = {
      orderNumber: this.data.orderNumber,
      toteID:  this.data.toteId
    };
    this.iAdminApiService.ManualOrdersPost(payload).subscribe(
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
