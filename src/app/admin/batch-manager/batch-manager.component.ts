import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { CurrentTabDataService } from '../inventory-master/current-tab-data-service';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-batch-manager',
  templateUrl: './batch-manager.component.html',
  styleUrls: ['./batch-manager.component.scss']
})
export class BatchManagerComponent implements OnInit {  
  batchUpdater: Event;

  public userData : any;
  public iAdminApiService: IAdminApiService;
  orderList : any;
  transTypeEvent: Event;
  displayOrderCols : string[] = ["orderNumber", "countOfOrderNumber", "minOfPriority", "detail", "action"];
  selOrderList : any = [];
  type:any;
  isAutoBatch=false;
  batchManagerSettings : any = [];
  displaySelOrderCols : string[] = ["orderNumber", "countOfOrderNumber", "action"];
  permissions:any;
  seeOrderStatus:boolean;
  pickToTotes:boolean;
  extraField:any="";
  constructor(private Api : ApiFuntions, 
              private authService: AuthService,
              private adminApiService: AdminApiService,
              private currentTabDataService: CurrentTabDataService,
              private global:GlobalService
              ) { 
                this.permissions= JSON.parse(localStorage.getItem('userRights') ?? '');
                this.iAdminApiService = adminApiService;
              }

  ngOnInit(): void {
    this.orderList = [];
    this.selOrderList = [];
    this.userData = this.authService.userData();
    
    if (!this.ApplySavedItem())
      this.getOrders("Pick");
    this.seeOrderStatus=this.permissions.includes('Order Status')
    
  }
  onBatchUpdate(event: Event) {
    this.batchUpdater = event;
  } 
  ApplySavedItem() {
    if (this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER])  {
      let item= this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER];
      this.selOrderList = item.selOrderList;
      this.orderList = item.orderList;
      this.type = item.transType;
      return true;
    }
    return false;
  }
  RecordSavedItem() {
    this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER] = {
      selOrderList : this.selOrderList,
      orderList : this.orderList,
      type :this.type,
    }
  }


  getOrders(type : any) {
    this.transTypeEvent = type;
    this.type = type;
    let paylaod = {
      "transType": type
    }
    try {
      this.iAdminApiService.BatchManagerOrder(paylaod).subscribe((res: any) => {
        
        const { data, isExecuted } = res
        if (isExecuted && data.length > 0) {
          this.orderList = data;
          this.RecordSavedItem();
        } else {
          
          this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
          console.log("BatchManagerOrder", res.responseMessage);
        }
      
      
      });
      this.iAdminApiService.GetBatchManager(paylaod).subscribe((res: any) => {
        const { data, isExecuted } = res
        if (isExecuted) {
          this.batchManagerSettings = data.batchManagerSettings;

          this.pickToTotes=JSON.parse(this.batchManagerSettings[0].pickToTotes.toLowerCase())
          this.extraField=this.batchManagerSettings[0].extraField1;
          
        } else {
          
          this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
          console.log("GetBatchManager", res.responseMessage);
        }
      
       
      });
    } catch (error) { 
    }
  
  }
  getDeletedOrder(event){
    this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER] = undefined;
    this.ngOnInit();
  }
  addRemoveOrder(order : any, type : any) {
    if (type == 1) {
      this.orderList = this.orderList.filter(val => val.orderNumber !== order.orderNumber);
      this.selOrderList = [order, ...this.selOrderList];
      
      this.selOrderList.sort((a, b) => {
        const orderNumA = a.orderNumber.toLowerCase();
        const orderNumB = b.orderNumber.toLowerCase();
        if (orderNumA < orderNumB) return -1;
        if (orderNumA > orderNumB) return 1;
        return 0;
      });
      
    } else {
    
      this.selOrderList = this.selOrderList.filter(val => val.orderNumber !== order.orderNumber);
      this.orderList = [order, ...this.orderList];
    }
    this.RecordSavedItem();
  }
   
  addRemoveAllOrders(operation){
    if(operation === 'add'){
      this.isAutoBatch=true;

      let filteredOrderList=this.orderList.filter((el,i)=>{
        if(el.includeInAutoBatch){
          return this.orderList[i]
        }
      })
      const namesToDeleteSet = new Set(filteredOrderList); 
      const newArr = this.orderList.filter((name) => { 
        return !namesToDeleteSet.has(name);
      });

        this.orderList = newArr;
        this.selOrderList = [...this.selOrderList,...filteredOrderList];

    }
    else if(operation === 'remove'){
      this.isAutoBatch=false;
      this.orderList = [...this.orderList,...this.selOrderList];
      this.selOrderList = [];
    }
    this.RecordSavedItem();
  }
  batchCreated(event:any){
    if(event){
      this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER] = undefined;
      this.ngOnInit();
    }
  }

}
