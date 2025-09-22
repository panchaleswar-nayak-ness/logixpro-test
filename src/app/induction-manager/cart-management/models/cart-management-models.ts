export interface CartItem {
  cartId: string;
  cartStatus: string;
  statusDate: string;
  toteQty: number;
  location: string;
}

export interface PaginationConfig {
  total: number;
  pageSize: number;
  pageIndex: number;
}

export interface CartGridConfig {
  rows: number;
  cols: number;
}

export interface TotePostionInfo {
  row: number;
  col: number;
}