import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SpinnerService } from '../../../app/init/spinner.service'; 
import { Router,NavigationEnd  } from '@angular/router';
import { AuthService } from '../../../app/init/auth.service';

import { SharedService } from 'src/app/services/shared.service'; 
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { ApiFuntions } from 'src/app/services/ApiFuntions'; 
import { MatDialog } from '@angular/material/dialog';
import { DPrinterSetupComponent } from 'src/app/dialogs/d-printer-setup/d-printer-setup.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api.service';
import { IGlobalConfigApi } from 'src/app/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/services/globalConfig-api/global-config-api.service';
import { IUserAPIService } from 'src/app/services/user-api/user-api-interface';
import { UserApiService } from 'src/app/services/user-api/user-api.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private breakpointSubscription: Subscription
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  loading:boolean = true;
  ConfigUserLogin:boolean = false;
  breadcrumbList: any = [];
  userData: any;
  configUser:any;
  public iInductionManagerApi : IInductionManagerApiService;
isConfigUser
statusTab;
public  iGlobalConfigApi: IGlobalConfigApi;
public iUserApi : IUserAPIService;
constructor(
	  public userApi : UserApiService,
    private global:GlobalService,
    private router: Router,
    public inductionManagerApi: InductionManagerApiService,
    public spinnerService: SpinnerService, 
    private authService: AuthService,
    // private api:ApiFuntions,
    public globalConfigApi: GlobalConfigApiService,
    
    private sharedService: SharedService,
    private titleService: Title,
    private breakpointObserver: BreakpointObserver, 
    ) {
      this.iGlobalConfigApi = globalConfigApi;
      let width=0;
      this.iInductionManagerApi = inductionManagerApi;
      this.iUserApi = userApi;

      this.breakpointSubscription = this.breakpointObserver.observe([Breakpoints.Small,Breakpoints.Large])
      .subscribe((state: BreakpointState) => {
           width = window.innerWidth;    
      })
      
   this.isConfigUser=  this.authService.isConfigUser()
    router.events.subscribe((val: any) => {
      if(!this.global.changesConfirmation){

        this.breadcrumbList = [];
        if(!this.authService.isConfigUser()){
            this.breadcrumbList.push({
              name:'LogixPro',
              menu: '',
              value:'/dashboard'
            })
          }
      }
  
      if(val instanceof NavigationEnd){
        let res = val.url.substring(1);
        if(!res.includes('report-view')||!res.includes('report')){
          localStorage.setItem('reportNav',val.url)
        }

        let withoutParam = res.split('?')[0]
        let splittedArray = withoutParam.split('/'); 
          if(splittedArray[0]==='FlowrackReplenishment'){
            splittedArray[0]='FlowrackReplenishment'
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
          if(element==='InductionManager'){
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
      
      }   
     
  });

   }

   capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  setImPreferences(){
    const imPreference = localStorage.getItem('InductionPreference');
    if (imPreference) {
      const parsedData = JSON.parse(imPreference);
      console.log('InductionPreference:', parsedData);

    } else {

 let paylaod = { 
    }
    this.iInductionManagerApi.PickToteSetupIndex(paylaod).subscribe(res => {
      localStorage.setItem('InductionPreference', JSON.stringify(res.data.imPreference));


    });
    }

  }
  ngOnInit(): void {
    this.loading = false;
    this.userData = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.configUser = JSON.parse(localStorage.getItem('userConfig') ?? '{}'); 
    if(this.router.url.indexOf('globalconfig') > -1){
      this.ConfigUserLogin =  true;
    }else {
      this.ConfigUserLogin =  false; 
      this.userData = this.authService.userData(); 
      if(this.userData.wsid) this.GetWorkStatPrinters();
      this.setImPreferences();
    }
      this.userData = this.authService.userData(); 
    

  }

  GetWorkStatPrinters(){
    this.iGlobalConfigApi.GetWorkStatPrinters().subscribe((res:any)=>{ 
      localStorage.setItem("SelectedReportPrinter",res.data.reportPrinter);
       localStorage.setItem("SelectedLabelPrinter",res.data.labelPrinter);
    })
  }
  ngAfterViewInit() {
      this.sharedService.breadCrumObserver.subscribe((res: any) => { 
      this.statusTab = res.tab.textLabel;
      this.breadcrumbList[this.breadcrumbList.length-1].name = this.statusTab
    } )
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }
  routeToLogin(){
    this.router.navigate(['/login']);
  }

  breadCrumbClick(menu,index:any = null) { 
     if(index != null){ 
      let Url = "";  
      for (let i = 0; i <= index; i++) {
        if(this.breadcrumbList[i].menu!='') Url += this.breadcrumbList[i].value; 
      }   
       this.router.navigate([Url]);
        
       this.sharedService.BroadCastMenuUpdate(Url.toString());
    }  
    if (!menu) {
      // Reverts side bar to it's orignal state 
      this.router.navigate(['/dashboard']);
      this.sharedService.resetSidebar();

      let filter = this.breadcrumbList.filter(e => e.name == "Dashboard");

      if (filter.length == 0) {
        this.breadcrumbList.push({
          name:'Dashboard',
          menu: '',
          value:'/dashboard'
        });
      }
    }    
  }

  logout(){    
    if(this.authService.isConfigUser()){
      this.iGlobalConfigApi.configLogout().subscribe((res:any) => {
        if (res.isExecuted) 
        {
          window.location.href = "/#/globalconfig"; 
        }
        else 
        {
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
          console.log("configLogout",res.responseMessage);
        }
      })
     
    }else{
      this.iUserApi.Logout().subscribe((res:any) => {
        if (res.isExecuted) 
        { 
          window.location.href = "/#/login";
        }
        else 
        {
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
          console.log("Logout",res.responseMessage);
        }
      })
    }
  

  }

  
  getViewportDimensions(): void {
    this.breakpointObserver.observe([Breakpoints.Small])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          // Small viewport dimensions
          const width = window.innerWidth;
          const height = window.innerHeight;

         
          console.log(`Viewport dimensions: ${width} x ${height}`);
        } else {
          // Large viewport dimensions
          // ...
        }
      });
  }
  ngOnDestroy(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  openPrintSetting(){
    this.global.OpenDialog(DPrinterSetupComponent, {
      height: 'auto',
      width: '556px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });

  }
 
}
