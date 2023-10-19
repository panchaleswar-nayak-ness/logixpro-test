import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-system-logic-preferences',
  templateUrl: './system-logic-preferences.component.html',
  styleUrls: []
})
export class SystemLogicPreferencesComponent implements OnInit{
  public iAdminApiService: IAdminApiService;
  userData: any;
  FieldNames: any;
  orderosrts: any;
  constructor(    
    public authService: AuthService,private adminApiService: AdminApiService,private Api:ApiFuntions) {
    this.iAdminApiService = adminApiService;
    this.userData = authService.userData();
   }
   ngOnInit(): void {
    this.CompanyInfo();
  }
  public CompanyInfo() {
    this.iAdminApiService.AdminCompanyInfo().subscribe((res: any) => {
      this.CompanyObj = res.data;
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
      "preference": ["true",String(this.CompanyObj.fifoPickAcrossWarehouse),"true",String(this.CompanyObj.replenishDedicatedOnly),"true","true",String(this.CompanyObj.zeroLocationQuantityCheck),"true","true","true","true",
       String(this.CompanyObj.reelTrackingPickLogic) ,"true","true",String(this.CompanyObj.showTransQty),
      String(this.CompanyObj.nextToteID),String(this.CompanyObj.nextSerialNumber),"",String(this.CompanyObj.pickType),String(this.CompanyObj.otTemptoOTPending)
      ,String(this.CompanyObj.distinctKitOrders),String(this.CompanyObj.printReplenPutLabels),String(this.CompanyObj.generateQuarantineTransactions)],
      "panel": 3,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    }; 
    this.SaveForm(payload);
  }

  async SaveForm(payload){ 
    this.iAdminApiService.GeneralPreferenceSave(payload).subscribe((res: any) => { 
    })
  }
  
}
