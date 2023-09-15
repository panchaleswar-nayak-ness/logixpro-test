import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/init/auth.service';
import { SharedService } from '../../../app/services/shared.service';
import { mergeMap, map } from 'rxjs/operators';
import { forkJoin, of, Subscription } from 'rxjs';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  tab_hover_color: string = '#cf9bff3d';
  licenseApp: any = [];
  index = 0;
  menuData: any = [];
  appNames: any = [];
  applicationData: any = [];
  userData: any;
  isDefaultAppVerify: any;
  private subscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    private Api: ApiFuntions,
    private authService: AuthService
  ) {}

  
  ngOnInit(): void {


    this.userData = this.authService.userData();
    if(localStorage.getItem('isAppVerified') ){
      this.isDefaultAppVerify =  JSON.parse(localStorage.getItem('isAppVerified') || '');
    }else{
      this.isDefaultAppVerify={appName: "",isVerified:true}
    }
    

  }


  ngAfterViewInit() {
    this.getAppLicense();
  }

  getAppLicense() {
    // moved the logic to login component and added these 2 lines to fetch the apps from localstorage and commented the api below in getAppLicence  ..
    // this.applicationData=JSON.parse(localStorage.getItem('availableApps') || '');
    // this.sharedService.setMenuData(this.applicationData)

    let payload = {
      workstationid: this.userData.wsid,
    };
    this.Api.AppNameByWorkstation(payload).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.convertToObj(res.data);
          localStorage.setItem(
            'availableApps',
            JSON.stringify(this.applicationData)
          );
          this.sharedService.setMenuData(this.applicationData);
        }
      },
      (error) => {}
    );
  }

  convertToObj(data) {
    data.wsAllAppPermission.forEach((item, i) => {
      for (const key of Object.keys(data.appLicenses)) {
        // arrayOfObjects.push({ key, value: this.licAppData[key] });
        if (item.includes(key) && data.appLicenses[key].isLicenseValid) {
          this.applicationData.push({
            appname: data.appLicenses[key].info.name,
            displayname: data.appLicenses[key].info.displayName,
            license: data.appLicenses[key].info.licenseString,
            numlicense: data.appLicenses[key].numLicenses,
            info: this.appNameDictionary(item),
            // status: data[key].isLicenseValid ? 'Valid' : 'Invalid',
            appurl: data.appLicenses[key].info.url,
            isButtonDisable: true,
          });
        }
      }
    });
    this.sortAppsData();
  }
  // OLD-----
  // async getAppLicense() {
  //   // get can access

  //   this.globalService.get(null, '/GlobalConfig/AppLicense').subscribe(
  //     (res: any) => {
  //       if (res && res.data) {
  //         this.appNames=Object.keys(res.data)
  //         this.convertToObj(res.data);
  //         // this.sharedService.setMenuData(this.appNames)

  //       }
  //     },
  //     (error) => {}
  //   );
  // }
  // async convertToObj(data) {

  //   for await (const key of Object.keys(data)) {

  //     if (data[key].isLicenseValid) {
  //       let payload = {
  //         AppName: data[key].info.name,
  //         wsid: this.userData.wsid,
  //       };
  //       this.globalService.get(payload, '/Common/WSAppPermission').subscribe(
  //         (res: any) => {
  //           if (res && res.data) {
  //            this.index++;
  //             this.applicationData.push({
  //               appName: res.data.appName,
  //               wsid: res.data.wsid,
  //               displayName:data[key].info.displayName,
  //               info: this.appNameDictionary(res.data.appName),
  //             });

  //           }
  //           this.sortAppsData();
  //         },
  //         (error) => {}
  //       );
  //     }

  //   }

  //           this.sharedService.setMenuData(this.applicationData)

  // }

  appNameDictionary(appName) {
    let routes = [
      {
        appName: 'ICSAdmin',
        route: '/admin',
        iconName: 'manage_accounts',
        name: 'Admin',
        updateMenu: 'admin',
        permission: 'Admin Menu',
      },
      {
        appName: 'Consolidation Manager',
        route: '/ConsolidationManager',
        iconName: 'insert_chart',
        name: 'Consolidation Manager',
        updateMenu: 'consolidation',
        permission: 'Consolidation Manager',
      },
      {
        appName: 'Induction',
        route: '/InductionManager',
        iconName: 'checklist',
        name: 'Induction Manager',
        updateMenu: 'induction',
        permission: 'Induction Manager',
      },
      {
        appName: 'FlowRackReplenish',
        route: '/FlowrackReplenishment',
        iconName: 'schema',
        name: 'FlowRack Replenishment',
        updateMenu: 'FlowReplenishment',
        permission: 'FlowRack Replenish',
      },
      {
        appName: 'ImportExport',
        route: '/ImportExport',
        iconName: 'electric_bolt',
        name: 'Import Export',
        updateMenu: '',
        permission: 'Import Export',
      },
      {
        appName: 'Markout',
        route: '#',
        iconName: 'manage_accounts',
        name: 'Markout',
        updateMenu: '',
        permission: 'Markout',
      },
      {
        appName: 'OrderManager',
        route: '/OrderManager',
        iconName: 'pending_actions',
        name: 'Order Manager',
        updateMenu: 'orderManager',
        permission: 'Order Manager',
      },
      {
        appName: 'WorkManager',
        route: '#',
        iconName: 'fact_check',
        name: 'Work Manager',
        updateMenu: '',
        permission: 'Work Manager',
      },
    ];

    let obj: any = routes.find((o) => o.appName === appName);
    return obj;
  }

  sortAppsData() {
    this.applicationData.sort(function (a, b) {
      var nameA = a.info.name.toLowerCase(),
        nameB = b.info.name.toLowerCase();
      if (nameA < nameB)
        //sort string ascending
        return -1;
      if (nameA > nameB) return 1;
      return 0; //default return value (no sorting)
    });
  }
  updateMenu(menu = '', obj: any = null) {
   
    if (menu != '') {
      this.sharedService.updateLoggedInUser(
        this.userData.userName,
        this.userData.wsid,
        menu
      );
    }

    if (menu == 'admin') {
      this.sharedService.updateAdminMenu();
    } else if (menu == 'induction') {
      this.sharedService.BroadCastMenuUpdate(obj.route);
      // this.sharedService.updateInductionAdminMenu(menu)
    } else if (menu == 'orderManager') {
      this.sharedService.BroadCastMenuUpdate(obj.route);
      // this.sharedService.updateInductionAdminMenu(menu)
    } else if (menu == 'consolidation') {
      this.sharedService.BroadCastMenuUpdate(obj.route);
      // this.sharedService.updateInductionAdminMenu(menu)
    } else if (menu === 'FlowReplenishment') {
      this.sharedService.updateFlowrackMenu(menu);
    }
    this.sharedService.updateSidebar();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  isAuthorized(controlName: any) {
    return !this.authService.isAuthorized(controlName);
  }
}
