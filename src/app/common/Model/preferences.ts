export interface GeneralSetup {
    companyName: string;
    address1: string;
    city: string;
    state: string;
    domainAuthentication: boolean;
    useNTLM: boolean;
    orderManifest: boolean;
    fifoPickAcrossWarehouse: boolean;
    checkForValidTotes: boolean;
    replenishDedicatedOnly: boolean;
    pickLabelsOnePerQty: boolean;
    shortPickFindNewLocation: boolean;
    zeroLocationQuantityCheck: boolean;
    requestNumberofPutAwayLabels: boolean;
    carouselBatchID: boolean;
    bulkBatchID: boolean;
    dynamicReelTrackingCreateWIP: boolean;
    reelTrackingPickLogic: string;
    multiBatchCartSelection: boolean;
    confirmInventoryChanges: boolean;
    showTransQty: string;
    nextToteID: number;
    nextSerialNumber: number;
    maxNumberOfPutAwayLabels: number;
    pickType: string;
    orderSort: string;
    cartonFlowDisplay: string;
    autoDisplayImage: boolean;
    otTemptoOTPending: boolean;
    earlyBreakTime: string;
    earlyBreakDuration: number;
    midBreakTime: string;
    midBreakDuration: number;
    lateBreakTime: string;
    lateBreakDuration: number;
    distinctKitOrders: boolean;
    printReplenPutLabels: boolean;
    generateQuarantineTransactions: boolean;
    requireHotReasons: boolean;
    allowQuickPicks:boolean;
    deafultQuickPicks:boolean;
    printReprocessReportAfterAllocation:boolean;
}

interface Preferences {
    maxOrders: number;
    allowInProc: boolean;
    allowPartRel: boolean;
    defUserFields: boolean;
    printDirectly: boolean;
}

export interface OrderManagerSettings {
    preferences: Preferences[];
    customReport: string;
    customAdmin: string;
    customAdminText: string;
}

interface CountInfo {
    mixed: number;
    carousel: number;
    offCarousel: number;
}

interface ImPreference {
    autoPickOrderSelection: boolean;
    orderSort: string;
    autoPickToteID: boolean;
    carouselToteIDPicks: boolean;
    offCarouselToteIDPicks: boolean;
    usePickBatchManager: boolean;
    useDefaultFilter: boolean;
    useDefaultZone: boolean;
    autoPutAwayToteID: boolean;
    defaultPutAwayPriority: number;
    defaultPutAwayQuantity: number;
    pickBatchQuantity: number;
    defaultCells: number;
    splitShortPutAway: boolean;
    selectIfOne: boolean;
    putAwayInductionScreen: string;
    validateTotes: boolean;
    carouselBatchIDPicks: boolean;
    carouselBatchIDPutAways: boolean;
    offCarouselBatchIDPicks: boolean;
    offCarouselBatchIDAways: boolean;
    autoForwardReplenish: boolean;
    createItemMaster: boolean;
    sapLocationTransactions: boolean;
    createPutAwayAdjustments: boolean;
    stripScan: boolean;
    stripSide: string;
    stripNumber: number;
    autoPrintCrossDockLabel: boolean;
    autoPrintPickLabels: boolean;
    pickLabelsOnePerQty: boolean;
    autoPrintPickToteLabels: boolean;
    autoPrintPutAwayToteLabels: boolean;
    autoPrintOffCarouselPickList: boolean;
    autoPrintOffCarouselPutAwayList: boolean;
    autoPrintPutAwayLabels: boolean;
    requestNumberOfPutAwayLabels: boolean;
    maxNumberOfPutAwayLabels: number;
    printDirectly: boolean;
    trackInductionTransactions: boolean;
    inductionLocation: string;
    stageUsingBulkPro: boolean;
    stageVelocityCode: string;
    defaultPutAwayScanType: string;
    defaultSuperBatchSize: number;
    confirmSuperBatch: boolean;
    superBatchByToteID: boolean;
    useInZonePickScreen: boolean;
    autoPrintCaseLabel: boolean;
    shortMethod: string;
    autoPrintPickBatchList: boolean;
    dontAllowOverReceipt: boolean;
    autoAssignAllZones: boolean;
    purchaseOrderRequired: boolean;
    defaultPutAwayShortQuantity: string;
}

export interface PickToteSetupIndex {
    countInfo: CountInfo;
    imPreference: ImPreference;
    pickBatches: string[];
}

export interface PutAwayOption {
    id: string;
    name: string;
}