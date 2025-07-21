export class BulkTransactionType {
    static readonly PICK = "Pick";
    static readonly PUT_AWAY = "PutAway";
    static readonly COUNT = "Count";
}

export class BulkTransactionView {
    static readonly BATCH = "batch";
    static readonly ORDER = "order";
    static readonly TOTE = "tote";
}

export const BATCH_DISPLAYED_COLUMNS: string[] = ['batchId', 'lineCount', 'priority', 'actions'];
export const TOTE_DISPLAYED_COLUMNS: string[] = ['toteId', 'lineCount', 'priority', 'requiredDate', 'details', 'actions'];
export const ORDER_DISPLAYED_COLUMNS: string[] = ['orderNumber', 'lineCount', 'priority', 'requiredDate', 'details', 'actions'];

export const SELECTED_BATCH_DISPLAYED_COLUMNS: string[] = ['orderNumber', 'toteNumber'];
export const SELECTED_TOTE_DISPLAYED_COLUMNS: string[] = ['toteId', 'toteNumber', 'actions'];
export const SELECTED_ORDER_DISPLAYED_COLUMNS: string[] = ['orderNumber', 'toteNumber', 'actions'];