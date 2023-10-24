import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { TableHeaderDefinitions } from '../../types/CommonTypes';

@Component({
  selector: 'app-column-filter-component',
  templateUrl: './column-filter-component.component.html',
  styleUrls: []
})
export class ColumnFilterComponentComponent {

  @Input() tableColumns : TableHeaderDefinitions[];
  @Input() searchCol: any = '';
  @Input() searchString: any = '';
  @Input() searchByInput = new Subject<string>();
  @Input() searchAutocompleteList;
  @Input() showClearBtn: boolean = false;

  @Output() selectionChangeEvent = new EventEmitter<Event>();
  @Output() colKeyUpEnterEvent = new EventEmitter<Event>();
  @Output() searchKeyUpEnterEvent = new EventEmitter<Event>();
  @Output() searchKeyUpEvent = new EventEmitter();
  @Output() searchFocusEvent = new EventEmitter<Event>();
  @Output() clearInputFieldEvent = new EventEmitter();
  @Output() autoCompleteEvent = new EventEmitter<string>();
  @Output() optionSelectedEvent = new EventEmitter<string>();
  @Output() clearBtnEvent = new EventEmitter<Event>();

  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);

  compareObjects(o1: any, o2: any): boolean {
    return o1.colDef === o2.colDef && o1.colHeader === o2.colHeader;
  }

  selectionChange(event) {
    this.selectionChangeEvent.emit(event);
  }

  colKeyUpEnter(event) {
    this.colKeyUpEnterEvent.emit(event);
  }

  searchKeyUpEnter(event) {
    this.searchKeyUpEnterEvent.emit(event);
  }

  searchKeyUp(event) {
    this.searchKeyUpEvent.emit(this.searchString);
  }

  searchFocus(event) {
    this.searchFocusEvent.emit(event);
  }

  clearInputField(event) {
    this.clearInputFieldEvent.emit(event);
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  clearBtn(event) {
    this.clearBtnEvent.emit(event);
  }

  autoComplete(event) {
    this.autoCompleteEvent.emit(event);
  }
  
  optionSelected(event) {
    this.optionSelectedEvent.emit(this.searchString);
  }

}
