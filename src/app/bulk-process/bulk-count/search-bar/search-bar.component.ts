import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  @Output() changeViewEmitter = new EventEmitter<any>();
  @Output() addItemEmitter = new EventEmitter<any>();
  @Output() printDetailList = new EventEmitter<any>();
  @Output() createBatchEmit = new EventEmitter<any>();
  
  searchText: string = "";
  suggestion: string = "";
  filteredOrders: any = [];
  @ViewChild('openAction') openAction: MatSelect;

  constructor() { }

  ngOnInit(): void {
  }

  changeView(event: any) {
    this.changeViewEmitter.emit(event.value);
  }
  CreateBatch(){
    this.createBatchEmit.emit(true);
  }
  search(event: any) {
    if (this.view == "batch") {
      this.filteredOrders = this.orders.filter(function (str) { return str.batchPickId.startsWith(event); });
      this.suggestion = this.filteredOrders[0]?.batchPickId;
    }
    else if (this.view == "tote") {
      this.filteredOrders = this.orders.filter(function (str) { return str.toteId.toString().startsWith(event); });
      this.suggestion = this.filteredOrders[0]?.toteId;
    }
    else if (this.view == "order") {
      this.filteredOrders = this.orders.filter(function (str) { return str.orderNumber.startsWith(event); });
      this.suggestion = this.filteredOrders[0]?.orderNumber;
    }
    if (event == "" || this.filteredOrders.length == 0) {
      this.filteredOrders = [];
      this.suggestion = "";
    }
  }

  addItem() {
    if (this.filteredOrders.length > 0) {
      this.addItemEmitter.emit(this.filteredOrders[0]);
      this.filteredOrders = [];
      this.searchText = "";
      this.suggestion = "";
    }
  }

  dropdownSelect(event: any) {
    this.addItemEmitter.emit(event.option.value);
    this.filteredOrders = [];
    this.searchText = "";
    this.suggestion = "";
  }

  PrintDetailList(){
    if(this.selectedOrders.length != 0){
      this.printDetailList.emit();
    }
  }

  clearMatSelectList() {
    this.openAction?.options.forEach((data: MatOption) => data.deselect());
  }

  generateTranscAction(event: any) {
    this.clearMatSelectList();
  }
  
}
