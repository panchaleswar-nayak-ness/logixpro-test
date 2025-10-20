export interface InventoryMapRecord {
  invMapID: number;
  itemNumber: string;
  location: string;
  locationNumber: string;
  bin: string;
  row: string;
  shelf: string;
  carousel: string;
  cell: string;
  zone: string;
  itemQuantity: number;
  description: string;
  lotNumber?: string;
  expirationDate?: string;
  warehouse?: string;
  dateSensitive?: boolean;
  dedicated?: boolean;
  cellSize?: string;
  laserX?: number;
  laserY?: number;
  masterInvMapID?: number;
  masterLocation?: string;
  locationID?: number;
}
