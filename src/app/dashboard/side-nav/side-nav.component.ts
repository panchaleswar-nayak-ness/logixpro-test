import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../common/services/shared.service';
import { AuthService } from '../../common/init/auth.service';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';
import { IGlobalConfigApi } from 'src/app/common/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/common/services/globalConfig-api/global-config-api.service';
import { UniqueConstants, TableConstant } from 'src/app/common/constants/strings.constants';
import { RouteUpdateMenu, AppNames, AppPermissions, AppRoutes, } from 'src/app/common/constants/menu.constants';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  menuData: any = [];
  @Input() sideBarOpen: boolean;
  isConfigUser: any = false;
  menuRoute;
  public userData: any;
  isMenuHide: any = false;
  dynamicMenu: any = [];
  menus: any = [
    { icon: 'home', title: 'Home', route: AppRoutes.Dashboard, permission: 'Home' },
    { icon: 'electric_bolt', title: 'Import Export', route: '/ImportExport', permission: 'Import Export' },
    { icon: 'manage_accounts', title: 'Admin', route: '/admin', permission: 'Admin Menu' },
    { icon: 'checklist', title: AppPermissions.InductionManager, route: '/InductionManager', permission: AppPermissions.InductionManager },
    { icon: 'fact_check', title: 'Work Manager', route: '#', permission: 'Work Manager' },
    { icon: 'insert_chart', title: AppPermissions.ConsolidationManager, route: '/ConsolidationManager', permission: AppPermissions.ConsolidationManager },
    { icon: 'pending_actions', title: AppPermissions.OrderManager, route: '/OrderManager', permission: AppPermissions.OrderManager },
    { icon: 'schema', title: 'FlowRack Replenishment', route: '/FlowrackReplenish', permission: 'FlowRack Replenish' },
    { icon: 'process_chart', title: 'Bulk Transactions', route: '/BulkTransactions', permission: 'FlowRack Replenish' },
    { icon: 'home', title: 'Markout', route: AppRoutes.Markout, permission: 'Markout' },
  ];
  globalMenus: any = [
    { icon: 'door_front', title: 'Home', route: '/globalconfig/home', permission: true },
    { icon: 'hub', title: 'Database Connections', route: '/globalconfig/database-connections', permission: true },
    { icon: 'print', title: 'Printers', route: '/globalconfig/printers', permission: '' },
    { icon: 'online_prediction', title: 'Workstation', route: '/globalconfig/workstation', permission: true },
    { icon: 'nest_wifi_gale', title: 'CCSIF', route: '/globalconfig/ccsif', permission: true },
    { icon: 'subtitles', title: 'Licensing', route: '/globalconfig/licensing', permission: true },
    { icon: 'subtitles', title: 'STE', route: '/globalconfig/ste', permission: true },

  ];
  adminMenus = [
    { icon: 'arrow_back', title: 'Admin', route: AppRoutes.Dashboard, class: UniqueConstants.backClass, permission: 'Dashboard' },
    { icon: 'dashboard', title: 'Inventory', route: '/admin/inventoryMaster', permission: 'Inventory' },
    { icon: 'directions_alt', title: 'Inventory Map', route: '/admin/inventoryMap', permission: 'Inventory Map' },
    { icon: 'analytics', title: 'Reports', route: '/admin/reports', permission: 'Reports' },
    { icon: 'dvr', title: 'Transactions', route: '/admin/transaction', permission: 'Transaction Journal' },
    { icon: 'list_alt', title: 'Batch Manager', route: '/admin/batchManager', permission: 'Batch Manager' },
    { icon: 'low_priority', title: 'Cycle Count', route: '/admin/cycleCounts', permission: 'Cycle Count Manager' },
    { icon: 'airline_stops', title: 'De-Allocate Orders', route: '/admin/DeAllocateOrders', permission: 'De-Allocate Orders' },
    { icon: 'assignment_ind', title: 'Employees', route: '/admin/employees', permission: 'Employees' },
    { icon: 'event_note', title: 'Event Log', route: '/admin/EventLog', permission: 'Event Log Manager' },
    { icon: 'my_location', title: 'Location Assignment', route: '/admin/locationAssignment', permission: 'Location Assignment' },
    { icon: 'ads_click', title: 'Manual Transactions', route: '/admin/manualTransactions', permission: 'Manual Transactions' },
    { icon: 'trolley', title: 'Move Items', route: '/admin/moveItems', permission: 'Move Items' },
    { icon: 'tune', title: 'Preferences', route: '/admin/adminPreferences', permission: 'Preferences' },
    { icon: 'published_with_changes', title: 'System Replenishment', route: '/admin/systemReplenishment', permission: 'Replenishment' },
  ];
  inductionMenus: any = [
    { icon: 'arrow_back', title: AppPermissions.InductionManager, route: AppRoutes.Dashboard, class: UniqueConstants.backClass, permission: AppPermissions.InductionManager },
    { icon: 'directions_alt', title: 'Process Picks', route: '/InductionManager/ProcessPicks', permission: 'Tote Transactions' },
    { icon: 'dashboard', title: 'Process Put Aways', route: '/InductionManager/ProcessPutAways', permission: 'Tote Transactions' },
    { icon: 'manage_accounts', title: 'Admin', route: '/InductionManager/Admin', permission: 'Tote Admin Menu' },
    { icon: 'edit_attributes', title: 'Mark Empty Reels', route: '/InductionManager/MarkEmptyReels', permission: AppPermissions.InductionManager },
    { icon: 'linear_scale', title: 'Pallet Receiving', route: '/InductionManager/PalletReceiving', permission: AppPermissions.InductionManager },
    { icon: 'line_style', title: 'Super Batch', route: '/InductionManager/SuperBatch', permission: AppPermissions.InductionManager },
    { icon: 'library_add_check', title: 'Complete Pick Batch', route: '/InductionManager/CompletePickBatch', permission: AppPermissions.InductionManager },
  ];
  consolidationMenus: any = [
    { icon: 'arrow_back', title: AppPermissions.ConsolidationManager, route: '/ConsolidationManager', class: UniqueConstants.backClass, permission: AppPermissions.ConsolidationManager },
    { icon: 'insert_chart', title: 'Consolidation', route: '/ConsolidationManager/Consolidation', class: UniqueConstants.backClass, permission: AppPermissions.ConsolidationManager },
    // Vector
    { icon: 'add_location_alt', title: 'Staging Locations', route: '/ConsolidationManager/StagingLocations', permission: AppPermissions.ConsolidationManager },
    { icon: 'tune', title: ' Preferences ', route: '/ConsolidationManager/Preferences', permission: 'Consolidation Mgr Admin' },
    // Vector (Stroke)
    { icon: 'analytics', title: 'Reporting ', route: '/ConsolidationManager/Reports', permission: 'Consolidation Mgr Admin' },
    { icon: 'view_module', title: 'Order Status', route: '/ConsolidationManager/OrderStatus', paramsObj: { IsOrderStatus: true }, permission: 'Order Status' }
    //  flex_wrap
  ];
  inductionAdminMenus: any = [
    { icon: 'arrow_back', title: 'Admin', route: '/InductionManager', class: UniqueConstants.backClass, permission: AppPermissions.InductionManager },
    { icon: ' directions_alt', title: 'Inventory Map', route: '/InductionManager/Admin/InventoryMap', permission: AppPermissions.InductionManager },
    { icon: ' dashboard ', title: 'Inventory ', route: '/InductionManager/Admin/InventoryMaster', permission: AppPermissions.InductionManager },
    { icon: ' inventory_2 ', title: 'Tote Transaction Manager ', route: '/InductionManager/Admin/ToteTransactionManager', permission: AppPermissions.InductionManager },
    { icon: 'ads_click   ', title: 'Manual Transactions ', route: '/InductionManager/Admin/ManualTransactions', permission: AppPermissions.InductionManager },
    { icon: 'elevator   ', title: 'Tote Manager ', route: '/InductionManager/Admin/ImToteManager', permission: AppPermissions.InductionManager },
    { icon: 'post_add ', title: 'Transaction Journal ', route: '/InductionManager/Admin/TransactionJournal', permission: AppPermissions.InductionManager },
    { icon: '     analytics     ', title: 'Reports ', route: '/InductionManager/Admin/Reports', permission: AppPermissions.InductionManager },
    { icon: '      tune       ', title: 'Preferences ', route: '/InductionManager/Admin/AdminPrefrences', permission: AppPermissions.InductionManager },
  ];
  orderManagerMenus: any = [
    { icon: 'arrow_back', title: AppPermissions.OrderManager, route: AppRoutes.Dashboard, class: UniqueConstants.backClass, permission: AppPermissions.OrderManager },
    { icon: ' pending_actions', title: AppPermissions.OrderManager, route: '/OrderManager/OrderManager', permission: 'Admin Release Orders' },
    { icon: 'view_module', title: 'Order Status ', route: '/OrderManager/OrderStatus', permission: true },
    { icon: 'event_note', title: 'Event Log ', route: '/OrderManager/EventLog', permission: 'Admin Release Orders' },
    { icon: 'dataset', title: 'Inventory Master Info', route: '/OrderManager/InventoryMaster', permission: 'Admin Inventory Master' },
    { icon: TableConstant.WareHouse, title: 'Stock Location & Quantity ', route: '/OrderManager/InventoryMap', permission: 'Admin Stock Locations' },
    { icon: 'analytics', title: 'Reports ', route: '/OrderManager/Reports', permission: 'Admin Reports' },
    { icon: 'tune', title: 'Preferences ', route: '/OrderManager/Preferences', permission: 'Admin Preferences' },
  ];
  flowrackReplenishmentMenus: any = [
    { icon: 'arrow_back', title: 'Flowrack Replenish', route: '/FlowrackReplenish', class: UniqueConstants.backClass, permission: 'FlowRack Replenish' },
    { icon: 'schema', title: 'Flowrack Replenishment', route: '/FlowrackReplenish/Flowrack', permission: 'FlowRack Replenish' },
    { icon: 'tune', title: 'Preferences ', route: '/FlowrackReplenish/Preferences', permission: 'FlowRack Replenish' },
  ];
  bulkProcessMenus: any = [
    { icon: 'arrow_back', title: 'Bulk Transactions', route: '/BulkTransactions', class: UniqueConstants.backClass, permission: 'FlowRack Replenish' },
    { icon: 'unarchive', title: 'Bulk Pick', route: '/BulkTransactions/BulkPick', permission: 'FlowRack Replenish' },
    { icon: 'archive', title: 'Bulk Put Away', route: '/BulkTransactions/BulkPutAway', permission: true },
    { icon: 'archive', title: 'Bulk Count', route: '/BulkTransactions/BulkCount', permission: true },
    { icon: 'tune', title: 'Preferences', route: '/BulkTransactions/Preferences', permission: 'FlowRack Replenish' },
  ];

  markOutMenus: any = [
    { icon: 'arrow_back', title: 'Markout', route: AppRoutes.Markout, class: UniqueConstants.backClass, permission: 'Markout' },
    { icon: 'schema', title: 'Markout', route: '/MarkoutProcess/Markout', permission: 'Markout' },
    { icon: 'tune', title: 'Preferences ', route: '/MarkoutProcess/Preferences', permission: 'Markout' },
  ];


  isParentMenu: boolean = true;
  isChildMenu: boolean = false;
  childMenus: any;
  public iGlobalConfigApi: IGlobalConfigApi

  constructor(
    public router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
    private currentTabDataService: CurrentTabDataService,
    public globalConfigApi: GlobalConfigApiService
  ) {
    
    this.iGlobalConfigApi = globalConfigApi;
    this.sharedService?.sideMenuHideObserver?.subscribe(menu => this.isMenuHide = menu);
    this.sharedService?.SidebarMenupdate?.subscribe((data: any) => {
      let Menuobj = this.menus.find(x => x.route == data);
      if (Menuobj == null && this.authService.UserPermissonByFuncName('Admin Menu')) Menuobj = this.adminMenus.find(x => x.route == data);
      this.loadMenus(Menuobj);
    });

    this.sharedService.updateInductionMenuObserver.subscribe((data: any) => {
      this.inductionMenus.filter(x => x.title == 'Complete Pick Batch')[0].route = data ? '/InductionManager/CompletePickBatch' : '#';
    });
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.isConfigUser = localStorage.getItem('isConfigUser') ?? false;
    this.sharedService.startMenu.subscribe(res => {
      if (res) {
        this.isParentMenu = true;
        this.isChildMenu = false;
      }
    });
    this.loadMenus({ route: this.router.url });
    this.sharedService.updateAdminMenuObserver.subscribe(adminMenu => {
      if (adminMenu) {
        this.childMenus = this.adminMenus;
        this.isParentMenu = false;
        this.isChildMenu = true;
      }
    });

    this.sharedService.updateFlowrackMenuObserver.subscribe(flowrack => {
      if (flowrack) {
        this.childMenus = this.flowrackReplenishmentMenus;
        this.isParentMenu = false;
        this.isChildMenu = true;
      }
    });

    this.sharedService.updateBulkProcessMenuObserver.subscribe((res: any) => {
   var obj =  { 
        permission : "FlowRack Replenish",
        route:res.route,
        title: res.menu
      }
      this.loadMenus(obj);
    })
    this.sharedService.updateMarkoutMenuObserver.subscribe((markout: any) => {
      if (markout) {
        this.childMenus = this.markOutMenus;
        this.isParentMenu = false;
        this.isChildMenu = true;
      }
       })
    this.sharedService.updateInductionAdminObserver.subscribe(InvadminMenu => {
      if (InvadminMenu.menu === RouteUpdateMenu.TransactionAdmin) {
        if (InvadminMenu.route.includes(`${AppRoutes.InductionManagerAdmin}/`)) this.inductionAdminMenus[0].route = AppRoutes.InductionManagerAdmin;
        else this.inductionAdminMenus[0].route = AppRoutes.InductionManager;
        this.childMenus = this.inductionAdminMenus;
        this.isParentMenu = false;
        this.isChildMenu = true;
      } else if (InvadminMenu.menu === RouteUpdateMenu.Induction) {
        if (InvadminMenu.route.includes(`${AppRoutes.InductionManager}/`)) this.inductionMenus[0].route = AppRoutes.InductionManager;
        else this.inductionMenus[0].route = AppRoutes.Dashboard;
        this.childMenus = this.inductionMenus;
        this.isParentMenu = false;
        this.isChildMenu = true;
      } else if (InvadminMenu.route.includes(AppRoutes.ConsolidationManager)) {
        let splittedRoute = InvadminMenu.route.split('/');
        if (splittedRoute[2] === undefined) this.consolidationMenus[0].route = AppRoutes.Dashboard;
        else this.consolidationMenus[0].route = AppRoutes.ConsolidationManager;
        this.childMenus = this.consolidationMenus;
        this.isParentMenu = false;
        this.isChildMenu = true;
      } else if (InvadminMenu.menu === AppRoutes.FlowrackReplenish) {
        let splittedRoute = InvadminMenu.route.split('/');
        if (splittedRoute[2] === undefined) this.flowrackReplenishmentMenus[0].route = AppRoutes.Dashboard;
        else this.flowrackReplenishmentMenus[0].route = AppRoutes.FlowrackReplenish;
      }else if (InvadminMenu.menu === AppRoutes.Markout) {
        let splittedRoute = InvadminMenu.route.split('/');
        if (splittedRoute[2] === undefined) this.markOutMenus[0].route = AppRoutes.Dashboard;
        else this.markOutMenus[0].route = AppRoutes.Markout;
      }
    });

    this.sharedService.menuData$.subscribe(data => {
      if (this.menuData.length === 0) {
        this.menuData = data;
        this.menuData.filter((item, i) => {
          if (this.dynamicMenu.find(x => x.title == item.displayname)) { }
          else {
            this.dynamicMenu[0] = { icon: 'home', title: 'Home', route: AppRoutes.Dashboard, permission: AppPermissions.Home };
            this.dynamicMenu.push({ icon: item.info.iconName, title: item.displayname, route: item.info.route, permission: item.info.permission });
          }

          if (item.appname === AppNames.ICSAdmin) {
            let obj = { icon: 'arrow_back', title: `${item.displayname}`, route: AppRoutes.Dashboard, class: UniqueConstants.backClass, permission: AppPermissions.Dashboard }
            this.adminMenus.splice(0, 1, obj);
          }
          else if (item.appname === AppNames.Induction) {
            let obj = { icon: 'arrow_back', title: `${item.displayname}`, route: AppRoutes.Dashboard, class: UniqueConstants.backClass, permission: AppPermissions.Dashboard }
            this.inductionMenus.splice(0, 1, obj);
          }
          else if (item.appname === AppNames.OrderManager) {
            let obj = { icon: 'arrow_back', title: `${item.displayname}`, route: AppRoutes.Dashboard, class: UniqueConstants.backClass, permission: AppPermissions.Dashboard }
            this.orderManagerMenus.splice(0, 1, obj);
          }
        });
      }

    });

    this.sharedService.updateMenuFromInside.subscribe((menuOpen) => this.loadMenus({ route: menuOpen }));
  }


  redirect() {
    this.router.navigate([`${localStorage.getItem('reportNav')}`]);
  }
 
  loadMenus(menu: any) {
    if((this.router.url == "/BulkTransactions/BulkPick" || this.router.url == "/BulkTransactions/BulkPutAway" || this.router.url == "/BulkTransactions/BulkCount") && localStorage.getItem("verifyBulks") == "true"){
      this.sharedService.verifyBulkTransBack();
      return;
    }

    if(localStorage.getItem("prevTab") && localStorage.getItem("newTabNavigated")){
      let prevTab:string = localStorage.getItem("prevTab") || "";
      localStorage.removeItem("prevTab");
      localStorage.removeItem("newTabNavigated");
      this.router.navigate([prevTab])
      .then(() => {
        window.location.reload();
      });
    }

    this.sharedService.updateLoggedInUser(this.userData.userName, this.userData.wsid, menu.route);
    if (!menu) menu = { route: AppRoutes.Dashboard };

    if (menu.route != '') {
      this.currentTabDataService.ClearItemsExceptCurrentTab();

      if (menu.route.includes('/admin')) {
        if (menu.route.includes('/admin/')) this.adminMenus[0].route = '/admin';
        else this.adminMenus[0].route = AppRoutes.Dashboard;
        this.childMenus = this.adminMenus;
        this.isParentMenu = false;
        this.isChildMenu = true;
        return;
      }

      if (menu.route.includes('/InductionManager') && menu.route != '/InductionManager/Admin' && !menu.route.includes('/InductionManager/Admin')) {
        if (menu.route.includes('/InductionManager/')) this.inductionMenus[0].route = '/InductionManager';
        else this.inductionMenus[0].route = AppRoutes.Dashboard;
        this.childMenus = this.inductionMenus;
        this.isParentMenu = false;
        this.isChildMenu = true;
        return;
      }

      if ([AppRoutes.Dashboard].indexOf(menu.route) > -1) {
        this.isParentMenu = true;
        this.isChildMenu = false;
      }

      if (menu.route.includes('/globalconfig')) {
        this.childMenus = this.globalMenus;
        this.isParentMenu = false;
        this.isChildMenu = true;
      }
    }
    if (menu.route.includes('/ConsolidationManager')) {
      let splittedRoute = menu.route.split('/');
      if (splittedRoute[2] === undefined) this.consolidationMenus[0].route = AppRoutes.Dashboard;
      else this.consolidationMenus[0].route = '/ConsolidationManager';
      this.childMenus = this.consolidationMenus;
      this.isParentMenu = false;
      this.isChildMenu = true; 
      return
    }

    if (menu.route.includes('/InductionManager')) {
      this.childMenus = this.inductionMenus;
      this.isParentMenu = false;
      this.isChildMenu = true;
    }

    if (menu.route.includes('/OrderManager')) {
      let splittedRoute = menu.route.split('/');
      if (splittedRoute[2] === undefined) this.orderManagerMenus[0].route = AppRoutes.Dashboard;
      else this.orderManagerMenus[0].route = '/OrderManager';
      this.childMenus = this.orderManagerMenus;
      this.isParentMenu = false;
      this.isChildMenu = true;
      return
    }

    if (menu.route.includes('/InductionManager/Admin')) {
      if (menu.route.includes('/InductionManager/Admin/')) this.inductionAdminMenus[0].route = '/InductionManager/Admin';
      else this.inductionAdminMenus[0].route = '/InductionManager';
      this.childMenus = this.inductionAdminMenus;
      this.isParentMenu = false;
      this.isChildMenu = true;
      return;
    }

    if (menu.route.includes('/globalconfig')) {
      this.childMenus = this.globalMenus;
      this.isParentMenu = false;
      this.isChildMenu = true;
    }

    if (menu.route.includes('/FlowrackReplenish')) {
      let splittedRoute = menu.route.split('/');
      if (splittedRoute[2] === undefined) this.flowrackReplenishmentMenus[0].route = AppRoutes.Dashboard;
      else this.flowrackReplenishmentMenus[0].route = '/FlowrackReplenish';
      this.childMenus = this.flowrackReplenishmentMenus;
      this.isParentMenu = false;
      this.isChildMenu = true; 
      return;
    }

    if (menu.route.includes('/MarkoutProcess')) {
      let splittedRoute = menu.route.split('/');
      if (splittedRoute[2] === undefined) this.markOutMenus[0].route = AppRoutes.Dashboard;
      else this.markOutMenus[0].route = '/MarkoutProcess';
      this.childMenus = this.markOutMenus;
      this.isParentMenu = false;
      this.isChildMenu = true; 
      return;
    }

    if (menu.route.includes("/BulkTransactions")) {
      let splittedRoute = menu.route.split('/');
      if (splittedRoute[2] === undefined && this.router.url == menu.route){
        this.bulkProcessMenus[0].route = AppRoutes.Dashboard;
        this.childMenus = this.dynamicMenu;
      } 
      else{
        this.bulkProcessMenus[0].route = '/BulkTransactions';
        this.childMenus = this.bulkProcessMenus;
      }
      this.isParentMenu = false;
      this.isChildMenu = true;
    }

    this.router.navigate([menu.route])
 
  }

  isAuthorized(controlName: any) {
    return !this.authService.UserPermissonByFuncName(controlName);
  }

}
