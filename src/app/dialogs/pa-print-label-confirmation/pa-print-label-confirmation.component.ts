import { Component } from '@angular/core'; 
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pa-print-label-confirmation',
  templateUrl: './pa-print-label-confirmation.component.html',
  styleUrls: [ ],
})
export class PaPrintLabelConfirmationComponent {
  numberLabel: number = 0;
  constructor(
    public dialogRef: MatDialogRef<PaPrintLabelConfirmationComponent>
  ) {}

  sendData() {
    this.dialogRef.close(this.numberLabel);
  }
}
