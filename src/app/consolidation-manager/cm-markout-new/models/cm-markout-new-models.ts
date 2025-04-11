export interface PickLines {
    item: number;
    qty: number;
    locID: string;
    status: string;
    statusDate: string;
    compQty: string;
    compBy: string;
    shortReason: string;
}

export interface PickTotes {
    toteId: number;
    status: string;
    statusDate: string;
    routeID: string;
    divertReason: string;
    location: string;
    destination: string;
    selected: boolean;
}

export interface ToteAudit {
    time: number;
    type: number;
    scanner: number;
    divert: number;
    location: string;
    status: string;
    statusDate: string;
    divertReason: string;
}