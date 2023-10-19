import { Component, EventEmitter, Output, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-SLSearchOrderNumberTote',
  templateUrl: './sl-search-order-number-tote.component.html',
  styleUrls: []
})
export class SLSearchOrderNumberToteComponent implements OnInit {
  @Input() OrderNumberTote: string = '';

  @Output() clearAllEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() stagingOrderNumEvent: EventEmitter<{event : Event, ordTote : string}> = new EventEmitter();
  constructor() {
  }

  StagingLocsOrderNum(event: Event) {
    this.stagingOrderNumEvent.emit({event, ordTote : this.OrderNumberTote});
  }

  ngOnInit() {
  }

  clearAll() {
    this.clearAllEvent.emit();
  }
}
