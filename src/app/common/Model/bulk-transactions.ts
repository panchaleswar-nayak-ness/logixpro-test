import { Time } from "@angular/common";

export class OrderBatchToteQtyRequest {
    type: string;
}

export class OrderBatchToteQtyResponse {
    batchCountWithIds: object;
    batchCount: number;
    toteCount: number;
    orderCount: number;
}

export class BatchesRequest {
    type: string;
    start: number;
    size: number;
    includeChildren: string
}

export class BatchesResponse {
    id: number;
    waveId: string = "";
    batchId: string = "";
    type: string = "";
    priority: number;
    importDate: Date | null;
    importBy: string | null;
    importFilename: string | null;
    transactionType: string = "";
    orderNumber: string = "";
    lineNumber: number;
    lineSequence: number;
    requiredDate: Date | null;
    itemNumber: string | null;
    unitOfMeasure: string | null;
    lotNumber: string | null;
    expirationDate: Date | null;
    serialNumber: string | null;
    description: string | null;
    revision: string | null;
    transactionQuantity: number;
    location: string | null;
    warehouse: string | null;
    zone: string | null;
    carousel: string | null;
    shelf: string | null;
    bin: string | null;
    invMapId: number;
    completedDate: Date | null;
    completedBy: string | null;
    completedQuantity: number;
    batchPickId: string | null;
    notes: string | null;
    exportFileName: string | null;
    exportDate: Date | null;
    exportedBy: string | null;
    exportBatchId: string | null;
    tableType: string | null;
    statusCode: string | null;
    masterRecord: boolean;
    masterRecordId: number;
    label: boolean;
    inProcess: boolean;
    toteId: string | null;
    toteNumber: number;
    cell: string | null;
    hostTransactionId: string | null;
    emergency: boolean;

    constructor() {
        this.id = 0;
        this.priority = 0;
        this.lineNumber = 0;
        this.lineSequence = 0;
        this.transactionQuantity = 0;
        this.invMapId = 0;
        this.completedQuantity = 0;
        this.masterRecord = false;
        this.masterRecordId = 0;
        this.label = false;
        this.inProcess = false;
        this.toteNumber = 0;
        this.emergency = false;
    }
}

export class TotesRequest {
    type: string;
    start: number;
    size: number;
    status: string;
    area: string;
}

export class TotesResponse {
    id: number;
    waveId: string | null;
    batchId: string | null;
    type: string | null;
    priority: number;
    importDate: Date | null;
    importBy: string | null;
    importFilename: string | null;
    transactionType: string | null;
    orderNumber: string | null;
    lineNumber: number;
    lineSequence: number;
    requiredDate: Date | null;
    itemNumber: string | null;
    unitOfMeasure: string | null;
    lotNumber: string | null;
    expirationDate: Date | null;
    serialNumber: string | null;
    description: string | null;
    revision: string | null;
    transactionQuantity: number;
    location: string | null;
    warehouse: string | null;
    zone: string | null;
    carousel: string | null;
    shelf: string | null;
    bin: string | null;
    invMapId: number;
    completedDate: Date | null;
    completedBy: string | null;
    completedQuantity: number;
    batchPickId: string | null;
    notes: string | null;
    exportFileName: string | null;
    exportDate: Date | null;
    exportedBy: string | null;
    exportBatchId: string | null;
    tableType: string | null;
    statusCode: string | null;
    masterRecord: boolean;
    masterRecordId: number;
    label: boolean;
    inProcess: boolean;
    toteId: string | null;
    toteNumber: number;
    cell: string | null;
    hostTransactionId: string | null;
    emergency: boolean;

    constructor() {
        this.id = 0;
        this.priority = 0;
        this.lineNumber = 0;
        this.lineSequence = 0;
        this.transactionQuantity = 0;
        this.invMapId = 0;
        this.completedQuantity = 0;
        this.masterRecord = false;
        this.masterRecordId = 0;
        this.label = false;
        this.inProcess = false;
        this.toteNumber = 0;
        this.emergency = false;
    }
}

export class OrdersRequest {
    type: string;
    start: number;
    size: number;
    status: string;
    area: string
}

