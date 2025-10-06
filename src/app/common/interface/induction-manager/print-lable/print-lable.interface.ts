export interface AvailableTote {
  toteId: string;
  priority: number;
  requiredDate: string;
  zone?: string; // Optional zone field that may come from API
}

export interface PrintQueueItem {
  toteId: string;
  priority: number;
  requiredDate: string;
  zone?: string; // Optional zone field
}

export interface PrintToteLabelsPayload {
  wsid: string;
  toteIds: string[];
}
