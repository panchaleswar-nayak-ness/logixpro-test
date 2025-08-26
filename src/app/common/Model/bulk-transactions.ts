import { Time } from "@angular/common";

export class OrderBatchToteQtyRequest {
    type: string;
}

export class OrderBatchToteQtyResponse {
    batchCount: number = 0;
    toteCount: number = 0;
    orderCount: number = 0;
    orderLinesCount: number = 0;
}

export class BatchesRequest {
    type: string;
    start: number;
    size: number;
    includeChildren: string
}

export class QuickPickOrdersRequest {
    start: number;
    size: number;
}

export class BatchesResponse {
    batchId: string;
    priority: number;
    orders: OrderResponse[];
    lineCount: number;
}

export class OrderResponse {
    orderNumber: string;
    toteId?: string | null;
    lineCount: number;
    priority: number;
    importDate?: Date | null;
    batchId?: string | null;
    importFilename?: string | null;
    requiredDate?: Date | null;
    exportBatchId?: string | null;
    toteNumber: number;
    orderLines: OrderLineResource[];
    isSlapperLabel? : boolean;
}

export class TotesResponse {
    priority: number = 0;
    importDate?: Date;
    importFilename?: string;
    requiredDate?: Date;
    toteId?: string;
    orderNumber?: string;
    toteNumber: number = 0;
    lineCount: number = 0;
    exportBatchId?: string;
    batchId?: string;
    lineNumber: number = 0;
    statusCode?: string;
    completedQuantity: number = 0;
    serialNumber?: string;
    orderLines: OrderLineResource[] = [];
}

export class OrderLineResource {
    id: number;
    orderNumber: string;
    itemNumber: string;
    description: string;
    lineNumber: number;
    batchId?: string | null;
    toteId?: string | null;
    transactionQuantity: number;
    zone?: string | null;
    completedBy?: string | null;
    completedDate?: Date | null;
    completedQuantity: number;
    transactionType: string;
    unitOfMeasure?: string | null;
    lotNumber?: string | null;
    expirationDate?: Date | null;
    serialNumber?: string | null;
    statusCode?: string | null;
    warehouse?: string | null;
    location?: string | null;
    assignedUser?: string | null;
    isPartialCase?: boolean;
}

export class TotesRequest {
    type: string;
    start: number;
    size: number;
    status: string;
    area: string;
}

export class OrdersRequest {
    type: string;
    start: number;
    size: number;
    status: string;
    area: string
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
    systemPreferences: SystemPreference;
    workstationPreferences: WorkstationPreference;
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
    storageContainer: boolean;
    locationControl: boolean;
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

export class NextToteId {
    numberOfIds?: number;
    nextId?: number;
}
export class TaskCompleteNewRequest {
  id: number;
  completedQty: number;
  newLocationQty?: number;
  BatchID?:string
}

export class ValidateToteRequest {
    toteid: string
}

export class FullToteRequest {
    NewToteID: string;
    FullToteID:string;
    Id: number;
    FullToteQTY: number;
    NewToteQTY: number;
}

export class AssignToteToOrderDto {
  orderNumber: string;
  toteId: string;
  type?: string;
}
export interface Order {
    priority: number;
    importDate: string;
    importFilename: string;
    requiredDate: string;
    toteId: string | null;
    orderNumber: string;
    toteNumber: number;
    lineCount: number;
    exportBatchId: string | null;
    batchId: string | null;
    lineNumber: number;
    statusCode: string | null;
    completedQuantity: number;
    serialNumber: string | null;
    orderLines: OrderLine[];
}
export interface OrderLine {
    id: number;
    orderNumber: string;
    itemNumber: string;
    description: string;
    lineNumber: number;
    batchId: string | null;
    toteId: string | null;
    toteNumber: string;
    transactionQuantity: number;
    zone: string;
    completedBy: string | null;
    completedDate: string | null;
    completedQuantity: number;
    transactionType: string;
    unitOfMeasure: string;
    lotNumber: string;
    expirationDate: string | null;
    serialNumber: string;
    statusCode: string;
    warehouse: string | null;
    location: string;
    assignedUser: string | null;
    invMapId: string;
    userField1: string | null;
    userField2: string | null;
    priority: number;
}

export class BulkZone {
    wsid: string;
    zone: string;
}

export class PartialToteIdRequest {
    orderNumber?: string;
    toteNumber?: string;
    toteID?: string;
    partialToteID?: string;
}

export class PartialToteIdResponse {
    orderNumber: string;
    toteNumber: string;
    toteID: string;
    partialToteID: string;
    orderLines: OrderLineResource[];
}
export interface SlapperLabelResponse {
    id: number;
    orderNumber: string;
    itemNumber: string;
    description: string;
    lineNumber: number;
    batchId: string | null;
    toteId: string;
    transactionQuantity: number;
    zone: string;
    completedBy: string | null;
    completedDate: string | null;
    completedQuantity: number;
    transactionType: string;
    unitOfMeasure: string;
    lotNumber: string;
    expirationDate: string | null;
    serialNumber: string;
    statusCode: string | null;
    warehouse: string | null;
    location: string;
    assignedUser: string | null;
    isPartialCase: boolean;
}

// Extended interface for consolidated records
export interface ConsolidatedSlapperLabelResponse extends SlapperLabelResponse {
    isConsolidated: boolean;
    originalPartialRecords: SlapperLabelResponse[];
    consolidatedToteCount: number;
  }