export class OrderResource {
    id: number;
    orderNumber: string = "";
    waveId: string = "";
    batchId: string = "";
    toteId: string | null;
    orderType: string = "";
    orderStatus: string = "";
    orderDate: string = "";
    lineCount: number;
    type: string | null;
    priority: number;
    importDate: Date | null;
    importBy: string | null;
    importFilename: string | null;
    transactionType: string | null;
    lineNumber: number;
    lineSequence: number;
    requiredDate: Date | null;
    itemNumber: string | null;
    unitOfMeasure: string | null;
    lotNumber: string | null;
    expirationDate: Date | null;
    serialNumber: string | null;
    description: string | null;
    revision: string | null;
    transactionQuantity: number;
    location: string | null;
    warehouse: string | null;
    zone: string | null;
    carousel: string | null;
    shelf: string | null;
    bin: string | null;
    invMapId: number;
    completedDate: Date | null;
    completedBy: string | null;
    completedQuantity: number;
    batchPickId: string | null;
    notes: string | null;
    exportFileName: string | null;
    exportDate: Date | null;
    exportedBy: string | null;
    exportBatchId: string | null;
    tableType: string | null;
    statusCode: string | null;
    masterRecord: boolean;
    masterRecordId: number;
    label: boolean;
    inProcess: boolean;
    toteNumber: number;
    cell: string | null;
    hostTransactionId: string | null;
    emergency: boolean;
    row: string | null;
    userField1: string | null;
    userField2: string | null;
    userField3: string | null;
    userField4: string | null;
    userField5: string | null;
    userField6: string | null;
    userField7: string | null;
    userField8: string | null;
    userField9: string | null;
    userField10: string | null;

    constructor() {
        this.id = 0;
        this.lineCount = 0;
        this.priority = 0;
        this.lineNumber = 0;
        this.lineSequence = 0;
        this.transactionQuantity = 0;
        this.invMapId = 0;
        this.completedQuantity = 0;
        this.masterRecord = false;
        this.masterRecordId = 0;
        this.label = false;
        this.inProcess = false;
        this.toteNumber = 0;
        this.emergency = false;
    }
}

export class BatchesByIdRequest {
    type: string;
    batchpickid: string;
    status: string;
}

export class WorkstationPreference {
    podId?: string;
    sort1Arrows?: string;
    sort2Arrows?: string;
    carouselSwPath?: string;
    lightTreeVersion?: string;
    locAssOrderSelection: boolean;
    locAssPickImport: boolean;
    locAssPutAwayImport: boolean;
    locAssCountImport: boolean;
    autoInventoryImport: boolean;
    locAssOneLocation: boolean;
    cartonFlowSequence?: string;
    batchQty: number;
    batchSqty: number;
    podOrder: boolean;
    printReprocessReport: boolean;
    autoPrintReprocessReport: boolean;
    batchPutAway: boolean;
    recombineSplitTransactions: boolean;
    waitForSplitTransactions: boolean;
    latestVersionPath?: string;
    spinSort?: string;
    cibDelay?: number;
    printPickLabel: boolean;
    scanVerifyPicks: boolean;
    scanVerifyPutAways: boolean;
    pickToTotes: boolean;
    putAwayFromTotes: boolean;
    autoPrintPickToteLabels: boolean;
    printPickLabelBatch: boolean;
    autoCompBoShipComplete: boolean;
    wsid: string;
    printReportLocation?: string;
    printLabelLocation?: string;
    scanVerifyCounts?: boolean;
    hotPickQuantity: number;
    hotPutAwayQuantity: number;
    hotPickStart?: string;
    hotPutAwayStart?: string;
    cartonFlowId?: string;
    pickToKanbanCart: boolean;
}

export class SystemPreference {
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

export class BulkPreferences {
    systempreferences: SystemPreference[];
    workstationPreferences: WorkstationPreference[];
}

export class CreateBatchRequest {
    BatchData: CreateBatchData[];
    nextBatchID: string;
    transactionType: string;
}

export class CreateBatchData {
    orderNumber: string;
    toteNumber: string;
}

export class WorkStationSetupResponse {
    podId: string;
    scanVerifyPicks: boolean;
    scanVerifyCounts: boolean;
    scanVerifyPutAways: boolean;
    printReportLocation: string;
    printLabelLocation: string;
    cartonFlowId: string;
    pickToTotes: boolean;
    putAwayFromTotes: boolean;
    autoPrintPickToteLabels: boolean;
    batchPutAway: boolean;
    locAssOrderSelection: boolean;
    printReprocessReport: boolean;
    printPickLabel: boolean;
    printPickLabelBatch: boolean;
    pfSettings: PFSettings[];
    pfSettingsII: PFSettings[];
    pfSettingsIII: PFSettings[];
}

export class PFSettings {
    pfName: string;
    pfSetting: string;
}

export class UpdateLocationQuantityRequest {
    invMapId: number;
    locationQty: number;
}

export class TaskCompleteRequest {
    otId: number;
    toteId?: string | null;
    serialNumber?: string | null;
    lotNumber?: string | null;
    pickedQty: number;
    countQty: number;
}

export class ValidateToteRequest{
    toteid:string
}



export class FullToteRequest {
    toteId?: string | null;
    orderNumber?: string | null;
    type?: string | null;
    newToteQty: number;

}