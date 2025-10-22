/**
 * Interface for transaction data used in the view-orders dialog
 * Represents the structure of transaction data received from the API
 */
export interface TransactionData {
  orderNumber: string;
  itemNumber: string;
  transactionQuantity: number;
  location: string;
  completedQuantity: number;
  description: string;
  batchPickId: string | null;
  bin: string;
  carousel: string;
  cell: string | null;
  completedBy: string;
  completedDate: string | null;
  emergency: boolean;
  expirationDate: string | null;
  exportBatchId: string | null;
  exportDate: string | null;
  exportedBy: string | null;
  hostTransactionId: string;
  id: number;
  importBy: string;
  importDate: string;
  importFilename: string;
  invMapId: number;
  lineNumber: number;
  lineSequence: number;
  lotNumber: string;
  masterRecord: boolean;
  masterRecordId: number;
  notes: string | null;
  priority: number;
  requiredDate: string | null;
  revision: string | null;
  row: string;
  serialNumber: string;
  shelf: string;
  statusCode: string;
  toteId: string | null;
  toteNumber: number;
  unitOfMeasure: string | null;
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
  warehouse: string | null;
  zone: string;
  rowNumber: number;
}
