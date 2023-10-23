import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; 
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IGlobalConfigApi } from 'src/app/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/services/globalConfig-api/global-config-api.service';

@Component({
  selector: 'app-d-printer-setup',
  templateUrl: './d-printer-setup.component.html',
  styleUrls: []
})
export class DPrinterSetupComponent implements OnInit {
  ReportPrinter:any;
  LabelPrinter:any;
  ListReportPrinter:any;
  userData:any = {};
  ListLabelPrinter:any;
  public  iGlobalConfigApi: IGlobalConfigApi;
  constructor(
    private dialog:MatDialog,
    private global : GlobalService,
    private api:ApiFuntions,
    public globalConfigApi: GlobalConfigApiService,
    private authService:AuthService) 
    {
      this.iGlobalConfigApi = globalConfigApi;
      this.userData = this.authService.userData();   
   }

  ngOnInit(): void { 
    this.getAllPrinters();
      this.ReportPrinter = localStorage.getItem("SelectedReportPrinter");
      this.LabelPrinter =   localStorage.getItem("SelectedLabelPrinter");
  }
ClosePopup(){
  this.dialog.closeAll();
}
getAllPrinters(){
  this.iGlobalConfigApi.GetAllPrinters().subscribe((res:any)=>{
    if(res)
    {
      this.ListLabelPrinter = res.data.filter(x=>x.label == "Able to Print Labels");
      this.ListReportPrinter = res.data.filter(x=>x.label == "Not Able to Print Labels");
    }
    else {
      this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
      console.log("GetAllPrinters",res.responseMessage);
    } 
      
  });
}
UpdWSPrefsPrinters(ReportPrinter,LabelPrinter){
  let payload = {
      ReportPrinter:ReportPrinter,
      LabelPrinter:LabelPrinter,
  }
  this.iGlobalConfigApi.UpdWSPrefsPrinters(payload).subscribe((res:any)=>{
    if(res)
    {
      localStorage.setItem("SelectedReportPrinter",ReportPrinter);
      localStorage.setItem("SelectedLabelPrinter",LabelPrinter);
    }
    else {
      this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
      console.log("UpdWSPrefsPrinters",res.responseMessage);
    } 
     
  });
}
}
