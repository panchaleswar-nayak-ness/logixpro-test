import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/init/auth.service';
import { IOrderManagerAPIService } from './order-manager-api-interface'

@Injectable({
  providedIn: 'root'
})
export class OrderManagerApiService implements IOrderManagerAPIService {

  public userData: any;

  constructor(
    private Api : ApiFuntions,
    private authService : AuthService) { }

      OrderManagerPreferenceIndex(){
        return this.Api.OrderManagerPreferenceIndex();
      };

      SelectOrderManagerTempDTNew(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.SelectOrderManagerTempDTNew(payload);
      }

      OMOTPendDelete(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.OMOTPendDelete(payload);
      }

      FillOrderManTempData(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.FillOrderManTempData(payload);
      }
      
      ReleaseOrders(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.ReleaseOrders(payload);
      }

      OrderManagerTempDelete(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.OrderManagerTempDelete(payload);
      }
 
      OrderManagerMenuIndex() {
        return this.Api.OrderManagerMenuIndex();
      }
      
      OrderManagerPreferenceUpdate(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.OrderManagerPreferenceUpdate(payload);
      }

      UserFieldData(){
        return this.Api.UserFieldData();
      }
      
      UserFieldDataUpdate(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.UserFieldDataUpdate(payload);
      }

      CreateOrderTypeahead(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.CreateOrderTypeahead(payload);
      }

      OTPendDelete(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.OTPendDelete(payload);
      }
      
      CreateOrdersDT(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.CreateOrdersDT(payload);
      }
      
      OrderManagerRecordUpdate(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.OrderManagerRecordUpdate(payload);
      }

      
      OTTempInsert(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.OTTempInsert(payload);
      }
      

      OTTempUpdate(payloadParams : any) {
        this.userData = this.authService.userData();
        const payload = {
          username: this.userData.username,
          wsid: this.userData.wsid,
          ...payloadParams 
        }
        return this.Api.OTTempUpdate(payload);
      }


}
