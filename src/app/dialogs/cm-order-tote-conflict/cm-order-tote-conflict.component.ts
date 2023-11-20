import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cm-order-tote-conflict',
  templateUrl: './cm-order-tote-conflict.component.html',
  styleUrls: [],
})
export class CmOrderToteConflictComponent {
  order: any;
  constructor(public dialogRef: MatDialogRef<any>) {}

  async SubmitOrder() {
    if (this.order) this.dialogRef.close(this.order);
  }
}
