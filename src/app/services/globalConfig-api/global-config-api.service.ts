import { Injectable } from '@angular/core';
import { IGlobalConfigApi } from './global-config-api-interface';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/init/auth.service';


@Injectable({
  providedIn: 'root'
})
export class GlobalConfigApiService implements IGlobalConfigApi {
  public userData: any;
  constructor(private Api : ApiFuntions,
    private authService : AuthService) {}
  
    workstationdefaultapp(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.workstationdefaultapp(payload);
	}

  GlobalMenu(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.GlobalMenu(payload);
	}

  AppLicense(){
    return this.Api.AppLicense();
  }

  getWorkstationapp(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.getWorkstationapp(payload);
	}

  workstationapp(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.workstationapp(payload);
	}

  WorkStationDelete(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.WorkStationDelete(payload);
	}

  WorkStationDefaultAppAdd(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.WorkStationDefaultAppAdd(payload);
	}

  WorkStationDefaultAppAddDefault(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.WorkStationDefaultAppAddDefault(payload);
	}

  WorkStationAppDelete(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.WorkStationAppDelete(payload);
	}

  AppNameByWorkstation(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.AppNameByWorkstation(payload);
	}

  configLogout(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.configLogout(payload);
	}

  startSTEService() {
		return this.Api.startSTEService();
	}

  stopSTEService(){
    return this.Api.stopSTEService();
  }

  RestartSTEService(){
    return this.Api.RestartSTEService();
  }

  ServiceStatusSTE(){
    return this.Api.ServiceStatusSTE();
  }

  ServiceStatusCCSIF(){
    return this.Api.ServiceStatusCCSIF(); 
  }

  stopCCSIF(){
    return this.Api.stopCCSIF(); 
  }

  startCCSIF(){
    return this.Api.startCCSIF();
  }

  GetAllPrinters(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.GetAllPrinters(payload);
	}

  UpdWSPrefsPrinters(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.UpdWSPrefsPrinters(payload);
	}

  StatusPrintService(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.StatusPrintService(payload);
	}

  StartPrintService(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.StartPrintService(payload);
	}

  StopPrintService(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.StopPrintService(payload);
	}

  RestartPrintService(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.RestartPrintService(payload);
	}

  deletePrinter(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.deletePrinter(payload);
	}

  InsertNewPrinter(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.InsertNewPrinter(payload);
	}

  UpdateCurrentPrinter(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.UpdateCurrentPrinter(payload);
	}

  ValidateLicenseSave(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ValidateLicenseSave(payload);
	}

  LoginUser(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.LoginUser(payload);
	}

  Menu(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.Menu(payload);
	}

  ConnectionUserPassword(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConnectionUserPassword(payload);
	}

  ConnectionSave(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConnectionSave(payload);
	}

  LAConnectionStringSet(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.LAConnectionStringSet(payload);
	}

  ChangeGlobalAccount(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ChangeGlobalAccount(payload);
	}

  ConnectedUser() {
		return this.Api.ConnectedUser();
	}

  ConnectionUserPasswordUpdate(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConnectionUserPasswordUpdate(payload);
	}

  ConnectionDelete(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConnectionDelete(payload);
	}

  GetWorkStatPrinters() {
		return this.Api.GetWorkStatPrinters();
	}














  





}
