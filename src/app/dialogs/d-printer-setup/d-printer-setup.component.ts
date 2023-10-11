import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; 
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
  let payload = {
      UserName:   this.userData.userName,
      WSID:this.userData.wsid
  }
  this.iGlobalConfigApi.GetAllPrinters(payload).subscribe((res:any)=>{ 
      this.ListLabelPrinter = res.data.filter(x=>x.label == "Able to Print Labels");
      this.ListReportPrinter = res.data.filter(x=>x.label == "Not Able to Print Labels");
  });
}
UpdWSPrefsPrinters(ReportPrinter,LabelPrinter){
  let payload = {
      ReportPrinter:ReportPrinter,
      LabelPrinter:LabelPrinter,
      WSID:this.userData.wsid
  }
  this.iGlobalConfigApi.UpdWSPrefsPrinters(payload).subscribe((res:any)=>{ 
    localStorage.setItem("SelectedReportPrinter",ReportPrinter);
    localStorage.setItem("SelectedLabelPrinter",LabelPrinter); 
  });
}
}
