import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-bp-order-selection-list',
  templateUrl: './bp-order-selection-list.component.html',
  styleUrls: ['./bp-order-selection-list.component.scss']
})
export class BpOrderSelectionListComponent implements OnInit {

  @Input() ordersDisplayedColumns: string[];
  @Input() orders: any = [];
  @Input() view;
  @Input() batchSeleted;
  @Output() selectOrderEmitter = new EventEmitter<any>();
  @Output() appendAllEmitter = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableHeading = "Batch Selection List";

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if(this.view == "batch"){
      this.tableHeading = "Batch Selection List";
    } 
    else if(this.view  == "tote"){
      this.tableHeading = "Tote Selection List";
    }
    else if(this.view  == "order"){
      this.tableHeading = "Order Selection List";
    }
  }

  selectOrder(order:any){
    if(!this.batchSeleted){
      this.selectOrderEmitter.emit(order);
      this.orders = this.orders.filter((x:any) => x.id != order.id);
    }
  }

  appendAll(){
    this.appendAllEmitter.emit();
  }



}
