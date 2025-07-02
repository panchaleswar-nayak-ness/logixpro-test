import { Injectable } from '@angular/core';
import { IMarkoutNewApiService } from './markout-new-api-interface';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from '../../init/auth.service';
import { IQueryParams } from 'src/app/consolidation-manager/cm-route-id-management/routeid-list/routeid-IQueryParams';

@Injectable({
  providedIn: 'root'
})
export class MarkoutNewApiService implements IMarkoutNewApiService {
  userData;

   constructor(private Api: ApiFuntions, private authService: AuthService) {
     this.userData = this.authService.userData();
   }

  GetMarkoutNewData(payload: IQueryParams) {
    return this.Api.GetMarkoutNewData(payload);
  }
  GetToteAudit(payload: IQueryParams, toteId :number) {
    return this.Api.GetToteAudit(payload,toteId);
  }
  GetTotePickLines(payload: IQueryParams, toteId :number) {
    return this.Api.GetTotePickLines(payload,toteId);
  }

   ResolveMarkoutTote(toteId :number) {
    return this.Api.ResolveMarkoutTote(toteId);
  }
}
