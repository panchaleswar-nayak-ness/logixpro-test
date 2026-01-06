import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventLogFilterField } from 'src/app/common/enums/admin/event-log-enums';
import { 
  AutoCompleteSearchEvent, 
  TypeAheadEvent, 
  SearchEvent, 
  SearchOnEnterEvent 
} from 'src/app/common/interface/admin/event/event-log.interfaces';

@Component({
  selector: 'app-event-log-panel-component',
  templateUrl: './event-log-panel-component.component.html',
  styleUrls: ['./event-log-panel-component.component.scss']
})
export class EventLogPanelComponentComponent {

  // Expose enum to template
  readonly FilterField = EventLogFilterField;

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
  @Output() dateEmit = new EventEmitter<{ startDate : string, endDate : string }>();
  @Output() autoCompleteSearchColumnEmit = new EventEmitter<AutoCompleteSearchEvent>();
  @Output() eventLogTypeAheadEmit = new EventEmitter<TypeAheadEvent>();
  @Output() searchEmit = new EventEmitter<SearchEvent>();
  @Output() clearEmit = new EventEmitter();
  @Output() clearFiltersEmit = new EventEmitter();
  @Output() searchOnEnterEmit = new EventEmitter<SearchOnEnterEvent>();

  ignoreDate: any;

  onIgnoreDateRange(event) {
    this.ignoreDate=event;
    this.ignoreDateRangeEmit.emit(event);
  }

  event(){
    this.dateEmit.emit({ startDate : this.startDate, endDate : this.endDate });
  }

  autocompleteSearchColumn(colName, msg, fieldName?){
    this.autoCompleteSearchColumnEmit.emit({colName, msg, fieldName});
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

  searchOnEnter(fieldName: string, value: string){
    this.searchOnEnterEmit.emit({fieldName, value});
  }

  /**
   * Handles keyup events for autocomplete search fields
   * Prevents autocomplete from firing when Enter key is pressed (handled separately)
   * @param event - Keyboard event
   * @param colName - Column name for the search
   * @param value - Current input value
   * @param fieldName - Field name from enum
   */
  handleKeyup(event: KeyboardEvent, colName: string, value: string, fieldName: string): void {
    // Ignore Enter key - it's handled by (keyup.enter) separately
    if (event.key === 'Enter') {
      return;
    }
    this.autocompleteSearchColumn(colName, value, fieldName);
  }
}
