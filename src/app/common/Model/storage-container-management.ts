export class UpdateSCReq {
    BinLayoutId: number;
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
    binCellLayouts: BinCellLayout[];
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
    binLayout: BinLayout;
    layoutDefinition: layoutDefinition;
}

export class UpdateStorageContainerLayoutRes{
    success: boolean;
    errorMessage: string;
}