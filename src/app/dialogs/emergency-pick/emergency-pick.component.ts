import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-emergency-pick',
  templateUrl: './emergency-pick.component.html',
  styleUrls: ['./emergency-pick.component.scss']
})
export class EmergencyPickComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialogRef: MatDialogRef<EmergencyPickComponent>
  ) { }

  cancel() {
    this.dialogRef.close('snooze');
  }

  proceedWithEmergencyPicks() {
    this.dialogRef.close('proceed');
  }

}
