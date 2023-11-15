export const StringAssignments = {
    WorkstationNotAssignedToZone: 'This workstation is not assigned to a zone',
};

export const StringConditions = {
    SupplierItemID:'Supplier Item ID',
    WaitingReprocess:'Waiting Reprocess',
    NotCompleted: 'Not Completed',
    NotAssigned: 'Not Assigned',
    No: 'No',
    Yes: 'Yes'
}

export const ResponseStrings = {
    No: 'No',
    Empty: '',
    Null: null,
    DNE: 'DNE',
    Conflict: 'Conflict',
    Error: 'Error',
    All: 'all',
    Modal: 'modal'
}

export const ToasterType = {
    Error: 'error',
    Success: 'success',
    Info: 'info'
}

export const ToasterTitle = {
    Error: 'Error!',
    Success: 'Success!',
    Alert: 'Alert!',
    NoRows: 'No Rows'
}

export const ConfirmationMessages = {
    UnverfiedItemsLeft:'There are still unverfied items. Coninue the preview?'
}

export const ToasterMessages = {
    NoOpenLocations: 'There are no open locations.',
    NoLocationForItem: 'No Locations found for Item Number, Scan or Select an open Location.',
    ItemNotInInventory: 'This item does not exist in Inventory Master for this carton flow zone.',
    LocationUnavailable: 'Location Unavailable.',
    QuantityMustGreaterZero: 'Quantity must be greater than zero.',
    EnterQuantity: 'Please enter a quantity.',
    ItemQuantityAdded: 'Item Quantity Added',
    QuantityErrorInventoryMap: 'The quantity was not entered due to an error in the Inventory Map',
    ConsolidationOrderInvalid:'Consolidation The Order/Tote that you entered is invalid or no longer exists in the system.',
    ValueMatchToToteOrder:'The Value you Entered matched a Tote and Order Number, select one to Continue.',
    ErrorWhileRetrievingData:'An Error occured while retrieving data.',
    ErrorOccured:'Error has occured',
    ConsolidatedAllItemsInOrder:'You have consolidated all items in this order',
    ItemNotCompleted: "The selected item has not yet been completed and can't be verified at this time",
    ItemNotInOrder:'Item not in order or has already been consolidated',
    NoUnverfiedItems: 'There are no unverfied items',
    SomethingWentWrong:'Something went wrong',
    DefaultSuperBatchSizeError:'Default Super Batch Size must be greater than 1',
    NoOpenTransactionsBatch:"No open transactions for the entered batch",
    NoOpenTranscationTote:"No open transaction for that tote in the batch",
    ErrorOccuredTranscation: "An error occured completing this transaction"
}

export const AppNames = {
    ICSAdmin: 'ICSAdmin',
    ConsolidationManager: 'Consolidation Manager',
    Induction: 'Induction',
    FlowRackReplenish: 'FlowRackReplenish',
    ImportExport: 'ImportExport',
    Markout: 'Markout',
    OrderManager: 'OrderManager',
    WorkManager: 'WorkManager'
}

export const AppRoutes = {
    Admin: '/admin',
    ConsolidationManager: '/ConsolidationManager',
    InductionManager: '/InductionManager',
    FlowrackReplenish: '/FlowrackReplenish',
    Hash: '#',
    OrderManager: '/OrderManager',
    AdminTransaction:'/#/admin/transaction',
    ReportView:'/#/report-view'
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

export const RouteNames = {
    Admin: 'Admin',
    ConsolidationManager: 'Consolidation Manager',
    InductionManager: 'Induction Manager',
    FlowRackReplenishment: 'FlowRack Replenishment',
    ImportExport: 'Import Export',
    Markout: 'Markout',
    OrderManager: 'Order Manager',
    WorkManager: 'Work Manager'
}

export const RouteUpdateMenu = {
    Admin: 'admin',
    Consolidation: 'consolidation',
    Induction: 'induction',
    Empty: '',
    OrderManager: 'orderManager'
}

export const AppPermissions = {
    AdminMenu: 'Admin Menu',
    ConsolidationManager: 'Consolidation Manager',
    InductionManager: 'Induction Manager',
    FlowRackReplenish: 'FlowRack Replenish',
    ImportExport: 'Import Export',
    Markout: 'Markout',
    OrderManager: 'Order Manager',
    WorkManager: 'Work Manager'
}

export const LiveAnnouncerMessage = {
    SortingCleared: 'Sorting cleared'
}

export const ApiEndpoints = {
    IMSytemSettings: '/Induction/imsytemsettings',
    RTSUserData: '/Induction/rtsuserdata',
    IMMIScSetup:'/Induction/immiscsetup',
    IMPrintSettings: '/Induction/imprintsettings'
}

export const superBatchFilterListName = {
    ToteID: 'Tote ID',
    OrderNo: 'Order Number'
}
