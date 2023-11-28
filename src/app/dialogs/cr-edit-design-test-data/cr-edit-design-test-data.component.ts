import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cr-edit-design-test-data',
  templateUrl: './cr-edit-design-test-data.component.html',
  styleUrls: ['./cr-edit-design-test-data.component.scss'],
})
export class CrEditDesignTestDataComponent {
  @ViewChild('descfocus') descfocus: ElementRef;
  text: any;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngAfterViewInit(): void {
    this.text = this.data ? this.data : '';
    this.descfocus.nativeElement.focus();
  }
  getDesignTestData() {
    this.dialogRef.close(this.text);
  }
}
