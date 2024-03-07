import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/init/auth.service';
import { SharedService } from '../../common/services/shared.service';
import { Subscription } from 'rxjs';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { IGlobalConfigApi } from 'src/app/common/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/common/services/globalConfig-api/global-config-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { RouteUpdateMenu, ToasterTitle, ToasterType ,AppNames,AppPermissions} from 'src/app/common/constants/strings.constants';

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

  public  iGlobalConfigApi: IGlobalConfigApi;

  constructor(
    private sharedService: SharedService,
    private global: GlobalService,
    public globalConfigApi: GlobalConfigApiService,
    private authService: AuthService,
    private currentTabDataService: CurrentTabDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.iGlobalConfigApi = globalConfigApi;
    window.addEventListener('beforeunload', () => this.currentTabDataService.RemoveTabOnRoute(this.router.url));
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    if(localStorage.getItem('isAppVerified')) this.isDefaultAppVerify = JSON.parse(localStorage.getItem('isAppVerified') ?? '');
    else this.isDefaultAppVerify = {appName: "", isVerified: true}
    this.route.queryParams.subscribe(params => {
      const error = params[ToasterType.Error];
      if (error === "multipletab") this.global.ShowToastr(ToasterType.Error, "Same Tab cannot be opened twice!", ToasterTitle.Error);
  });
  }

  ngAfterViewInit() {
    this.getAppLicense();
  }

  getAppLicense() {
    // moved the logic to login component and added these 2 lines to fetch the apps from localstorage and commented the api below in getAppLicence  ..
    // this.applicationData=JSON.parse(localStorage.getItem('availableApps') || '');
    // this.sharedService.setMenuData(this.applicationData)

    let payload = { workstationid: this.userData.wsid };
    this.iGlobalConfigApi.AppNameByWorkstation(payload).subscribe(
      (res: any) => {
        if (res?.data) {
          // temp BulkProcess
          res.data.wsAllAppPermission.push("BulkTransactions");
          res.data.appLicenses.BulkTransactions = JSON.parse(JSON.stringify(res.data.appLicenses.FlowRackReplenish));
          res.data.appLicenses.BulkTransactions.info.displayName = "BulkTransactions";
          res.data.appLicenses.BulkTransactions.info.name = "BulkTransactions";
          res.data.appLicenses.BulkTransactions.info.url = "BulkTransactions";
          // temp BulkProcess
          
          this.convertToObj(res.data);
          localStorage.setItem('availableApps', JSON.stringify(this.applicationData));
          this.sharedService.setMenuData(this.applicationData);
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("AppNameByWorkstation", res.responseMessage);
        }
      },
      (error) => {}
    );
  }

  convertToObj(data) {
    data.wsAllAppPermission.forEach((item, i) => {
      for (const key of Object.keys(data.appLicenses)) {
        if (item.includes(key) && data.appLicenses[key].isLicenseValid) {
          this.applicationData.push({
            appname: data.appLicenses[key].info.name,
            displayname: data.appLicenses[key].info.displayName,
            license: data.appLicenses[key].info.licenseString,
            numlicense: data.appLicenses[key].numLicenses,
            info: this.appNameDictionary(item),
            appurl: data.appLicenses[key].info.url,
            isButtonDisable: true,
          });
        }
      }
    });
    this.sortAppsData();
  }

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
        appName: AppPermissions.ConsolidationManager,
        route: '/ConsolidationManager',
        iconName: 'insert_chart',
        name: AppPermissions.ConsolidationManager,
        updateMenu: 'consolidation',
        permission: AppPermissions.ConsolidationManager,
      },
      {
        appName: 'Induction',
        route: '/InductionManager',
        iconName: 'checklist',
        name: AppPermissions.InductionManager,
        updateMenu: 'induction',
        permission: AppPermissions.InductionManager,
      },
      {
        appName: 'FlowRackReplenish',
        route: '/FlowrackReplenish',
        iconName: 'schema',
        name: 'FlowRack Replenishment',
        updateMenu: 'FlowReplenishment',
        permission: 'FlowRack Replenish',
      },
      {
        appName: 'BulkTransactions',
        route: '/BulkTransactions',
        iconName: 'process_chart',
        name: 'BulkTransactions',
        updateMenu: 'BulkTransactions',
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
        appName: AppNames.OrderManager,
        route: '/OrderManager',
        iconName: 'pending_actions',
        name: AppPermissions.OrderManager,
        updateMenu: 'orderManager',
        permission: AppPermissions.OrderManager,
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
      let nameA = a.info.name.toLowerCase(), nameB = b.info.name.toLowerCase();
      if (nameA < nameB) return -1; //sort string ascending
      if (nameA > nameB) return 1;
      return 0; //default return value (no sorting)
    });
  }

  updateMenu(menu = '', obj: any = null) {
    debugger
    if (menu != '') this.sharedService.updateLoggedInUser(this.userData.userName, this.userData.wsid, menu);

    if (menu == RouteUpdateMenu.Admin) this.sharedService.updateAdminMenu();
    else if (menu == RouteUpdateMenu.Induction) this.sharedService.BroadCastMenuUpdate(obj.route);
    else if (menu == RouteUpdateMenu.OrderManager) this.sharedService.BroadCastMenuUpdate(obj.route);
    else if (menu == RouteUpdateMenu.Consolidation) this.sharedService.BroadCastMenuUpdate(obj.route);
    else if (menu === RouteUpdateMenu.FlowReplenishment) this.sharedService.updateFlowrackMenu(menu);
    else if (menu === RouteUpdateMenu.BulkTransactions)this.sharedService.BroadCastMenuUpdate(obj.route);

    this.sharedService.updateSidebar();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isAuthorized(controlName: any) {
    return !this.authService.isAuthorized(controlName);
  }
}
