import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { ILogin, ILoginInfo } from './Ilogin'; 
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import labels from '../labels/labels.json';
import { MatDialog } from '@angular/material/dialog';
// import { ChangePasswordComponent } from './change-password/change-password.component';
import { SpinnerService } from '../init/spinner.service';
import { AuthService } from '../init/auth.service'; 
import { ILogin } from '../login/Ilogin';
import { ApiFuntions } from '../services/ApiFuntions';

@Component({
  selector: 'global-config',
  templateUrl: './global-config.component.html', 
  styleUrls: ['./global-config.component.scss'],
})
export class GlobalConfigComponent {
  login: ILogin;
  addLoginForm:any = {};
  @ViewChild('passwordInput') passwordInput: ElementRef;
  returnUrl: string;
  public env;
  public toggle_password = true;
  url = '';

  constructor(
    public Api: ApiFuntions,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public loader: SpinnerService,
    private auth: AuthService 
  ) {
    this.url = this.router.url;
  }

 

  public noWhitespaceValidator(control: FormControl) {
    const isSpace = (control.value || '').match(/\s/g);
    return isSpace ? { whitespace: true } : null;
  }

  loginUser() {
    this.loader.show();
    this.addLoginForm.username = this.addLoginForm.username?.replace(/\s/g, "")||null;
    this.addLoginForm.password = this.addLoginForm.password?.replace(/\s/g, "")||null;
    this.login = this.addLoginForm;
    const workStation: any = JSON.parse(
      localStorage.getItem('workStation') || ''
    );
    this.login.wsid = workStation.workStationID;
    this.Api.LoginUser(this.login).subscribe(
      (res: any) => { 
        if (res.isExecuted && res.data !=null) { 
          let data = {
            _token: res.data.token,
            userName: res.data.userName,
            accessLevel: res.data.accessLevel,
            wsid: res.data.wsid,
            loginTime: res.data.loginTime,
          };
          let userRights = res.data.userRights;
                  // userRights = this.addCustomPermission(userRights);
                  // this.addLoginForm.reset();
                  localStorage.setItem('userConfig', JSON.stringify(data));
                  // localStorage.setItem('global-config-userRights', JSON.stringify(userRights));
          window.location.href =  '/#/globalconfig/home';
          window.location.reload();
        } else {
          const errorMessage = res.responseMessage;
          this.toastr.error(errorMessage?.toString(), 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (error) => {
        const errorMessage = error.responseMessage;
        this.toastr.error(errorMessage?.toString(), 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
    );
    //   this.loginService
    //     .login(this.login)
    //     .subscribe((response: any) => {
    //       const exe = response.isExecuted
    //       if (exe == true) {
    //         let data = {
    //           '_token': response.data.token,
    //           'userName': response.data.userName,
    //           'accessLevel': response.data.accessLevel,
    //           'wsid': response.data.wsid,
    //           'loginTime': response.data.loginTime,
    //         }
    //         let userRights = response.data.userRights;
    //         userRights = this.addCustomPermission(userRights);
    //         this.addLoginForm.reset();
    //         localStorage.setItem('user', JSON.stringify(data));
    //         localStorage.setItem('userRights', JSON.stringify(userRights));
    // this.router.navigate(['/dashboard']);
    //       }
    //       else {
    //         const errorMessage = response.responseMessage;
    //         this.toastr.error(errorMessage?.toString(), 'Error!', {
    //           positionClass: 'toast-bottom-right',
    //           timeOut: 2000
    //         });
    //       }

    // });
  }
  enterUserName(){
    this.passwordInput.nativeElement.focus();
  }
  ngOnInit() {
    debugger
    if (this.auth.IsloggedIn()) { 
        window.location.href = '/#/dashboard'; 
       
    }
      else{
    this.route.url.forEach((res) => {
      if(res[0].path.includes('globalconfig')){
          localStorage.setItem('isConfigUser', JSON.stringify(true))
      }
    })
      this.Api.getSecurityEnvironment().subscribe((res:any) => {
        this.env = res.data.securityEnvironment;
        if (this.env) {
          const { workStation } = res.data;
          localStorage.setItem('env', JSON.stringify(this.env));
          localStorage.setItem('workStation', JSON.stringify(workStation));
        } else {
          this.toastr.error(
            'Kindly contact to administrator',
            'Workstation is not set!',
            {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            }
          );
        }
      });
  }
  }

  changePass() {
    // let dialogRef = this.dialog.open(ChangePasswordComponent, {
    //   height: 'auto',
    //   width: '500px',
    //   autoFocus: '__non_existing_element__',
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);
    // });
  }
  private addCustomPermission(userRights: any) {
    let customPerm = [
      'Home',
      'Import Export',
      'Induction Manager',
      'Work Manager',
      'Consolidation Manager',
      'Order Manager',
      'Admin Menu',
      'FlowRack Replenish',
      'Markout',

      //Admin Menus
      'Dashboard',
      // 'Inventory Map',
      // 'Batch Manager',
      // 'Reports',
      // 'Location Assignment',
      // 'Cycle Count Manager',
      // 'Move Items',
      // 'Transaction Journal',
      // 'Dashboard',
      // 'Dashboard',
      // 'Dashboard',
    ];
    return [...userRights, ...customPerm];
  }
}
