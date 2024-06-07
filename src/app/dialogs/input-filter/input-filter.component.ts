import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-input-filter',
  templateUrl: './input-filter.component.html',
  styleUrls: ['./input-filter.component.scss'],
})
export class InputFilterComponent implements OnInit {
  @ViewChild('autFocus') autFocus: ElementRef;
  inputFiltersForm: FormGroup;
  text1: any;
  text2: any;
  SendData: any;
  condition: any;
  columnName: any;
  butttonText : string = "Submit";
  inputType : string = "text";
  
  dynamicText: string = 'Dynamic Text';
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.condition = this.data.Condition;
    this.columnName = this.data.FilterColumnName;
    this.dynamicText = this.data.dynamicText;
    this.butttonText = this.data.butttonText;
    this.inputType= this.data.inputType;
  }
  onSend(form?: any) {
    if (
      this.data.Condition == 'is between' &&
      this.data.TypeOfElement == 'date'
    ) {
      this.SendData = "'" + this.text1 + "'" + ' and ' + "'" + this.text2 + "'";
    } else if (
      this.data.Condition == 'is between' &&
      this.data.TypeOfElement == 'number'
    ) {
      this.SendData = this.text1 + ' and ' + this.text2;
    } else {
      this.SendData = this.text1;
    }
    const dictionary = {
      SelectedItem: this.SendData,
      SelectedColumn: this.data.FilterColumnName,
      Condition: this.data.Condition,
      Type: this.data.TypeOfElement,
    };
    this.dialogRef.close(dictionary);
  }
  ngAfterViewInit(): void {
    this.autFocus.nativeElement.focus();
  }
}
