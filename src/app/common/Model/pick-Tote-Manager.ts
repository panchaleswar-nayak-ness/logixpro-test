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

export interface SavedFilterChangeEvent {
  option: {
    value: string;
  };
}

export interface FilterData {
  sequence: number;
  field: string;
  criteria: string;
  value: string;
  andOr: string;
  isSaved: boolean;
  is_db?: boolean;
}

export interface OrderData {
  id?: number;
  sequence: number;
  field: string;
  order: string;
  isSaved: boolean;
}
export interface PickToteFilterPreference {
  userName: string;
  filterNumeric: boolean;
}
export interface FilterationColumns {
  ColumnName: string;
  ColumnType: string | number | Date | boolean;
  Value: string | number | Date | boolean | null | undefined;
  Value2: string | number | Date | boolean | null | undefined;
  GridOperation: string;
  IsInput: boolean;
}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
export interface InputDialogResult {
  Condition: string;
  SelectedColumn: string;
  SelectedItem2: string;
  SelectedItem: string;
  Type: string;
}