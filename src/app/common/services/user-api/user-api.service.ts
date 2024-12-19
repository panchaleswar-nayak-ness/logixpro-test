import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/common/init/auth.service';
import { IUserAPIService } from './user-api-interface';
import { LocalStorageService } from 'src/app/common/services/LocalStorage.service';

@Injectable({
  providedIn: 'root'
})
export class UserApiService implements IUserAPIService {

  public userData: any;

  constructor(
    private Api : ApiFuntions,
    private authService : AuthService,
    private localstorageService:LocalStorageService
  ) { }

  Logout() {
    this.userData = this.authService.userData();
    const payload = {
      username: this.userData.userName,
      wsid: this.userData.wsid
    }
    this.localstorageService.clearLocalStorage();
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
