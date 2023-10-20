import { Component, OnInit } from '@angular/core';

import { SharedService } from 'src/app/services/shared.service'; 
import labels from '../../../labels/labels.json';
import { Router  } from '@angular/router';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IGlobalConfigApi } from 'src/app/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/services/globalConfig-api/global-config-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: [],
})
export class UserAccountComponent implements OnInit {
  public  iGlobalConfigApi: IGlobalConfigApi;
  constructor(
    private sharedService: SharedService,
    private Api:ApiFuntions,
    
    private router: Router,
    public globalConfigApi: GlobalConfigApiService,
    private global: GlobalService
  ) {
    this.iGlobalConfigApi = globalConfigApi;
  }

  username: any;
  password: any;
  constUser:any;
  passwordCompare:any;
  public toggle_password = true;
  ngOnInit(): void {
    let sharedData = this.sharedService.getData();
    if (sharedData?.loginInfo) {
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
    this.iGlobalConfigApi.Menu(payload).subscribe(
      {next: (res: any) => {
        if (res.isExecuted && res.data ) {
          this.sharedService.setData(res.data);
          this.username = res.data.loginInfo[0].user;
          this.password = res.data.loginInfo[0].password;
          this.passwordCompare= res.data.loginInfo[0].password;

          this.constUser=res.data.loginInfo[0].user;
        }
        else{
          this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
          console.log("Menu",res.responseMessage);
        }
      },
      error: (error) => {}}
    );
  }
  

 
  changeGlobalAcc() {
    let payload = {
      password: this.password,
    };
    this.iGlobalConfigApi
      .ChangeGlobalAccount(payload)
      .subscribe(
        {next: (res: any) => {
          if (res?.isExecuted) {
            this.global.ShowToastr('success',labels.alert.success, 'Success!');
          }
          else{
            this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
            console.log("changeGlobalAccount",res.responseMessage);
          }
          this.getMenuData();
          localStorage.clear();
          this.router.navigate(['/globalconfig']);
        },
        error: (error) => {
          this.global.ShowToastr('error',labels.alert.went_worng, 'Error!');
        }}
      );
  }
}
