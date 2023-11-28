import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../common/init/auth.service';
import { CurrentTabDataService } from '../inventory-master/current-tab-data-service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { AppPermissions, StringConditions, ToasterTitle, ToasterType, TransactionType, localStorageKeys ,Column} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-batch-manager',
  templateUrl: './batch-manager.component.html',
  styleUrls: ['./batch-manager.component.scss']
})

export class BatchManagerComponent implements OnInit {

  batchUpdater: Event;
  public userData: any;
  public iAdminApiService: IAdminApiService;
  orderList: any;
  transTypeEvent: Event;
  displayOrderCols: string[] = ["orderNumber", "countOfOrderNumber", "minOfPriority", "detail", "action"];
  selOrderList: any = [];
  type: any;
  isAutoBatch = false;
  batchManagerSettings: any = [];
  displaySelOrderCols: string[] = ["orderNumber", "countOfOrderNumber", "action"];
  permissions: any;
  seeOrderStatus: boolean;
  pickToTotes: boolean;
  extraField: any = "";

  constructor(
    private authService: AuthService,
    public adminApiService: AdminApiService,
    private currentTabDataService: CurrentTabDataService,
    private global: GlobalService
  ) {
    this.permissions = JSON.parse(localStorage.getItem(localStorageKeys.UserRights) ?? '');
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  initializeComponent() {
    this.orderList = [];
    this.selOrderList = [];
    this.userData = this.authService.userData();
    if (!this.applySavedItem())
      this.getOrders(TransactionType.Pick);
    this.seeOrderStatus = this.permissions.includes(AppPermissions.OrderStatus);
  }

  onBatchUpdate(event: Event) {
    this.batchUpdater = event;
  }

  applySavedItem() {
    if (this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER]) {
      let item = this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER];
      this.selOrderList = item.selOrderList;
      this.orderList = item.orderList;
      this.type = item.transType;
      return true;
    }
    return false;
  }

  recordSavedItem() {
    this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER] = {
      selOrderList: this.selOrderList,
      orderList: this.orderList,
      type: this.type,
    }
  }

  getOrders(type: any) {
    this.transTypeEvent = type;
    this.type = type;
    let paylaod = {
      'transType': type
    }
    try {
      this.iAdminApiService.BatchManagerOrder(paylaod).subscribe((res: any) => {
        const { data, isExecuted } = res
        if (isExecuted && data.length > 0) {
          this.orderList = data;
          this.recordSavedItem();
        } else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("BatchManagerOrder", res.responseMessage);
        }
      });
      this.iAdminApiService.GetBatchManager(paylaod).subscribe((res: any) => {
        const { data, isExecuted } = res
        if (isExecuted) {
          this.batchManagerSettings = data.batchManagerSettings;
          this.pickToTotes = JSON.parse(this.batchManagerSettings[0].pickToTotes.toLowerCase())
          this.extraField = this.batchManagerSettings[0].extraField1;
        } else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("GetBatchManager", res.responseMessage);
        }
      });
    } catch (error) {
    }
  }

  getDeletedOrder() {
    this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER] = undefined;
    this.initializeComponent;
  }

  addRemoveOrder(order: any, type: any) {
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
    this.recordSavedItem();
  }

  addRemoveAllOrders(operation) {
    if (operation === StringConditions.Add) {
      this.isAutoBatch = true;
      let filteredOrderList = this.orderList.filter((el, i) => {
        if (el.includeInAutoBatch) {
          return this.orderList[i]
        }
      })
      const namesToDeleteSet = new Set(filteredOrderList);
      const tempOrderList = this.orderList.filter((name) => {
        return !namesToDeleteSet.has(name);
      });
      this.orderList = tempOrderList;
      this.selOrderList = [...this.selOrderList, ...filteredOrderList];
    }
    else if (operation === StringConditions.Remove) {
      this.isAutoBatch = false;
      this.orderList = [...this.orderList, ...this.selOrderList];
      this.selOrderList = [];
    }
    this.recordSavedItem();
  }

  batchCreated(event: any) {
    if (event) {
      this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER] = undefined;
      this.initializeComponent;
    }
  }

}
