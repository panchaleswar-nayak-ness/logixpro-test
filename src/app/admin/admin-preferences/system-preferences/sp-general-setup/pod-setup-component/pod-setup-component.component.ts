import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-pod-setup-component',
  templateUrl: './pod-setup-component.component.html',
  styleUrls: []
})
export class PodSetupComponentComponent implements OnInit{
  public iAdminApiService: IAdminApiService;
  userData: any;
  orderosrts: any;
FieldNames: ReadonlyMap<unknown,unknown>;
  constructor(    
    public authService: AuthService,private adminApiService: AdminApiService,private Api:ApiFuntions) {
    this.iAdminApiService = adminApiService;
    this.userData = authService.userData();
   }
   ngOnInit(): void {
    this.OSFieldFilterNames();
  }
  public OSFieldFilterNames() { 
    this.iAdminApiService.OSFieldFilterNames().subscribe((res: any) => {
      this.FieldNames = res.data;
    })
  }

  CompanyObj: any = {}

  payload(){
    const payload:any = {
      "preference": [
        this.CompanyObj.orderSort,this.CompanyObj.cartonFlowDisplay,this.CompanyObj.autoDisplayImage
      ],
      "panel": 4,
    }; 
    this.SaveForm(payload); 
  }
  async SaveForm(payload){ 
    this.iAdminApiService.GeneralPreferenceSave(payload).subscribe((res: any) => { 
    })
  }
  async GetOrderSort(){
    this.iAdminApiService.ordersort().subscribe((res:any)=>{
      this.orderosrts = res.data;
    })
  }
}
