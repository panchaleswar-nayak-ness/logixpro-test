export interface LookupTableData {
  id: number;
  appName?: string;
  valueName: string;
  value: string;
  sequence: number;
  IsDisabled?: boolean;
}

export interface LookupTablePayload {
  id: number;
  ValueName: string;
  Value: string;
  Sequence: number | string;
  AppName: string;
  ListName: string;
}

export interface LookupListConfig {
  listName: string;              // API parameter (ShortPick, HotPick, etc.)
  infoText: string;              // Description shown at top
  deleteActionMessage: string;   // "Pick list", "Hot Pick list", etc.
  automationIdPrefix: string;    // For data-automation-id attributes
}

