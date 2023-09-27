import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-br-choose-report-type',
  templateUrl: './br-choose-report-type.component.html',
  styleUrls: []
})
export class BrChooseReportTypeComponent{
  @ViewChild('exp_file') exp_file: ElementRef;
  Type:string;
  ExportFileName:string;
  constructor(public dialogRef: MatDialogRef<any>,    @Inject(MAT_DIALOG_DATA) public data: any) { 
    if(data.Name){
      this.ExportFileName  = data.Name;  
    }else{
      this.ExportFileName  = data.ReportName;  
    }
  }
  ngAfterViewInit(): void {
    this.exp_file.nativeElement.focus();
  }

  ExportSubmit(){
    this.dialogRef.close({ Type:this.Type,FileName:this.ExportFileName});
  }
  }

function BrChooseReportTypeDialogue() {
  throw new Error('Function not implemented.');
}

