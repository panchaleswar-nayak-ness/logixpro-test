import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/init/auth.service';
import { IUserAPIService } from './user-api-interface';

@Injectable({
  providedIn: 'root'
})
export class UserApiService implements IUserAPIService {

  public userData: any;

  constructor(
    private Api : ApiFuntions,
    private authService : AuthService
  ) { }

  Logout() {
    this.userData = this.authService.userData();
    const payload = {
      username: this.userData.userName,
      wsid: this.userData.wsid
    }
    localStorage.clear();
    return this.Api.Logout(payload);
  }

  getSecurityEnvironment(){
    return this.Api.getSecurityEnvironment();
  };

  login(payloadParams : any) {
    return this.Api.login(payloadParams);
  }

  changePassword(payloadParams : any) {
    this.userData = this.authService.userData();
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...payloadParams 
    }
    return this.Api.changePassword(payload);
  }

  CompanyInfo(){
    return this.Api.CompanyInfo();
  };
}
