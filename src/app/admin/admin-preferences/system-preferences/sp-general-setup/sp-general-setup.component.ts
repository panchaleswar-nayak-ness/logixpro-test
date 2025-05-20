import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { StringConditions, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { ApiResponse, OSFieldFilterNames, UserSession } from 'src/app/common/types/CommonTypes';
import { GeneralSetup } from 'src/app/common/Model/preferences';

interface Payload {
  preference: string[];
  panel: number;
  username: string;
  wsid: string;
}

interface GeneralPreferenceSaveResponse {
  preference: string[];
  panel: number;
}

@Component({
  selector: 'app-sp-general-setup',
  templateUrl: './sp-general-setup.component.html',
  styleUrls: []
})
export class SpGeneralSetupComponent implements OnInit {
  public iAdminApiService: IAdminApiService;
  userData: UserSession;
  generalSetupInfo: GeneralSetup;
  fieldNames: OSFieldFilterNames;
  
  constructor(
    public authService: AuthService, 
    private global: GlobalService,
    public adminApiService: AdminApiService
  ) {
    this.emptyGeneralSetupInfo();
    this.iAdminApiService = adminApiService;
    this.userData = authService.userData();
  }
  
  ngOnInit(): void {
    this.getGeneralSetupInfo();
    this.osFieldFilterNames();
  }

  emptyGeneralSetupInfo(){
    this.generalSetupInfo = {
      companyName: '',
      address1: '',
      city: '',
      state: '',
      domainAuthentication: false,
      useNTLM: false,
      orderManifest: false,
      fifoPickAcrossWarehouse: false,
      checkForValidTotes: false,
      replenishDedicatedOnly: false,
      pickLabelsOnePerQty: false,
      shortPickFindNewLocation: false,
      zeroLocationQuantityCheck: false,
      requestNumberofPutAwayLabels: false,
      carouselBatchID: false,
      bulkBatchID: false,
      dynamicReelTrackingCreateWIP: false,
      reelTrackingPickLogic: '',
      multiBatchCartSelection: false,
      confirmInventoryChanges: false,
      showTransQty: '',
      nextToteID: 0,
      nextSerialNumber: 0,
      maxNumberOfPutAwayLabels: 0,
      pickType: '',
      orderSort: '',
      cartonFlowDisplay: '',
      autoDisplayImage: false,
      otTemptoOTPending: false,
      earlyBreakTime: '',
      earlyBreakDuration: 0,
      midBreakTime: '',
      midBreakDuration: 0,
      lateBreakTime: '',
      lateBreakDuration: 0,
      distinctKitOrders: false,
      printReplenPutLabels: false,
      generateQuarantineTransactions: false,
      requireHotReasons:false,
      allowQuickPicks:false,
      deafultQuickPicks:false,
      printReprocessReportAfterAllocation:false
  };
  
  }

  public getGeneralSetupInfo(){
    this.iAdminApiService.AdminCompanyInfo().subscribe((res: ApiResponse<GeneralSetup>) => {
      if(res.isExecuted && res.data){
        this.generalSetupInfo = res.data;
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("AdminCompanyInfo", res.responseMessage);
      } 
    })
  }

  public osFieldFilterNames() { 
    this.iAdminApiService.OSFieldFilterNames().subscribe((res: ApiResponse<OSFieldFilterNames>) => {
      if(res.isExecuted && res.data) this.fieldNames = res.data;
      else {
        this.global.ShowToastr(ToasterTitle.Error, this.global.globalErrorMsg(), ToasterType.Error);
        console.log("OSFieldFilterNames",res.responseMessage);
      }
    })
  }

  buildPreferenceArray(panelNumber: number, updatedInfo: GeneralSetup) : string[]{
    if(panelNumber == 1){ 
      return [
        updatedInfo.companyName,
        updatedInfo.address1,
        updatedInfo.city,
        updatedInfo.state,
        updatedInfo.earlyBreakTime,
        String(updatedInfo.earlyBreakDuration),
        updatedInfo.midBreakTime,
        String(updatedInfo.midBreakDuration),
        updatedInfo.lateBreakTime,
        String(updatedInfo.lateBreakDuration)
      ]
    } else if(panelNumber == 3) {
      return [
        StringConditions.True,
        String(updatedInfo.fifoPickAcrossWarehouse),
        StringConditions.True,
        String(updatedInfo.replenishDedicatedOnly),
        StringConditions.True,
        String(updatedInfo.shortPickFindNewLocation),
        String(updatedInfo.zeroLocationQuantityCheck),
        StringConditions.True,
        StringConditions.True,
        String(updatedInfo.bulkBatchID),
        StringConditions.True,
        String(updatedInfo.reelTrackingPickLogic),
        StringConditions.True,
        StringConditions.True,
        String(updatedInfo.showTransQty),
        String(updatedInfo.nextToteID),
        String(updatedInfo.nextSerialNumber),
        "",
        String(updatedInfo.pickType),
        String(updatedInfo.otTemptoOTPending),
        String(updatedInfo.distinctKitOrders),
        String(updatedInfo.printReplenPutLabels),
        String(updatedInfo.generateQuarantineTransactions),
        String(updatedInfo.requireHotReasons)
      ]
    } else if(panelNumber == 4){
      return [
        updatedInfo.orderSort,
        updatedInfo.cartonFlowDisplay,
        String(updatedInfo.autoDisplayImage)
      ]
    } else return [];
  }

  generatePayload(panelNumber: number, updatedInfo: GeneralSetup){ 
    const payload : Payload = {
      "preference": this.buildPreferenceArray(panelNumber, updatedInfo),
      "panel": panelNumber,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    };
    
    this.saveForm(payload); 
  }

  async saveForm(paylaod: Payload){ 
    this.iAdminApiService.GeneralPreferenceSave(paylaod).subscribe((res: ApiResponse<GeneralPreferenceSaveResponse>) => {});
  }
}
