import { Component, EventEmitter, Output } from '@angular/core';
import { SpinnerService } from '../../common/init/spinner.service'; 
import { Router,NavigationEnd  } from '@angular/router';
import { AuthService } from '../../common/init/auth.service';
import { SharedService } from 'src/app/common/services/shared.service'; 
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { DPrinterSetupComponent } from 'src/app/dialogs/d-printer-setup/d-printer-setup.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { StylesService } from 'src/app/common/services/styles.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { IGlobalConfigApi } from 'src/app/common/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/common/services/globalConfig-api/global-config-api.service';
import { IUserAPIService } from 'src/app/common/services/user-api/user-api-interface';
import { UserApiService } from 'src/app/common/services/user-api/user-api.service';
import {  ToasterTitle,ToasterType,DialogConstants} from 'src/app/common/constants/strings.constants';
import { AppNames, AppRoutes, } from 'src/app/common/constants/menu.constants';
import { LocalStorageService } from 'src/app/common/services/LocalStorage.service';

export interface ITheme {
  name : string
  value : number
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private breakpointSubscription: Subscription
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  loading:boolean = true;
  ConfigUserLogin:boolean = false;
  breadcrumbList: any = [];
  userData: any;
  configUser:any;
  isConfigUser
  statusTab;

  themes : ITheme[] = [
    { name : 'Standard', value : 0 },
    { name : 'High Contrast 1', value : 1 },
    { name : 'High Contrast 2', value : 2 },
    { name : 'High Contrast 3', value : 3 }
  ];

  themeRadio : number = 0;

  public iInductionManagerApi : IInductionManagerApiService;
  public iGlobalConfigApi: IGlobalConfigApi;
  public iUserApi : IUserAPIService;

  constructor(
	  public userApi : UserApiService,
    private router: Router,
    public inductionManagerApi: InductionManagerApiService,
    public spinnerService: SpinnerService, 
    private authService: AuthService,
    public globalConfigApi: GlobalConfigApiService,
    private sharedService: SharedService,
    private titleService: Title,
    private breakpointObserver: BreakpointObserver,
    private global:GlobalService,
    private stylesService: StylesService,
    private localstorageService:LocalStorageService
  ) {
    this.checkCurState(); 
    this.iGlobalConfigApi = globalConfigApi;
    let width = 0;
    this.iInductionManagerApi = inductionManagerApi;
    this.iUserApi = userApi;

    this.breakpointSubscription = this.breakpointObserver.observe([Breakpoints.Small,Breakpoints.Large]).subscribe((state: BreakpointState) => width = window.innerWidth);
      
    this.isConfigUser=  this.authService.isConfigUser()
      router.events.subscribe((val: any) => {
        if((this.router.url == "/BulkTransactions/BulkPick" || this.router.url == "/BulkTransactions/BulkPutAway" || this.router.url == "/BulkTransactions/BulkCount") && localStorage.getItem("verifyBulks") == "true"){
          return;
        }
        this.breadcrumbList = [];
        if(!this.global.changesConfirmation){
          if(!this.authService.isConfigUser()){
            this.breadcrumbList.push({
                name:'LogixPro',
                menu: '',
                value:AppRoutes.Dashboard
              })
            }
        }else{
            this.breadcrumbList.push({
                name:'LogixPro',
                menu: '',
                value:AppRoutes.Dashboard
              })
        
        }
    
        if(val instanceof NavigationEnd){
          let res = val.url.substring(1);
          if(!res.includes('report-view')||!res.includes('report')){
            localStorage.setItem('reportNav',val.url)
          }

          let withoutParam = res.split('?')[0]
          let splittedArray = withoutParam.split('/'); 
            if(splittedArray[0]==='FlowrackReplenishment'){
              splittedArray[0]='FlowrackReplenish'
            }
          
          
           
           
          splittedArray.forEach((element,i) => {
          if(element==='createCountBatches' || element==='cycleCounts'){
            element='CycleCount'
          }

         

          if(element==='Flowrack'){
            element='FlowrackReplenishment'
          }
          if(element==='ImToteManager' ){
            element='ToteManager'
          }
          if(element==='ccsif' ||element==='ste'  ){
            element=element.toLocaleUpperCase();
          }

          if(width<=768){
            if(element===AppNames.InductionManager){
              element='IM'
            }
            
          }
      
          
          this.titleService.setTitle(`LogixPro  ${element.toLowerCase() !='adminprefrences'? this.capitalizeFirstLetter(element).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2"):'Preferences'}`);
            
          this.breadcrumbList.push({
            name: element.toLowerCase() !='adminprefrences'? this.capitalizeFirstLetter(element).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2"):'Preferences',
            menu: element,
            value:'/'+element
          })
          if(element === 'transaction'){
            this.breadcrumbList.push({
              name:'Open Transaction',
              menu: element,
              value:'/'+element
            })
          }
        });
        this.updateBreadcrumbList();
        
        }   
      
    });
   }

