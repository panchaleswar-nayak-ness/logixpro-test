import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/init/auth.service';
import { ICommonApi } from './common-api-interface';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService implements ICommonApi{

  public userData: any;

  constructor(private Api : ApiFuntions,
              private authService : AuthService) { }

  UserAppNameAdd(payloadParams : any) {
		return this.Api.UserAppNameAdd(payloadParams);
	}

  getCellSize() {
		return this.Api.getCellSize();
	}

  saveCellSize(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.saveCellSize(payload);
	}

  dltCellSize(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.dltCellSize(payload);
	}

  getCategory() {
		return this.Api.getCategory();
	}

  saveCategory(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.saveCategory(payload);
	}

  dltCategory(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.dltCategory(payload);
	}

  getUnitOfMeasure() {
		return this.Api.getUnitOfMeasure();
	}

  saveUnitOfMeasure(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.saveUnitOfMeasure(payload);
	}

  dltUnitOfMeasure(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.dltUnitOfMeasure(payload);
	}

  SearchItem(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.SearchItem(payload);
	}

  LocationEnd(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.LocationEnd(payload);
	}

  LocationBegin(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.LocationBegin(payload);
	}

  ScanCodeTypes() {
		return this.Api.ScanCodeTypes();
	}

  CodeTypeSave(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.CodeTypeSave(payload);
	}

  ScanCodeTypeDelete(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ScanCodeTypeDelete(payload);
	}

  GetWarehouses() {
		return this.Api.GetWarehouses();
	}

  CategoryDelete(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.CategoryDelete(payload);
	}

  getSearchedItem(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.getSearchedItem(payload);
	}

  ItemExists(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.ItemExists(payload);
	}

  SupplierItemIDInfo(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.SupplierItemIDInfo(payload);
	}

  UserFieldGetByID(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.UserFieldGetByID(payload);
	}

  UserFieldTypeAhead(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.UserFieldTypeAhead(payload);
	}

  UserFieldMTSave(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.UserFieldMTSave(payload);
	}

  SupplierItemTypeAhead(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.SupplierItemTypeAhead(payload);
	}

  updateAppName(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.updateAppName(payload);
	}

  saveWareHouse(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.saveWareHouse(payload);
	}

  dltWareHouse(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.dltWareHouse(payload);
	}

  getVelocityCode() {
		return this.Api.getVelocityCode();
	}

  saveVelocityCode(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.saveVelocityCode(payload);
	}

  dltVelocityCode(payloadParams : any) {
    this.userData = this.authService.userData();
		const payload = {
			username: this.userData.username,
      wsid: this.userData.wsid,
			...payloadParams 
		}

		return this.Api.dltVelocityCode(payload);
	}

  getAdjustmentReasonsList() {
		return this.Api.getAdjustmentReasonsList();
	}

  getItemQuantityDetail(payloadParams : any) {
		return this.Api.getItemQuantityDetail(payloadParams);
	}

}
