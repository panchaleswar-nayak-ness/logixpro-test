import { Injectable } from '@angular/core';
import { IFlowRackReplenishApi } from './flowrackreplenish-api-interface'
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/init/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FlowRackReplenishApiService implements IFlowRackReplenishApi{

  public userData: any;

  constructor(private Api : ApiFuntions,
              private authService : AuthService) { }

  itemquantity(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.itemquantity(payload);
	}

  verifyitemquantity(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.verifyitemquantity(payload);
	}

  verifyitemlocation(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.verifyitemlocation(payload);
	}
  ItemLocation(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ItemLocation(payload);
	}
  
  openlocation(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.openlocation(payload);
	}

  CFData(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.CFData(payload);
	}
  
  wslocation(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.wslocation(payload);
	}
}
