// Structure of each item in locationWithWSNameList
export class WorkstationLocations {
  workstation: string;
  locations: string[];
}

// Structure of each item in itemNumberWithWSNameList
export class WorkstationItems {
  workstation: string;
  items: string[];
}


export interface CycleCountDialogData {
  heading: string;
  importType: string;
  notFoundLocations?: string[];
  cycleCountLocations?: string[];
  workstationGroups?: WorkstationLocations[];
  notFoundItems?: string[];
  cycleCountItems?: string[];
  itemWorkstationGroups?: WorkstationItems[];
}


// Structure of the data passed to the dialog
export interface CycleCountConfirmMessageDialogData {
  heading: string;
  importType: string;
  notFoundLocations: string[];
  cycleCountLocations: string[];
  workstationGroups: WorkstationLocations[];
  notFoundItems: string[];
  cycleCountItems: string[];
  itemWorkstationGroups: WorkstationItems[];
}


// Top-level API response
export interface CommonResponse {
  isExecuted: boolean;
  data: InventoryFilterResult;
  responseMessage: string | null;
}

// Structure of the data field in the API response (InventoryFilterResult)
interface InventoryFilterResult {
  missingValues: string[];
  inventoryList: BatchCount[];
  locationExistsList: string[] | null;
  locationNotExistsList: string[] | null;
  locationWithWSIDList: string[] | null;
  locationWithWSNameList: WorkstationLocations[] | null;
  itemNumberExistsList: string[] | null;
  itemNumberNotExistsList: string[] | null;
  itemNumberWithWSNameList: WorkstationItems[] | null;
}

// Structure of each item in inventoryList
interface BatchCount {
  invMapID: number;
  itemNumber: string;
  description: string;
  itemQuantity: string;
  unitOfMeasure: string;
  wareHouse: string | null;
  generatedLocation: string;
  cellSize: string;
  serialNumber: string;
  lotNumber: string;
  location: string;
  expirationDate: string | null;
}
// Payload for GetImportBatchCount
export interface ImportBatchCountPayload {
  items: string;
  importBy: string;
  includeEmpty: boolean;
  includeOther: boolean;
}