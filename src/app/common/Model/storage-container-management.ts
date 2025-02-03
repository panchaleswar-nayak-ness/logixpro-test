export class UpdateSCReq {
    BinLayoutId: number;
}

export class UpdateSCRes {
    binLayout: BinLayout
}

export class BinCellLayout {
    id: number;
    column: number;
    row: number;
    bin: string;
    cellSize: string;
    commandString: string;
}

export class BinLayout {
    id: number;
    description: string;
    layoutDefinitionId: number;
    numberOfColumns: number;
    numberOfRows: number;
    binCellLayout: BinCellLayout[];
}

export class BinLayoutRes {
    binLayout: BinLayout
}

export class CarouselZonesRes {
    zones : string [];
}