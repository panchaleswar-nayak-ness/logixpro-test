import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-unquarantine-dialog',
  templateUrl: './unquarantine-dialog.component.html',
  styleUrls: []
})
export class UnquarantineDialogComponent implements OnInit {
  currentPageItemNo: number;
  checkboxValue: boolean = false;

  @Output() checkboxValueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<UnquarantineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.currentPageItemNo = this.data.currentPageItemNo;
  }

  checkCheckBoxvalue(event: any) {
    this.checkboxValue = event.checked;
    this.checkboxValueChanged.emit(this.checkboxValue);
  }
}
