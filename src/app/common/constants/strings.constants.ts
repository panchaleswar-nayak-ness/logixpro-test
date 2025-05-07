import { EmployeeAccessLevel, WorkStationSetup } from "../types/CommonTypes";

export const StringAssignments = {
    WorkstationNotAssignedToZone: 'This workstation is not assigned to a zone',
};

export const localStorageKeys = {
    UserRights: 'userRights',
    TransactionTabIndex: 'TransactionTabIndex'
}

export const TransactionType = {
    Pick: 'Pick',
    PutAway: 'Put Away',
    Count: 'Count'
}

export const DialogConstants = {
    auto: 'auto',
    close: 'close',
    autoFocus: '__non_existing_element__'
}

export const StringConditions = {
    SupplierItemID: 'Supplier Item ID',
    ToteID: 'Tote ID',
    WaitingReprocess: 'Waiting Reprocess',
    Reprocess: 'Reprocess',
    Complete: 'Complete',
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
    AllTransactions: 'All Transactions',
    Batch: 'Batch',
    BatchWithID: 'batchWithID',
    PrintBatch: 'PrintBatch',
    PrintCase: 'PrintCase',
    PrintPickList: 'PrintPickList',
    PickPickLabel: 'PrintPickLabel',
    PrintTote: 'PrintTote',
    Invalid: 'Invalid',
    orderTypeOpen: 'Open',
    ResetField: 'resetField',
    isAdd: 'isAdd',
    filterLoc: 'Nothing',
    True: 'true',
    InProgress: 'In Progress',
    Completed: 'Completed',
    on: 'on',
    off: 'off',
    EntireOrder: 'Entire Order',
    currentValue: 'currentValue',
    history: 'history',
    cleared: 'cleared',
    set_column_sq: 'set_column_sq',
    hold: 'hold',
    reprocess: 'reprocess',
    complete: 'complete',
    start: 'start',
    False: 'False',
    clear: 'clear',
    filter: 'filter',
    MoveTo: 'MoveTo',
    edit: 'edit',
    MoveFrom: 'MoveFrom',
    Short: 'Short'
}

export const ResponseStrings = {
    No: 'No',
    Yes: 'Yes',
    Cancel: 'Cancel',
    Empty: '',
    Null: null,
    DNE: 'DNE',
    Conflict: 'Conflict',
    Error: 'Error',
    All: 'all',
    AllCaps: 'All',
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
    BatchFilled: 'Batch is Filled.',
    Update: 'Update!',
    Info:'Info!',
    InvalidTote: 'Invalid Tote'
}

export const ConfirmationHeadings = {
    BatchManager: 'Batch Manager',
    MoveNow: "Continue Move Now?",
    PasswordExpiryAlert: "Password Expiry Alert"
}
export const ConfirmationButtonText = {
    ResetPassword: 'Reset Password Now',
    RemindMeLater: 'Remind Me Later'
}


