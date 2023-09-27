import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SpinnerService } from '../../../app/init/spinner.service'; 
import { Router,NavigationEnd  } from '@angular/router';
import { AuthService } from '../../../app/init/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared.service'; 
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { ApiFuntions } from 'src/app/services/ApiFuntions'; 
import { MatDialog } from '@angular/material/dialog';
import { DPrinterSetupComponent } from 'src/app/dialogs/d-printer-setup/d-printer-setup.component';
import { GlobalService } from 'src/app/common/services/global.service';

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
isConfigUser
statusTab;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    public spinnerService: SpinnerService, 
    private authService: AuthService,
    private api:ApiFuntions,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private titleService: Title,
    private breakpointObserver: BreakpointObserver,
    private global:GlobalService,
    ) {
      let width=0;
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
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }
    this.api.PickToteSetupIndex(paylaod).subscribe(res => {
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
    this.api.GetWorkStatPrinters().subscribe((res:any)=>{ 
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
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  breadCrumbClick(menu,index:any = null) { 
    debugger
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
    let paylaod = {
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }
    if(this.authService.isConfigUser()){
      localStorage.clear();
      this.api.configLogout(paylaod).subscribe((res:any) => {
        if (res.isExecuted) 
        {
          window.location.href = "/#/globalconfig"; 
        }
        else 
        {
          this.toastr.error(res.responseMessage, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
      })
     
    }else{
      localStorage.clear();
      this.api.Logout(paylaod).subscribe((res:any) => {
        if (res.isExecuted) 
        { 
          window.location.href = "/#/login";
        }
        else 
        {
          this.toastr.error(res.responseMessage, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
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
    this.dialog.open(DPrinterSetupComponent, {
      height: 'auto',
      width: '556px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });

  }
 
}
