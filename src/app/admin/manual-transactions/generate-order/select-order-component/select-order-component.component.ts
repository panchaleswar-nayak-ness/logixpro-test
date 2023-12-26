import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-select-order-component',
  templateUrl: './select-order-component.component.html',
  styleUrls: [],
})
export class SelectOrderComponentComponent implements OnInit{

  @ViewChild('matRef') matRef: MatSelect;
  @Input() orderNumber: string;
  @Output() orderTableData: EventEmitter<any> = new EventEmitter();
  @Output() clear: EventEmitter<any> = new EventEmitter();
  @Output() transTypeEmitter: EventEmitter<any> = new EventEmitter();
  @Output() autocompleteSearchColumn: EventEmitter<any> = new EventEmitter();
  @Output() getOrderTableData:EventEmitter<any> =new EventEmitter();
  @Output() orderNumberEmitter:EventEmitter<any>=new EventEmitter();
  @Output() searchData: EventEmitter<any> = new EventEmitter();
  @Output() actionDialog: EventEmitter<{ param1: boolean, param2: any }> = new EventEmitter();
  floatLabelType: FloatLabelType;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  @Input() transType: string;
  @Input() selectedOption: any;
  @Input() isPost: boolean = false;

  searchByInput: any = new Subject<string>();
  @Input() searchAutocompleteList: string[] = [];
  selectedOrder: string;
  toteID: any;
  userData: any;
  itemNumberForInsertion: any;

  public iAdminApiService: IAdminApiService;
  dataSource: MatTableDataSource<unknown>;
  
  ngOnInit(): void {
    this.searchByInput
      .pipe(debounceTime(400))
      .subscribe(() => {
        console.log(this.orderNumber)
        this.autocompleteSearchColumn.emit(this.orderNumber);
        this.getOrderTableData.emit(this.orderNumber);
      });
  }

  onOrderNoChange() {
    this.orderNumberEmitter.emit(this.orderNumber);
  }
  onTransTypeChange() {
    this.transTypeEmitter.emit(this.transType);
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }
  clearMatSelectList(){
    this.matRef?.options.forEach((data: MatOption) => data.deselect());
  }
}
