import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-fr-preferences',
  templateUrl: './fr-preferences.component.html',
  styleUrls: ['./fr-preferences.component.scss'],
})
export class FrPreferencesComponent implements OnInit {
  public cartonFlowList: any;
  public userData: any;
  selectedCarton:any;
  constructor(private Api: ApiFuntions,  private authservice: AuthService) {}

  ngOnInit(): void {
    this.userData = this.authservice.userData()
    this.cartonFlow()
    this.getCartonFlowList();
  }

  cartonFlow() {
    // let payload = {
    //   "WSID": this.userData.wsid,
    // }
    this.Api.wslocation({}).subscribe((res) => {
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

    this.Api.UpdateCartonFlow(payload).subscribe((res) => {
      this.cartonFlowList = [...res.data];
    });
  }
  getCartonFlowList() {
    this.Api.GetCartonFlow().subscribe((res) => {
      this.cartonFlowList = [...res.data];
    });
  }
}
