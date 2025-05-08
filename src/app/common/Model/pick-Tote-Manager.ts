export interface FilterOrder {
    orderNumber: string;
    reqDate: string;
    priority: number | string;
    otLines: number | string;
    isSelected: boolean;
  }

  
  export interface FilterTransaction {
    orderNumber: string;
    itemNumber?: string;
    transactionQuantity?: number;
    location?: string;
    completedQuantity?: number;
    description?: string;
    importDate?: string;
    priority?: number | string;
    requiredDate?: string;
    lineNumber?: number;
    lineSequence?: number;
    serialNumber?: string;
    lotNumber?: string;
    expirationDate?: string;
    completedDate?: string;
    completedBy?: string;
    batchPickID?: string;
    unitOfMeasure?: string;
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
    revision?: string;
    toteID?: string;
    toteNumber?: string;
    cell?: string;
    hostTransactionID?: string;
    id?: string | number;
    zone?: string;
    carousel?: string;
    row?: string;
    shelf?: string;
    bin?: string;
    warehouse?: string;
    invMapID?: string;
    importBy?: string;
    importFilename?: string;
    notes?: string;
    emergency?: boolean | string | number;
    masterRecord?: string;
    masterRecordID?: string;
    exportBatchID?: string;
    exportDate?: string;
    exportedBy?: string;
    statusCode?: string;
  }