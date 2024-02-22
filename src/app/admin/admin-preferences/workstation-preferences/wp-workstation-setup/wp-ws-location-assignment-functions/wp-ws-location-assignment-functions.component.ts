import { Component, OnInit } from '@angular/core';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-wp-ws-location-assignment-functions',
  templateUrl: './wp-ws-location-assignment-functions.component.html',
  styleUrls: ['./wp-ws-location-assignment-functions.component.scss']
})
export class WpWsLocationAssignmentFunctionsComponent implements OnInit {
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
        this.companyObj.locAssPickSort = res.data.pfSettingsIII.filter((x: any) => x.pfName == "LocAss Pick Sort")[0].pfSetting;
        this.companyObj.showTransQtyBulk = res.data.pfSettingsIII.filter((x: any) => x.pfName == "Show Trans Qty Bulk")[0].pfSetting;
        this.companyObj.autoCompBackOrders = res.data.pfSettingsIII.filter((x: any) => x.pfName == "Auto Complete Backorders")[0].pfSetting == "0" ? false : true;
        this.companyObj.printPickLab = res.data.printPickLabel;
        this.companyObj.locAssOrderSel = res.data.locAssOrderSelection;
        this.companyObj.printReprocRep = res.data.printReprocessReport;
        this.companyObj.sapLocChange = res.data.pfSettingsIII.filter((x: any) => x.pfName == "SAP Location Change")[0].pfSetting == "0" ? false : true;
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("AdminCompanyInfo", res.responseMessage);
      }
    })
  }

  payload() {
    const payload: any = {
      "locAssOrderSel": this.companyObj.locAssOrderSel,
      "printReprocRep": this.companyObj.printReprocRep ,
      "printPickLab": this.companyObj.printPickLab,
      "printPickLabBatch": true,
      "locAssPickSort": this.companyObj.locAssPickSort,
      "showTransQtyBulk": this.companyObj.showTransQtyBulk,
      "autoCompBackOrders": this.companyObj.autoCompBackOrders,
      "sapLocChange": this.companyObj.sapLocChange
    }
    this.saveForm(payload);
  }

  async saveForm(paylaod) {
    this.iAdminApiService.LocationAssignmentFunctionsUpdate(paylaod).subscribe((res: any) => {
    })
  }

}
