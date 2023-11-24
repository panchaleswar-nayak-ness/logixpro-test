import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../common/init/auth.service'; 
import labels from 'src/app/common/labels/labels.json';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType ,ResponseStrings} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-delete-confirmation-transaction',
  templateUrl: './delete-confirmation-transaction.component.html',
})
export class DeleteConfirmationTransactionComponent implements OnInit {
  isChecked: boolean = true;
  public userData;
  public iAdminApiService: IAdminApiService;
  accessLevel = 'Selected Only';
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public adminApiService: AdminApiService,
    private global:GlobalService,
    public dialogRef: MatDialogRef<DeleteConfirmationTransactionComponent>,
    private authService: AuthService
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }

  onConfirmdelete() {
    let deletePayload = {
      transType: this.data.transType,
      orderNumber: this.data.orderNo,
      id: this.data.id,
      itemNumber: '',
      lineNumber: ''
    };

    this.iAdminApiService.DeleteOrder(deletePayload).subscribe(
      (res: any) => {
        if(res.isExecuted){
          this.dialogRef.close(ResponseStrings.Yes);
          this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("DeleteOrder",res.responseMessage);
        }
      },
      (error) => {
        this.dialogRef.close("No");
        this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
        console.log("(error) => : DeleteOrder");
      }
    );
  }

  checkOptions(event: MatCheckboxChange): void {
    if (event.checked) this.isChecked = false;
    else this.isChecked = true;
  }
}
