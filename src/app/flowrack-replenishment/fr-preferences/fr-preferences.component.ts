import { Component, OnInit } from '@angular/core';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IFlowRackReplenishApi } from 'src/app/common/services/flowrackreplenish-api/flowrackreplenish-api-interface';
import { FlowRackReplenishApiService } from 'src/app/common/services/flowrackreplenish-api/flowrackreplenish-api.service';

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

  constructor(
    public adminApiService: AdminApiService, 
    private global : GlobalService,  
    private authService: AuthService,
    public flowRackReplenishApi : FlowRackReplenishApiService) {
    this.iAdminApiService = adminApiService;
    this.iFlowRackReplenishApi = flowRackReplenishApi;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData()
    this.cartonFlow()
    this.getCartonFlowList();
  }

  cartonFlow() {
    this.iFlowRackReplenishApi.wslocation({}).subscribe((res) => {
      if(res.isExecuted && res.data)
      {
        this.selectedCarton=res.data
      }
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
