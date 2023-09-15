import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared.service'; 
import labels from '../../../labels/labels.json';
import { Router,NavigationEnd  } from '@angular/router';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';


@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
})
export class UserAccountComponent implements OnInit {
  constructor(
    private sharedService: SharedService,
    private Api:ApiFuntions,
    private toastr: ToastrService,
    private router: Router,
    private authService:AuthService
  ) {}

  username: any;
  password: any;
  constUser:any;
  passwordCompare:any;
  public toggle_password = true;
  ngOnInit(): void {
    let sharedData = this.sharedService.getData();
    if (sharedData && sharedData.loginInfo) {
      this.username = sharedData.loginInfo[0].user;
      this.password = sharedData.loginInfo[0].password;
      this.passwordCompare = sharedData.loginInfo[0].password;
    } else {
      this.getMenuData();
    }
  }
  addLoginForm = new FormGroup({
    username: new FormControl({value: '', disabled: true}, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    password: new FormControl('', [Validators.required]),
  });
  getMenuData() {
    let payload = {
      LicenseString:
        'qdljjBp3O3llQvKEW01qlvO4dTIFf6VMuJvYMgXgEc8U8q+dVlMKt0mKG6qtD9DO',
      AppUrl: 'CM1',
      DisplayName: 'Consolidation Manager',
      AppName: 'Consolidation Manager',
    };
    this.Api.Menu(payload).subscribe(
      (res: any) => {
        res && res.data;
        if (res && res.data ) {
          this.sharedService.setData(res.data);
          this.username = res.data.loginInfo[0].user;
          this.password = res.data.loginInfo[0].password;
          this.passwordCompare= res.data.loginInfo[0].password;

          this.constUser=res.data.loginInfo[0].user;
        }
      },
      (error) => {}
    );
  }
  

 
  changeGlobalAcc() {
    let payload = {
      // userName: this.constUser,
      userName:this.authService.userData().userName,
      password: this.password,
    };
    this.Api
      .ChangeGlobalAccount(payload)
      .subscribe(
        (res: any) => {
          if (res.isExecuted) {
            this.toastr.success(labels.alert.success, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
          this.getMenuData();
          localStorage.clear();
          this.router.navigate(['/globalconfig']);
        },
        (error) => {
          this.toastr.error(labels.alert.went_worng, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      );
  }
}
