import { Component, OnInit } from '@angular/core';
import { BmToteidEntryComponent } from 'src/app/admin/dialogs/bm-toteid-entry/bm-toteid-entry.component';
import { DialogConstants } from 'src/app/common/constants/strings.constants';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-bulk-pick',
  templateUrl: './bulk-pick.component.html',
  styleUrls: ['./bulk-pick.component.scss']
})
export class BulkPickComponent implements OnInit {

  verifyBulkPicks: boolean = false;
  status: any = { }
  view:string = "";
  NextToteID:any;
  ordersDisplayedColumns: string[] = ['batchPickId', 'quantity', 'priority', 'requiredDate','actions'];
  selectedOrdersDisplayedColumns: string[] = ['orderNumber', 'toteNumber'];
  orders: any = [];
  Prefernces:any;
  selectedOrders:any = [];

  public iBulkProcessApiService: IBulkProcessApiService;
  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    private global: GlobalService
  ) { 
    this.iBulkProcessApiService = bulkProcessApiService;
  }

  ngOnInit(): void {
    this.bulkPickoOrderBatchToteQty();
    this.getworkstationbulkzone();
    this.BatchNextTote();
  }

  bulkPickoOrderBatchToteQty(){
    let paylaod = {
      "type": 'pick'
    }
    this.iBulkProcessApiService.bulkPickoOrderBatchToteQty(paylaod).subscribe((res: any) => {
      if (res) {
        this.status = res;
        this.status.linesCount = 0;
        if(this.status.batchCount > 0){
          this.bulkPickBatches();
          this.view = "batch";
        }
        else if(this.status.toteCount > 0){
          this.bulkPickTotes();
          this.view = "tote";
        }
        else{
          this.bulkPickOrders();
          this.view = "order";
        }
      }
      this.changeView(this.view);
    });
  }

  bulkPickBatches(){
    let paylaod = {
      "type": 'pick',
      "start": 1,
      "size": 500,
      "status": "open",
      "area":" "
    }
    this.iBulkProcessApiService.bulkPickBatches(paylaod).subscribe((res: any) => {
      if (res) {
        this.orders = res;
        this.selectedOrders = [];
      }
    });
  }
  
  bulkPickTotes(){
    let paylaod = {
      "type": 'pick',
      "start": 1,
      "size": 50,
      "status": "open",
      "area":" "
    }
    this.iBulkProcessApiService.bulkPickTotes(paylaod).subscribe((res: any) => {
      if (res) {
        this.orders = res;
        this.selectedOrders = [];
      }
    });
  }

  bulkPickOrders(){
    let paylaod = {
      "type": 'pick',
      "start": 1,
      "size": 50,
      "status": "open",
      "area":" "
    }
    this.iBulkProcessApiService.bulkPickOrders(paylaod).subscribe((res: any) => {
      if (res) {
        this.orders = res;
        this.selectedOrders = [];
      }
    });
  }

  pickProcess() {
    if(this.Prefernces?.pickToTotes ){
        this.OpenNextToteId();
    }else this.verifyBulkPicks = !this.verifyBulkPicks;
  }

  changeView(event:any){
    this.view = event;
    if(event == "batch"){
      this.ordersDisplayedColumns = ['batchPickId', 'quantity', 'priority', 'requiredDate','actions'];
      this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber']; //,'actions'
      this.bulkPickBatches();
    }
    else if(event == "tote"){
      this.ordersDisplayedColumns = ['toteId', 'quantity', 'priority', 'requiredDate','actions'];
      this.selectedOrdersDisplayedColumns = ['toteId', 'toteNumber','actions'];
      this.bulkPickTotes();
    }
    else if(event == "order"){
      this.ordersDisplayedColumns = ['orderNumber', 'quantity', 'priority', 'requiredDate','actions'];
      this.selectedOrdersDisplayedColumns = ['orderNumber', 'toteNumber','actions'];
      this.bulkPickOrders();
    }
  }

  selectOrder(event:any){  
    if(this.view == "batch"){
      let paylaod = {
        "type": 'pick',
        "batchpickid": event.batchPickId, 
        "status": "open", 
      }
      this.iBulkProcessApiService.bulkPickBatchId(paylaod).subscribe((res: any) => {
        if (res) { 
          this.selectedOrders = res;
        }
      });
    }else   this.selectedOrders = [...this.selectedOrders,event]; 
    this.orders = this.orders.filter((x:any) => x.id != event.id);
    this.status.linesCount = this.status.linesCount + 1;
  }
OpenNextToteId(){
 let dialogRefTote = this.global.OpenDialog(BmToteidEntryComponent, {
    height: 'auto',
    width: '990px',
    autoFocus: DialogConstants.autoFocus,
    disableClose: true , 
    data: {
      selectedOrderList: this.selectedOrders,
      nextToteID: this.NextToteID,
      BulkProcess:true,
      checkForValidTotes:this.Prefernces.checkForValidTotes
    }
  });
  dialogRefTote.afterClosed().subscribe((result) => { 
    if(result == true){
      this.verifyBulkPicks = !this.verifyBulkPicks;
    }
  });
}
  removeOrder(event:any){
    this.orders = [...this.orders,event];
    this.selectedOrders = this.selectedOrders.filter((x:any) => x.id != event.id);
    this.status.linesCount = this.status.linesCount - 1;
  }

  appendAll(){
    this.selectedOrders = [...this.selectedOrders,...this.orders];
    this.orders = [];
  }
getworkstationbulkzone(){
   this.iBulkProcessApiService.bulkPreferences().subscribe((res:any)=>{
    this.Prefernces = res.workstationPreferences[0];
  }) 
}
BatchNextTote(){
  this.iBulkProcessApiService.BatchNextTote().subscribe((res:any)=>{
   this.NextToteID = res;
 }) 
}

  removeAll(){
    if(this.view == "batch") this.bulkPickBatches();
    else this.orders = [...this.orders,...this.selectedOrders];
    this.selectedOrders = [];
  }
 
}

