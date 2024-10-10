import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-order-number',
  templateUrl: './filter-order-number.component.html',
  styleUrls: ['./filter-order-number.component.scss'],
})
export class FilterOrderNumberComponent implements OnInit {
  orderNumberFilter: string[] = [];

  constructor(public dialogRef: MatDialogRef<FilterOrderNumberComponent>) {}

  ngOnInit(): void {}

  onPaste(event: ClipboardEvent) {
    if (event && event.clipboardData) {
      const pastedText = event.clipboardData.getData('text');
      this.orderNumberFilter = pastedText.split('\n');
      console.log(this.orderNumberFilter.join(','));
    }
  }

  close() {
    this.orderNumberFilter = [];
    this.dialogRef.close({ orderNumberFilter: this.orderNumberFilter });
  }

  applyFilter() {
    this.dialogRef.close({ orderNumberFilter: this.orderNumberFilter });
  }
}
