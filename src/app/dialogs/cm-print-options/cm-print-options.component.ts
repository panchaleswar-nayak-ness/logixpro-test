import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';

@Component({
  selector: 'app-cm-print-options',
  templateUrl: './cm-print-options.component.html',
  styleUrls: []
})
export class CmPrintOptionsComponent implements OnInit {

  preview:any;
  orderNumber:any;
  packListSort:any;
  print:any;
  public userData: any;
  printType:any = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CmPrintOptionsComponent>,
    public router: Router,
    private global:GlobalService,
    public authService: AuthService
    ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.preview = this.data?.preview;
    this.orderNumber = this.data?.orderNumber;
    this.packListSort = this.data?.packListSort;
    this.print = this.data?.print;
  }

  submit(){
    if(this.printType == "new"){
      this.printNewLines();
    }
    else{
      this.printAllLines();
    }
  }

  printNewLines(){
    if(this.print){
      this.global.Print(`FileName:PrintPrevCMPackList|OrderNum:${this.orderNumber}|Where:where|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`)
    }
    else{
      window.open(`/#/report-view?file=FileName:PrintPrevCMPackList|OrderNum:${this.orderNumber}|Where:where|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
    }
  }

  printAllLines(){
    if(this.print){
      this.global.Print(`FileName:PrintPrevCMPackList|OrderNum:${this.orderNumber}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`)
    }
    else{
      window.open(`/#/report-view?file=FileName:PrintPrevCMPackList|OrderNum:${this.orderNumber}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
    }
  }

}
