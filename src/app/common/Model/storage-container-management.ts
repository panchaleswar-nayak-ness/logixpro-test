export class UpdateSCReq {
    BinLayoutId: number;
    Zone: string;
}

export class UpdateSCRes {
    binLayout: BinLayout
}

export class BinCellLayout {
    id: number;
    binLayoutID: number;
    column: number;
    row: number;
    binID: string;
    cellSize: string;
    commandString: string;
    binLayout: BinLayout;
}

export class BinLayout {
    id: number;
    description: string;
    layoutDefinitionID: number;
    columns: number;
    rows: number;
    binCellLayouts: BinCellLayout[] = [];
    layoutDefinition: layoutDefinition;
}

export class layoutDefinition {
    id: number;
    maxCells: number;
    maxColumns: number;
    maxRows: number;
}

export class BinLayoutRes {
    binLayout: BinLayout
}

export class VaildateScannedContainerRes {
    errorMessage: string;
    errorCode: number;
    validationErrorCode: string;
    details: {};
    hasError: boolean;
}

export class StorageContainerLayout {
    columns: number;
    rows: number;
    binLayout: BinLayout = new BinLayout();
    layoutDefinition: layoutDefinition;
}

export class UpdateStorageContainerLayoutRes {
    success: boolean;
    errorMessage: string;
}

export class ContainerTypes {
    id: number;
    name: string;
}

export class CarouselZone {
    zone: string;
    zoneName: string;
}

export const ValidationErrorCodes = {
    LocationDedicatedToContainer: "LocationDedicatedToContainer",
    AllocatedPutawayToContainer: "AllocatedPutawayToContainer",
    PickAllocatedToContainer: "PickAllocatedToContainer",
    ItemQuantityAssignedToContainer: "ItemQuantityAssignedToContainer",
    ItemAssignedToContainer: "ItemAssignedToContainer",
    NoLayoutAssignedToContainer: "NoLayoutAssignedToContainer"
}

export class InventoryMap {
    location:string = "";
    zone:string = "";
    carousel:string = "";
    row:string = "";
    shelf:string = "";
    bin:string = "";
    item:string = "";
    itemQuantity: number;
    description:string = "";
    clear: number;
    cell:string = "";
    velocity:string = "";
    maxQuantity: number;
    dedicated: boolean = false;
    serialNumber: number;
    lotNumber: number;
    expirationDate:string = "";
    unitOfMeasure:string = "";
    quantityAllocatedPick: number;
    quantityAllocatedPutAway: number;
    putAwayDate:string = "";
    warehouse:string = "";
    revision:string = "";
    inventoryMapID:string = "";
    userField1:string = "";
    userField2:string = "";
    masterLocation: boolean = false;
    dateSensitive: boolean = false;
    masterInventoryMapID:string = "";
    minQuantity: number;
    laserX: number;
    laserY: number;
    locationNumber:string = "";
    locationID:string = "";
    altLight: number;
}