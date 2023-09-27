import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cr-design-filename-confirmation',
  templateUrl: './cr-design-filename-confirmation.component.html',
  styleUrls: []
})
export class CrDesignFilenameConfirmationComponent implements OnInit {
  restoreAll
  constructor( public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.restoreAll = this.data.restore
  }

  goBack(check){
    this.dialogRef.close(check);
  }

}
