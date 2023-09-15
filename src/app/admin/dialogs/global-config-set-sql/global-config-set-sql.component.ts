import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import labels from '../../../labels/labels.json';
import { SqlAuthConfirmationComponent } from '../sql-auth-confirmation/sql-auth-confirmation.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-global-config-set-sql',
  templateUrl: './global-config-set-sql.component.html',
  styleUrls: ['./global-config-set-sql.component.scss'],
})
export class GlobalConfigSetSqlComponent implements OnInit {
  @ViewChild('user_name') user_name: ElementRef;
  form_heading = 'SQL Auth Username and Password';
  userName: any ;
  password: any;
  message:string='';
  connectionName:any;
  public toggle_password = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private toastr: ToastrService,
    private Api:ApiFuntions
  ) {

    this.userName=data.userName
    this.password=data.password;
    this.connectionName=data.ConnectionName;
  }

  ngOnInit(): void {
   
    // this.getConnectionUser();
  }
  ngAfterViewInit() {
    this.user_name.nativeElement.focus();
  }
  getConnectionUser() {
    // let payload = {
    //   ConnectionName: this.data.connectionName,
    // };
    // this.globalConfService
    //   .get(payload, '/GlobalConfig/ConnectionUserPassword')
    //   .subscribe(
    //     (res: any) => {
   
          
    //       if (res.isExecuted) {
         
    //         this.userName='';
    //         this.password='';
    //         this.userName = res.data && res.data.user?res.data.user:'';
    //         this.password = res.data && res.data.password?res.data.password:'';
    //       }
    //     },
    //     (error) => {}
    //   );
  }
  saveLogin() {

    if(this.userName===''|| this.password===''){
      this.message='Username and/or Password are empty. This will set this connection for Windows Authentication. Press OK to set this';
    }else{
      this.message='Username and Password are set. This will set this connection for SQL Authentication. Press OK to set this';

    }
    const dialogRef = this.dialog.open(SqlAuthConfirmationComponent, {
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
        this.Api
          .ConnectionUserPasswordUpdate(payload)
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.toastr.success(labels.alert.success, 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close({isExecuted:true})
    
              }
            },
            (error) => {
              this.toastr.success(labels.alert.went_worng, 'Errpr!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
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
