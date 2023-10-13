import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
 
import labels from '../../../labels/labels.json';
import { SqlAuthConfirmationComponent } from '../sql-auth-confirmation/sql-auth-confirmation.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IGlobalConfigApi } from 'src/app/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/services/globalConfig-api/global-config-api.service';
import { GlobalService } from 'src/app/common/services/global.service';


@Component({
  selector: 'app-global-config-set-sql',
  templateUrl: './global-config-set-sql.component.html',
  styleUrls: [],
})
export class GlobalConfigSetSqlComponent implements OnInit {
  @ViewChild('user_name') user_name: ElementRef;
  form_heading = 'SQL Auth Username and Password';
  userName: any ;
  password: any;
  message:string='';
  connectionName:any;
  public toggle_password = true;
  public  iGlobalConfigApi: IGlobalConfigApi;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global:GlobalService,
    public dialogRef: MatDialogRef<any>,
    
    private Api:ApiFuntions,
    public globalConfigApi: GlobalConfigApiService
  ) {
    this.iGlobalConfigApi = globalConfigApi;
    this.userName=data.userName
    this.password=data.password;
    this.connectionName=data.ConnectionName;
  }

  ngOnInit(): void {
   
  }
  ngAfterViewInit() {
    this.user_name.nativeElement.focus();
  }
  
  saveLogin() {

    if(this.userName===''|| this.password===''){
      this.message='Username and/or Password are empty. This will set this connection for Windows Authentication. Press OK to set this';
    }else{
      this.message='Username and Password are set. This will set this connection for SQL Authentication. Press OK to set this';

    }
    const dialogRef:any = this.global.OpenDialog(SqlAuthConfirmationComponent, {
      height: 'auto',
      width: '560px',
      data:{
        message:this.message
      }
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
                this.global.ShowToastr('success',labels.alert.success, 'Success!');
                this.dialogRef.close({isExecuted:true})
    
              }
            },
            (error) => {
              this.global.ShowToastr('success',labels.alert.went_worng, 'Errpr!');
              this.dialogRef.close({isExecuted:true})
    
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
