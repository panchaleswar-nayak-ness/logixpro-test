import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';


@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent implements OnInit {
  startDateEvent: Event;
  endDateEvent: Event;
  orderNoEvent:Event;
  resetDateEvent:Event;

  clearEvent: Event;

  constructor() {}
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
  ngOnInit(): void {
  }
  

  onClearFromStatus(event: Event) {
    this.clearEvent = event; 
  }
}
