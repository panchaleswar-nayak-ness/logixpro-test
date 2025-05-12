export interface IQueryParams {
    page: number;
    pageSize: number;
    searchColumn?: string;
    searchValue?: string;
    sortColumn?: string;
    sortOrder?: string;
  }

  
export interface SearchItem {
  column: string;
  value: string;
}

export interface SortItem {
  column: string;
  order: string;
}