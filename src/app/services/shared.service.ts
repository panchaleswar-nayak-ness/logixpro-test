import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs'; 
import { ApiFuntions } from './ApiFuntions';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private api: ApiFuntions) { }
  loadMenu: boolean = false;
  private data: any;
  private menuData = new Subject<any>();
  public SidebarMenupdate = new Subject<any>();

  menuData$ = this.menuData.asObservable();

  private appData: any;
  SideBarMenu: Subject<any> = new Subject<any>(); 
  startMenu: Subject<any> = new Subject<any>(); 
  updateAdminMenuObserver: Subject<boolean> = new Subject<boolean>(); // observing that bool
  updateFlowrackMenuObserver: Subject<any> = new Subject<any>(); // observing that bool
  updateInductionAdminObserver: Subject<any> = new Subject<any>();
  orderStatusObserver: Subject<any> = new Subject<any>();
  itemObserver: Subject<any> = new Subject<any>();
  historyItemObserver: Subject<any> = new Subject<any>();
  reprocessItemObserver: Subject<any> = new Subject<any>();
  orderStatusObjObserver: Subject<any> = new Subject<any>();
  orderStatusSendOrderObserver: Subject<any> = new Subject<any>();
  historyLocObserver: Subject<any> = new Subject<any>();
  appRestrictionObserver: Subject<any> = new Subject<any>();
  fieldNameObserver: Subject<any> = new Subject<any>();
  updateReprocessObserver: Subject<any> = new Subject<any>();
  updateToteFilterCheckObserver: Subject<any> = new Subject<any>();
  updateCompDateObserver: Subject<any> = new Subject<any>();
  updateOrderStatusSelectObserver: Subject<any> = new Subject<any>();
  batchManagerObserver: Subject<any> = new Subject<any>();
  breadCrumObserver: Subject<any> = new Subject<any>();
  invMasterParentObserver: Subject<any> = new Subject<any>();
  devicePrefObserver: Subject<any> = new Subject<any>();
  updateInductionMenuObserver: Subject<any> = new Subject<any>();
  updateMenuFromInside: Subject<any> = new Subject<any>();
  sideMenuHideObserver: Subject<any> = new Subject<any>();
  PrintServiceObserver: Subject<any> = new Subject<any>();
  

  BroadCastInductionMenuUpdate(str: any) {
    this.updateInductionMenuObserver.next(str);
  }
   
  resetSidebar() {
    this.startMenu.next(true);
  }

  updateSidebar() {
    this.loadMenu = !this.loadMenu;
    return this.loadMenu;
  }

  updateAdminMenu() {
    this.updateAdminMenuObserver.next(true);
  }

  updateInductionAdminMenu(
    menu // on side menu update induction menu
  ) {
    this.updateInductionAdminObserver.next(menu);
  }
  updateFlowrackMenu(
    menu // on side menu update induction menu
  ) {
    this.updateFlowrackMenuObserver.next(menu);
  }
  updateOrderStatus(order) {
    // order status observer for selecting order number when passing toteid and set order fields
    this.orderStatusObserver.next(order);
  }
  updateItemTransaction(item) {
    // changes select field to item number and passes item number to field in Open Transaction
    this.itemObserver.next(item);
  }
  updateTransactionHistory(item) {
    //changes select field to item number and passes item number to field in Transaction History
    this.historyItemObserver.next(item);
  }
  updateTransactionLocHistory(loc) {
    //changes select field to location and passes location to field in Transaction History
    this.historyLocObserver.next(loc);
  }
  updateTransactionReprocess(item) {
    //changes select field to item number and passes item number to field in Rreprocess
    this.reprocessItemObserver.next(item);
  }
  updateFilterByTote(obj) {
    // passing data of coming from filter of tote passing to order list for filtering
    this.orderStatusObjObserver.next(obj);
  }
  updateAppVerification(isVerified?) {
    this.appRestrictionObserver.next(isVerified);
  }
  updateFieldNames(fieldName?) {
    this.fieldNameObserver.next(fieldName);
  }
  updateLoadMenuFunction(url?) {
    this.updateMenuFromInside.next(url);
  }

  updateReprocess(obj?) {
    // passing item number and order number in reprocess transaction
    this.updateReprocessObserver.next(obj);
  }

  updateToteFilterCheck(isChecked) {
    // toggle check box if tote filter present in order status
    this.updateToteFilterCheckObserver.next(isChecked);
  }

  updateOrderStatusOrderNo(orderNumber) {
    this.orderStatusSendOrderObserver.next(orderNumber);
  }
  updateCompDate(selectType) {
    this.updateCompDateObserver.next(selectType);
  }

  updateOrderStatusSelect(obj) {
    this.updateOrderStatusSelectObserver.next(obj);
  }

  updateBatchManagerObject(obj) {
    this.batchManagerObserver.next(obj);
  }
  updateInvMasterState(obj, type) {
    this.invMasterParentObserver.next({ event: obj, isEnable: type });
  }
  updateMenuState(obj) {
    this.sideMenuHideObserver.next(obj);
  }

  updatePrintService(value:boolean) {
    this.PrintServiceObserver.next(value);
  }
  updateDevicePref(obj){
    this.devicePrefObserver.next({event:obj});
  }
  getSidebarStatus() {
    return this.loadMenu;
  }

  setData(data: any) {
    this.data = data;
  }
  getData() {
    return this.data;
  }

  setApp(data: any) {
    this.appData = data;
  }
  getApp() {
    return this.appData;
  }

  updateLoggedInUser(userName: any, wsid: any, menu: any) {
    let appName: any;
    if (menu.includes('/FlowrackReplenishment')) appName = 'FlowrackReplenishment';
    if (menu.includes('/admin')) appName = 'Admin';
    if (menu.includes('/InductionManager')) appName = 'Induction Manager';
    if (menu.includes('/ConsolidationManager')) appName = 'Consolidation Manager';
    if (menu.includes('/globalconfig')) return;
    
    else{
      var object:any = {
        userName:userName,
        wsid:wsid, appName:appName
      }
  
        this.api.UserAppNameAdd(object).subscribe((res: any) => { },(error: any) => {
          console.error('An error occurred:', error);
        }); 

      
    } 
  }

  setMenuData(value: any) {
    
    this.menuData.next(value);
  }
  BroadCastMenuUpdate(str: any) {
    this.SidebarMenupdate.next(str);
  }

  updateBreadcrumb(breadCrumb: any) {
    this.breadCrumObserver.next(breadCrumb);
  }
}
