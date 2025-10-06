export interface InventoryCompareField {
  fieldId: string;
  fieldName: string;
  fieldIndex: number;
  startPosition: number;
  fieldLength: number;
  trimLeft: boolean;
  trimRight: boolean;
  dataType: string;
}

export interface InventoryCompareConfigPayload {
  fields: InventoryCompareField[];
} 