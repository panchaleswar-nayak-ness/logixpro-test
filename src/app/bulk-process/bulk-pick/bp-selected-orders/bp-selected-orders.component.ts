import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-bp-selected-orders',
  templateUrl: './bp-selected-orders.component.html',
  styleUrls: ['./bp-selected-orders.component.scss']
})
export class BpSelectedOrdersComponent implements OnInit {

  @Input() selectedOrdersDisplayedColumns: string[];
  @Input() selectedOrders: any = [];
  @Input() view;
  @Output() removeOrderEmitter = new EventEmitter<any>();
  @Output() removeAllEmitter = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableHeading = "Selected Batches";

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if(this.view == "batch"){
      this.tableHeading = "Selected Batches";
    } 
    else if(this.view  == "tote"){
      this.tableHeading = "Selected Totes";
    }
    else if(this.view  == "order"){
      this.tableHeading = "Selected Orders";
    }
  }

  removeOrder(order: any) {
    this.removeOrderEmitter.emit(order);
    this.selectedOrders = this.selectedOrders.filter((x: any) => x.id != order.id);
  }

  
  removeAll(){
    this.removeAllEmitter.emit();
  }

}
