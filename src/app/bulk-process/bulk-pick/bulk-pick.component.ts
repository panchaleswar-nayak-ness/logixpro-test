import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bulk-pick',
  templateUrl: './bulk-pick.component.html',
  styleUrls: ['./bulk-pick.component.scss']
})
export class BulkPickComponent implements OnInit {

  verifyBulkPicks: boolean = false;
  status: any = {
    "batchCount": 38,
    "toteCount": 344,
    "orderCount": 344,
    "linesCount": 0
  }
  view:string = "batch";
  ordersDisplayedColumns: string[] = ['batchPickId', 'quantity', 'priority', 'requiredDate','actions'];
  selectedOrdersDisplayedColumns: string[] = ['batchPickId', 'toteNumber','actions'];
  orders: any = [];
  selectedOrders:any = [];

  constructor() { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(){
    this.orders = [
      {
        "id": 13502116,
        "orderNumber": "2943823A",
        "priority": 60,
        "toteId": 12345,
        "toteNumber": 0,
        "zone": "01",
        "batchPickId": "13202116-13502116",
        "exportBatchId": null,
        "lineNumber": 3,
        "transactionQuantity": 1,
        "requiredDate": "2022-12-20T17:30:00"
      },
      {
        "id": 13502117,
        "orderNumber": "2953823A",
        "priority": 60,
        "toteId": 12445,
        "toteNumber": 0,
        "zone": "01",
        "batchPickId": "13302116-13502116",
        "exportBatchId": null,
        "lineNumber": 3,
        "transactionQuantity": 1,
        "requiredDate": "2022-12-20T17:30:00"
      },
      {
        "id": 13502118,
        "orderNumber": "2963823A",
        "priority": 60,
        "toteId": 12545,
        "toteNumber": 0,
        "zone": "01",
        "batchPickId": "13402116-13502116",
        "exportBatchId": null,
        "lineNumber": 3,
        "transactionQuantity": 1,
        "requiredDate": "2022-12-20T17:30:00"
      },
      {
        "id": 13502119,
        "orderNumber": "2963823A",
        "priority": 60,
        "toteId": 12645,
        "toteNumber": 0,
        "zone": "01",
        "batchPickId": "13502116-13502116",
        "exportBatchId": null,
        "lineNumber": 3,
        "transactionQuantity": 1,
        "requiredDate": "2022-12-20T17:30:00"
      }
    ];
    this.selectedOrders = [];
  }

  pickProcess() {
    this.verifyBulkPicks = !this.verifyBulkPicks;
  }

  changeView(event:any){
    if(event == "batch"){
      this.ordersDisplayedColumns = ['batchPickId', 'quantity', 'priority', 'requiredDate','actions'];
      this.selectedOrdersDisplayedColumns = ['batchPickId', 'toteNumber','actions'];
    }
    else if(event == "tote"){
      this.ordersDisplayedColumns = ['toteId', 'quantity', 'priority', 'requiredDate','actions'];
      this.selectedOrdersDisplayedColumns = ['toteId', 'toteNumber','actions'];
    }
    else if(event == "order"){
      this.ordersDisplayedColumns = ['orderNumber', 'quantity', 'priority', 'requiredDate','actions'];
      this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber','actions'];
    }
    this.getOrders();
  }

  selectOrder(event:any){
    this.selectedOrders = [...this.selectedOrders,event];
    this.orders = this.orders.filter((x:any) => x.id != event.id);
  }

  removeOrder(event:any){
    this.orders = [...this.orders,event];
    this.selectedOrders = this.selectedOrders.filter((x:any) => x.id != event.id);
  }

  appendAll(){
    this.selectedOrders = [...this.selectedOrders,...this.orders];
    this.orders = [];
  }

  removeAll(){
    this.orders = [...this.orders,...this.selectedOrders];
    this.selectedOrders = [];
  }

}

