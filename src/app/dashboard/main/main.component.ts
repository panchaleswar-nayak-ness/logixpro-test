import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/init/auth.service';
import { SharedService } from '../../common/services/shared.service';
import { Subscription } from 'rxjs';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';
import { Router, ActivatedRoute } from '@angular/router';
import { IGlobalConfigApi } from 'src/app/common/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/common/services/globalConfig-api/global-config-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { RouteName, RouteNames, RouteMenu, RouteUpdateMenu, AppPermission, AppName, AppNames ,AppPermissions } from 'src/app/common/constants/menu.constants';
import { ApiResponse } from 'src/app/common/types/CommonTypes'; 

export interface AppInfo {
  appName: string;
  route: string;
  iconName: string;
  name: string;
  updateMenu: string;
  permission: string;
}

export interface App {
  appname?: string;
  displayname?: string;
  license?: string;
  numlicense: number;
  info: AppInfo;
  appurl?: string;
  isButtonDisable: boolean;
}


export interface AppData {
  name?: string;
  licenseString?: string;
  url?: string;
  displayName?: string;
}


export interface AppLicense {
  isLicenseValid: boolean;
  numLicenses: number;
  info: AppData;
}

export interface AppNameByWorkstationResponse {
  appLicenses: { [key: string]: AppLicense } | null;
  wsAllAppPermission: string[] | null;
}


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
  applicationData: App[] = [];
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

    let payload = { workstationid: this.userData.wsid };
    this.iGlobalConfigApi.AppNameByWorkstation(payload).subscribe(
      (res: ApiResponse<AppNameByWorkstationResponse>) => {
        if (res?.data) {
          this.setApplicationData(res.data);
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

  setApplicationData(data: AppNameByWorkstationResponse) {
    data.wsAllAppPermission?.forEach((item, i) => {
      let licences: { [key: string]: AppLicense;} | null = data.appLicenses;
      for (const key in licences) {
        if (item.includes(key) && licences[key].isLicenseValid) {
          this.applicationData.push({
            appname: licences[key].info.name,
            displayname: licences[key].info.displayName,
            license: licences[key].info.licenseString,
            numlicense: licences[key].numLicenses,
            info: this.appNameDictionary(item)!,
            appurl: licences[key].info.url,
            isButtonDisable: true,
          });
        }
      }
    });
    this.sortAppsData();
    
  }

  appNameDictionary(appName) {
    let routes:{
      appName: AppName;
      route: string;
      iconName: string;
      name: RouteName;
      updateMenu: RouteMenu;
      permission: AppPermission;
  }[] = [
      {
        appName: AppNames.ICSAdmin,
        route: '/admin',
        iconName: 'manage_accounts',
        name: RouteNames.Admin,
        updateMenu: RouteUpdateMenu.Admin,
        permission: AppPermissions.AdminMenu
      },
      {
        appName: AppNames.ConsolidationManager,
        route: '/ConsolidationManager',
        iconName: 'insert_chart',
        name: RouteNames.ConsolidationManager,
        updateMenu: RouteUpdateMenu.Consolidation,
        permission: AppPermissions.ConsolidationManager,
      },
      {
        appName: AppNames.Induction,
        route: '/InductionManager',
        iconName: 'checklist',
        name: RouteNames.InductionManager,
        updateMenu: RouteUpdateMenu.Induction,
        permission: AppPermissions.InductionManager,
      },
      {
        appName: AppNames.FlowRackReplenish,
        route: '/FlowrackReplenish',
        iconName: 'schema',
        name: RouteNames.FlowRackReplenishment,
        updateMenu: RouteUpdateMenu.FlowReplenishment,
        permission: AppPermissions.FlowRackReplenish
      },
      {
        appName: AppNames.BulkTransactions,
        route: '/BulkTransactions',
        iconName: 'process_chart',
        name: RouteNames.BulkTransactions,
        updateMenu: RouteUpdateMenu.BulkTransactions,
        permission: AppPermissions.BulkTransactions
      },
      {
        appName: AppNames.ImportExport,
        route: '/ImportExport',
        iconName: 'electric_bolt',
        name: RouteNames.ImportExport,
        updateMenu: RouteUpdateMenu.Empty,
        permission: AppPermissions.ImportExport
      },
      // {
      //   appName: AppNames.MarkoutProcess,
      //   route: '/MarkoutProcess',
      //   iconName: 'manage_accounts',
      //   name: RouteNames.MarkoutProcess,
      //   updateMenu: RouteUpdateMenu.MarkoutProcess,
      //   permission: AppPermissions.MarkoutProcess,
      // },
      {
        appName: AppNames.OrderManager,
        route: '/OrderManager',
        iconName: 'pending_actions',
        name: RouteNames.OrderManager,
        updateMenu: RouteUpdateMenu.OrderManager,
        permission: AppPermissions.OrderManager,
      },
      {
        appName: AppNames.WorkManager,
        route: '#',
        iconName: 'fact_check',
        name: RouteNames.WorkManager,
        updateMenu: RouteUpdateMenu.Empty,
        permission: AppPermissions.WorkManager
      },
    ];

    let obj = routes.find((o) => o.appName === appName);
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

  updateMenu(app: AppInfo) {
    if (app.updateMenu != '') this.sharedService.updateLoggedInUser(this.userData.userName, this.userData.wsid, app.updateMenu);

    if (app.updateMenu == RouteUpdateMenu.Admin) this.sharedService.updateAdminMenu();
    else if (app.updateMenu == RouteUpdateMenu.Induction) this.sharedService.BroadCastMenuUpdate(app.route);
    else if (app.updateMenu == RouteUpdateMenu.OrderManager) this.sharedService.BroadCastMenuUpdate(app.route);
    else if (app.updateMenu == RouteUpdateMenu.Consolidation) this.sharedService.BroadCastMenuUpdate(app.route);
    else if (app.updateMenu === RouteUpdateMenu.FlowReplenishment) this.sharedService.updateFlowrackMenu(app.updateMenu);
    // else if (app.updateMenu === RouteUpdateMenu.MarkoutProcess) this.sharedService.updateMarkoutMenu(app.updateMenu);
    else if (app.updateMenu === RouteUpdateMenu.BulkTransactions)this.sharedService.BroadCastMenuUpdate(app.route);

    this.sharedService.updateSidebar();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isAuthorized(controlName: any) {
    return !this.authService.isAuthorized(controlName);
  }
}