export const ConfirmationMessages = {
    NoOrdersSelected: 'No Orders Selected.',
    BatchIDMustBeSpecified: 'Batch ID must be specified.',
    ClickOkToPrintBatchReport: 'Click Ok to print a Batch Report for the selected orders?',
    ClickOkToPrintItemLabels: 'Click Ok to print item labels for the selected batch orders?',
    UnverfiedItemsLeft: 'There are still unverfied items. Coninue the preview?',
    EventLogDeleteWithRange: 'Are you sure you want to delete all Event Log entries with specified date, message, event location and name stamp filters?',
    ClickOkToUpdateLocation: 'You will now update both locations to complete the current move',
    ConfirmationToClearAllInventoryMap : "Click OK to clear all Inventory Map records matching Location Number (Zone + Carousal + Row + Shelf + Bin) Criteria!",
    ClearWholeLocationPutAwayQuantity:"Clear Whole Location cannot proceed because the Allocated Pick or Allocated Put Away quantity is greater than zero.",
    DeleteLicenseConfirmation:"Are you sure you want to delete this License?"
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
    ConsolidationOrderInvalid: 'Consolidation The Order/Tote that you entered is invalid or no longer exists in the system.',
    ValueMatchToToteOrder: 'The Value you Entered matched a Tote and Order Number, select one to Continue.',
    ErrorWhileRetrievingData: 'An Error occured while retrieving data.',
    ErrorOccured: 'Error has occured',
    ConsolidatedAllItemsInOrder: 'You have consolidated all items in this order',
    ItemNotCompleted: "The selected item has not yet been completed and can't be verified at this time",
    ItemNotInOrder: 'Item not in order or has already been consolidated',
    NoUnverfiedItems: 'There are no unverfied items',
    SomethingWentWrong: 'Something went wrong',
    DefaultSuperBatchSizeError: 'Default Super Batch Size must be greater than 1',
    NoOpenTransactionsBatch: "No open transactions for the entered batch",
    NoOpenTranscationTote: "No open transaction for that tote in the batch",
    ErrorOccuredTranscation: "An error occured completing this transaction",
    ErrorWhileSave: 'An Error Occured while trying to save',
    OrderInvalid: 'The Order/Tote that you entered is invalid or no longer exists in the system.',
    InvalidLocation: 'The Location entered was not valid',
    ErrorOccuredTryingToRemoveAll: 'An Error Occured while trying to remove all data, check the event log for more information',
    StartDateMustBeBeforeEndDate: 'Start date must be before end date!',
    BlankZone: 'Zone may not be left blank.  Zone will not be saved until this is fixed.',
    SequenceMustEqualOrGreaterZero: 'Sequence must be an integer greater than or equal to 0.  Zone will not be saved until this is fixed',
    DuplicateZone: 'Zone is currently set to be a duplicate. Zone will not be saved until this is fixed',
    ErrorOccuredPalletSetup: 'An error occurred processing this pallet setup',
    PalletProcessed: 'Pallet was processed',
    EnterBatchIdtoProcess: 'Please enter in a batch id to proccess.',
    EnterBatchId: 'Please enter in a batch id',
    EnterToteId: 'Please enter in at least 1 tote id to process.',
    EnterOneOrderNoToProcess: 'Please enter in at least 1 order number to process.',
    PopupBlocked: 'Popup was blocked by the browser.',
    EnterOneTote: 'Please enter in at least 1 tote id',
    EnterOneOrder: 'Please enter in at least 1 order number',
    BatchIDRequired: 'Batch id is required.',
    BatchIDCannotBeEmpty: 'Batch ID cannot be empty when opening the pick batch manager.',
    NoOpenTote: 'No open totes in batch',
    SelectBatchID: 'Please select a Batch ID to print',
    EnterOrderNo: 'Please enter in an order number.',
    InvalidOrderNo: 'This is not a vaild order number for this pick batch.',
    ToteIdAlreadyInBatch: 'This tote id is already in this batch. Enter a new one',
    MissingDataFromPrint: 'Missing data from the desired print row',
    DeletePendingTransaction: 'You can only delete pending transactions.',
    ItemNumberExists: 'Item Number Already Exists.',
    RecordUpdatedSuccessful: 'Record Updated Successfully',
    DuplicateAdjustmentReason: 'Adjustment Reason is a duplicate. Save other edited fields and ensure it is not a duplicate before saving.',
    DuplicateToteError: 'Tote must be unique. Another entry matches it. Please save any pending totes and try again.',
    DuplicateFieldError: 'Field is a duplicate. Save other edited fields and ensure it is not a duplicate before saving.',
    ErrorRemovingRow: 'An Error Occured while trying to remove this row, check the event log for more information',
    ErrorRemovingData: 'An Error Occured while trying to remove all data, check the event log for more information',
    ErrorCreatingCount: 'Error Occured while creating Count records, check event log for more information',
    ImportDataFailed: 'Failed to import data.',
    NoFileFound: 'No file found.',
    OrderDeAllocationFailed: 'Order De-Allocation Not Successful',
    NoItemAtLocation: 'No item found at the location specified. Ensure that the entry selected has been saved since an item was assigned to it.',
    ZoneLocationRequired: 'Zone and Location need to be set via the dropdown in order to save.',
    WarehouseSensitiveWarning: 'The selected item is warehouse sensitive. Please set a warehouse to continue.',
    DateSensitiveWarning: 'Item is date sensitive. Please set date sensitive before saving.',
    ToteIsInUse:"This tote is in use and assigned to an open order.",
    DuplicateLocation:"Location name already exists.",
    SessionTimeOut:"Session timed out, you have been logged off",
    LocationDeleted: 'Location deleted successfully',
    DeleteFailed:"Delete Failed",
    FieldEmptyDefault:"Field cannot be empty. Default value has been applied.",
    ZoneAndLocationNameNeedToBeSet:" “Zone and Location Name need to be set via the Preferences - Location Zones screen in order to save”",
    Consolidationzones:"Failed to load consolidation zones.",
    Consolidationstatuscount:"Failed to load consolidation status count.",
    RouteidCount:"Failed to load route id status count.",
    ConsolidationThreshold:"Failed to update threshold.",
    ConheaderData:"Failed to load con header list data.",
    RequestReleaseFailed:"Request release failed.",
    RequestReleaseSuccess:"Request release successfully.",
    APIErrorMessage:"API request failed."
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
    Cube: 'cube',
    userField1: 'userField1',
    userField2: 'userField2',
    userField3: 'userField3',
    userField4: 'userField4',
    userField5: 'userField5',
    userField6: 'userField6',
    userField7: 'userField7',
    userField_1_Alias: 'userField_1_Alias',
    userField_2_Alias: 'userField_2_Alias',
    userField_3_Alias: 'userField_3_Alias',
    userField_4_Alias: 'userField_4_Alias',
    userField_5_Alias: 'userField_5_Alias',
    userField_6_Alias: 'userField_6_Alias',
    userField_7_Alias: 'userField_7_Alias',
}

