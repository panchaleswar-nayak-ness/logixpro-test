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
