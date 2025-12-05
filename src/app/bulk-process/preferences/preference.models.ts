export interface Zone {
  zone: string;
  carousel: boolean;
  cartonFlow: boolean;
  includeCfCarouselPick: boolean;
  includeInTransactions: boolean;
  includeInAutoBatch: boolean;
  locationName: string;
  label1: string;
  label2: string;
  label3: string;
  label4: string;
  replenishmentZone: boolean;
  sequence: number;
  stagingZone: boolean;
  dynamicWarehouse: boolean;
  allocable: boolean;
  parentZone: string;
  caseLabel: string | null;
  kanbanZone: boolean;
  kanbanReplenishmentZone: boolean;
  keepMasterLocation: boolean;
  allowWholeClearLocation: boolean;
  id?: number;
}
export interface BulkZone {
  wsid: string;
  zone: string;
  isNew?: boolean;
  oldZone?: string;
  options?: Zone[];
}

export type ZoneListPayload = string[];