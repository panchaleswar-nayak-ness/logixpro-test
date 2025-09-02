import { InventoryCompareField } from './inventory-compare.interface';

// Interface for the inventory compare API response based on actual API response
export interface InventoryCompareConfigResponse {
  isSuccess: boolean;
  errorMessages: string[];
  value: {
    fields: InventoryCompareField[];
  };
} 