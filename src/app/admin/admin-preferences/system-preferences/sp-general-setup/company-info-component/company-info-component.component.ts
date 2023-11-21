import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-company-info-component',
  templateUrl: './company-info-component.component.html',
  styleUrls: []
})
export class CompanyInfoComponentComponent  implements OnInit{
  public iAdminApiService: IAdminApiService;
  userData: any;
  constructor(    public authService: AuthService, private global : GlobalService,private adminApiService: AdminApiService,private Api:ApiFuntions) {
    this.iAdminApiService = adminApiService;
    this.userData = authService.userData();
   }
   ngOnInit(): void {
    this.companyInfo();
  }
  companyObj: any = {};
  public companyInfo() {
    this.iAdminApiService.AdminCompanyInfo().subscribe((res: any) => {
      if(res.isExecuted && res.data)
      {
      this.companyObj = res.data;
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("AdminCompanyInfo",res.responseMessage);

      }
    })
  }

  payload(no){ 
    const payload: any = {
      "preference": [
        this.companyObj.companyName,this.companyObj.address1,this.companyObj.city,this.companyObj.state,
        this.companyObj.earlyBreakTime,String(this.companyObj.earlyBreakDuration),this.companyObj.midBreakTime,String(this.companyObj.midBreakDuration)
        ,this.companyObj.lateBreakTime,String(this.companyObj.lateBreakDuration)
      ],
      "panel": 1,
      "username": this.userData.userName,
      "wsid": this.userData.wsids
    };
    this.saveForm(payload); 
    
  }
  async saveForm(paylaod){ 
    this.iAdminApiService.GeneralPreferenceSave(paylaod).subscribe((res: any) => { 
    })
  }
}
