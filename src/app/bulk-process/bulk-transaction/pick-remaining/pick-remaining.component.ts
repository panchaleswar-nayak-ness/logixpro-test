import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogsCloseMessage } from 'src/app/common/constants/strings.constants';
import { DisplayEOBResponse } from 'src/app/common/types/bulk-process/bulk-transactions';

@Component({
  selector: 'app-pick-remaining',
  templateUrl: './pick-remaining.component.html',
  styleUrls: ['./pick-remaining.component.scss'],
})
export class PickRemainingComponent {
  ordersDisplayedColumns: string[] = ["zone", "orderNumber", "toteNumber", "toteID", "picksQTY"];
  orders: DisplayEOBResponse[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DisplayEOBResponse[],
    public dialogRef: MatDialogRef<PickRemainingComponent>
  ) {
    this.orders = this.data;
  }

  ClosePopup() {
    this.dialogRef.close(DialogsCloseMessage.Yes);
  }
}
