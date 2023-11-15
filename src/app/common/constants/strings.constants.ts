export const StringAssignments = {
    WorkstationNotAssignedToZone: 'This workstation is not assigned to a zone',
};

export const StringConditions = {
    SupplierItemID:'Supplier Item ID',
    WaitingReprocess:'Waiting Reprocess',
    NotCompleted: 'Not Completed',
    NotAssigned: 'Not Assigned',
    No: 'No',
    Yes: 'Yes',
    Enter: 'Enter',
    Event: 'event',
    Click: 'click'
}

export const ResponseStrings = {
    No: 'No',
    Empty: '',
    Null: null,
    DNE: 'DNE',
    Conflict: 'Conflict',
    Error: 'Error',
    All: 'all',
    Modal: 'modal',
    DNENP: 'DNENP',
    Fail: 'Fail',
    INVALID: 'INVALID',
    Redirect: 'Redirect'
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
    Consolidation: 'Consolidation!',
    Staging: 'Staging!'
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
    ErrorOccuredTryingToRemoveAll:'An Error Occured while trying to remove all data, check the event log for more information',
    ErrorWhileSave:'An Error Occured while trying to save',
    OrderInvalid:'The Order/Tote that you entered is invalid or no longer exists in the system.',
    InvalidLocation:'The Location entered was not valid'
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
    ReportView:'/#/report-view',
    Logon:'/#/Logon/'
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

export const CMConsolidationPreferences = {
    DefPackList: 'defPackList',
    BlindVerify: 'blindVerify',
    VerifyEach: 'verifyEach',
    PackingList: 'packingList',
    PrintUnVerified: 'printUnVerified',
    PrintVerified: 'printVerified',
    DefLookType: 'defLookType',
    BackOrders: 'backOrders',
    NonPickPro: 'nonPickpro',
    EmailPackSlip: 'emailPackSlip',
    ValidateStaingLocs: 'validateStaingLocs'
}

export const CMShippingPreferences = {
    AllowShip: 'allowShip',
    AllowPack: 'allowPack',
    PrintCont: 'printCont',
    PrintOrd: 'printOrd',
    PrintContLabel: 'printContLabel',
    ContIDText: 'contIDText',
    ContID: 'contID',
    ConfirmPack: 'confirmPack',
    ConfirmQTY: 'confirmQTY',
    Freight: 'freight',
    Freight1: 'freight1',
    Freight2: 'freight2',
    Weight: 'weight',
    Length: 'length',
    Width: 'width',
    Height: 'height',
    Cube: 'cube'
}