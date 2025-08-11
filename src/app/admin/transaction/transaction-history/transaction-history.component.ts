import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: [],
})
export class TransactionHistoryComponent  {
  startDateEvent: Date;
  endDateEvent: Event;
  orderNoEvent:Event;
  resetDateEvent:Event;
  clearEvent: Event;
  cleanFilter:Event;

  @Input() tabIndex:any;

  startDateChange(inputStartDate: Date) {
    this.startDateEvent = inputStartDate;
  }

  endDateChange(event: Event) {
    this.endDateEvent = event;
  }
 
  orderNoChange(event: Event) {
    this.orderNoEvent = event;
  }

  resetDate(event: Event){
    this.resetDateEvent=event;
  }
  
  onClearFromStatus(event: Event) {
    this.clearEvent = event; 
  }
  
  clearFilter(event: Event) {
    this.cleanFilter = event;
  }

}
