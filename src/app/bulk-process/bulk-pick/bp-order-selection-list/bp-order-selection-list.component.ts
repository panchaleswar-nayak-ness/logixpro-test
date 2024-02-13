import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-bp-order-selection-list',
  templateUrl: './bp-order-selection-list.component.html',
  styleUrls: ['./bp-order-selection-list.component.scss']
})
export class BpOrderSelectionListComponent implements OnInit {

  @Input() ordersDisplayedColumns: string[];
  @Input() orders: any = [];
  @Output() selectOrderEmitter = new EventEmitter<any>();
  @Output() appendAllEmitter = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
  }

  selectOrder(order:any){
    this.selectOrderEmitter.emit(order);
    this.orders = this.orders.filter((x:any) => x.id != order.id);
  }

  appendAll(){
    this.appendAllEmitter.emit();
  }



}
