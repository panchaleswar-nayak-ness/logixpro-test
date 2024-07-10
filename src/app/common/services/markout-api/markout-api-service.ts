import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/common/init/auth.service';
import { IMarkoutApiService } from './markout-api-interface';
import { MarkoutBlossomTotenRequest, MarkoutCompleteTransactionRequest, MarkoutToteRequest, UpdateMOPrefRequest, UpdateQuantityRequest } from 'src/app/markout-main-process/markout-main-module/models/markout-model';
@Injectable({
  providedIn: 'root',
})
export class MarkoutApiService implements IMarkoutApiService {
  public userData: any;

  constructor(private Api: ApiFuntions, private authService: AuthService) {
    this.userData = this.authService.userData();
  }

  GetMarkoutData(request: MarkoutToteRequest) {
    return this.Api.GetMarkoutData(request);
  }
  
  UpdateMarkoutQuantity(request: UpdateQuantityRequest) {
    return this.Api.UpdateMarkoutQuantity(request);
  }
  MarkoutCompleteTransaction(request: MarkoutCompleteTransactionRequest) {
    return this.Api.MarkoutCompleteTransaction(request);
  }
  GetParamByName(paramName: string) {
    return this.Api.GetParamByName(paramName);
  }
  MarkoutValidTote(toteid: string) {
    return this.Api.MarkoutValidTote(toteid);
  }
  MarkoutBlossomTote(request: MarkoutBlossomTotenRequest) {
    return this.Api.MarkoutBlossomTote(request);
  }

  GetMarkoutPreferences(){
    return this.Api.GetMarkoutPreferences();
  }
  UpdateMarkoutPreferences(request: UpdateMOPrefRequest){
    return this.Api.UpdateMarkoutPreferences(request);
  }
}
