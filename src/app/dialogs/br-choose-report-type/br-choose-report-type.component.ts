import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-br-choose-report-type',
  templateUrl: './br-choose-report-type.component.html',
  styleUrls: []
})
export class BrChooseReportTypeComponent{
  @ViewChild('expFile') expFile: ElementRef;
  type:string;
  exportFileName:string;
  constructor(public dialogRef: MatDialogRef<any>,    @Inject(MAT_DIALOG_DATA) public data: any) { 
    if(data.Name){
      this.exportFileName  = data.Name;  
    }else{
      this.exportFileName  = data.ReportName;  
    }
  }
  ngAfterViewInit(): void {
    this.expFile.nativeElement.focus();
  }

  ExportSubmit(){
    this.dialogRef.close({ Type:this.type,FileName:this.exportFileName});
  }
  }

