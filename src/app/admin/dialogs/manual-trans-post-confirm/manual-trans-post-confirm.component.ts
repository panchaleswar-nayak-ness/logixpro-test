import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 
import labels from 'src/app/common/labels/labels.json';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';

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
    private global:GlobalService
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
          this.global.ShowToastr(ToasterType.Success,labels.alert.delete, ToasterTitle.Success);
          this.dialogRef.close({ isExecuted: true });
        } else {
          this.global.ShowToastr(ToasterType.Error,labels.alert.went_worng, ToasterTitle.Error);
          this.dialogRef.close({ isExecuted: false });
          console.log("ManualOrdersPost",res.responseMessage);
        }
      },
    );
  }
}
