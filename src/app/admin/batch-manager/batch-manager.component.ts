import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { CurrentTabDataService } from '../inventory-master/current-tab-data-service';

const ELEMENT_DATA: any = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', action: ''},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', action: ''},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', action: ''},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', action: ''},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', action: ''},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', action: ''},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', action: ''},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', action: ''},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', action: ''},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', action: ''},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na', action: ''},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg', action: ''},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al', action: ''},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si', action: ''},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P', action: ''},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S', action: ''},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl', action: ''},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar', action: ''},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K', action: ''},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca', action: ''},
];

const INVMAP_DATA = [
  { colHeader: "location", colDef: "Location" },
  { colHeader: "zone", colDef: "Zone" },
  { colHeader: "carousel", colDef: "Carousel" },
  { colHeader: "row", colDef: "Row" },
  { colHeader: "shelf", colDef: "Shelf" },
  { colHeader: "bin", colDef: "Bin" },
  { colHeader: "itemNumber", colDef: "Item Number" },
  { colHeader: "itemQuantity", colDef: "Item Quantity" },
  { colHeader: "description", colDef: "Description" },
  { colHeader: "cellSize", colDef: "Cell Size" },
  { colHeader: "goldenZone", colDef: "Velocity Code" },
  { colHeader: "maximumQuantity", colDef: "Maximum Quantity" },
  { colHeader: "dedicated", colDef: "Dedicated" },
  { colHeader: "serialNumber", colDef: "Serial Number" },
  { colHeader: "lotNumber", colDef: "Lot Number" },
  { colHeader: "expirationDate", colDef: "Expiration Date" },
  { colHeader: "unitOfMeasure", colDef: "Unit of Measure" },
  { colHeader: "quantityAllocatedPick", colDef: "Quantity Allocated Pick" },
  { colHeader: "quantityAllocatedPutAway", colDef: "Quantity Allocated Put Awa" },
  { colHeader: "putAwayDate", colDef: "Put Away Date" },
  { colHeader: "warehouse", colDef: "Warehouse" },
  { colHeader: "revision", colDef: "Revision" },
  { colHeader: "invMapID", colDef: "Inv Map ID" },
  { colHeader: "userField1", colDef: "User Field1" },
  { colHeader: "userField2", colDef: "User Field2" },
  { colHeader: "masterLocation", colDef: "Master Location" },
  { colHeader: "dateSensitive", colDef: "Date Sensitive" },
  { colHeader: "masterInvMapID", colDef: "Master Inv Map ID" },
  { colHeader: "minQuantity", colDef: "Min Quantity" },
  { colHeader: "laserX", colDef: "Laser X" },
  { colHeader: "laserY", colDef: "Laser Y" },
  { colHeader: "locationNumber", colDef: "Location Number" },
  { colHeader: "locationID", colDef: "Alternate Light" },
  { colHeader: "qtyAlcPutAway", colDef: "Quantity Allocated Put Away" },
];

@Component({
  selector: 'app-batch-manager',
  templateUrl: './batch-manager.component.html',
  styleUrls: ['./batch-manager.component.scss']
})
export class BatchManagerComponent implements OnInit {  
  batchUpdater: Event;

  public userData : any;
  
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
              private currentTabDataService: CurrentTabDataService
              ) { 
                this.permissions= JSON.parse(localStorage.getItem('userRights') ?? '');
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
      "transType": type,
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }
    try {
      this.Api.BatchManagerOrder(paylaod).subscribe((res: any) => {
        
        const { data, isExecuted } = res
        if (isExecuted && data.length > 0) {
          this.orderList = data;
          this.RecordSavedItem();
        } 
      
      
      });
      this.Api.GetBatchManager(paylaod).subscribe((res: any) => {
        const { data, isExecuted } = res
        if (isExecuted) {
          this.batchManagerSettings = data.batchManagerSettings;

          this.pickToTotes=JSON.parse(this.batchManagerSettings[0].pickToTotes.toLowerCase())
          this.extraField=this.batchManagerSettings[0].extraField1;
          
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
