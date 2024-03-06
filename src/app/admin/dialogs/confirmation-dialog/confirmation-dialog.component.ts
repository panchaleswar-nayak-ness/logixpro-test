import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FunctionAllocationComponent } from '../function-allocation/function-allocation.component';
import { GlobalService } from 'src/app/common/services/global.service';
import {  ResponseStrings } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: []
})
export class ConfirmationDialogComponent implements OnInit {
  dialog_msg: string = '';
  dialog_msg2: string = '';
  dialog_heading: string = '';
  buttonFields:any = false;
  threeButtons:boolean = false;
  singleButton:boolean = false;
  customButtonText:boolean = false;
  btn1Text: string = '';
  btn2Text: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private global:GlobalService, 
   
  public dialogRef: MatDialogRef<FunctionAllocationComponent>) { }

  ngOnInit(): void {
    this.dialog_msg = this.data?.message;
    this.dialog_msg2 = this.data?.message2;
    this.dialog_heading = this.data?.heading;
    this.buttonFields = this.data?.buttonFields;
    this.threeButtons = this.data?.threeButtons;
    this.singleButton = this.data?.singleButton;
    this.customButtonText = this.data?.customButtonText;
    this.btn1Text = this.data?.btn1Text;
    this.btn2Text = this.data?.btn2Text;
  }

  confirmOK()
  {
    this.dialogRef.close(ResponseStrings.Yes);
  }

  confirmNo()
  {
    this.dialogRef.close(ResponseStrings.No);
  }

  confirmCancel()
  {
    this.dialogRef.close(ResponseStrings.Cancel);
  }

}
export { FunctionAllocationComponent };

