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
  dialog_heading: string = '';
  buttonFields:any = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private global:GlobalService, 
   
  public dialogRef: MatDialogRef<FunctionAllocationComponent>) { }

  ngOnInit(): void {
    this.dialog_msg = this.data?.message;
    this.dialog_heading = this.data?.heading;
    this.buttonFields = this.data?.buttonFields;
  }

  confirmOK()
  {
    this.dialogRef.close(ResponseStrings.Yes);
  }

}
export { FunctionAllocationComponent };

