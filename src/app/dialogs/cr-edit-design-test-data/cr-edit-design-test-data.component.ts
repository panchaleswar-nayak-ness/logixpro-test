import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cr-edit-design-test-data',
  templateUrl: './cr-edit-design-test-data.component.html',
  styleUrls: [],
})
export class CrEditDesignTestDataComponent {
  @ViewChild('desc_focus') desc_focus: ElementRef;
  Text: any;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngAfterViewInit(): void {
    this.Text = this.data ? this.data : '';
    this.desc_focus.nativeElement.focus();
  }
  getDesignTestData() {
    this.dialogRef.close(this.Text);
  }
}
