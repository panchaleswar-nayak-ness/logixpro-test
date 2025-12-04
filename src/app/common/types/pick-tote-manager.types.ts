import { FilterationColumns } from "../Model/pick-Tote-Manager";

export type SavedFilterChangeEvent = {
  option: {
    value: string;
  };
};

export type FilterData = {
  sequence: number;
  field: string;
  format: string;
  criteria: string;
  value: string;
  andOr: string;
  isSaved: boolean;
  is_db?: boolean;
  isNumericFormat?: boolean;
};

export type OrderData = {
  id?: number;
  sequence: number;
  field: string;
  order: string;
  isSaved: boolean;
};

export type FilterOrder = {
  orderNumber: string;
  reqDate: string;
  priority: number | string;
  otLines: number | string;
  isSelected: boolean;
};
export type AllDataTypeValues = string | number | boolean | Date | null | undefined;

export type TransactionColumnDef = {
  columnDef: string;
  header: string;
  cell: (element: FilterTransaction) => string | number | boolean;
};

export type FilterTransaction = {
  orderNumber: string;
  itemNumber?: string;
  transactionQuantity?: number;
  location?: string;
  completedQuantity?: number;
  description?: string;
  importDate: string | Date | null ;
  priority?: number | string;
  requiredDate: string | Date | null ;
  lineNumber?: number;
  lineSequence?: number;
  serialNumber?: string;
  lotNumber?: string;
  expirationDate: string | Date | null ;
  completedDate: string | Date | null ;
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
  exportDate: string | Date | null ;
  exportedBy?: string;
  statusCode?: string;
}; 

export interface PickToteTransPayload {
  Draw: number;
  OrderNumber: string | number | null; // adjust based on your actual type
  SRow: number;
  ERow: number;
  SortColumnNumber: number;
  SortOrder: string | number; // depends on UniqueConstants.Asc type
  Filter: string;
  FiltrationColumns: FilterationColumns[]; // replace 'any' with proper type if you know structure
  IsZoneOrderSelection?: boolean; // Optional parameter to indicate zone order selection
}
export interface PickToteTransResponse {
  TotalRecords: number;
  FilteredRecords: number,
  Draw: number;
  PickToteManTrans: FilterTransaction[]; 
}
