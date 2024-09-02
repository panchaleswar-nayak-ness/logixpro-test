import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CrAddNewCustomReportComponent } from 'src/app/dialogs/cr-add-new-custom-report/cr-add-new-custom-report.component';
import { CrDeleteConfirmationComponent } from 'src/app/dialogs/cr-delete-confirmation/cr-delete-confirmation.component';
import { CrEditDesignTestDataComponent } from 'src/app/dialogs/cr-edit-design-test-data/cr-edit-design-test-data.component';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { GlobalService } from 'src/app/common/services/global.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ToasterTitle, ToasterType, DialogConstants, Style, UniqueConstants } from 'src/app/common/constants/strings.constants';
import { AppNames } from 'src/app/common/constants/menu.constants';
import { ApiResponse } from 'src/app/common/types/CommonTypes';

interface ReportTitle {
  title: string;
  isSelected: boolean;
  userCreated: number;
  description: string,
  testData: string,
  fileName: string,
  outputType: string,
  systemOutput: boolean,
  testDataType: string,
  exportFileName: string
}

interface ReportTitles {
  sysTitles: ReportTitle[];
  reportTitles: ReportTitle[];
}

interface CustomReportResponse {
  reports: string[];
  reportTitles: ReportTitles;
  app: string;
}

@Component({
  selector: 'app-custom-reports-and-labels',
  templateUrl: './custom-reports-and-labels.component.html',
  styleUrls: ['./custom-reports-and-labels.component.scss'],
})
export class CustomReportsAndLabelsComponent implements OnInit {
  @ViewChild('matRef') matRef: MatSelect;

  detail: ReportTitle;
  listReports: ReportTitle[] = [];
  reportTitles: ReportTitle[] = [];
  isSystemReport: boolean = true;
  sysTitles: ReportTitle[] = [];
  oldDetail: string;
  currentApp : string;
  public iAdminApiService: IAdminApiService;

  constructor(
    public adminApiService: AdminApiService,
    public router: Router,
    public global: GlobalService
  ) {
    this.iAdminApiService = adminApiService;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let spliUrl = event.url.split('/');
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
    this.getCustomReports();
    this.clearDetails();
  }

  changeReport(IsSysBolean: boolean) {
    this.clearDetails();
    this.isSystemReport = IsSysBolean;
    if (this.isSystemReport) this.listReports = this.sysTitles;
    else this.listReports = this.reportTitles;
  }

  getCustomReports() {
    let payload = { app: this.currentApp };
    this.iAdminApiService.Getcustomreports(payload).subscribe((res: ApiResponse<CustomReportResponse>) => {
      if(res.isExecuted && res.data) {
        this.sysTitles = res?.data?.reportTitles?.sysTitles;
        this.reportTitles = res?.data?.reportTitles?.reportTitles;
        this.sysTitles.forEach((object) => {
          object.isSelected = false;
          object.userCreated = 0;
        });
        this.reportTitles.forEach((object) => {
          object.isSelected = false;
          object.userCreated = 1;
        });

        if (this.isSystemReport || this.isSystemReport == undefined) this.listReports = this.sysTitles;
        else this.listReports = this.reportTitles;
      } else this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
    });
  }
  
  openListAndLabel(route) {
    window.open(
      `/#/${route}?file=${this.detail.fileName.replace('.', '-')}&user=${this.detail.userCreated}`,
      UniqueConstants._blank,
      'width=' +
        screen.width +
        ',height=' +
        screen.height +
        ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0'
    );
  }

  clearMatSelectList() {
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }

  openAction() {
    this.clearMatSelectList();
  }

  clearDetails(){
    this.detail = {
      isSelected: false,
      title: '',
      userCreated: 0,
      description: '',
      exportFileName: '',
      fileName: '',
      outputType: '',
      systemOutput: false,
      testData: '',
      testDataType: ''
    }
  }

  SelectedFile: string | null;

