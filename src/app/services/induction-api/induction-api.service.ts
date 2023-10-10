import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/init/auth.service';
import { IInductionServiceApi } from './induction-api-interface'

@Injectable({
  providedIn: 'root'
})
export class InductionApiService implements IInductionServiceApi {

  public userData: any;

  constructor(private Api : ApiFuntions,
              private authService : AuthService) { }

  BatchTotesDelete(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.BatchTotesDelete(payload);
	}

  AllBatchDelete() {
		return this.Api.AllBatchDelete();
	}
  
}
