import { Component} from '@angular/core';
import {  } from '../om-user-field-data/om-user-field-data.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pa-print-label-confirmation',
  templateUrl: './pa-print-label-confirmation.component.html',
  styleUrls: []
})
export class PaPrintLabelConfirmationComponent {
  numberLabel:number = 0
  constructor( public dialogRef: MatDialogRef<PaPrintLabelConfirmationComponent>) { }

 

  sendData(){
    this.dialogRef.close(this.numberLabel);
  }

}
