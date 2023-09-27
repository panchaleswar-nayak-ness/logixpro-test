import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-description',
  templateUrl: './update-description.component.html',
  styleUrls: []
})
export class UpdateDescriptionComponent{
  @ViewChild('des_focus') des_focus: ElementRef;
  // updateItemNumber : boolean = true;
  addItem : boolean = true;

  constructor(public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

 

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngAfterViewInit() {
    this.des_focus.nativeElement.focus();
  }
}
