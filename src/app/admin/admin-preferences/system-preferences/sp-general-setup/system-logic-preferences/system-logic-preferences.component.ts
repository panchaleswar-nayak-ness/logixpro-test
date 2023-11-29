import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ToasterTitle, ToasterType ,StringConditions} from 'src/app/common/constants/strings.constants';
@Component({
  selector: 'app-system-logic-preferences',
  templateUrl: './system-logic-preferences.component.html',
  styleUrls: []
})
export class SystemLogicPreferencesComponent implements OnInit{
  public iAdminApiService: IAdminApiService;
  userData: any;
  constructor(    
    public authService: AuthService, private global : GlobalService,private adminApiService: AdminApiService,private Api:ApiFuntions) {
    this.iAdminApiService = adminApiService;
    this.userData = authService.userData();
   }
   ngOnInit(): void {
    this.companyInfo();
  }
  public companyInfo() {
    this.iAdminApiService.AdminCompanyInfo().subscribe((res: any) => {
      
      if(res.isExecuted && res.data)
      {
        this.CompanyObj = res.data;

      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("AdminCompanyInfo",res.responseMessage);

      }
    })
  }
 
  CompanyObj: any = {
    nextToteID: '', 
    nextSerialNumber: '',
    pickType: 'Pick and Pass',
    fifoPickAcrossWarehouse: false, 
    replenishDedicatedOnly: false,
    otTemptoOTPending: false,
    zeroLocationQuantityCheck: false,
    distinctKitOrders: false,
    printReplenPutLabels: false,
    generateQuarantineTransactions: false
  };

  payload() {
    const payload:any = {
      "preference": [StringConditions.True,String(this.CompanyObj.fifoPickAcrossWarehouse),StringConditions.True,String(this.CompanyObj.replenishDedicatedOnly),StringConditions.True,StringConditions.True,String(this.CompanyObj.zeroLocationQuantityCheck),StringConditions.True,StringConditions.True,StringConditions.True,StringConditions.True,
       String(this.CompanyObj.reelTrackingPickLogic) ,StringConditions.True,StringConditions.True,String(this.CompanyObj.showTransQty),
      String(this.CompanyObj.nextToteID),String(this.CompanyObj.nextSerialNumber),"",String(this.CompanyObj.pickType),String(this.CompanyObj.otTemptoOTPending)
      ,String(this.CompanyObj.distinctKitOrders),String(this.CompanyObj.printReplenPutLabels),String(this.CompanyObj.generateQuarantineTransactions)],
      "panel": 3,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    }; 
    this.saveForm(payload);
  }

  async saveForm(payload){ 
    this.iAdminApiService.GeneralPreferenceSave(payload).subscribe((res: any) => { 
    })
  }
  
}
