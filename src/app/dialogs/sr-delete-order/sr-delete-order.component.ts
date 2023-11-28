import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
 

@Component({
  selector: 'app-sr-delete-order',
  templateUrl: './sr-delete-order.component.html',
  styleUrls: ['./sr-delete-order.component.scss']
})
export class SrDeleteOrderComponent { 
  confrimDelete: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    
    public dialogRef: MatDialogRef<SrDeleteOrderComponent>, 
  ) { } 
  onConfirmdelete(){
    this.dialog.closeAll();
    this.dialogRef.close(this.data);
  }

}
