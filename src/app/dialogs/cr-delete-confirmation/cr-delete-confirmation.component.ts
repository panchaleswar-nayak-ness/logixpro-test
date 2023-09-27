import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cr-delete-confirmation',
  templateUrl: './cr-delete-confirmation.component.html',
  styleUrls: []
})
export class CrDeleteConfirmationComponent {

  constructor(public dialogRef: MatDialogRef<any>) { }


  deleteReport(check){
    this.dialogRef.close(check);
  }

}
