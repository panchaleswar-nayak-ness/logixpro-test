export const StringAssignments = {
    WorkstationNotAssignedToZone: 'This workstation is not assigned to a zone',
};

export const localStorageKeys = {
    UserRights : 'userRights'
}

export const TransactionType = {
    Pick: 'Pick',
    PutAway: 'Put Away',
    Count: 'Count'
}
export const DialogConstants = {
    auto: 'auto',
    close: 'close',
    autoFocus:'__non_existing_element__' 
}
export const StringConditions = {
    SupplierItemID:'Supplier Item ID',
    ToteID: 'Tote ID',
    WaitingReprocess:'Waiting Reprocess',
    NotCompleted: 'Not Completed',
    NotAssigned: 'Not Assigned',
    No: 'No',
    Yes: 'Yes',
    AddCaps: 'Add',
    Enter: 'Enter',
    Event: 'event',
    Click: 'click',
    Add: 'add',
    Remove: 'remove',
    BatchToteTrans: 'batch_tote_trans',
    BatchTote: 'batch_tote',
    AllTransaction: 'All Transaction',
    Batch: 'Batch',
    BatchWithID:'batchWithID',
    PrintBatch:'PrintBatch',
    PrintCase: 'PrintCase',
    PrintPickList:'PrintPickList',
    PickPickLabel:'PrintPickLabel',
    PrintTote: 'PrintTote',
    Invalid: 'Invalid',
    orderTypeOpen: 'Open',
    ResetField:'resetField',
    isAdd:'isAdd',
    filterLoc:'Nothing',
    True:'true',
    InProgress: 'In Progress',
    Completed: 'Completed',
    on: 'on',
    off: 'off',
    EntireOrder:'Entire Order',
    currentValue : 'currentValue'
}

export const ResponseStrings = {
    No: 'No',
    Yes: 'Yes',
    Empty: '',
    Null: null,
    DNE: 'DNE',
    Conflict: 'Conflict',
    Error: 'Error',
    All: 'all',
    AllCaps:'All',
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
    Warning: 'Warning!',
    Consolidation: 'Consolidation!',
    Staging: 'Staging!',
    NoRows: 'No Rows',
    BatchFilled: 'Batch is Filled.'
}

export const ConfirmationHeadings = {
    BatchManager: 'Batch Manager'
}

export const ConfirmationMessages = {
    NoOrdersSelected: 'No Orders Selected.',
    BatchIDMustBeSpecified: 'Batch ID must be specified.',
    ClickOkToPrintBatchReport:'Click Ok to print a Batch Report for the selected orders?',
    ClickOkToPrintItemLabels:'Click Ok to print item labels for the selected batch orders?',
    UnverfiedItemsLeft:'There are still unverfied items. Coninue the preview?',
    EventLogDeleteWithRange: 'Are you sure you want to delete all Event Log entries with specified date, message, event location and name stamp filters?'
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
    ErrorOccuredTranscation: "An error occured completing this transaction",
    ErrorWhileSave:'An Error Occured while trying to save',
    OrderInvalid:'The Order/Tote that you entered is invalid or no longer exists in the system.',
    InvalidLocation:'The Location entered was not valid',
    ErrorOccuredTryingToRemoveAll:'An Error Occured while trying to remove all data, check the event log for more information',
    StartDateMustBeBeforeEndDate: 'Start date must be before end date!',
    BlankZone:'Zone may not be left blank.  Zone will not be saved until this is fixed.',
    SequenceMustEqualOrGreaterZero:'Sequence must be an integer greater than or equal to 0.  Zone will not be saved until this is fixed',
    DuplicateZone:'Zone is currently set to be a duplicate. Zone will not be saved until this is fixed',
    ErrorOccuredPalletSetup:'An error occurred processing this pallet setup',
    PalletProcessed:'Pallet was processed',
    EnterBatchIdtoProcess:'Please enter in a batch id to proccess.',
    EnterBatchId:'Please enter in a batch id',
    EnterToteId:'Please enter in at least 1 tote id to process.',
    EnterOneOrderNoToProcess:'Please enter in at least 1 order number to process.',
    PopupBlocked:'Popup was blocked by the browser.',
    EnterOneTote:'Please enter in at least 1 tote id',
    EnterOneOrder:'Please enter in at least 1 order number',
    BatchIDRequired: 'Batch id is required.',
    BatchIDCannotBeEmpty:'Batch ID cannot be empty when opening the pick batch manager.',
    NoOpenTote:'No open totes in batch',
    SelectBatchID:'Please select a Batch ID to print',
    EnterOrderNo:'Please enter in an order number.',
    InvalidOrderNo:'This is not a vaild order number for this pick batch.',
    ToteIdAlreadyInBatch:'This tote id is already in this batch. Enter a new one',
    MissingDataFromPrint:'Missing data from the desired print row',
    DeletePendingTransaction: 'You can only delete pending transactions.',
    ItemNumberExists:'Item Number Already Exists.'
}

export const AppNames = {
    ICSAdmin: 'ICSAdmin',
    ConsolidationManager: 'Consolidation Manager',
    Induction: 'Induction',
    InductionManager: 'InductionManager',
    FlowRackReplenish: 'FlowRackReplenish',
    ImportExport: 'ImportExport',
    Markout: 'Markout',
    OrderManager: 'OrderManager',
    WorkManager: 'WorkManager',
   
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
    AdminInventoryMap:'/admin/inventoryMap',
    InductionManagerInventoryMap:'/InductionManager/Admin/InventoryMap'
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
    WorkManager: 'Work Manager',
    OrderStatus: 'Order Status'
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

export const KeyboardKeys = {
    A: 'a',
    B: 'b',
    C: 'c',
    D: 'd',
    E: 'e',
    R: 'r',
    Enter: 'Enter'
}

export const zoneType = {
    carousel:'carousel',
    cartonFlow:'cartonFlow',
    includePick:'includePick'
}

export const alertMessage = {
    SerialNoNotExistsMsg: 'Serial Number Does Not Exist',
    ErrorValidatingSerialNoMsg: 'There was an error validating serial number',
    EnterSerialNo: 'Please enter a serial number',
    SerialNoAlreadyScan: 'Serial Number already scanned',
    DeleteMessage:'You are about to mark the scanned reels as empty. This will delete ALL current open transactions associated with the scanned reels.'
} 

export const showNotificationHeading = {
    FieldsMissing:'Fields Missing',
    InvalidQuantity:'Invalid Quantity',
    InvalidItemEntered:'Invalid Item Entered',
    InvalidToteEntered:'Invalid Tote Entered'
}

export const showNotificationMessage = {
    FieldsFill:'Not all the fields were filled out. Please fill them out',
    InvalidQuantity:'An invalid quantity was entered. Please enter a quantity greater than 0',
    ItemNotExists:'This item does not exist in Inventory',
    ToteAlreadyExists:'This tote id already exists in Open Transactions'
}

export const FieldName = {
    EventLocation: 'Event Location',
    Message: 'Message',
    Username: 'Username',
    EventCode: 'Event Code',
    EventType: 'Event Type'
}
export const Column = {
    ImportDate: 'Import Date',
    RequiredDate: 'Required Date',
    Priority: 'Priority',
    OrderNumber: 'Order Number',
    ItemNumber: 'Item Number',
    ToteID: 'Tote ID'
}

export const Case = {
    Like: 'Like'
}

export const Mode = {
    HoldTransactions: 'hold-trans',
    DeleteTransaction: 'delete-transaction',
    DeleteOrderStatus: 'delete-order-status'
}

export const TableName = {
    OpenTransactions: 'Open Transactions'
}
