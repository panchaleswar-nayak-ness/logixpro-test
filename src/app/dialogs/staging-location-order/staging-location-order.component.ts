import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-staging-location-order',
  templateUrl: './staging-location-order.component.html',
  styleUrls: ['./staging-location-order.component.scss'],
})
export class StagingLocationOrderComponent {
  @ViewChild('fieldFocus') fieldFocus: ElementRef;

  order: any;
  constructor(public dialogRef: MatDialogRef<any>) {}

  ngAfterViewInit(): void {
    this.fieldFocus?.nativeElement.focus();
  }
  async SubmitOrder() {
    if (this.order) this.dialogRef.close(this.order);
  }
  closeOrder() {
    this.dialogRef.close(false);
  }
}