export const ApiEndpoints = {
    IMSytemSettings: '/Induction/imsytemsettings',
    RTSUserData: '/Induction/rtsuserdata',
    IMMIScSetup: '/Induction/immiscsetup',
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
    carousel: 'carousel',
    cartonFlow: 'cartonFlow',
    includePick: 'includePick'
}

export const alertMessage = {
    SerialNoNotExistsMsg: 'Serial Number Does Not Exist',
    ErrorValidatingSerialNoMsg: 'There was an error validating serial number',
    EnterSerialNo: 'Please enter a serial number',
    SerialNoAlreadyScan: 'Serial Number already scanned',
    DeleteMessage: 'You are about to mark the scanned reels as empty. This will delete ALL current open transactions associated with the scanned reels.'
}

export const showNotificationHeading = {
    FieldsMissing: 'Fields Missing',
    InvalidQuantity: 'Invalid Quantity',
    InvalidItemEntered: 'Invalid Item Entered',
    InvalidToteEntered: 'Invalid Tote Entered'
}

export const showNotificationMessage = {
    FieldsFill: 'Not all the fields were filled out. Please fill them out',
    InvalidQuantity: 'An invalid quantity was entered. Please enter a quantity greater than 0',
    ItemNotExists: 'This item does not exist in Inventory',
    ToteAlreadyExists: 'This tote id already exists in Open Transactions'
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
    ToteID: 'Tote ID',
    LineNumber: 'Line Number',
    LotNumber: 'Lot Number',
    Location: 'Location',
    Description: 'Description',
    TransType: 'transType',
    Action: 'action',
    cell: 'cell',
    Row: 'row'
}
export const ColumnDef = {
    userField1: 'userField1',
    userField2: 'userField2',
    userField3: 'userField3',
    userField4: 'userField4',
    userField5: 'userField5',
    userField6: 'userField6',
    userField7: 'userField7',
    userField8: 'userField8',
    userField9: 'userField9',
    userField10: 'userField10',
    Emergency: 'Emergency',
    HostTransactionId: 'hostTransactionID',
    Zone: 'Zone',
    BatchPickID: 'Batch Pick ID',
    Revision: 'revision',
    ExpirationDate: 'expirationDate',
    Actions: 'actions',
    Action: 'action',
    ToteID: 'toteID',
    TransactionQuantity: 'transactionQuantity',
    UnitOfMeasure: 'unitOfMeasure',
    SerialNumber: 'Serial Number',
    Bin: 'bin',
    Warehouse: 'Warehouse',
    RequiredDate: 'requiredDate',
    actions: 'actions'
}

export const Case = {
    Like: 'Like'
}