  getReportDetails(file : string, index?: number, details? : ReportTitle) {  

    this.listReports.forEach((item, i) => {
      if (i === index)
        if (item.isSelected) item.isSelected = false;
        else item.isSelected = true;
      else item.isSelected = false;
    });

    this.oldDetail = file;

    if (this.SelectedFile == file) {
      this.clearDetails();
      this.SelectedFile = null
      return 1;
    }

    this.SelectedFile = file;

    let obj: any = {
      FileName: file,
    };

    this.iAdminApiService.Getreportdetails(obj).subscribe((res: any) => {
      if(res.isExecuted && res.data) {
        this.detail = res.data[0];
        this.detail.userCreated = details?.userCreated ?? 0;
      } else this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
    });
    
    return 1;
  }

  openEditDesign() {
    const dialogRef: any = this.global.OpenDialog(CrEditDesignTestDataComponent, {
      height: DialogConstants.auto,
      width: '932px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: this.detail.testData ? this.detail.testData : '',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.detail.testData = result;
      this.saveInput();
    });
  }

  crAddNewCustomReportDialogue() {
    const dialogRef: any = this.global.OpenDialog(CrAddNewCustomReportComponent, {
      height: DialogConstants.auto,
      width: '932px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        ListReports: this.listReports,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.getCustomReports();
        this.getReportDetails(result.filename);
      }
    });
  }

  openDeleteDialogue() {
    const dialogRef: any = this.global.OpenDialog(CrDeleteConfirmationComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'permanent' || result == 'keep') {
        let payload = {
          filename: this.detail.fileName,
          keepFile: result === 'keep' ? true : result === 'permanent',
          wsid: '',
          username: '',
          contentRootPath: '',
        };
        this.iAdminApiService.deleteReport(payload).subscribe((res) => {
          if(!res.data) this.global.ShowToastr(ToasterType.Error, "Unexpected error occurred.  If this persists please contact Scott Tech for support.", ToasterTitle.Error);
          else {
            this.getCustomReports();
            this.clearDetails();
            this.global.ShowToastr(ToasterType.Error,`File Deleted Successfully`, ToasterTitle.Error);
          };
        })
      } 
    }
    );
  }

  onFileSelected(event: any) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    
    // No file selected, handle the case if needed
    if (!file) return;

    if (file.name == this.detail.fileName) {
      const formData = new FormData();
      formData.append('file', file);
      this.iAdminApiService.importFile(formData).subscribe(
        (response) => this.global.ShowToastr(ToasterType.Error, `File successfully uploaded`, ToasterTitle.Error),
        (error) => this.global.ShowToastr(ToasterType.Error, error, ToasterTitle.Error)
      );
    } 
    else this.global.ShowToastr(ToasterType.Error, `Uploaded filename ${file.name} must match report filename ${this.detail.fileName}`, ToasterTitle.Error);
  }

  pushReports() {
    const dialogRef: any = this.global.OpenDialog(AlertConfirmationComponent, {
      height: DialogConstants.auto,
      width: '500px',
      data: {
        message: 'Do you wish to give all workstations your version of this report?',
        heading: '',
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let payload = { FileName: this.detail.fileName };
        this.iAdminApiService.pushReportChanges(payload).subscribe((res: { isExecuted : boolean }) => {
          if (res.isExecuted) this.global.ShowToastr(ToasterType.Error, `Changes have been successfully pushed to the other workstations`, ToasterTitle.Error);
          else this.global.ShowToastr(ToasterType.Error, `Error has occured while pushing changes to the other worksations`, ToasterTitle.Error);
        });
      } 
      else return;
    });
  }

  saveInput() {
    if (this.detail.outputType == undefined) return;

    let payload = {
      oldfilename: this.oldDetail,
      newfilename: this.detail.fileName,
      description: this.detail.description,
      datasource: this.detail.testData,
      output: this.detail.outputType,
      testDataType: this.detail.testDataType,
      eFilename: this.detail.exportFileName,
    };

    this.iAdminApiService.updatereportDetails(payload).subscribe((res: { isExecuted : boolean }) => {
      if (!res.isExecuted) this.global.ShowToastr(ToasterType.Error, 'Unexpected error occurred. Changes Not Saved', ToasterTitle.Error);
    });
  }
}
