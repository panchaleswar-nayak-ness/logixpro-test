import { Component, EventEmitter, Output,Input } from '@angular/core';

@Component({
  selector: 'app-SLSearchOrderNumberTote',
  templateUrl: './sl-search-order-number-tote.component.html',
  styleUrls: []
})
export class SLSearchOrderNumberToteComponent {
  
  @Input() orderNumberTote: string = '';
  @Output() clearAllEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() stagingOrderNumEvent: EventEmitter<{event : Event, ordTote : string}> = new EventEmitter();
 
  StagingLocsOrderNum(event: Event) {
    this.stagingOrderNumEvent.emit({event, ordTote : this.orderNumberTote});
  }

  clearAll() {
    this.clearAllEvent.emit();
  }
}
