import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { GlobalService } from 'src/app/common/services/global.service';
import { } from 'src/app/dialogs/br-choose-report-type/br-choose-report-type.component';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions'; 

@Component({
  selector: 'app-basic-reports-and-labels',
  templateUrl: './basic-reports-and-labels.component.html',
  styleUrls: ['./basic-reports-and-labels.component.scss']
})
export class BasicReportsAndLabelsComponent implements OnInit {
  reports:any = [];
  @ViewChild('matRef') matRef: MatSelect;

  searchByInput: any = new Subject<string>();
  ListFilterValue:any = [];
  oldFilterValue:any = [];
  fields:any = [];
  public userData: any;
  BasicReportModel:any = {};
  reportData:any = {};
  ELEMENT_DATA: any[] =[
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'}
  ]
  

    displayedColumns: string[] = ['fields','expression_type','value_to_test','between','actions'];
    tableData = this.ELEMENT_DATA
    dataSourceList:any
    currentApp

      
  constructor(private dialog: MatDialog,private api:ApiFuntions,private authService:AuthService,private route:Router,public global:GlobalService) {
     
    this.userData = this.authService.userData(); 
    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let spliUrl=event.url.split('/');

        if(spliUrl[1]=='admin'){
          this.currentApp = 'Admin'
        }
        else if(spliUrl[1]=='OrderManager'){
          this.currentApp = 'OM'
        }
        else if(spliUrl[1]=='InductionManager'){
          this.currentApp = 'IM'
        }
        else if(spliUrl[1]=='ConsolidationManager'){
          this.currentApp = 'CM'
        }
     }
      });
  }

  ngOnInit(): void {
    this.BasicReportModel.ChooseReport = "";
    this.Getcustomreports();
    
  }
  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  openAction(event:any){
    this.clearMatSelectList();
  }
  onFocusEmptyInput(i: number) {
    const inputValue = this.reportData[16 + i];
    if (!inputValue || inputValue === '') {
      this.changefilter(this.reportData[4 + i], i);
    }
  }


  filterByItem(value : any,index){ 
    this.ListFilterValue[index] = this.oldFilterValue[index].filter(x=> x.toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1);
 
  }

  
  
  Getcustomreports(){
    let payload = {
      'app':this.currentApp
    }
    this.api.Getcustomreports(payload).subscribe((res:any)=>{
      this.reports = res?.data?.reports;
      this.reports.unshift('');
    })
  }
  basicreportdetails(Report){
   let payload:any = {
    report:Report,
    WSID:this.userData.wsid
    }
    this.api.basicreportdetails(payload).subscribe((res:any)=>{
      this.reportData = res?.data?.reportData; 
      this.fields = res?.data?.fields; 
      this.fields.unshift('');
    })
  }
  async changefilter(column,index){
 
    let payload:any ={
      reportName:this.BasicReportModel.ChooseReport,
      column:column
    };
    this.api.changefilter(payload).subscribe((res:any)=>{
      console.log(res)  
        this.ListFilterValue[index] = res.data;
        this.oldFilterValue[index] = res.data;
    })  
    
  }
  ReportFieldsExps(item:any=null,index:any=null){
    if(item == 'fields'){
      this.reportData[10+index] = "";
      this.reportData[16+index] = "";
      this.reportData[22+index] = "";
    }
    let payload:any = {
     report:this.BasicReportModel.ChooseReport,
     wsid:this.userData.wsid,
     username:this.userData.userName,
     fields:[],
     exps:[]
    };
     for(let i = 0;i<6;i++){
      payload.fields.push(this.reportData[4+i]);
     }  
     for(let i = 0;i<6;i++){
      payload.exps.push(this.reportData[10+i]);
     }  
     this.api.ReportFieldsExps(payload).subscribe((res:any)=>{  
       
     })
   }

   ValueSelect(event: MatAutocompleteSelectedEvent,index){ 
    this.reportData[16+index]  = event.option.value;
    this.reportfieldvalues(index,this.reportData[16+index]);
   }
   selectedIndex:number;
   selectedValue:string;
   reportfieldvaluesChange(index,value){
      setTimeout(() => {
        this.reportfieldvalues(index,value)        
      }, 1000);
   }
reportfieldvalues(selectedIndex,selectedValue,IsRemove=false){
  if(IsRemove == true || !(selectedIndex == this.selectedIndex && selectedValue == this.selectedIndex)){
    this.selectedIndex = selectedIndex;
    this.selectedValue =selectedValue;
  let payload:any = {
    report:this.BasicReportModel.ChooseReport,
    wsid:this.userData.wsid,
    username:this.userData.userName,
    V1:[] ,
    V2:[]
   };
    for(let i = 0;i<6;i++){
     payload.V1.push(this.reportData[16+i].toString());
    }   for(let i = 0;i<6;i++){
      payload.V2.push(["NOT BETWEEN","BETWEEN"].indexOf(this.reportData[10 + i]) > -1 && this.reportData[22+i].toString() ? this.reportData[22+i].toString():"");
      
     } 
     this.api.reportfieldvalues(payload).subscribe((res:any)=>{ 
       console.log('resss')
       
     })
   } 
    
  }
ReportTitles(){
  let payload:any = {
    report:this.BasicReportModel.ChooseReport,
    wsid:this.userData.wsid,
    username:this.userData.userName,
    title:[]  
   };
    for(let i = 0;i<4;i++){
     payload.title.push(this.reportData[i]);
    }    
     this.api.ReportTitles(payload).subscribe((res:any)=>{  
       
     })
   } 
 
  OpenListAndLabel(){ 
    window.open(`/#/report-view?file=${this.global.capitalizeAndRemoveSpaces(this.BasicReportModel.ChooseReport)+'-lst'}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
  }
Remove(index){ 
  this.reportData[16+index] = "";
  this.reportData[4+index] = "";
  this.reportData[10+index] = ""; 
  this.ReportFieldsExps();
  this.reportfieldvalues(index,"",true);
  this.ReportTitles();
}





}
