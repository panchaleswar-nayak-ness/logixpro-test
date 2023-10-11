import { Component, OnInit } from '@angular/core';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { SharedService } from 'src/app/services/shared.service'; 
import { IGlobalConfigApi } from 'src/app/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/services/globalConfig-api/global-config-api.service';

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
      },
      error: (error) => {}}
    );
  }
}