export const Mode = {
    HoldTransactions: 'hold-trans',
    DeleteTransaction: 'delete-transaction',
    DeleteZone: 'delete-zone',
    DeletePickLevel: 'delete-picklevel',
    DeleteLocation: 'delete-location',
    DeleteConnectionString: 'delete-connection-string',
    DeleteGroup: 'delete-group',
    DeleteAllowedGroup: 'delete-allowed-group',
    DeleteAllowedFunction: 'delete-allowed-funcation',
    DeleteInvMap: 'delete-inventory-map',
    DeleteEmp: 'delete-emp',
    DeleteGrpAllowed: 'delete-grpallowed',
    DeleteWarehouse: 'delete-warehouse',
    DeleteVelocity: 'delete-velocity',
    DeleteOrderStatus: 'delete-order-status',
    DeleteCarrier: 'delete-carrier',
    DeleteWorkstation: 'delete_workstation',
    DeleteCategory: 'delete-category',
    DeleteTrans: 'delete-trans',
    DeleteOrder: 'delete-order',
    DeleteManualTransaction: 'delete-manual-transaction'
}

export const TableName = {
    OpenTransactions: 'Open Transactions',
    OpenTransactionsTemp: 'Open Transactions Temp',
    ReProcessed: 'ReProcessed',
    TransactionHistory: 'Transaction History'
}
export const TableConstant = {
    CompletedDate: 'Completed Date',
    HostTransactionID: 'Host Transaction ID',
    LineSequence: 'lineSequence',
    UserField1: 'User Field1',
    UserField2: 'User Field2',
    Revision: 'Revision',
    ExpirationDate: 'Expiration Date',
    ImportBy: 'importBy',
    Cell: 'Cell',
    TransactionQuantity: 'Transaction Quantity',
    ImportDate: 'importDate',
    zone: 'zone',
    TransactionType: 'Transaction Type',
    Row: 'Row',
    shelf: 'shelf',
    Shelf: 'Shelf',
    Bin: 'Bin',
    Carousel: 'Carousel',
    Notes: 'notes',
    label: 'label',
    completedQuantity: 'completedQuantity',
    transactionType: 'transactionType',
    BatchPickID: 'batchPickID',
    Location: 'location',
    LineNumber: 'lineNumber',
    WareHouse: 'warehouse',
    SerialNumber: 'serialNumber',
    LotNumber: 'lotNumber',

}
export const UniqueConstants = {
    backClass: 'back-class',
    _blank: '_blank',
    position: 'position',
    goldenZone: 'goldenZone',
    searchValue: 'searchValue',
    event: '$event',
    delete: 'delete',
    Asc: 'asc',
    Desc: 'desc',
    Description: "description",
    Priority: 'priority',
    constantDate: "12/14/2022",
    Select: 'select',
    emergency: 'emergency',
    _self: '_self',
    cellSize: 'cellSize',
    item: 'item',
    itemCount: 'itemCount',
    OneEqualsOne: '1 = 1',
    Lizard: 'Lizard',
    Lindsay: 'Lindsay',
    Blue: 'Blue',
    Ibl: 'lbl',
    OrderNumber: 'orderNumber',
    Regx: "^[0-9]*$"

}
export const Style = {
    w560px: '560px',
    w100vw: '100vw',
    w50vw: '50vw',
    w480px: '480px',
    w600px: '600px',
    w786px: '786px',
    w402px: '402px',
    w1080px: '1080px',
}

export const FilterColumnName = {
    unitOfMeasure: 'Unit of Measure'
}
export const markoutdisplayedColumns = {
    Status: 'status',
    ToteID: 'toteId',
    ItemNumber: 'itemNumber',
    Location: 'location',
    TransQty: 'transQty',
    CompQty: 'compQty',
    ShortQty: 'shortQty',
    ToteQty: 'toteQty',
    actions: 'actions',
    CompletedDate:'completedDate',
    TotalQty: 'totalQty'
}

export const SpecificFilters = {
    ColumnNames: 'ColumnNames',
    SelectedFilters: 'SelectedFilters',
    SelectedFilter: 'SelectedFilter',
};

export const BlossomType = {
    Blossom: 'Blossom',
    BlossomComplete: 'BlossomComplete',
}

