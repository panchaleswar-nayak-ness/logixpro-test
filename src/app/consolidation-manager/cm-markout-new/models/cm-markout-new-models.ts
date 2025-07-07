export interface MarkoutPickLine {
  orderId: string;
  itemNumber: string;
  quantity: number | null;
  locationId: string;
  status: string;
  statusDate: string;
  completeQty: number | null;
  completedBy: string;
  shortReason: string;
}

export interface PickTotes {
    toteId: number;
    markoutStatus: string;
    statusDate: string;
    routeId: string;
    divertReason: string;
    location: string;
    destination: string;
    orderNumber: string;
    hostRecordId: string;
    type:string;
    selected: boolean;
    addedDate:string;

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


export interface PaginationMeta {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface MarkoutAuditResponse {
  items: ToteAudit[];
  meta: PaginationMeta;
}

export interface MarkoutResponse {
  items: PickTotes[];
  meta: PaginationMeta;
}

export interface MarkoutPickLinesResponse {
  items: MarkoutPickLine[];
  meta:  PaginationMeta;
  suggestions?: MarkoutPickLine[];
}

// Suggestive search response for Pick Lines
export interface PickLineSuggestionResponse {
  data: string[];
}

// Suggestive search response for Pick Totes
export interface PickTotesSuggestionResponse {
  data: string[];
}