import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToasterTitle, ToasterType,UniqueConstants,ColumnDef} from 'src/app/common/constants/strings.constants';
import { AppNames } from 'src/app/common/constants/menu.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions'; 
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';

@Component({
  selector: 'app-basic-reports-and-labels',
  templateUrl: './basic-reports-and-labels.component.html',
  styleUrls: ['./basic-reports-and-labels.component.scss']
})
export class BasicReportsAndLabelsComponent implements OnInit {

  reports:any = [];
  @ViewChild('matRef') matRef: MatSelect;
  reportTitles: any = [1,2,3,4]; 
  searchByInput: any = new Subject<string>();
  listFilterValue:any = [];
  oldFilterValue:any = [];
  fields:any = [];
  
  basicReportModel:any = {};
  reportData:any = {};
  ELEMENT_DATA: any[] =[
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'}
  ]
  comparisonOperators = [
    { label: '', value: '' },
    { label: '= (Equals)', value: "=" },
    { label: '> (Greater Than)', value: ">" },
    { label: '< (Less Than)', value: "<" },
    { label: '>= (Greater Than or Equal)', value: ">=" },
    { label: '<= (Less Than or Equal)', value: "<=" },
    { label: '<> (Not Equal)', value: "<>" },
    { label: 'LIKE (Matches value with wildcards)', value: "LIKE" },
    { label: 'NOT LIKE (Matches value with wildcards)', value: "NOT LIKE" },
    { label: 'NULL (Empty/Blank)', value: "NULL" },
    { label: 'NOT NULL', value: "NOT NULL" },
    { label: 'BETWEEN', value:  "BETWEEN"},
    { label: 'NOT BETWEEN', value: "NOT BETWEEN" },
    { label: 'IN (In list like 1, 2, 3, 4)', value: "IN" },
    { label: 'NOT IN (Not in list like 1, 2, 3, 4)', value: "NOT IN" }
  ];
  

    displayedColumns: string[] = ['fields','expression_type','value_to_test','between',ColumnDef.Actions];
    tableData = this.ELEMENT_DATA
    dataSourceList:any
    currentApp

    public iAdminApiService: IAdminApiService;
    public userData: any;
  constructor(private dialog: MatDialog,private api:ApiFuntions,private adminApiService: AdminApiService,private authService:AuthService,private route:Router,public global:GlobalService,private router: Router) {
    this.iAdminApiService = adminApiService;    
    this.userData = this.authService.userData(); 
    this.route.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
        let spliUrl=event.url.split('/');
        switch (spliUrl[1]) {
          case 'admin':
            this.currentApp = 'Admin';
            break;
          case AppNames.OrderManager:
            this.currentApp = 'OM';
            break;
          case AppNames.InductionManager:
            this.currentApp = 'IM';
            break;
          case 'ConsolidationManager':
            this.currentApp = 'CM';
            break;
          default:
            break;
        }
     }
      });
  }

  ngOnInit(): void {
    this.basicReportModel.ChooseReport = "";
    this.getCustomReports();
    
  }
  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  openAction(event:any){
    this.clearMatSelectList();
  }
  onFocusEmptyInput(i: number) {
    this.changeFilter(this.reportData[4 + i], i);
  }


  filterByItem(value : any,index){ 
    this.listFilterValue[index] = this.oldFilterValue[index].filter(x=> x.toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1);
 
  }

  
  
  getCustomReports(){
    let payload = {
      'app':this.currentApp
    }
    this.iAdminApiService.Getcustomreports(payload).subscribe((res:any)=>{
      if(res.isExecuted && res.data)
      {
        this.reports = res?.data?.reports;
        this.reports.push('Utilization Report');
        
        // Sort reports alphabetically, ignoring case
        this.reports.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      this.reports.unshift('');
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("Getcustomreports",res.responseMessage);
      }
    })
  }



// Method to handle selection and navigation
basicReportDetails(selectedReport: string) {
  
  if (selectedReport === 'Utilization Report') {
      // Navigate to utilizationDashboard when "Utilization Report" is selected
      this.router.navigate(['/admin/reports/utilizationDashboard']);
  } else {
    let payload:any = {
      report:selectedReport, 
      }
      this.iAdminApiService.basicreportdetails(payload).subscribe((res:any)=>{
        if(res.isExecuted && res.data)
        {
          this.reportData = res?.data?.reportData; 
        this.fields = res?.data?.fields; 
        this.fields.unshift('');
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("basicreportdetails",res.responseMessage);
        }
      })
     
  }
}


  async changeFilter(column,index){  

    let payload:any ={
      reportName:this.basicReportModel.ChooseReport,
      column:column
    };
    this.iAdminApiService.changefilter(payload).subscribe((res:any)=>{
      if(res.isExecuted && res.data)
      {
        this.listFilterValue[index] = res.data;
        this.oldFilterValue[index] = res.data;
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("changefilter",res.responseMessage);
      }
    })  
    
  }
  reportFieldsExps(item:any=null,index:any=null){
    if(item == 'fields'){
      this.reportData[10+index] = "";
      this.reportData[16+index] = "";
      this.reportData[22+index] = "";
    }
    let payload:any = {
     report:this.basicReportModel.ChooseReport, 
     fields:[],
     exps:[]
    };
     for(let i = 0;i<6;i++){
      payload.fields.push(this.reportData[4+i]);
     }  
     for(let i = 0;i<6;i++){
      payload.exps.push(this.reportData[10+i]);
     }  
     this.iAdminApiService.ReportFieldsExps(payload).subscribe((res:any)=>{  
       
     })
   }

   valueSelect(event: MatAutocompleteSelectedEvent,index){ 
    this.reportData[16+index]  = event.option.value;
    this.reportFieldValues(index,this.reportData[16+index]);
   }
   selectedIndex:number;
   selectedValue:string;
   reportFieldValuesChange(index,value){
      setTimeout(() => {
        this.reportFieldValues(index,value)        
      }, 1000);
   }
reportFieldValues(selectedIndex,selectedValue,IsRemove=false){
  if(IsRemove || !(selectedIndex == this.selectedIndex && selectedValue == this.selectedIndex)){
    this.selectedIndex = selectedIndex;
    this.selectedValue =selectedValue;
  let payload:any = {
    report:this.basicReportModel.ChooseReport, 
    V1:[] ,
    V2:[]
   };
    for(let i = 0;i<6;i++){
     payload.V1.push(this.reportData[16+i].toString());
    }   for(let i = 0;i<6;i++){
      payload.V2.push(["NOT BETWEEN","BETWEEN"].indexOf(this.reportData[10 + i]) > -1 && this.reportData[22+i].toString() ? this.reportData[22+i].toString():"");
      
     } 
     this.iAdminApiService.reportfieldvalues(payload).subscribe((res:any)=>{ 
       console.log('resss')
       
     })
   } 
    
  }
reportPayloadTitles(){
  let payload:any = {
    report:this.basicReportModel.ChooseReport, 
    title:[]  
   };
    for(let i = 0;i<4;i++){
     payload.title.push(this.reportData[i]);
    }    
     this.iAdminApiService.ReportTitles(payload).subscribe((res:any)=>{  
       
     })
   }

  openListAndLabel(){ 
    window.open(`/#/report-view?file=${this.global.capitalizeAndRemoveSpaces(this.basicReportModel.ChooseReport)+'-lst'}`, UniqueConstants._blank, 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
  }
Remove(index){ 
  this.reportData[16+index] = "";
  this.reportData[4+index] = "";
  this.reportData[10+index] = ""; 
  this.reportFieldsExps();
  this.reportFieldValues(index,"",true);
  this.reportPayloadTitles();
}





}
