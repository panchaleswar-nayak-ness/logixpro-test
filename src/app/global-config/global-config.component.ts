import { Component, ElementRef,  ViewChild } from '@angular/core';
import { FormControl} from '@angular/forms';
import { ActivatedRoute,  Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
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
      localStorage.getItem('workStation') ?? ''
    );
    this.login.wsid = workStation.workStationID;
    this.Api.LoginUser(this.login).subscribe(
      {next: (res: any) => { 
        if (res.isExecuted && res.data !=null) { 
          let data = {
            _token: res.data.token,
            userName: res.data.userName,
            accessLevel: res.data.accessLevel,
            wsid: res.data.wsid,
            loginTime: res.data.loginTime,
          };
          localStorage.setItem('userConfig', JSON.stringify(data));
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
      error: (error) => {
        const errorMessage = error.responseMessage;
        this.toastr.error(errorMessage?.toString(), 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }}
    );
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
}
