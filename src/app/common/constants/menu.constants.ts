export type AppName = 'ICSAdmin' | 'Consolidation Manager' | 'Induction' | 'InductionManager' | 'FlowRackReplenish' | 'BulkTransactions' | 'ImportExport' | 'Markout' | 'OrderManager' | 'WorkManager'
export type RouteName = 'Admin' | 'Consolidation Manager' | 'Induction Manager' | 'FlowRack Replenishment' | 'Bulk Transactions' | 'Import Export' | 'Markout' | 'Order Manager' | 'Work Manager'
export type RouteMenu = 'admin' | 'consolidation' | 'induction' | '' | 'orderManager' | 'transaction-admin' | 'FlowReplenishment' | 'BulkTransactions' | 'routeFromInduction' | 'MarkoutProcess'
export type AppPermission = 'Admin Menu' | 'Consolidation Manager' | 'Induction Manager' | 'FlowRack Replenish' | 'Bulk Transactions' | 'Import Export' | 'Markout' | 'Order Manager' | 'Work Manager' | 'Order Status' | 'Home' | 'Dashboard'

export const RouteNames: {
    Admin: RouteName;
    ConsolidationManager: RouteName;
    InductionManager: RouteName;
    FlowRackReplenishment: RouteName;
    BulkTransactions: RouteName;
    ImportExport: RouteName;
    Markout: RouteName;
    OrderManager: RouteName;
    WorkManager: RouteName;
} = {
    Admin: 'Admin',
    ConsolidationManager: 'Consolidation Manager',
    InductionManager: 'Induction Manager',
    FlowRackReplenishment: 'FlowRack Replenishment',
    BulkTransactions: 'Bulk Transactions',
    ImportExport: 'Import Export',
    Markout: 'Markout',
    OrderManager: 'Order Manager',
    WorkManager: 'Work Manager'
}

export const AppIcons = {
    ManageAccounts: 'manage_accounts',
    InsertChart: 'insert_chart',
    CheckList: 'checklist',
    Schema: 'schema',
    ElectricBolt: 'electric_bolt',
    PendingActions: 'pending_actions',
    FactCheck: 'fact_check'
}

export const AppRoutes = {
    Admin: '/admin',
    ConsolidationManager: '/ConsolidationManager',
    InductionManager: '/InductionManager',
    InductionManagerAdminInvMap: '/InductionManager/Admin/InventoryMaster',
    FlowrackReplenish: '/FlowrackReplenish',
    Hash: '#',
    OrderManager: '/OrderManager',
    OrderManagerEventLog: '/OrderManager/EventLog',
    OrderManagerOrderStatus: '/OrderManager/OrderStatus',
    AdminTransaction:'/#/admin/transaction',
    AdminTrans:'/admin/transaction',
    AdminInventoryMaster:'/admin/inventoryMaster',
    ReportView:'/#/report-view',
    Logon:'/#/Logon/',
    AdminCreateCounts: '/admin/createCounts',
    AdminCreateCountBatches: '/admin/createCountBatches',
    OrderManagerInventoryMap:'/OrderManager/InventoryMap',
    AdminInventoryMap:'/#/admin/inventoryMap',
    InductionManagerAdminInventoryMap:'/InductionManager/Admin/InventoryMap',
    Dashboard: '/dashboard',
    InductionManagerAdmin:'/InductionManager/Admin',
    Markout: '/MarkoutProcess',
}

export const AppNames: {
    ICSAdmin: AppName;
    ConsolidationManager: AppName;
    Induction: AppName;
    InductionManager: AppName;
    FlowRackReplenish: AppName;
    BulkTransactions: AppName;
    ImportExport: AppName;
    Markout: AppName;
    OrderManager: AppName;
    WorkManager: AppName;
} = {
    ICSAdmin: 'ICSAdmin',
    ConsolidationManager: 'Consolidation Manager',
    Induction: 'Induction',
    InductionManager: 'InductionManager',
    FlowRackReplenish: 'FlowRackReplenish',
    BulkTransactions: 'BulkTransactions',
    ImportExport: 'ImportExport',
    Markout: 'Markout',
    OrderManager: 'OrderManager',
    WorkManager: 'WorkManager'
}





export const RouteUpdateMenu: {
    Admin: RouteMenu;
    Consolidation: RouteMenu;
    Induction: RouteMenu;
    Empty: RouteMenu;
    OrderManager: RouteMenu;
    TransactionAdmin: RouteMenu;
    FlowReplenishment: RouteMenu;
    BulkTransactions: RouteMenu;
    RouteFromInduction: RouteMenu;
    MarkoutProcess: RouteMenu;
} = {
    Admin: 'admin',
    Consolidation: 'consolidation',
    Induction: 'induction',
    Empty: '',
    OrderManager: 'orderManager',
    TransactionAdmin: 'transaction-admin',
    FlowReplenishment: 'FlowReplenishment',
    BulkTransactions: 'BulkTransactions',
    RouteFromInduction:'routeFromInduction',
    MarkoutProcess: 'MarkoutProcess'
}

export const AppPermissions: {
    AdminMenu: AppPermission;
    ConsolidationManager: AppPermission;
    InductionManager: AppPermission;
    FlowRackReplenish: AppPermission;
    BulkTransactions: AppPermission;
    ImportExport: AppPermission;
    Markout: AppPermission;
    OrderManager: AppPermission;
    WorkManager: AppPermission;
    OrderStatus: AppPermission;
    Home: AppPermission;
    Dashboard: AppPermission;
} = {
    AdminMenu: 'Admin Menu',
    ConsolidationManager: 'Consolidation Manager',
    InductionManager: 'Induction Manager',
    FlowRackReplenish: 'FlowRack Replenish',
    BulkTransactions: 'Bulk Transactions',
    ImportExport: 'Import Export',
    Markout: 'Markout',
    OrderManager: 'Order Manager',
    WorkManager: 'Work Manager',
    OrderStatus: 'Order Status',
    Home: 'Home',
    Dashboard: 'Dashboard'
}