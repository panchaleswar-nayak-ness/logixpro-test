import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss']
})
export class LocationDetailsComponent implements OnInit {

  @Input() reqDate : Date;
  @Input() isMoveQty : boolean = false;
  @Input() from_priority : number = 0;
  @Input() from_itemQuantity : number = 0;
  @Input() isDedicated : boolean = false;
  
  @Input() MoveFromDedicated : string = '';
  @Input() from_warehouse : string = '';
  @Input() from_locationShow : string = '';
  @Input() from_itemNo : string = '';
  @Input() from_description : string = '';
  @Input() from_itemQtyShow : string = '';
  @Input() from_cellSize : string = '';
  @Input() from_lotNo : string = '';
  @Input() from_serialNo : string = '';

  @Input() MoveToDedicated : string = '';
  @Input() to_warehouse : string = '';
  @Input() to_locationShow : string = '';
  @Input() to_itemNo : string = '';
  @Input() to_description : string = '';
  @Input() to_itemQtyShow : string = '';
  @Input() to_cellSize : string = '';
  @Input() to_lotNo : string = '';
  @Input() to_serialNo : string = '';
  @Input() fillQtytoShow : number = 0;

  @ViewChild('myInput') myInput: ElementRef<HTMLInputElement>;

  constructor() { }

  ngOnInit(): void {
  }

  restrictTo4Digits(): void {
    const inputElement = this.myInput.nativeElement;
    let value = inputElement.value.replace(/\D/g, ''); // Remove non-digit characters
    if (parseInt(value) > 2147483647) value = value.slice(0, 3);
    else value = value.slice(0, 4);
    inputElement.value = value;
  }

  onBlurPriority(){
    if(this.from_priority === undefined || this.from_priority === null) this.from_priority=0;
  }

}
