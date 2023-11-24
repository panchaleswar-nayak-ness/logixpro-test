import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  StringConditions } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-function-allocation',
  templateUrl: './function-allocation.component.html',
  styleUrls: []
})
export class FunctionAllocationComponent implements OnInit {
  dialogMsg: string = '';
  btnLabel = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FunctionAllocationComponent>
  ) { }
 
  ngOnInit(): void { 
    if(this.data?.target === 'assigned') { this.dialogMsg = 'Are you sure you want to add ?'; this.btnLabel = StringConditions.AddCaps };
    if(this.data?.target === 'unassigned') { this.dialogMsg = 'Are you sure you want to remove ?'; this.btnLabel = 'Remove' };
  }

  onConfirmAdd() {
    this.dialogRef.close(this.data);
  }
}
