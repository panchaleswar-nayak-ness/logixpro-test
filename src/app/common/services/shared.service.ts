import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; 
import { ICommonApi } from './common-api/common-api-interface';
import { CommonApiService } from './common-api/common-api.service';
import { GlobalService } from './global.service';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    private global:GlobalService,
  ) { 
    this.iCommonAPI = commonAPI; 
  }

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
  updateMarkoutMenuObserver: Subject<any> = new Subject<any>(); // observing that bool
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
  updateBulkProcessMenuObserver: Subject<any> = new Subject<any>();


  verifyBulkTransBackObserver: Subject<any> = new Subject<any>();
  
// Subject used to emit refresh signals
private refreshSubject = new Subject<void>();

// Holds the active interval subscription for cleanup
private intervalSubscription: Subscription | null = null;
  
  verifyBulkTransBack(){
    this.verifyBulkTransBackObserver.next(true);
  }
  
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
  updateBulkProcessMenu(
    menu // on side menu update induction menu
  ) {
    this.updateBulkProcessMenuObserver.next(menu);
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

  updateMarkoutMenu(
    menu // on side menu update markout menu
  ) {
    this.updateMarkoutMenuObserver.next(menu);
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
    this.global.changesConfirmation = true;
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
    if (menu.includes('/FlowrackReplenish')) appName = 'FlowrackReplenish';
    if (menu.includes('/Markout')) appName = 'MarkoutProcess';
    if (menu.includes('/admin')) appName = 'Admin';
    if (menu.includes('/InductionManager')) appName = 'Induction Manager';
    if (menu.includes('/ConsolidationManager')) appName = 'Consolidation Manager';
    if (menu.includes('/globalconfig')) return;
    
    else{
      let object:any = {
        userName:userName,
        wsid:wsid, 
        appName:appName
      };
      this.iCommonAPI.UserAppNameAdd(object).subscribe(
        (res: any) => { }, 
        (error: any) => { console.error('An error occurred:', error); }
      ); 
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

 /**
 * Starts emitting a refresh signal at the specified interval (default: 5000ms).
 * Ensures that only one interval is active at a time to prevent duplicate polling.
 * If an interval is already running, it exits early without restarting it.
 */
start(intervalMs = 5000): void {
  // Avoid restarting if an active interval is already running
  if (this.intervalSubscription && !this.intervalSubscription.closed) {
    return;
  }

  // Start a new interval and emit refresh signals to all subscribers
  this.intervalSubscription = interval(intervalMs).subscribe(() => {
    this.refreshSubject.next();
  });
}


/**
   * Stops the refresh interval if it's active, unsubscribes to free memory,
   * and clears the reference to avoid memory retention or stale state.
   */
  stop(): void {
    if (this.intervalSubscription && !this.intervalSubscription.closed) {
      this.intervalSubscription.unsubscribe(); // Safely unsubscribe
    }
    this.intervalSubscription = null; // Clear reference
  }

 /**
   * Exposes the refresh observable so components can subscribe and react
   * to the emitted signals (e.g., for polling data every 5 seconds).
   */
get refresh$() {
  return this.refreshSubject.asObservable();
}

}
