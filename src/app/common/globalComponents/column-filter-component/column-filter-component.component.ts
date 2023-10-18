import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { TableHeaderDefinitions } from '../../types/CommonTypes';

@Component({
  selector: 'app-column-filter-component',
  templateUrl: './column-filter-component.component.html',
  styleUrls: ['./column-filter-component.component.scss']
})
export class ColumnFilterComponentComponent implements OnInit {

  @Input() tableColumns : TableHeaderDefinitions[];
  @Input() searchCol: any = '';
  @Input() searchString: any = '';
  @Input() searchByInput = new Subject<string>();
  @Input() searchAutocompleteList;
  @Input() showClearBtn: boolean = false;

  @Output() selectionChangeEvent = new EventEmitter<Event>();
  @Output() autoCompleteEvent = new EventEmitter<string>();
  @Output() clearBtnEvent = new EventEmitter<Event>();

  
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);

  constructor() { }

  ngOnInit(): void {
  }

  selectionChange(event) {
    this.selectionChangeEvent.emit(event);
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

}
