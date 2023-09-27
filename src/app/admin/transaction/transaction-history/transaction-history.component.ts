import {
  Component,
} from '@angular/core';


@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: [],
})
export class TransactionHistoryComponent {
  startDateEvent: Event;
  endDateEvent: Event;
  orderNoEvent:Event;
  resetDateEvent:Event;

  clearEvent: Event;

  
  startDateChange(event: Event) {
    this.startDateEvent = event;
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
}
