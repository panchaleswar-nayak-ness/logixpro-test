import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-company-info-component',
  templateUrl: './company-info-component.component.html',
  styleUrls: []
})
export class CompanyInfoComponentComponent  implements OnInit{
  public iAdminApiService: IAdminApiService;
  userData: any;
  constructor(    public authService: AuthService,private adminApiService: AdminApiService,private Api:ApiFuntions) {
    this.iAdminApiService = adminApiService;
    this.userData = authService.userData();
   }
   ngOnInit(): void {
    this.CompanyInfo();
  }
  CompanyObj: any = {};
  public CompanyInfo() {
    this.iAdminApiService.AdminCompanyInfo().subscribe((res: any) => {
      this.CompanyObj = res.data;
    })
  }

  payload(no){ 
    const payload: any = {
      "preference": [
        this.CompanyObj.companyName,this.CompanyObj.address1,this.CompanyObj.city,this.CompanyObj.state,
        this.CompanyObj.earlyBreakTime,String(this.CompanyObj.earlyBreakDuration),this.CompanyObj.midBreakTime,String(this.CompanyObj.midBreakDuration)
        ,this.CompanyObj.lateBreakTime,String(this.CompanyObj.lateBreakDuration)
      ],
      "panel": 1,
      "username": this.userData.userName,
      "wsid": this.userData.wsids
    };
    this.SaveForm(payload); 
    
  }
  async SaveForm(paylaod){ 
    this.iAdminApiService.GeneralPreferenceSave(paylaod).subscribe((res: any) => { 
    })
  }
}
