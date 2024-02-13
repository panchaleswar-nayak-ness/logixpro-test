import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bp-search-bar',
  templateUrl: './bp-search-bar.component.html',
  styleUrls: ['./bp-search-bar.component.scss']
})
export class BpSearchBarComponent implements OnInit {

  @Input() view;
  @Input() orders;
  @Output() changeViewEmitter = new EventEmitter<any>();
  @Output() addItemEmitter = new EventEmitter<any>();
  searchText: string = "";
  suggestion: string = "";
  filteredOrders: any = [];

  constructor() { }

  ngOnInit(): void {
  }

  changeView(event: any) {
    this.changeViewEmitter.emit(event.value);
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
    this.addItemEmitter.emit(event);
    this.filteredOrders = [];
    this.searchText = "";
    this.suggestion = "";
  }
}
