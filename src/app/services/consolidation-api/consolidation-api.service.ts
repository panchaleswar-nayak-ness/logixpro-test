import { Injectable } from '@angular/core';
import { IConsolidationApi } from './consolidation-api-interface';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/init/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConsolidationApiService implements IConsolidationApi {

  public userData: any;

  constructor(private Api : ApiFuntions,
              private authService : AuthService) { }

  ContIDShipTransUpdate(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ContIDShipTransUpdate(payload);
	}
  
  CarrierSave(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.CarrierSave(payload);
	}

  CarrierSelect() {
		return this.Api.CarrierSelect();
	}

  ConsolidationData(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConsolidationData(payload);
	}

  StagingLocationsUpdate(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.StagingLocationsUpdate(payload);
	}

  ConsoleDataSB(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConsoleDataSB(payload);
	}

  ConsolidationPreferenceUpdate(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConsolidationPreferenceUpdate(payload);
	}

  SystemPreferenceEmailSlip(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.SystemPreferenceEmailSlip(payload);
	}

  ConsolidationPreferenceShipUpdate(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConsolidationPreferenceShipUpdate(payload);
	}

  ConsolidationIndex(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConsolidationIndex(payload);
	}

  ShippingButtSet(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ShippingButtSet(payload);
	}

  VerifyAllItemPost(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.VerifyAllItemPost(payload);
	}

  UnVerifyAll(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.UnVerifyAll(payload);
	}

  VerifyItemPost(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.VerifyItemPost(payload);
	}

  DeleteVerified(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.DeleteVerified(payload);
	}

  ConsoleItemsTypeAhead(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConsoleItemsTypeAhead(payload);
	}

  CompleteShipment(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.CompleteShipment(payload);
	}

  SelCountOfOpenTransactionsTemp(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.SelCountOfOpenTransactionsTemp(payload);
	}

  ShipmentItemUpdate(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ShipmentItemUpdate(payload);
	}

  ShipmentItemDelete(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ShipmentItemDelete(payload);
	}

  ShippingIndex(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ShippingIndex(payload);
	}

  ShippingTransactionIndex(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ShippingTransactionIndex(payload);
	}

  CompletePackingUpdate(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.CompletePackingUpdate(payload);
	}

  SplitLineTrans(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.SplitLineTrans(payload);
	}

  ShipQTYShipTransUpdate(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ShipQTYShipTransUpdate(payload);
	}

  ContainerIdSingleShipTransUpdate(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ContainerIdSingleShipTransUpdate(payload);
	}

  ShippingItemAdd(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ShippingItemAdd(payload);
	}

  ItemModelData(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ItemModelData(payload);
	}

  ConfPackProcModalUpdate(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConfPackProcModalUpdate(payload);
	}

  ConfPackProcModal(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConfPackProcModal(payload);
	}

  ConfPackSelectDT(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConfPackSelectDT(payload);
	}

  ConfirmAllConfPack(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConfirmAllConfPack(payload);
	}

  ConfirmAndPackingIndex(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ConfirmAndPackingIndex(payload);
	}

  ShipTransUnPackUpdate(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ShipTransUnPackUpdate(payload);
	}

  SelContIDConfirmPack(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.SelContIDConfirmPack(payload);
	}

  CarrierDelete(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.CarrierDelete(payload);
	}

  viewShipping(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.viewShipping(payload);
	}

  ShowCMPackPrintModal(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ShowCMPackPrintModal(payload);
	}

}
