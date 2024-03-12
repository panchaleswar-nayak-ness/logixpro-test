import { Component, OnInit } from '@angular/core';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-wp-ws-tote-management',
  templateUrl: './wp-ws-tote-management.component.html',
  styleUrls: ['./wp-ws-tote-management.component.scss']
})
export class WpWsToteManagementComponent implements OnInit {

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
        this.companyObj.pickTotes = res.data.pickToTotes;
        this.companyObj.putTotes = res.data.putAwayFromTotes;
        this.companyObj.autoPrintTote = res.data.autoPrintPickToteLabels;
        this.companyObj.batchPut = res.data.batchPutAway;
        this.companyObj.autoToteManifest = res.data.pfSettingsII.filter((x: any) => x.pfName == "Auto Tote Manifest")[0].pfSetting == 1 ? true : false;
        this.companyObj.carManifest = res.data.pfSettingsII.filter((x: any) => x.pfName == "Carousel Manifest")[0].pfSetting == 1 ? true : false;
        this.companyObj.offCarManifest = res.data.pfSettingsII.filter((x: any) => x.pfName == "Off Carousel Manifest")[0].pfSetting == 1 ? true : false;
        this.companyObj.batchHotPut = res.data.pfSettingsII.filter((x: any) => x.pfName == "Batch Hot Put Away")[0].pfSetting;
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("AdminCompanyInfo", res.responseMessage);
      }
    })
  }

  payload() {
    const payload: any = {
      "pickTotes": this.companyObj.pickTotes,
      "putTotes": this.companyObj.putTotes,
      "autoPrintTote": this.companyObj.autoPrintTote,
      "batchPut": this.companyObj.batchPut,
      "batchHotPut": this.companyObj.batchHotPut,
      "carManifest": this.companyObj.carManifest,
      "offCarManifest": this.companyObj.offCarManifest,
      "autoToteManifest": this.companyObj.autoToteManifest,
    }
    this.saveForm(payload);
  }

  async saveForm(paylaod) {
    this.iAdminApiService.ToteManagementUpdate(paylaod).subscribe((res: any) => {
    })
  }
}
