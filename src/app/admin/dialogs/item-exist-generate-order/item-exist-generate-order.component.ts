import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-item-exist-generate-order',
  templateUrl: './item-exist-generate-order.component.html',
  styleUrls: []
})
export class ItemExistGenerateOrderComponent implements OnInit {
  itemNumber;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>
  ) {}

  ngOnInit(): void {
    this.itemNumber = this.data.itemNumber;
  }
}
