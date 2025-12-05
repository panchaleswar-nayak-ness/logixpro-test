/**
 * Interface for transaction data used in the Confirm and Packing Select Transaction dialog
 * Represents the structure of transaction data received from the ConfPackSelectDT API
 */
export interface ConfPackSelectTransaction {
  sT_ID: number;
  itemNumber: string;
  lineNumber: number;
  completedQuantity: number;
  transactionQuantity: number;
  containerID?: string;
}

/**
 * Minimal interface for transaction items in the transaction table
 * Used when searching for transactions by sT_ID
 */
export interface ConfPackTransaction {
  sT_ID: number;
  containerID?: string;
}

