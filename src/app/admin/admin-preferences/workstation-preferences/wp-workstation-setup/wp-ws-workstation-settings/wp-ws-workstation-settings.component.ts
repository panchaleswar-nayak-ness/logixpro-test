import { Component, OnInit } from '@angular/core';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-wp-ws-workstation-settings',
  templateUrl: './wp-ws-workstation-settings.component.html',
  styleUrls: ['./wp-ws-workstation-settings.component.scss']
})
export class WpWsWorkstationSettingsComponent implements OnInit {

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
        this.companyObj.scanPicks = res.data.scanVerifyPicks;
        this.companyObj.scanCounts = res.data.scanVerifyCounts;
        this.companyObj.scanPuts = res.data.scanVerifyPutAways;
        this.companyObj.quickPick = res.data.pfSettings.filter((x:any) => x.pfName == "Quick Pick")[0].pfSetting == 1 ? true : false;
        this.companyObj.defQuickPick = res.data.pfSettings.filter((x:any) => x.pfName == "Default Quick Pick")[0].pfSetting == 1 ? true : false;
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("AdminCompanyInfo", res.responseMessage);
      }
    })
  }

  payload() {
    const payload: any = {
      "cartonFlowID": "",
      "podID": "",
      "scanPicks": this.companyObj.scanPicks,
      "scanCounts": this.companyObj.scanCounts,
      "scanPuts": this.companyObj.scanPuts,
      "printRepLocation": "",
      "printLabelLocation": "",
      "quickPick": this.companyObj.quickPick,
      "defQuickPick": this.companyObj.defQuickPick,
    }
    this.saveForm(payload);
  }

  async saveForm(paylaod) {
    this.iAdminApiService.WorkstationSettingsUpdate(paylaod).subscribe((res: any) => {
    })
  }

}
