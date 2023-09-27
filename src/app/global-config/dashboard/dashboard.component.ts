import { Component, OnInit } from '@angular/core';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { SharedService } from 'src/app/services/shared.service'; 

@Component({
  selector: 'app-global-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
})
export class GlobalDashboardComponent implements OnInit {
  licAppNames: any = [];
  sideBarOpen: boolean = true;
  constructor(
    private Api:ApiFuntions,
    private sharedService: SharedService
  ) {}

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

    this.Api.AppLicense().subscribe(
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
