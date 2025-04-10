import { OperationTypes } from "../enums/CommonEnums";

export interface Operations {
    condition: string;
    title: string;
    type: OperationTypes;
}

export interface TableHeaderDefinitions {
    colHeader: string,
    colDef: string
} 

export type ValidWorkstation = {
    pcName: string, 
    wsid: string
};

export interface ApiResponse<T> {
    data: T;
    responseMessage: string;
    isExecuted: boolean;
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
  