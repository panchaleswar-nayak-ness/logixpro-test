import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FunctionAllocationComponent } from '../function-allocation/function-allocation.component';
import {  ResponseStrings } from 'src/app/common/constants/strings.constants';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ConfirmationDialogData } from 'src/app/common/interface/confirm-dialog-data';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: []
})
export class ConfirmationDialogComponent implements OnInit {
  dialog_msg: string = '';
  dialog_msg2: string = '';
  dialog_heading: string = '';
  buttonFields: boolean = false;  // Replace `any` with the actual type if you know the type
  threeButtons: boolean = false;
  singleButton: boolean = false;
  customButtonText: boolean = false;
  btn1Text: string = '';
  btn2Text: string = '';
  hideCancel: boolean = true;
  checkBox: boolean = false;
  
  
  checkBoxText:string="I understand data cannot be recovered";
  isChecked: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
    public dialogRef: MatDialogRef<FunctionAllocationComponent>
  ) { }

  ngOnInit(): void {
    this.dialog_msg = this.data?.message ?? '';
    this.dialog_msg2 = this.data?.message2 ?? '';
    this.dialog_heading = this.data?.heading ?? '';
    this.buttonFields = this.data?.buttonFields ?? false;
    this.threeButtons = this.data?.threeButtons ?? false;
    this.singleButton = this.data?.singleButton ?? false;
    this.customButtonText = this.data?.customButtonText ?? false;
    this.btn1Text = this.data?.btn1Text ?? '';
    this.btn2Text = this.data?.btn2Text ?? '';
    this.hideCancel = this.data?.hideCancel ?? true;
    this.checkBox = this.data?.checkBox ?? false;
  }

  confirmOK()
  {
    if(this.checkBox && !this.isChecked){
      return;
    }
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

  checkOptions(event: MatCheckboxChange): void {
    this.isChecked = event.checked;
  }

}
export { FunctionAllocationComponent };

