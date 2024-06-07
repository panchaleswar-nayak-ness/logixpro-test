import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/common/init/auth.service';
import { IMarkoutApiService } from './markout-api-interface';
import { MarkoutBlossomTotenRequest, MarkoutCompleteTransactionRequest, UpdateQuantityRequest } from 'src/app/markout/models/markout-model';
@Injectable({
  providedIn: 'root',
})
export class MarkoutApiService implements IMarkoutApiService {
  public userData: any;

  constructor(private Api: ApiFuntions, private authService: AuthService) {
    this.userData = this.authService.userData();
  }

  GetMarkoutData(toteid: string) {
    return this.Api.GetMarkoutData(toteid);
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
}
