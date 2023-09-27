import { Component, OnInit ,Inject, ViewChildren, ElementRef, QueryList, Renderer2} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-tote',
  templateUrl: './filter-tote.component.html',
  styleUrls: []
})
export class FilterToteComponent implements OnInit {
  @ViewChildren('input_focus', { read: ElementRef }) input_focus: QueryList<ElementRef>;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<any>,private renderer: Renderer2) { }
  dateList:any;
  orderName;
  ngOnInit(): void {
   
    this.dateList=this.data.dates;
      this.orderName=this.data.orderName
  }

  ngAfterViewInit(){
    const inputElements = this.input_focus.toArray();
    const inputElement = inputElements[0].nativeElement as HTMLInputElement;
      this.renderer.selectRootElement(inputElement).focus();
  }
  selectDate(date){
    this.dialogRef.close({ selectedDate: date });
  }

}
