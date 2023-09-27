import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: []
})
export class AddNotesComponent {
  @ViewChild('notes_focus') notes_focus: ElementRef;
  notes:string;
  numberOfLines = 8;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<any>) { 
    this.notes=data?.notes && data.notes;
  }

 

  submit(){
    this.dialogRef.close(this.notes);
  }
  ngAfterViewInit() {
    this.notes_focus.nativeElement.focus();
  }
}
