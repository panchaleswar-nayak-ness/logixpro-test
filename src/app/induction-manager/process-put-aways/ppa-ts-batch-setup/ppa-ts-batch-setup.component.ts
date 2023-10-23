import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ppa-ts-batch-setup',
  templateUrl: './ppa-ts-batch-setup.component.html',
  styleUrls: ['./ppa-ts-batch-setup.component.scss']
})
export class PpaTsBatchSetupComponent implements OnInit {

  hideRequiredControlItem = new FormControl(false);
  floatLabelControlItem: any = new FormControl('item' as FloatLabelType);
  @Input() cellSize = '0';
  @Input() batchId = '';
  public status = 'Not Processed';
  searchByItem: any = new Subject<string>();
  @Input() searchAutocompleteItemNum: any = [];
  @Input() assignedZones = '';

  @Output() funCall = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  callFun(funName:any,funParam:any){
    this.funCall.emit({funName:funName,funParam:funParam});
  }

  getFloatLabelValueItem(): FloatLabelType {
    return this.floatLabelControlItem.value || 'item';
  }
  
}
