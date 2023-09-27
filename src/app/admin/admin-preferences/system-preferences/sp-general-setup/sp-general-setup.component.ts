import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-sp-general-setup',
  templateUrl: './sp-general-setup.component.html',
  styleUrls: []
})
export class SpGeneralSetupComponent implements OnInit {
  public userData: any;
  public CompanyObj: any={};
  orderosrts:any = [];
  public FieldNames :any={};
  constructor(    public authService: AuthService,private Api:ApiFuntions) {
    this.userData = authService.userData();
   }

  ngOnInit(): void {
    this.CompanyInfo();
    this.OSFieldFilterNames();
    this.GetOrderSort();
  }
  public OSFieldFilterNames() { 
    this.Api.OSFieldFilterNames().subscribe((res: any) => {
      this.FieldNames = res.data;
    })
  }
  public CompanyInfo() {
    this.Api.AdminCompanyInfo().subscribe((res: any) => {
      this.CompanyObj = res.data;
    })
  }
  
  payload(no){ 
    const paylaod1:any = {
      "preference": [
        this.CompanyObj.companyName,this.CompanyObj.address1,this.CompanyObj.city,this.CompanyObj.state,
        this.CompanyObj.earlyBreakTime,String(this.CompanyObj.earlyBreakDuration),this.CompanyObj.midBreakTime,String(this.CompanyObj.midBreakDuration)
        ,this.CompanyObj.lateBreakTime,String(this.CompanyObj.lateBreakDuration)
      ],
      "panel": 1,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    }; 
    const paylaod3:any = {
      "preference": ["true",String(this.CompanyObj.fifoPickAcrossWarehouse),"true",String(this.CompanyObj.replenishDedicatedOnly),"true","true",String(this.CompanyObj.zeroLocationQuantityCheck),"true","true","true","true",
       String(this.CompanyObj.reelTrackingPickLogic) ,"true","true",String(this.CompanyObj.showTransQty),
      String(this.CompanyObj.nextToteID),String(this.CompanyObj.nextSerialNumber),"",String(this.CompanyObj.pickType),String(this.CompanyObj.otTemptoOTPending)
      ,String(this.CompanyObj.distinctKitOrders),String(this.CompanyObj.printReplenPutLabels),String(this.CompanyObj.generateQuarantineTransactions)],
      "panel": 3,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    }; 
    const paylaod4:any = {
      "preference": [
        this.CompanyObj.orderSort,this.CompanyObj.cartonFlowDisplay,this.CompanyObj.autoDisplayImage
      ],
      "panel": 4,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    }; 
    if(no==1) this.SaveForm(paylaod1);
    if(no==3)  this.SaveForm(paylaod3);
    if(no==4)  this.SaveForm(paylaod4);
  }
    async SaveForm(paylaod){ 
      this.Api.GeneralPreferenceSave(paylaod).subscribe((res: any) => { 
      })
    }
    async GetOrderSort(){
      this.Api.ordersort().subscribe((res:any)=>{
        this.orderosrts = res.data;
      })
    }
}
