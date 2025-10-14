import { EmployeeAccessLevel, WorkStationSetup } from "../types/CommonTypes";

export const StringAssignments = {
    WorkstationNotAssignedToZone: 'This workstation is not assigned to a zone',
};

export const localStorageKeys = {
    UserRights: 'userRights',
    TransactionTabIndex: 'TransactionTabIndex',
    VerifyBulks: "verifyBulks",
    SelectedReportPrinter: "SelectedReportPrinter",
    SelectedLabelPrinter: "SelectedLabelPrinter"
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

export const DialogsCloseMessage = {
    Yes: 'Yes',
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
    Filter: 'Filter',
    MoveTo: 'MoveTo',
    edit: 'edit',
    MoveFrom: 'MoveFrom',
    Short: 'Short',
    Confirm:'confirm'
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
    Redirect: 'Redirect',
    Resolved: 'Resolved'
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
    OutboundPort: 'Outbound Port',
    MoveNow: "Continue Move Now?",
    PasswordExpiryAlert: "Password Expiry Alert",
    PrintItemLabelsNow: "Print Item Labels Now?",
    CreateBatchNow: "Create Batch Now?",
    PrintBatchOrOrder:"Print Batch Or Order",
    NoOffCarouselPicksFound:"No Off-Carousel Picks Found",
    ResolveToteId: "Resolve Tote ID",
    ClearAll: "Clear All?",
    CancelCartCreation: "Cancel Cart Creation",
    CancelCartUpdate: "Discard Changes?",
    PrintBatchOrOrders: "Print Batch Or Orders?",
    PrintOffCarouselPickItemLabels: "Print Off-Carousel Pick Item Labels?",
    ContinueCreatingTransaction: 'Continue Creating Transactions?',
    AssignLocation: 'Assign Location',
    ChangeFormatType: "Change Format Type"
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
    DeleteLicenseConfirmation:"Are you sure you want to delete this License?",
    TouchYesToPrintlabelForItemInBatch: "Touch ‘Yes’ to print a label for each item in this batch",
    TouchYesToPrintAllAsBatch:"Touch ‘Yes’ to print all orders as a batch",
    TouchNoToPrintEachOrder: "Touch 'No' to print a page for each order.",
    AssignOrdersToBatch: (batchId: string | number) =>
        `Touch ‘Yes’ to Assign the Selected Orders to Batch ID ${batchId}. Touch ‘No’ to Cancel Batching.`,
    NoOffCarouselPicks:"There are no off-carousel picks for the order(s) selected.",    
    ResolvedToteConfirmation:"Are you sure you want to mark this Tote ID as resolved? This will remove this Tote ID from the Markout.",
    IrreversibleActionWarning :'This action cannot be undone.',
    ClearAllTotesMessage: "Are you sure you want to remove all the empty totes from this cart?",
    CancelCartCreationMessage: "Are you sure you want to close this screen? All entered data will be lost.",
    CancelCartUpdateMessage:"Are you sure you want to close? All the information you’ve entered will be lost.",
    UpdateAllInterface: 'Click OK to update all devices with Com Port: {{comPort}}',
    UpdateAllInterfaceWithZone: 'Click OK to update all devices with Com Port: {{comPort}} and Zone: {{zone}}',
    PrintBatchOrOrders: 'Click Yes to print all orders as a batch. Click No to print a page for each order.',
    PrintOffCarouselPickItemLabels: 'Click Yes to print item labels for all the items in this batch.',
    InconsistentFormat: (fieldName: string, newFormat: string, oldFormat: string) => `An "${fieldName}" was added with ${oldFormat} format. Changing to ${newFormat} will update that entry as well. Do you want to continue?`,
    ContinueCreatingTransaction: 'You will now create a “Count” Transaction for each Item Number in the Queue.',
    InfoText: 'These items will be removed from the Discrepancies List.',
    ClickYesToAssignLocation: 'Click Yes to close the Cycle Count Manager screen and go the Location Assignment Screen.',
    ClickOkToOutboundPort: (totalRecordsToRemove: number, binId: string) => `Proceeding will remove ${totalRecordsToRemove} record(s) of Storage Container  ${binId} from inventory map. Do you want to continue?`,
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
    FailedToRequestStorageBinExit: 'Failed to request storage bin exit',
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
    APIErrorMessage:"API request failed.",
    ZoneNotSelected: "Zone not selected",
    DeleteAllSuccess:"All records deleted successfully",
    NoRecordFound:"No records found",
    RecordsAddedSuccessfully: "All Records added successfully",
    AddAllFailed: "Failed to add all records",
    ZoneAddedSuccessfully: "Zone added successfully",
    ZoneUpdatedSuccessfully: "Zone updated successfully",
    ZoneDeletedSuccessfully: "Zone deleted successfully",
    NoDefaultFilter:"No filter is marked as default.",
    Resolved:"Resolved Successfully.",
    RecordUpdateFailed:'Failed to update record',
    LowerBoundAndUpperBoundRequired: 'Both Lower Bound and Upper Bound must be filled before applying the filter.',
    LowerBoundCannotBeGreater: 'Lower Bound cannot be greater than Upper Bound. Please adjust the range.',
    EnterQuantityValueBeforeApplying: 'Please enter a quantity value before applying the filter.',
    EnterValidPositiveQuantity: 'Please enter a valid positive number for the quantity.',
    PrintSuccessfullyCompleted:'Print successfully completed',
    UnableToPrint: 'Unable to print',
    UnableToAssignLocation: "Unable to assign location",
    CannotAssignMultipleMarkoutFunctions: 'Cannot assign multiple Markout functions to the same group.',
    OnlyOneMarkoutFunctionAllowed: 'Only one Markout function can be assigned per group.',
    StaffAlreadyHasMarkoutAssigned: 'Staff has already one markout assigned',
    InvalidInputForFilter: "Some of the inputs are missing values. Cannot add row to filter.",
    ZoneWouldBeADuplicateAndCannotBeAdded: "Zone would be a duplicate and cannot be added.",
    LocationZoneCannotBeDeleted: "Location Zone cannot be deleted because there are allocated quantities in an Inventory Map location matching the zone",
    CannotInsertDuplicateZone: "Cannot insert duplicate Zone",
    AddedInQueueSuccess:"Added in Queue",
    AddedInQueueFailed:"Added in Queue failed",
    AddToQueueSuccess: "Added to Queue successfully",
    RemoveFromQueueSuccess:"Remove from Queue",
    RemoveFromQueueFailed:"Remove from Queue failed",
    CountQueueActionTypeError:"Unhandled action type",
    ConfigurationUpdateSuccess: 'Configuration updated successfully',
    ConfigurationUpdateFailed: 'Failed to update configuration',
    UnableToConnectToServer: "Unable to connect to the server. Please make sure the service is running and try again.",
    TransactionCreatedSuccess: 'Transactions created successfully',
    FieldRequiresBothStartPositionAndFieldLength: (fieldName: string) => `${fieldName} requires both Start Position and Field Length values`,
    FieldHasInvalidValues: (fieldName: string) => `${fieldName} has invalid values. Please check the minimum requirements.`,
    SendToOutboundPort: 'Send to Outbound Port',
    NoTotesAvailableToAdd: 'No totes available to add',
    NoTotesSelected: 'No totes selected',
    PrintQueueIsEmpty: 'Print queue is empty',
    NoItemsSelected: 'No items selected',
    ToteAddedToQueue: (toteId: string) => `Tote ${toteId} added to print queue`,
    TotesAddedToQueue: (count: number) => `${count} tote(s) added to print queue`,
    ToteMovedBackToAvailable: (toteId: string) => `Tote ${toteId} moved back to available totes`,
    ItemsMovedBackToAvailable: (count: number) => `${count} item(s) moved back to available totes`,
    PrintingLabelsFromQueue: (count: number) => `Printing ${count} label(s) from queue`,
    LabelsDataPrintedSuccessfully: 'Labels printed successfully',
    InvalidCartID: "Invalid Cart ID, please try again",
    InvalidToteID: "Invalid Tote ID, please enter again",
    StorageBinExitSuccessful: 'Storage Container has been sent to Outbound Port.',
    CartAvailableAgain: 'All totes removed. Cart is now available again.',
    CartInducted: 'Cart has been Inducted',
    InvalidTote: "Please enter a valid Tote ID",
    InventoryMapRecordsDeletedSuccessfully: (count: number) => `Successfully deleted ${count} inventory map record(s)`,
    InventoryMapRecordsPartiallyDeleted: (successCount: number, failureCount: number) => `Deleted ${successCount} record(s), but ${failureCount} failed to delete`,
    InventoryMapRecordsDeleteFailed: 'Failed to delete inventory map records',
    ErrorDeletingInventoryMapRecords: 'Error occurred while deleting inventory map records'
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
    includePick: 'includePick',
    includeCFCarouselPick: 'includeCFCarouselPick'
}

export const alertMessage = {
    SerialNoNotExistsMsg: 'Serial Number Does Not Exist',
    ErrorValidatingSerialNoMsg: 'There was an error validating serial number',
    EnterSerialNo: 'Please enter a serial number',
    SerialNoAlreadyScan: 'Serial Number already scanned',
    DeleteMessage: 'You are about to mark the scanned reels as empty. This will delete ALL current open transactions associated with the scanned reels.',
    ZoneCannotBeLeftBlank:'Zone cannot be left blank.',
    DeviceTypeCannotBeLeftBlank:'Device Type cannot be left blank.',
    DeviceNumberCannotBeLeftBlank:'Device Number cannot be left blank.'
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
    TransactionHistory: 'Transaction History',
    BatchSelectionList: "Batch Selection List",
    ToteSelectionList: "Tote Selection List",
    OrderSelectionList: "Order Selection List",
    SelectedOrders: "Selected Orders",
    SelectedTotes: "Selected Totes",
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
    Regx: "^[0-9]*$",

}
export const Style = {
    w560px: '560px',
    w100vw: '100vw',
    w50vw: '50vw',
    w96vw:'96vw',
    w480px: '480px',
    w600px: '600px',
    w786px: '786px',
    w402px: '402px',
    w1080px: '1080px',
    w990px: '990px',
    auto:'auto',
    w56vw: '56vw',
    zIndexStickyHeader: 200000000
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
    MarkoutStatus: 'markoutStatus',
    StatusDate: 'statusDate',
    RouteId: 'routeId',
    DivertReason: 'divertReason',
    Location: 'location',
    Destination: 'destination',
    Details: 'details'
}

export const MarkoutNewPickTotesDC = {
    ToteID: 'Tote ID',
    MarkoutStatus: 'Status',
    StatusDate: 'Status Date',
    RouteId: 'Route Id',
    DivertReason: 'Divert Reason',
    Location: 'Location',
    Destination: 'Destination',
    Details: 'Details',
}


export const MarkoutNewPickLinesKeys = {
    Item: 'itemNumber',
    Quantity: 'quantity',
    LocationID: 'locationId',
    Status: 'status',
    StatusDate: 'statusDate',
    CompletedQuantity: 'completedQuantity',
    CompletedBy: 'completedBy',
    ShortReason: 'shortReason'
}

export const MarkoutNewPickLinesDC = {
    Item: 'Item Number',
    Quantity: 'Quantity',
    LocationID: 'Location ID',
    Status: 'Status',
    StatusDate: 'Status Date',
    CompletedQuantity: 'Completed Quantity',
    CompletedBy: 'Completed by',
    ShortReason: 'Short Reason'
}

export const MarkoutNewToteAuditKeys = {
    Time: 'timeStamp',
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
}

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

export const RouteIdManagement = {
    RouteIdStatus: 'In Consolidation',
}

export const REPORT_REPOSITORY_ID = 'BCAEC8B2-9D16-4ACD-94EC-74932157BF82';

export class PrintReports {
    static readonly REPROCESS_TRANSACTIONS = "ReprocessTransactions-lst";
    static readonly LOC_ASS_PICK_SHORTAGE = "LocAssPickShortage-lst";
}

export class ConsoleErrorMessages {
    static readonly ErrorPrintingReprocessReport = "Error occurred while printing reprocess report after allocation:"
    static readonly ErrorFindingAssignedOrderLines = "Error occurred while finding order lines assigned locations:"
}

export class ApiErrorMessages {
  static readonly UnexpectedResponseStatus = "Unexpected response status"
  static readonly FailedToRemoveOrderLines = "Failed to remove order lines"
  static readonly FailedToRemoveOrderLinesFromTote = "Failed to remove order lines from tote"
  static readonly ErrorRemovingOrderLinesFromTote = "Error removing order lines from tote"
  static readonly ErrorSubmittingCaseWiseOrders = "Error submitting case-wise orders"
  static readonly ErrorLoadingContainerLayout = "Error loading container layout"
  static readonly ErrorLoadingInventoryData = "Error loading inventory data"
  static readonly ValidationError = "Validation error"
}
export const PickToteFilterpreferences = {
    preferences: "PickToteFilterPrefs"
}
export const importFieldMappingDialogSizes  = {
  CCDiscrepancies : {
    width: '800px',
    height: '650px'
  }
}
export const FILTRATION_GRID_OPERATION_KEYS = {
    Between: "between",
    Clear: "clear",
    Clears: "clears",   
    Equals: "Equals",   
    And: " and "   
}
export const INPUT_TYPES = {
    Date: "date",
    Text: "text"
}
export const DATE_COLUMNS = new Set([
      'expirationDate',
      'putAwayDate',
      'importDate',
      'requiredDate',
      'completedDate',
      'exportDate',
      'inductionDate'
    ]);
    export const OPERATION_CONDITIONS: Record<string, string> = {
      'equals to': 'Equals',
      'is not equals to': 'NotEquals',
      'is greater than or equal to': 'GreaterThanOrEqual',
      'is less than or equal to': 'LessThanOrEqual',
      'is greater than': 'GreaterThan',
      'is less than': 'LessThan',
      'is like': 'Like',
      'contains': 'Contains',
      'is not like': 'NotLike',
      'does not contains': 'DoesNotContain',
      'begins with': 'Begins',
      'does not begins with': 'DoesNotBegin',
      'ends with': 'EndsWith',
      'does not ends with': 'DoesNotEndWith',
      'is between': 'Between',
      'between': 'Between'
    };

export const MarkoutFunctions = {
    MarkoutProcess: 'Markout Process',
    RGTPMarkout: 'RGTP Markout'
} as const;

export const MarkoutFunctionsList = [
    MarkoutFunctions.MarkoutProcess,
    MarkoutFunctions.RGTPMarkout
] as const;

export const DISABLED_FIELDS = [
    'priority',
    'Required Date',
    'Emergency',
    'Import Date'
  ];
  
  export const FIELDS_DEFAULT_AN = new Set<string>([
    'userField1',
    'userField2',
    'userField3',
    'userField4',
    'userField5',
    'userField6',
    'userField7',
    'userField8',
    'userField9',
    'userField10',
    'Emergency',
    'Zone',
    'expirationDate',
    'Warehouse',
    'requiredDate'
  ]);
  export const FormatValues = {
    NUMERIC : '123',
    ALPHA_NUMERIC : 'A+N',
  }
  
  export const FormatType = {
    NUMERIC : 'Numeric',
    ALPHA_NUMERIC : 'Alphanumeric',
  }
  export const storageContainerDisabledFields = {
    SENDTOOUTBOUNDPORT: 'sendToOutboundPort',
    CAROUSELZONE: 'carouselZone',
    TRAY: 'tray',
    CONTAINERTYPE: 'containerType',
    SAVE: 'save',
  };
  
export const DialogTitles = {
    STORAGE_CONTAINER : 'Storage Container'
}
  export const LabelPrintingModes = {
    NewTotes: 'New Totes',
    PrintedHistory: 'Printed Totes'
  }

  export const InventoryMapActionValues = {
    Cart_Management : 'cart_management',
  }

export const EmergencyOptions = {
    ProceedWithEmergencyPick:'proceed',
    Snooze:'snooze'
}