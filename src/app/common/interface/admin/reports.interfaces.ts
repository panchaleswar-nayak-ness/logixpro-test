// Interface for change filter request payload
export interface ChangeFilterRequest {
  reportName: string;
  column: string;
  searchTerm: string;
  pageSize: number;
  pageNumber: number;
}