   private updateBreadcrumbList() {
    this.breadcrumbList.forEach((breadcrumb: any) => {
      if (breadcrumb.name === 'Inventory Master') {
        breadcrumb.name = 'Inventory';
      }
    });
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  setImPreferences(){
    const imPreference = localStorage.getItem('InductionPreference');
    if (imPreference) {} 
    else {
      let paylaod = {};
      this.iInductionManagerApi.PickToteSetupIndex(paylaod).subscribe(res => {
      localStorage.setItem('InductionPreference', JSON.stringify(res.data.imPreference));
    });
    }

  }

  ngOnInit(): void {
   
    
    this.loading = false;
    this.userData = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.configUser = JSON.parse(localStorage.getItem('userConfig') ?? '{}');
    if(this.router.url.indexOf('globalconfig') > -1) this.ConfigUserLogin =  true;
    else {
      this.ConfigUserLogin =  false; 
      this.userData = this.authService.userData(); 
      if(this.userData.wsid) this.GetWorkStatPrinters();
      this.setImPreferences();
    }
    this.userData = this.authService.userData(); 
    this.checkCurState();
  }

  GetWorkStatPrinters(){
    this.iGlobalConfigApi.GetWorkStatPrinters().subscribe((res:any) => {
      localStorage.setItem("SelectedReportPrinter",res?.data?.reportPrinter);
      localStorage.setItem("SelectedLabelPrinter",res?.data?.labelPrinter);
    });
  }

  ngAfterViewInit() {
    
    this.sharedService.breadCrumObserver.subscribe((res: any) => { 
      this.statusTab = res.tab.textLabel;
      this.breadcrumbList[this.breadcrumbList.length-1].name = this.statusTab
    });
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  routeToLogin(){
    this.router.navigate(['/login']);
  }

  breadCrumbClick(menu,index:any = null) { 
    if(index != null) { 
      let Url = "";  
      for (let i = 0; i <= index; i++) {
        if(this.breadcrumbList[i].menu!='') Url += this.breadcrumbList[i].value; 
      }
      if((this.router.url == "/BulkTransactions/BulkPick" || this.router.url == "/BulkTransactions/BulkPutAway" || this.router.url == "/BulkTransactions/BulkCount") && localStorage.getItem("verifyBulks") == "true"){
        this.sharedService.verifyBulkTransBack();
        return;
      }
      this.router.navigate([Url]); 
      this.sharedService.BroadCastMenuUpdate(Url.toString());
    }  
    if(!menu) {
      // Reverts side bar to it's orignal state 
      this.router.navigate([AppRoutes.Dashboard]);
      this.sharedService.resetSidebar();
      let filter = this.breadcrumbList.filter(e => e.name == "Dashboard"); 
      if (filter.length == 0) {
        this.breadcrumbList.push({
          name:'Dashboard',
          menu: '',
          value:AppRoutes.Dashboard
        });
      }
    }    
  }

  logout(){    
    if(this.authService.isConfigUser()){
      this.iGlobalConfigApi.configLogout().subscribe((res:any) => {
        if (res.isExecuted) 
        {
          //this.clearLocalStorageExcept('CountPickChecks')
          //localStorage.clear();
          this.localstorageService.clearLocalStorage();
          window.location.href = "/#/globalconfig"; 
        }
        else 
        {
          this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
          console.log("configLogout",res.responseMessage);
        }
      });
    } else {
      this.iUserApi.Logout().subscribe((res:any) => {
        if (res.isExecuted){
          this.localstorageService.clearLocalStorage();
          localStorage.setItem("logout", new Date().toDateString());
          window.location.href = "/#/login";
        } 
        else {
          this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
          console.log("Logout",res.responseMessage);
        }
      });
    }
  }

  getViewportDimensions(): void {
    this.breakpointObserver.observe([Breakpoints.Small]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        // Small viewport dimensions
        // const width = window.innerWidth;
        // const height = window.innerHeight;
        // console.log(`Viewport dimensions: ${width} x ${height}`);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.breakpointSubscription) this.breakpointSubscription.unsubscribe();
  }

  openPrintSetting(){
    this.global.OpenDialog(DPrinterSetupComponent, {
      height: 'auto',
      width: '556px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
  }

  checkCurState() {
    const { userName } = this.authService.userData();
    const theme = this.global.getCookie(`${userName}-Theme`) ? parseInt(this.global.getCookie(`${userName}-Theme`)) : 0;
    this.themeRadio = theme;
    this.selectTheme(theme);
  }

  selectTheme(theme: number): void {
    if (theme == 1) this.setTheme(theme, './assets/design-system/styles-hc-v1.css');
    else if (theme == 2) this.setTheme(theme, './assets/design-system/styles-hc-v2.css');
    else if (theme == 3) this.setTheme(theme, './assets/design-system/styles-hhc.css');
    else this.setTheme(theme, './assets/design-system/styles-normal.css');
  }

  setTheme(theme : number, stylesheet : string) {
    const { userName } = this.authService.userData();
    this.global.setCookie(`${userName}-Theme`, theme.toString(), 525600);
    this.stylesService.setStylesheet(stylesheet);
  }
 
   // Function to remove all items from localStorage except the specific item
 

  
}