export const Placeholders = {
    itemNumber: '{{itemNumber}}',
    itemNumberFallback: 'Item Number',

    unitOfMeasure: '{{unitOfMeasure}}',
    unitOfMeasureFallback: 'Unit Of Measure',

    userField1: '{{userField1}}',
    userField1Fallback: 'User Field 1',

    userField2: '{{userField2}}',
    userField2Fallback: 'User Field 2',

    userField3: '{{userField3}}',
    userField3Fallback: 'User Field 3',

    userField4: '{{userField4}}',
    userField4Fallback: 'User Field 4',

    userField5: '{{userField5}}',
    userField5Fallback: 'User Field 5',

    userField6: '{{userField6}}',
    userField6Fallback: 'User Field 6',

    userField7: '{{userField7}}',
    userField7Fallback: 'User Field 7',

    userField8: '{{userField8}}',
    userField8Fallback: 'User Field 8',

    userField9: '{{userField9}}',
    userField9Fallback: 'User Field 9',

    userField10: '{{userField10}}',
    userField10Fallback: 'User Field 10',

    bin: '{{bin}}',
    binFallback: 'Bin',

    shelf: '{{shelf}}',
    shelfFallback: 'Shelf',

    row: '{{rin}}',
    rowFallback: 'Row',

    carousel: '{{carousel}}',
    carouselFallback: 'Carousel',

  };

export const MarkoutNewPickTotesKeys = {
    ToteID: 'toteId',
    Status: 'status',
    StatusDate: 'statusDate',
    RouteID: 'routeID',
    DivertReason: 'divertReason',
    Location: 'location',
    Destination: 'destination',
    Details: 'details'
}

export const MarkoutNewPickTotesDC = {
    ToteID: 'Tote ID',
    Status: 'Status',
    StatusDate: 'Status Date',
    RouteID: 'Route ID',
    DivertReason: 'Divert Reason',
    Location: 'Location',
    Destination: 'Destination',
    Details: 'Details'
}


export const MarkoutNewPickLinesKeys = {
    Item: 'item',
    Qty: 'qty',
    LocID: 'locID',
    Status: 'status',
    StatusDate: 'statusDate',
    CompQty: 'compQty',
    CompBy: 'compBy',
    ShortReason: 'shortReason'
}

export const MarkoutNewPickLinesDC = {
    Item: 'Item',
    Qty: 'Qty',
    LocID: 'Loc ID',
    Status: 'Status',
    StatusDate: 'Status Date',
    CompQty: 'Comp Qty',
    CompBy: 'Comp By',
    ShortReason: 'Short Reason'
}

export const MarkoutNewToteAuditKeys = {
    Time: 'time',
    Type: 'type',
    Scanner: 'scanner',
    Divert: 'divert',
    Location: 'location',
    Status: 'status',
    StatusDate: 'statusDate',
    DivertReason: 'divertReason'
}

export const MarkoutNewToteAuditDC = {
    Time: 'Time',
    Type: 'Type',
    Scanner: 'Scanner',
    Divert: 'Divert',
    Location: 'Location',
    Status: 'Status',
    StatusDate: 'Status Date',
    DivertReason: 'Divert Reason'
}

export const defaultWorkstationSetup: WorkStationSetup = {
    podID: "No",
    scanVerifyPicks: false,
    scanVerifyCounts: false,
    scanVerifyPutAways: false,
    printReportLocation: "No Printer",
    printLabelLocation: "No Printer",
    cartonFlowID: null,
    pickToTotes: false,
    putAwayFromTotes: false,
    autoPrintPickToteLabels: false,
    batchPutAway: false,
    storageContainer: false,
    locationControl: false,
    locAssOrderSelection: false,
    printReprocessReport: false,
    printPickLabel: false,
    printPickLabelBatch: false,
    pfSettings: [
      {
        pfName: "",
        pfSetting: ""
      }
    ],
    pfSettingsII: [
      {
        pfName: "",
        pfSetting: ""
      }
    ],
    pfSettingsIII: [
      {
        pfName: "",
        pfSetting: ""
      }
    ]
};

export const defaultEmployeeAccessLevels: EmployeeAccessLevel ={
    lastRefreshedDateTime : new Date(),
    accessStorageContainer : false,
    accessClearWholeLocation : false,
    accessAddInvMapLocation: false
}

export const AccessLevel = {
    Administrator: "administrator",
    StaffMember: "staff_member"
}

export const AppLicensingDisplayedColumns = {
    AppName: 'appname',
    DisplayName: 'displayname',
    License: 'license',
    NumLicense: 'numlicense',
    Status: 'status',
    AppURL: 'appurl',
    Save: 'save',
};

export const LocalStorageCacheKeys = {
    EmployeeAccessLevels: 'employeeAccessLevels',
}