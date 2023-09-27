import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  selector: 'app-input-filter',
  templateUrl: './input-filter.component.html',
  styleUrls: []
})
export class InputFilterComponent implements OnInit {
  @ViewChild('aut_focus') aut_focus: ElementRef;
  InputFiltersForm: FormGroup;
  text1:any
  text2:any
  SendData: any
  condition:any
  columnName:any
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

  ngOnInit(): void {
     
    this.condition = this.data.Condition;
    this.columnName = this.data.FilterColumnName;
  }
  onSend(form?: any) {
    if(this.data.Condition == "is between" && this.data.TypeOfElement == 'date')
    {
         this.SendData = "'" + this.text1 + "'" + " and " +  "'" + this.text2 + "'";
    }
    else if(this.data.Condition == "is between" && this.data.TypeOfElement == 'number')
    {
      this.SendData = this.text1 + " and " + this.text2;
    }
    else
    {
          this.SendData = this.text1;
    }
    const dictionary = {
      'SelectedItem':  this.SendData,
      'SelectedColumn': this.data.FilterColumnName,
      'Condition':this.data.Condition,
      'Type' : this.data.TypeOfElement
    };
    this.dialogRef.close(dictionary);
  }
  ngAfterViewInit(): void {
    this.aut_focus.nativeElement.focus();
  }
}