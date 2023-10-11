import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { IFlowRackReplenishApi } from 'src/app/services/flowrackreplenish-api/flowrackreplenish-api-interface';
import { FlowRackReplenishApiService } from 'src/app/services/flowrackreplenish-api/flowrackreplenish-api.service';

@Component({
  selector: 'app-fr-preferences',
  templateUrl: './fr-preferences.component.html',
  styleUrls: ['./fr-preferences.component.scss'],
})
export class FrPreferencesComponent implements OnInit {
  public cartonFlowList: any;
  public userData: any;
  selectedCarton:any;
  public iAdminApiService: IAdminApiService;
  public iFlowRackReplenishApi : IFlowRackReplenishApi;
  constructor(private Api: ApiFuntions,private adminApiService: AdminApiService,  private authservice: AuthService,public flowRackReplenishApi : FlowRackReplenishApiService) {
    this.iAdminApiService = adminApiService;
    this.iFlowRackReplenishApi = flowRackReplenishApi;
  }

  ngOnInit(): void {
    this.userData = this.authservice.userData()
    this.cartonFlow()
    this.getCartonFlowList();
  }

  cartonFlow() {
    // let payload = {
    //   "WSID": this.userData.wsid,
    // }
    this.iFlowRackReplenishApi.wslocation({}).subscribe((res) => {
      // console.log(res)
      this.selectedCarton=res.data
    })
  }
  updatePref(item) {
    this.selectedCarton=item.value
    let payload = {
      cartonFlowID: item.value,
      podID: '',
      scanPicks: true,
      scanCounts: true,
      scanPuts: true,
      printRepLocation: '',
      printLabelLocation: '',
      quickPick: true,
      defQuickPick: true,
    };

    this.iAdminApiService.UpdateCartonFlow(payload).subscribe((res) => {
      this.cartonFlowList = [...res.data];
    });
  }
  getCartonFlowList() {
    this.iAdminApiService.GetCartonFlow({}).subscribe((res) => {
      this.cartonFlowList = [...res.data];
    });
  }
}
