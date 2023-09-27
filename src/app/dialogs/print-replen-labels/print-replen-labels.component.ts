import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-print-replen-labels',
  templateUrl: './print-replen-labels.component.html',
  styleUrls: []
})
export class PrintReplenLabelsComponent {

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PrintReplenLabelsComponent>,
  ) { }

 

  printLabelsForCurrentDisplay(){
    this.dialog.closeAll();
    this.dialogRef.close({});
  }

  printLabelsForUnprintedReplens(){
    this.dialog.closeAll();
    this.dialogRef.close({});
  }

  printLabelsForAllReplens(){
    this.dialog.closeAll();
    this.dialogRef.close({});
  }

}
