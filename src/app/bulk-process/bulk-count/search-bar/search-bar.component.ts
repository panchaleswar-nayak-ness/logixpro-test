import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
 
  @Input() view;
  @Input() orders;
  @Input() selectedOrders;
  @Input() status;
  @Input() batchSeleted: boolean;
  @Output() changeViewEmitter = new EventEmitter<any>();
  @Output() addItemEmitter = new EventEmitter<any>();
  @Output() createBatchEmit = new EventEmitter<any>();
  @Output() printDetailList = new EventEmitter<any>();
  searchText: string = "";
  suggestion: string = "";
  filteredOrders: any = [];
  @ViewChild('openAction') openAction: MatSelect;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchBoxField?.nativeElement.focus();
    }, 500);
  }
  ClearSearch(){
    this.suggestion = "";
    this.searchText = ""
    this.filteredOrders = []; 
    } 
  changeView(event: any) {
    this.changeViewEmitter.emit(event.value);
  }

  search(event: string) {
    if (this.view == "batch") {
      this.filteredOrders = this.orders.filter(function (str) { return str.batchId.toLowerCase().startsWith(event.toLowerCase()); });
      this.suggestion = this.filteredOrders[0]?.batchId;
    }
    else if (this.view == "tote") {
      this.filteredOrders = this.orders.filter(function (str) { return str.toteId.toString().toLowerCase().startsWith(event.toLowerCase()); });
      this.suggestion = this.filteredOrders[0]?.toteId;
    }
    else if (this.view == "order") {
      this.filteredOrders = this.orders.filter(function (str) { return str.orderNumber.toLowerCase().startsWith(event.toLowerCase()); });
      this.suggestion = this.filteredOrders[0]?.orderNumber;
    }
    if (event == "" || this.filteredOrders.length == 0) {
      this.filteredOrders = [];
      this.suggestion = "";
    }
  }

  addItem() {
    if (!this.batchSeleted && this.filteredOrders.length > 0) {
      this.addItemEmitter.emit(this.filteredOrders[0]);
      this.filteredOrders = [];
    }
    this.searchText = "";
    this.suggestion = "";
  }

  dropdownSelect(event: any) {
    if (!this.batchSeleted) {
      this.addItemEmitter.emit(event.option.value);
      this.filteredOrders = [];
    }
    this.searchText = "";
    this.suggestion = "";
  }

  PrintDetailList() {
    if (this.selectedOrders.length != 0) {
      this.printDetailList.emit();
    }
  }

  clearMatSelectList() {
    this.openAction?.options.forEach((data: MatOption) => data.deselect());
  }

  generateTranscAction(event: any) {
    this.clearMatSelectList();
  }
  CreateBatch(){
    if (this.selectedOrders.length != 0) {
    this.createBatchEmit.emit(true);
  }
}
}
