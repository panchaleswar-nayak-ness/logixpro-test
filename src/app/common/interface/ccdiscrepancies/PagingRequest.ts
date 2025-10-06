export interface PagingRequest {
    page: number;
    pageSize: number;
    sortColumn?: string;
    sortOrder?: string;
}
