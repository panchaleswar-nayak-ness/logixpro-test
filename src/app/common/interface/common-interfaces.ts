import { FilterationColumns } from '../Model/pick-Tote-Manager';

export interface SearchRequest {
  Value: string;
  Column: string;
}
export interface SortRequest {
  Direction: string;
  Column: string;
}
export interface ProcessPicksPickTypePreference {
  UserName: string;
  PickType: string;
}
export interface WorkstationZoneFilterPreference {
  UserName: string;
  Carousel: boolean;
  CartonFlow: boolean;
  Bulk: boolean;
}

// Applied Filter Display Interface for filter chips
// Uses FilterationColumns type directly to avoid duplication and maintain single source of truth
export interface AppliedFilterDisplay {
  columnName: string;
  columnDisplayName: string;
  criteria: string;
  value: string;
  value2?: string;
  filter: FilterationColumns;
}