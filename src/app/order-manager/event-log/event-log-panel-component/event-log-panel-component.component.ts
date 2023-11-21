import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-event-log-panel-component',
  templateUrl: './event-log-panel-component.component.html',
  styleUrls: ['./event-log-panel-component.component.scss']
})
export class EventLogPanelComponentComponent {

  @Input() ignoreDateRange : boolean;
  @Input() startDate : any;
  @Input() endDate : any;
  @Input() message : any;
  @Input() eventLocation : string;
  @Input() searchAutocompleteList : any;
  @Input() eventCode : string;
  @Input() eventType : string;
  @Input() userName : string;

  @Output() ignoreDateRangeEmit = new EventEmitter<any>();
  @Output() dateEmit : EventEmitter<{ startDate : string, endDate : string }> = new EventEmitter();
  @Output() autoCompleteSearchColumnEmit : EventEmitter<{colName : string, msg : string}> = new EventEmitter();
  @Output() eventLogTypeAheadEmit : EventEmitter<{colName : string, msg : string, loader : boolean}> = new EventEmitter();
  @Output() searchEmit : EventEmitter<{event : any, msg : string}> = new EventEmitter();
  @Output() clearEmit = new EventEmitter();
  @Output() clearFiltersEmit = new EventEmitter();

  ignoreDate: any;

  onIgnoreDateRange(event) {
    this.ignoreDate=event;
    this.ignoreDateRangeEmit.emit(event);
  }

  event(){
    this.dateEmit.emit({ startDate : this.startDate, endDate : this.endDate });
  }

  autocompleteSearchColumn(colName, msg){
    this.autoCompleteSearchColumnEmit.emit({colName, msg});
  }

  eventLogTypeAhead(colName, msg, loader){
    this.eventLogTypeAheadEmit.emit({colName, msg, loader});
  }

  search(event, msg){
    this.searchEmit.emit({event, msg});
  }

  clear(field:any = ""){
    this.clearEmit.emit(field);
  }

  clearFilters(){
    this.eventLocation = "";
    this.userName = "";
    this.message = "";
    this.eventCode='';
    this.eventType='';
    this.ignoreDateRangeEmit.emit(this.ignoreDate);
    this.dateEmit.emit({ startDate : this.startDate, endDate : this.endDate });
    this.clearFiltersEmit.emit();
  }
}
