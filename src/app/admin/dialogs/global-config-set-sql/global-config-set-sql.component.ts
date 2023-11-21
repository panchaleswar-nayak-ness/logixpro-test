import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import labels from 'src/app/common/labels/labels.json';
import { SqlAuthConfirmationComponent } from '../sql-auth-confirmation/sql-auth-confirmation.component';
import { IGlobalConfigApi } from 'src/app/common/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/common/services/globalConfig-api/global-config-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { DialogConstants, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-global-config-set-sql',
  templateUrl: './global-config-set-sql.component.html',
  styleUrls: [],
})
export class GlobalConfigSetSqlComponent {
  @ViewChild('user_name') usernameField: ElementRef;

  formHeading = 'SQL Auth Username and Password';
  userName: any ;
  password: any;
  message:string='';
  connectionName:any;
  public togglePassword = true;

  public iGlobalConfigApi: IGlobalConfigApi;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global:GlobalService,
    public dialogRef: MatDialogRef<any>,
    public globalConfigApi: GlobalConfigApiService
  ) {
    this.iGlobalConfigApi = globalConfigApi;
    this.userName=data.userName
    this.password=data.password;
    this.connectionName=data.ConnectionName;
  }

  ngAfterViewInit() {
    this.usernameField.nativeElement.focus();
  }
  
  saveLogin() {
    if(this.userName === ''|| this.password === '') this.message='Username and/or Password are empty. This will set this connection for Windows Authentication. Press OK to set this';
    else this.message='Username and Password are set. This will set this connection for SQL Authentication. Press OK to set this';
    
    const dialogRef:any = this.global.OpenDialog(SqlAuthConfirmationComponent, {
      height: DialogConstants.auto,
      width: '560px',
      data:{ message:this.message }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if(res.isExecuted){
        let payload = {
          ConnectionName: this.connectionName,
          UserName: this.userName,
          Password: this.password,
        };
        this.iGlobalConfigApi
          .ConnectionUserPasswordUpdate(payload)
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.global.ShowToastr(ToasterType.Success, labels.alert.success, ToasterTitle.Success);
                this.dialogRef.close({ isExecuted : true });
              } else {
                this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
                console.log("ConnectionUserPasswordUpdate",res.responseMessage);
              }
            },
            (error) => {
              this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
              this.dialogRef.close({ isExecuted : true });
              console.log("(error) => ConnectionUserPasswordUpdate");
            }
          );
      }
    });
  }

  clearLoginInfo() {
    this.userName = '';
    this.password = '';
  }
}
