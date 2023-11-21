import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import {  StringConditions, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
@Component({
  selector: 'app-pod-setup-component',
  templateUrl: './pod-setup-component.component.html',
  styleUrls: []
})
export class PodSetupComponentComponent implements OnInit{
  public iAdminApiService: IAdminApiService;
  userData: any;
  orderosrts: any;
fieldNames: ReadonlyMap<unknown,unknown>;
  constructor(    
    public authService: AuthService,private global : GlobalService, private adminApiService: AdminApiService) {
    this.iAdminApiService = adminApiService;
    this.userData = authService.userData();
   }
   ngOnInit(): void {
    this.osFieldFilterNames();
  }
  public osFieldFilterNames() { 
    this.iAdminApiService.OSFieldFilterNames().subscribe((res: any) => {
      if(res.isExecuted && res.data)
      {
        this.fieldNames = res.data;
      }
      else {
        this.global.ShowToastr(ToasterTitle.Error, this.global.globalErrorMsg(), ToasterType.Error);
        console.log("OSFieldFilterNames",res.responseMessage);
      }
    })
  }

  companyObj: any = {}

  payload(){
    const payload:any = {
      "preference": [
        this.companyObj.orderSort,this.companyObj.cartonFlowDisplay,this.companyObj.autoDisplayImage
      ],
      "panel": 4,
    }; 
    this.saveForm(payload); 
  }
  async saveForm(payload){ 
    this.iAdminApiService.GeneralPreferenceSave(payload).subscribe((res: any) => { 
    })
  }
  async getOrderSort(){
    this.iAdminApiService.ordersort().subscribe((res:any)=>{
      
      if(res.isExecuted && res.data)
      {
        this.orderosrts = res.data;

      }
      else {
        this.global.ShowToastr(ToasterTitle.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ordersort",res.responseMessage);

      }
    })
  }
}
