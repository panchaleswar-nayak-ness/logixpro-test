import { Time } from "@angular/common";
import { OperationTypes } from "../enums/CommonEnums";

export interface Operations {
    condition: string;
    title: string;
    type: OperationTypes;
}

export interface TableHeaderDefinitions {
    colHeader: string,
    colDef: string,
    colTitle?: string
}

export type ValidWorkstation = {
    pcName: string,
    wsid: string
};

export interface ApiResponse<T> {
    data: T;
    responseMessage: string;
    isExecuted: boolean;
    messages: any;
    statusCode: number;
}

export interface ApiResult<T> {
    isSuccess: boolean;
    value: T | null;
    errorMessage?: string;
}

export interface ApiResponseData {
    responseMessage: string;
    isExecuted: boolean;
    messages: any;
    statusCode: number;
}

export interface UserSession {
    _token: string;
    userName: string;
    accessLevel: string;
    wsid: string;
    loginTime: string;
}


export interface OpenTransactions {
    id: number,
    orderNumber: string,
    lotNumber: string,
    hostTransactionID: string,
    transactionQuantity: number,
    expirationDate: string,
    serialNumber: string,
    location: string,
    userField1: string,
    userField2: string,
    warehouse: string,
    zone: string,
    rn: number
}

export interface ColumnAlias {
    itemNumber: string;
    unitOfMeasure: string;
    userField1: string;
    userField2: string;
    userField3: string;
    userField4: string;
    userField5: string;
    userField6: string;
    userField7: string;
    userField8: string;
    userField9: string;
    userField10: string;
    bin: string;
    shelf: string;
    row: string;
    carousel: string;
}

export interface FieldMappingAlias {
    itemNumber: string;
    unitOfMeasure: string;
    userField1: string;
    userField2: string;
    userField3: string;
    userField4: string;
    userField5: string;
    userField6: string;
    userField7: string;
    userField8: string;
    userField9: string;
    userField10: string;
    bin: string;
    shelf: string;
    row: string;
    carousel: string;
    routeId: string;
    statusDate: string;
    consolidationStatus: string;
    routeIdStatus: string;
    consolidationProgress: string;
    routeIdStatusCountCard: string;
    consolidationStatusCard: string;
    'con.HeaderList':string;
}

export interface OSFieldFilterNames {
    UserField1: string;
    UserField2: string;
    UserField3: string;
    UserField4: string;
    UserField5: string;
    UserField6: string;
    UserField7: string;
    UserField8: string;
    UserField9: string;
    UserField10: string;
}

export interface CustomPagination {
    total: number;
    recordsPerPage: number;
    startIndex: number;
    endIndex: number;
}

export interface CmPreferences {
    emailPickingSlip: boolean;
    defaultPackingList: string;
    defaultLookupType: string;
    verifyItems: string;
    blindVerifyItems: string;
    printVerified: string;
    printUnVerified: string;
    customToteManifest: string;
    autoCompBOShipComplete: boolean;
    packingListSort: string;
    packing: boolean;
    confirmAndPacking: boolean;
    autoPrintContPL: boolean;
    autoPrintOrderPL: boolean;
    autoPrintContLabel: boolean;
    enterContainerID: boolean;
    containerIDDefault: string;
    confirmAndPackingConfirmQuantity: boolean;
    freight: boolean;
    freight1: boolean;
    freight2: boolean;
    weight: boolean;
    length: boolean;
    width: boolean;
    height: boolean;
    cube: boolean;
    shipping: boolean;
    stageNonPickProOrders: boolean;
    validateStagingLocations: boolean;
    userField1: boolean;
    userField2: boolean;
    userField3: boolean;
    userField4: boolean;
    userField5: boolean;
    userField6: boolean;
    userField7: boolean;
    userField1Alias: string;
    userField2Alias: string;
    userField3Alias: string;
    userField4Alias: string;
    userField5Alias: string;
    userField6Alias: string;
    userField7Alias: string;
    autoPrintToteManifest: boolean;
    autoPrintToteManifest2: boolean;
    autoPrintMarkoutReport: boolean;
    defaultViewType: string;
    currentStatus: boolean;
    missed: boolean;
    short: boolean;
    shipShort: boolean;
    complete: boolean;
    notIncluded: boolean;
}

export interface FieldMappingModel {
    itemNumber: string;
    unitOfMeasure: string;
    userField1: string;
    userField2: string;
    userField3: string;
    userField4: string;
    userField5: string;
    userField6: string;
    userField7: string;
    userField8: string;
    userField9: string;
    userField10: string;
}

