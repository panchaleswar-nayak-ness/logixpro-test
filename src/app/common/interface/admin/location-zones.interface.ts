export interface LocationZone {
  zone: string;
  carousel: boolean;
  cartonFlow: boolean;
  replenishmentZone: boolean;
  stagingZone: boolean;
  includeCFCarouselPick: boolean;
  parentZone: string;
  includeInAutoBatch: boolean;
  includeInTransactions: boolean;
  dynamicWarehouse: boolean;
  allocable: boolean;
  locationName: string;
  label1: string;
  label2: string;
  label3: string;
  label4: string;
  caseLabel: string;
  sequence: number;
  kanbanZone: boolean;
  kanbanReplenishmentZone: boolean;
  allowClearWholeLocation: boolean;
  id?: number; // Added as optional since it's assigned in the component
}
