import { Component, ElementRef,  TemplateRef,  ViewChild } from '@angular/core';
import { ILogin} from './Ilogin'; 
import { FormControl} from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SpinnerService } from '../common/init/spinner.service';
import { AuthService } from '../common/init/auth.service'; 
import packJSON from '../../../package.json'
import { SharedService } from '../common/services/shared.service';
import { IGlobalConfigApi } from 'src/app/common/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/common/services/globalConfig-api/global-config-api.service';
import { IUserAPIService } from '../common/services/user-api/user-api-interface';
import { UserApiService } from '../common/services/user-api/user-api.service';
import { GlobalService } from '../common/services/global.service';
import { ToasterTitle,ToasterType,DialogConstants} from 'src/app/common/constants/strings.constants';
import { AppName, AppNames, AppPermissions, AppRoutes, RouteName, RouteNames, RouteMenu, RouteUpdateMenu, AppPermission } from 'src/app/common/constants/menu.constants';
import { MatDialog } from '@angular/material/dialog';
import { WorkstationLoginComponent } from '../dialogs/workstation-login/workstation-login.component';
import { BaseService } from 'src/app/common/services/base-service.service';
import { ValidWorkstation, ApiResponse } from 'src/app/common/types/CommonTypes';
import { LinkedResource } from 'src/app/common/services/base-service.service';
import { AppInfo, App, AppData, AppLicense, AppNameByWorkstationResponse } from 'src/app/dashboard/main/main.component';
import { LocalStorageService } from 'src/app/common/services/LocalStorage.service';
import { filter } from 'rxjs';
type Version = {version: string};

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  apiVersion: string;
  login: ILogin;
  @ViewChild('passwordInput') passwordInput: ElementRef;
  returnUrl: string;
  public env;
  public toggle_password = true;
  url = '';
  isReadOnly: boolean = true;
  version : string;
  applicationData: App[] = [];
  isAppAccess=false;
  info:any=  {};
  @ViewChild('workstationSelect') workstationSelectTemplate: TemplateRef<any>;

  public iGlobalConfigApi: IGlobalConfigApi;
  public iUserApi : IUserAPIService;
  workstationD=false;

  constructor(
    public userApi : UserApiService,
    private router: Router,
    private global:GlobalService,
    public loader: SpinnerService,
    public globalConfigApi: GlobalConfigApiService,
    private auth: AuthService, 
    private sharedService: SharedService,
    public dialog: MatDialog,
    private apiBase: BaseService,
    private localstorageService:LocalStorageService
  ) { 
    this.iGlobalConfigApi = globalConfigApi;
    this.iUserApi = userApi;
    this.apiBase.GetApiEndpoint("version").subscribe((endpoint: string) => {
      this.apiBase.Get<Version>(endpoint).subscribe((res: Version) => {
        this.apiVersion = res.version;
      });
    });
    this.url = this.router.url;
    this.configureWorkstation();
  }

  

  configureWorkstation(){
    let wsName = this.global.getCookie("WSName");
    if(wsName){
      this.apiBase.GetApiEndpoint("validworkstations").subscribe((endpoint: string) => {
        this.apiBase.Get<[LinkedResource<ValidWorkstation>]>(endpoint).subscribe((res: [LinkedResource<ValidWorkstation>]) => {
          // see if the wsName is in the list of valid workstations
          let workstationResource = res.find((w) => w.resource.pcName === wsName);
          // follow the cookie link if it is
          if (workstationResource) {
            let links = workstationResource._links;
            let cookieLink = links.find((l) => l.rel === "cookie");
            if (cookieLink) {
              this.apiBase.Get<string>(cookieLink.href).subscribe((cookie: string) => {
                // if we got a cookie, we're good to go
                this.workstationD = true;
              },
              (error) => {
                this.global.deleteAllCookies();
                this.openWS();
              });
            }
          }
          else {
            this.global.deleteAllCookies();
            this.openWS();
          }
        });
      });
    }
    else{
      this.global.deleteAllCookies();
      this.openWS();
    }
  }
  
  openWS(){
    const dialogRef = this.dialog.open(WorkstationLoginComponent,{
    width: '550px',
    autoFocus: DialogConstants.autoFocus,
    disableClose: true,
  })
  dialogRef.afterClosed().subscribe((res:string) => {
    if(res)
    {
      this.global.setCookie("WSName", res, 525600);
      this.workstationD = true;
    }
  });
  }

  removeReadOnly(){  
    this.isReadOnly = !this.isReadOnly;
  }

  addLoginForm:any = {};

  enterUserName(){
    this.passwordInput.nativeElement.focus();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isSpace = (control.value || '').match(/\s/g);
    return isSpace ? { 'whitespace': true } : null;
  }
 
  loginUser() {
    this.loader.show();
    this.cleanLoginForm();
  
    this.iUserApi.login(this.login).subscribe((response: ApiResponse<any>) => {
      const { isExecuted, data } = response;
      const validity = data?.passwordValidity?.item1;
      const errorMessage = data?.passwordValidity?.item2;
      if (!isExecuted) {
        return this.handleLoginFailure(response.responseMessage);
      } else {
        if ([400, 500].includes(validity)) {
          return this.handleLoginFailure(errorMessage);
        }
      }
      switch (validity) {
        case 100:
          return this.handleLoginSuccess(response, errorMessage?.toString());
        case 200:
        case 0:
          return this.handleLoginSuccess(response);
        case 300:
          return this.global.ShowToastr(ToasterType.Error, errorMessage?.toString(), ToasterTitle.Error);
        default:
          return this.handleLoginFailure(errorMessage);
      }
    });
  }
  
  cleanLoginForm() {
    this.addLoginForm.username = this.addLoginForm.username?.replace(/\s/g, "") || null;
    this.addLoginForm.password = this.addLoginForm.password?.replace(/\s/g, "") || null;
    this.login = this.addLoginForm;
  }
  
  handleLoginSuccess(response: ApiResponse<any>, errorMessage: string = "") {
    this.setLoginDatainLocalStorage(response,errorMessage);
    this.getAppLicense(response.data.wsid);
  
      const lastRoute = localStorage.getItem('LastRoute');
      const url = lastRoute ? `/#${lastRoute}` : "/#/dashboard";
      window.location.href = url;
      window.location.reload();
  }
  
  handleLoginFailure(message: string) {
    this.global.ShowToastr(ToasterType.Error, message?.toString(), ToasterTitle.Error);
    console.log("login", message);
  }
  
 setLoginDatainLocalStorage(response: any, errorMessage: string = ""){
  let data = {
    '_token': response.data.token,
    'userName': response.data.userName,
    'accessLevel': response.data.accessLevel,
    'wsid': response.data.wsid,
    'loginTime': response.data.loginTime,
    'alertmsg': errorMessage
  }
  let userRights = response.data.userRights;
  userRights = this.addCustomPermission(userRights);
  localStorage.setItem('user', JSON.stringify(data));
  localStorage.setItem('userRights', JSON.stringify(userRights));

 }
  CompanyInfo(){
    this.iUserApi.CompanyInfo().subscribe((response: any) => {
      if (response.isExecuted && response.data) {
        this.info = response.data;
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.error('Error: CompanyInfo request failed');
      }
    });
  }

  ngOnInit() {
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(event => {
      const navEndEvent = event as NavigationEnd;
      if (navEndEvent.urlAfterRedirects === '/login') {
        this.configureWorkstation();
      }
    });
    this.version = packJSON.version;
    let lastRoute: any = localStorage.getItem('LastRoute') ? localStorage.getItem('LastRoute') : "";
    //localStorage.clear();
    this.localstorageService.clearLocalStorage();
    if(lastRoute != "" && lastRoute != "login"){
      localStorage.setItem('LastRoute', lastRoute);
    }
    if(this.auth.IsloggedIn()){
      this.router.navigate([AppRoutes.Dashboard]);
    }
    else{
      this.iUserApi.getSecurityEnvironment().subscribe((res:ApiResponse<any>) => {
        if(res?.isExecuted)
        {
          this.env = res.data.securityEnvironment;
        if(this.env){
          const { workStation } = res.data;
          localStorage.setItem('env', JSON.stringify(this.env));
          localStorage.setItem('workStation', JSON.stringify(workStation));
        }
        else{
          this.global.ShowToastr(ToasterType.Error,'Please contact your administrator', 'Workstation is not set!');
          
        }
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("getSecurityEnvironment",res.responseMessage);
        }
        
      });
    }
   this.CompanyInfo();
  }

  getAppLicense(wsid) {
    let userData=JSON.parse(localStorage.getItem('user')?? '{}');
    let payload = {
      workstationid: userData.wsid,
    };
    this.iGlobalConfigApi.AppNameByWorkstation(payload)
      .subscribe(
        (res: ApiResponse<AppNameByWorkstationResponse>) => {
          if (res?.data) {

            this.setApplicationData(res.data);
            localStorage.setItem('availableApps',JSON.stringify(this.applicationData))
            this.sharedService.setMenuData(this.applicationData)
            this.getDefaultApp(wsid);
          }
          else {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.log("AppNameByWorkstation",res.responseMessage);

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

  sortAppsData() {
    this.applicationData.sort(function (a, b) {
      let nameA = a.info?.name?.toLowerCase(),
        nameB = b.info?.name?.toLowerCase();
      if (nameA < nameB)
        //sort string ascending
        return -1;
      if (nameA > nameB) return 1;
      return 0; //default return value (no sorting)
    });
  }

  appNameDictionary(appName) {
    let routes: {
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
        permission: AppPermissions.AdminMenu,
      },
      {
        appName: AppNames.FlowRackReplenish,
        route: '/FlowrackReplenish',
        iconName: 'schema',
        name: 'FlowRack Replenishment',
        updateMenu: '',
        permission: 'FlowRack Replenish',
      },
      {
        appName: AppNames.ConsolidationManager,
        route: '/ConsolidationManager',
        iconName: 'insert_chart',
        name: RouteNames.ConsolidationManager,
        updateMenu: RouteUpdateMenu.Empty,
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
        appName: AppNames.ImportExport,
        route: '/ImportExport',
        iconName: 'electric_bolt',
        name: RouteNames.ImportExport,
        updateMenu: RouteUpdateMenu.Empty,
        permission: AppPermissions.ImportExport,
      },
      {
        appName: AppNames.MarkoutProcess,
        route: '#',
        iconName: 'manage_accounts',
        name: RouteNames.MarkoutProcess,
        updateMenu: RouteUpdateMenu.Empty,
        permission: AppPermissions.MarkoutProcess,
      },
      {
        appName: AppNames.OrderManager,
        route: '/OrderManager',
        iconName: 'pending_actions',
        name: RouteNames.OrderManager,
        updateMenu: RouteUpdateMenu.Empty,
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
      {
        appName: AppNames.BulkTransactions,
        route: '/BulkTransactions',
        iconName: 'process_chart',
        name: RouteNames.BulkTransactions,
        updateMenu: RouteUpdateMenu.BulkTransactions,
        permission: AppPermissions.BulkTransactions
      }
    ];

    let obj = routes.find((o) => o.appName === appName);
    return obj;
  }

  getDefaultApp(wsid){
    let paylaod={
      workstationid: wsid
    }
     this.iGlobalConfigApi.workstationdefaultapp(paylaod).subscribe(
  (res: any) => {
    if(res)
    {
      if (res.data) {
        this.checkAppAcess(res.data)
   
        }
       else{
         localStorage.setItem('isAppVerified',JSON.stringify({appName:'',isVerified:true}))
         if(localStorage.getItem('LastRoute')){
           localStorage.removeItem('LastRoute');
         }
         else{
           this.router.navigate([AppRoutes.Dashboard]);
         }	
       }
    }
    else {
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      console.log("workstationdefaultapp",res.responseMessage);
    }
  
   
  },
  (error) => {}
);

  }

  checkAppAcess(appName){
    this.applicationData.find(el=>{
      if(el.appname===appName || this.isAppAccess){
        this.isAppAccess=true
      }else{
        this.isAppAccess=false;
      }

   
    })
       
    if(this.isAppAccess){
      localStorage.setItem('isAppVerified',JSON.stringify({appName:appName,isVerified:true}))
      let lastRoute = localStorage.getItem('LastRoute')
      console.log(lastRoute)
      lastRoute?this.router.navigate([lastRoute]):this.redirection(appName)      
      
    }else{
    localStorage.setItem('isAppVerified',JSON.stringify({appName:appName,isVerified:false}))
      this.router.navigate([AppRoutes.Dashboard]);
    }
  }

  redirection(appName){

    switch (appName) {
      case AppPermissions.ConsolidationManager:
        this.router.navigate(['/#']);
        break;
      case 'FlowRackReplenish':
        this.router.navigate(['/FlowrackReplenish']);
        break;
        case 'ICSAdmin':
        this.router.navigate(['/admin']);
        break;
        case 'ImportExport':
        this.router.navigate(['/#']);
        break;
        case 'Induction':
          this.router.navigate(['/InductionManager']);
          break;
        case 'MarkoutProcess':
          this.router.navigate(['/#']);
            break;
         case AppNames.OrderManager:
          this.router.navigate(['/#']);
            break;
             case 'WorkManager':
          this.router.navigate(['/#']);
            break;
         
      default:
        this.router.navigate([AppRoutes.Dashboard]);
        break;
    }
  }

  changePass() {
    let dialogRef:any = this.global.OpenDialog(ChangePasswordComponent, {
      height: 'auto',
      width: '500px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe(result => {
      ;

    });
  }

  private addCustomPermission(userRights: any) {
    let customPerm = [
      AppPermissions.ImportExport,
      AppPermissions.InductionManager,
      AppPermissions.WorkManager,
      AppPermissions.ConsolidationManager,
      AppPermissions.OrderManager,
      AppPermissions.AdminMenu,
      AppPermissions.BulkTransactions,
      AppPermissions.FlowRackReplenish,
      AppPermissions.MarkoutProcess,
      AppPermissions.Dashboard,
      AppPermissions.Home
    ];
    localStorage.setItem('customPerm', JSON.stringify(customPerm));
    return [...userRights, ...customPerm];
  }
}
