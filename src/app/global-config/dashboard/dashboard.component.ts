import { Component, OnInit } from '@angular/core';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { SharedService } from 'src/app/common/services/shared.service'; 
import { IGlobalConfigApi } from 'src/app/common/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/common/services/globalConfig-api/global-config-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
@Component({
  selector: 'app-global-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
})
export class GlobalDashboardComponent implements OnInit {
  licAppNames: any = [];
  sideBarOpen: boolean = true;
  public  iGlobalConfigApi: IGlobalConfigApi;
  constructor(
    private global:GlobalService,
    private Api:ApiFuntions,
    public globalConfigApi: GlobalConfigApiService,
    private sharedService: SharedService
  ) {
    this.iGlobalConfigApi = globalConfigApi;
  }

  ngOnInit(): void {
    let appData = this.sharedService.getApp();
    if (!appData) {
      this.getAppLicense();
    }
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  async getAppLicense() {
    // get can access

    this.iGlobalConfigApi.AppLicense().subscribe(
      {next: (res: any) => {
        if (res?.data) {
          this.licAppNames = res.data;
          this.sharedService.setApp(this.licAppNames);
        }
        else{
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("AppLicense",res.responseMessage);
        }
      },
      error: (error) => {}}
    );
  }
}
