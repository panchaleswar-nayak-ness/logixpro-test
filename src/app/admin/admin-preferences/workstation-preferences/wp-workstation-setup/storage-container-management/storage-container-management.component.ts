import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-storage-container-management',
  templateUrl: './storage-container-management.component.html',
  styleUrls: ['./storage-container-management.component.scss']
})
export class StorageContainerManagementComponent implements OnInit {
  public iAdminApiService: IAdminApiService;
  userData: any;
  companyObj: any = {};
  constructor(
    public authService: AuthService,
    private global: GlobalService,
    public adminApiService: AdminApiService) {
    this.iAdminApiService = adminApiService;
    this.userData = authService.userData();
  }
  
  ngOnInit(): void {
 this.companyInfo();
  }



    public companyInfo() {
      this.iAdminApiService.WorkstationSetupInfo().subscribe((res: any) => {
        if (res.isExecuted && res.data) {
          this.companyObj.storageContainer = res.data.storageContainer;        }
        else {
          //this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("AdminCompanyInfo", res.responseMessage);
        }
      })
    }

    payload() {
      const payload: any = {
        "StorageContainer": this.companyObj.storageContainer,
      }
      this.saveForm(payload);
    }
  
    async saveForm(paylaod) {
      this.iAdminApiService.StorageContainerManagementUpdate(paylaod).subscribe((res: any) => {
      })
    }
  }
  