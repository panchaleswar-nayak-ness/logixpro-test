export interface PagingRequest {
    page?: number;
    pageSize: number;
    selectedPage?:number;
    sortColumn?: string;
    sortOrder?: string;
}
