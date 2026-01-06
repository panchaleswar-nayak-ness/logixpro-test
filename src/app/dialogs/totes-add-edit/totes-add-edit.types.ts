export interface ToteElement {
  toteID: string;
  cells: string;
  position: number;
  oldToteID: string;
  isInserted: number;
  isDuplicate: boolean;
  isEdit: boolean;
}

export interface ToteSetupPayload {
  oldToteID: string;
  toteID: string;
  cells: string;
}

export interface SavedTote {
  toteid: string;
  cells?: string;
}

export interface ToteTypeAheadItem {
  toteID: string;
  cells?: string;
}

export interface SelectedTote {
  toteID: string;
  cellID: string;
  position: number;
}

export interface TotesAddEditDialogData {
  position: number;
  alreadySavedTotes: SavedTote[];
  defaultCells?: string;
  validateTotes?: boolean;
}

