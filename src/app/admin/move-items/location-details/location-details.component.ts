import { Component, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Placeholders, StringConditions } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: []
})
export class LocationDetailsComponent {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  itemNumber: string = this.fieldMappings.itemNumber;

  @Input() reqDate : Date;
  @Input() isMoveQty : boolean = false;
  @Input() from_priority : number = 0;
  @Input() from_itemQuantity : number = 0;
  @Input() isDedicated : boolean = false;
  @Input() tableType : string = StringConditions.MoveFrom;
  stringConditions = StringConditions;
  placeholders = Placeholders;
  
  @Input() moveFromDedicated : string = '';
  @Input() from_warehouse : string = '';
  @Input() from_locationShow : string = '';
  @Input() from_itemNo : string = '';
  @Input() from_description : string = '';
  @Input() from_itemQtyShow : string = '';
  @Input() from_cellSize : string = '';
  @Input() from_lotNo : string = '';
  @Input() from_serialNo : string = '';

  @Input() moveToDedicated : string = '';
  @Input() to_warehouse : string = '';
  @Input() to_locationShow : string = '';
  @Input() to_itemNo : string = '';
  @Input() to_description : string = '';
  @Input() to_itemQtyShow : string = '';
  @Input() to_cellSize : string = '';
  @Input() to_lotNo : string = '';
  @Input() to_serialNo : string = '';
  @Input() fillQtytoShow : number = 0;

  @Output() setMoveQtyEmit = new EventEmitter();
  @Output() setDedicatedEmit = new EventEmitter();

  @Output() setReqDateEmit = new EventEmitter();
  @Output() setPriorityEmit = new EventEmitter();

  @ViewChild('myInput') myInput: ElementRef<HTMLInputElement>;

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

  setMoveQty() {
    this.setMoveQtyEmit.emit(this.from_itemQuantity);
  }

  setDedicated() {
    this.setDedicatedEmit.emit(this.isDedicated);
  }
  setReqDate() {
    this.setReqDateEmit.emit(this.reqDate);
  }
  setPriority() {
    this.setPriorityEmit.emit(this.from_priority);
  }

}