export interface WorkStationSetup {
    podID: string;
    scanVerifyPicks: boolean;
    scanVerifyCounts: boolean;
    scanVerifyPutAways: boolean;
    printReportLocation: string;
    printLabelLocation: string;
    cartonFlowID: string | null;
    pickToTotes: boolean;
    putAwayFromTotes: boolean;
    autoPrintPickToteLabels: boolean;
    batchPutAway: boolean;
    storageContainer: boolean;
    locationControl: boolean;
    locAssOrderSelection: boolean;
    printReprocessReport: boolean;
    printPickLabel: boolean;
    printPickLabelBatch: boolean;
    pfSettings: PFSetting[];
    pfSettingsII: PFSetting[];
    pfSettingsIII: PFSetting[];
}

type PFSetting = {
    pfName: string;
    pfSetting: string;
};

export type ClearType = 'all' | 'order' | 'item';

export const ClearTypes = {
  All: 'all' as ClearType,
  Order: 'order' as ClearType,
  Item: 'item' as ClearType
};

export interface SystemPreference {
    id: number;
    maximumOrders: number;
    companyName?: string;
    address1?: string;
    city?: string;
    state?: string;
    zip?: string;
    companyLogo?: Uint8Array;
    userField1?: string;
    userField2?: string;
    userField3?: string;
    userField4?: string;
    userField5?: string;
    userField6?: string;
    userField7?: string;
    userField8?: string;
    userField9?: string;
    userField10?: string;
    itemNumber?: string;
    unitOfMeasure?: string;
    warehouse?: string;
    showTransQty?: string;
    locationLotMixing: boolean;
    nextBatchId?: string;
    webSite?: string;
    replenishNextOrder?: string;
    replenishNextBatchId?: string;
    nextToteId: number;
    checkForValidTotes: boolean;
    pickType?: string;
    zeroLocationQuantityCheck: boolean;
    orderSort?: string;
    orderManifest: boolean;
    pickPartialKits: boolean;
    distinctKitOrders: boolean;
    autoBatchKits: boolean;
    nextSerialNumber: number;
    shortPickFindNewLocation: boolean;
    reelTrackingPickLogic?: string;
    autoLocPicks: boolean;
    autoLocPutAways: boolean;
    autoLocCounts: boolean;
    carouselBatchId: boolean;
    bulkBatchId: boolean;
    rtsDollarAmount: number;
    rtsThresholdQuantity: number;
    rtU1?: string;
    rtU2?: string;
    rtU3?: string;
    rtU4?: string;
    rtU5?: string;
    rtU6?: string;
    rtU7?: string;
    rtU8?: string;
    rtU9?: string;
    rtU10?: string;
    rtOrderNumberPrefix?: string;
    replenishDedicatedOnly: boolean;
    domainAuthentication: boolean;
    fifoPickAcrossWarehouse: boolean;
    confirmInventoryChanges: boolean;
    dynamicReelTrackingCreateWip: boolean;
    pickLabelsOnePerQty: boolean;
    cartonFlowDisplay?: string;
    requestNumberOfPutAwayLabels: boolean;
    maxNumberOfPutAwayLabels: number;
    emailPackingSlip: boolean;
    urlImages: boolean;
    urlPreamble?: string;
    urlPostamble?: string;
    autoDisplayImage: boolean;
    useNtlm: boolean;
    multiBatchCartSelection: boolean;
    printFullCases: boolean;
    hostImage: boolean;
    hostImageLocation?: string;
    quickCountQuantity?: string;
    osFieldName?: string;
    osText?: string;
    companyLogoLocation?: string;
    displayEob: boolean;
    beepIfPicks: boolean;
    allowTwoPickBatchSelection: boolean;
    viewOrderShowOrderStatus: boolean;
    toteLabelShowCount: boolean;
    displayCaseQty: boolean;
    displayCaseQtyUm?: string;
    otTempToOtPending: boolean;
    earlyBreakTime: Time;
    earlyBreakDuration: number;
    midBreakTime: Time;
    midBreakDuration: number;
    lateBreakTime: Time;
    lateBreakDuration: number;
    printReplenPutLabels: boolean;
    osFieldNameRed?: string;
    osTextRed?: string;
    osFieldNameGreen?: string;
    osTextGreen?: string;
    osFieldNameBlue?: string;
    osTextBlue?: string;
    generateQuarantineTransactions: boolean;
    requireHotReasons: boolean;
}

//THis interface is only used when retrieving data from the server
export interface AccessLevelByGroupFunctions {
    accessClearWholeLocation: boolean;
    accessstorageContainer: boolean;
}

export interface EmployeeAccessLevel {
    lastRefreshedDateTime : Date;
    accessStorageContainer : boolean;
    accessClearWholeLocation : boolean;
    accessAddInvMapLocation: boolean;
}

export interface ApiResponseData {
  status: 'Success' | 'Fail' | string;  // or use the same enum if shared
  value?: string | null;
  errors?: string[] | null;
}