export interface PickToteManagerDialogData {
  useDefaultFilter: boolean;
  allOrders: string[];
  pickBatchQuantity: number;
  toteSetup: Array<{ toteID: string }>;
  resultObj: Array<{ orderNumber: string; isSelected?: boolean }>;
}

