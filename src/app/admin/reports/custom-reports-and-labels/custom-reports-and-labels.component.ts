import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { CrAddNewCustomReportComponent } from 'src/app/dialogs/cr-add-new-custom-report/cr-add-new-custom-report.component';
import { CrDeleteConfirmationComponent } from 'src/app/dialogs/cr-delete-confirmation/cr-delete-confirmation.component';
import { CrEditDesignTestDataComponent } from 'src/app/dialogs/cr-edit-design-test-data/cr-edit-design-test-data.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { ToastrService } from 'ngx-toastr';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-custom-reports-and-labels',
  templateUrl: './custom-reports-and-labels.component.html',
  styleUrls: ['./custom-reports-and-labels.component.scss']
})
export class CustomReportsAndLabelsComponent implements OnInit {
  @ViewChild('matRef') matRef: MatSelect;

  Detail:any = {};
  ListReports:any = [];
  reportTitles:any = [];
  IsSystemReport:boolean = true;
  sysTitles:any = [];
  olddetail
  currentApp
  constructor(private api:ApiFuntions,private route:Router,private dialog: MatDialog, private toastr :ToastrService,private router: Router,public global:GlobalService) { 
    this.router.events.subscribe((event) => {
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
  this.Getcustomreports();

  }
  ChangeReport(IsSysBolean:boolean){
    this.Detail = {}
    this.IsSystemReport = IsSysBolean;
    if(this.IsSystemReport) this.ListReports = this.sysTitles;
    else this.ListReports = this.reportTitles;
    console.log(this.ListReports)
  }
  Getcustomreports(){

    let payload = {
      'app':this.currentApp
    }
    this.api.Getcustomreports(payload).subscribe((res:any)=>{
      this.sysTitles = res?.data?.reportTitles?.sysTitles;
      this.reportTitles = res?.data?.reportTitles?.reportTitles;
      this.sysTitles.forEach((object) => {
        object.isSelected = false;
      });
      this.reportTitles.forEach((object) => {
        object.isSelected = false;
      });

      console.log(this.sysTitles)
      console.log(this.reportTitles)

      if(this.IsSystemReport || this.IsSystemReport == undefined) this.ListReports = this.sysTitles;
      else this.ListReports = this.reportTitles;
      
    })
  }
  OpenListAndLabel(route){
    window.open(`/#/${route}?file=${this.Detail.fileName.replace(".","-")}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
  }

  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  openAction(event:any){
    this.clearMatSelectList();
  }
  SelectedFile:any;

  Getreportdetails(file,index?){
    console.log(file)
    this.ListReports.forEach((item,i)=>{
      if(i===index){
        if(item.isSelected){
          item.isSelected=false;
        }
        else{
          item.isSelected=true
        }

      }else{
        item.isSelected=false;
      }
      
    })

      this.olddetail = file; 
    if(this.SelectedFile == file){
      
      this.Detail = {};
      this.SelectedFile = null;
      return 1;
    }
    this.SelectedFile = file;

     let obj : any = {
      FileName:file
    }
    this.api.Getreportdetails(obj).subscribe((res:any)=>{
      this.Detail = res.data[0];
    })
   
    return 1;
  }

  openEditDesign() {
    const dialogRef = this.dialog.open(CrEditDesignTestDataComponent, {
      height: 'auto',
      width: '932px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data:this.Detail.testData ? this.Detail.testData : "" 
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)  
      if(result )    
      this.Detail.testData = result
      this.saveInput()
    }
    );
  }
  CrAddNewCustomReportDialogue() {
    const dialogRef = this.dialog.open(CrAddNewCustomReportComponent, {
      height: 'auto',
      width: '932px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data : {
        ListReports:this.ListReports
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
    if(!result){
      console.log(result,'obj')
      console.log(this.IsSystemReport)      
      console.log(this.ListReports)  
      
      this.Getcustomreports()
      this.Getreportdetails(result.filename)
    }
    }
    );
  }
  openDeleteDialogue() {
    const dialogRef = this.dialog.open(CrDeleteConfirmationComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result,'delete')   
      if(result == 'permanent' ||result == 'keep')  {
      
        let payload = {
          "filename": this.Detail.fileName,
          "keepFile": result === 'keep' ? true : result === 'permanent',
          "wsid": "",
          "username": "",
          "contentRootPath": ""
        }
        this.api.deleteReport(payload).subscribe(res=>{
          if (!res.data) {
            this.toastr.error("Unexpected error occurred.  If this persists please contact Scott Tech for support.", 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
        } else {
          this.Getcustomreports()
          this.Detail= {}
          this.toastr.success(`File Deleted Successfully`, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });

        };
        })
      } 
    }
    );
  }

  onFileSelected(event: any) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) {
      // No file selected, handle the case if needed
      return;
    }
    if(file.name == this.Detail.fileName){
      const formData = new FormData();
      formData.append('file', file);
  
  
      // Replace 'your_upload_endpoint' with the server's API endpoint to handle file upload
      this.api.importFile(formData).subscribe(
        (response) => {
          this.toastr.success(`File successfully uploaded`, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
          // Handle the response from the server after file upload, if needed
          console.log(response);
        },
        (error) => {
          this.toastr.error(error, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
          // Handle error if the file upload fails
          console.error(error);
        }
      );
    }
    else{
      this.toastr.error(`Uploaded filename ${file.name} must match report filename ${this.Detail.fileName}`, 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
    }


  }

  pushReports(){
    const dialogRef = this.dialog.open(AlertConfirmationComponent, {
      height: 'auto',
      width: '500px',
      data: {
        message: 'Do you wish to give all workstations your version of this report?',
        heading: '',
      },
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        let payload = {
          FileName:this.Detail.fileName
        }
        this.api.pushReportChanges(payload).subscribe(res=>{
          console.log(res)
          if(res.isExecuted){
            this.toastr.success( `Changes have been successfully pushed to the other workstations`, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
          else{
            this.toastr.error( `Error has occured while pushing changes to the other worksations`, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        })
      }
      else{
        return
      }
    });
  }


  saveInput(){
    if(this.Detail.outputType == undefined) return
   let payload =  {
      "oldfilename": this.olddetail,
      "newfilename": this.Detail.fileName,
      "description":this.Detail.description ,
      "datasource": this.Detail.testData,
      "output": this.Detail.outputType,
      "testDataType": this.Detail.testDataType,
      "eFilename":this.Detail.exportFileName ,
    }

    this.api.updatereportDetails(payload).subscribe(res=>{
      if(!res.isExecuted){
        this.toastr.error("Unexpected error occurred. Changes Not Saved", 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    })
  }
}
