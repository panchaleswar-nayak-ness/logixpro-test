import { SearchRequest, SortRequest } from 'src/app/common/interface/common-interfaces';
import { FilterationColumns } from 'src/app/common/Model/pick-Tote-Manager';

export interface CartManagementData {
  mode: 'create' | 'edit' | 'view';
  cartId?: string;
  cartStatus?: string;  // Cart status - used to determine behavior in edit mode
  existingAssignments?: Record<number, {toteId: string, status?: string}>;
  rows: number;
  cols: number;
  isReadonly?: boolean;
}

export interface CartManagementResult {
  action: 'create' | 'update' | 'close';
  cartId?: string;
  status: string;
  quantity?: number;
  assignments?: Record<number, string>;
}

export interface CartDraftData {
  cartId: string;
  status: string;
  inductedDateTime: string;
  toteQuantity?: number;
  location: string;
}

export interface ValidationRequest {
  cartId: string;
  workstationName: string;
}

export interface ValidationResponse {
  cartId: string;
  status: string;
  cartRows: number;
  cartColumns: number;
}

export interface RemoveCartContentRequest {
  cartId: string;
  toteIds: string[];
  updateStatus: boolean;
}

export interface ValidateToteRequest{
  cartId: string;
  toteId: string;
  storageLocationId: string;
}
export interface TotePositionInfo {
  toteId: string;
  rowNumber: number;
  columnNumber: number;
  status?: string;
}

export interface ViewDetailsResponse {
  cartId: string;
  cartRows: number;
  cartColumns: number;
  totePositions: TotePositionInfo[];
}

export interface CartListRequest {
  Search: SearchRequest;
  SelectedPage: number;
  PageSize: number;
  sort: SortRequest;
  Filters?: FilterationColumns[];
}


export interface ToteAssignments {
  toteId: string;
  status: string;
}

// Interface for API error structure
export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

// Interface for the API response structure
export interface CartApiResponse<T> {
  errors: ApiError[];
  isSuccess: boolean;
  status: number;
  value: T;
}

export interface ValidateToteResponse {
  isSuccess: boolean;
  message: string;
  toteId: string;
  cartId: string;
}

export interface CompleteCartResponse {
  isSuccess: boolean;
  message: string;
  cartId: string;
  completedAt: string;
}


export interface Cart {
  action?: 'create' | 'update' | 'close';
  cartID: string; // Changed from cartId to cartID to match API response
  cartStatus: string; // Changed from status to cartStatus to match API response
  cartStatusDate: string; // Changed from inductedDateTime to cartStatusDate to match API response
  totesQty: number; // Changed from toteQuantity to totesQty to match API response
  location: string;
  assignments: Record<number, string>; // position -> toteId mapping
  createdAt?: string;
  updatedAt?: string;
  dimensions: string;
}

export interface CreateCartRequest {
  cart: Cart;
  assignments: Record<number, string>;
  checkExistingRecord: boolean;
}

export interface UpdateCartRequest {
  cart: Cart;
  assignments: Record<number, string>;
}

export interface CartListResponse {
  pagingInfo: {
    totalCount: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  value: Cart[]; // Changed from carts to value to match API response
  isSuccess: boolean;
  errorMessages: string[];
}

export interface CartSearchRequest {
  SearchColumn?: string; // Changed from searchColumn to SearchColumn to match API parameters
  SearchValue?: string; // Changed from searchTerm to SearchValue to match API parameters
  SortBy?: string; // Added SortBy parameter
  SortDirection?: string; // Added SortDirection parameter
  SelectedPage?: number; // Changed from pageIndex to SelectedPage to match API parameters
  PageSize?: number; // Changed from pageSize to PageSize to match API parameters
}

export interface CartStatusCountsDto {
  value: {
    Inducting?: number;
    Inducted?: number;
    'In Progress'?: number;
    Available?: number;
    Inactive?: number;
  };
}

export interface CartStatusSummary {
  inducting: number;
  inducted: number;
  inProgress: number;
  available: number;
  inactive: number;
}

export interface AddCartRequest {
  cartId: string;
  positionCount: number;
  shelveCount: number;
}

export interface AddCartResponse {
  data: string;        // The CartId that was created
  status: string;      // "Success" or error status
  message?: string;    // Optional error message
}

export interface ValidateCartIdResponse {
  errors: string[];
  isSuccess: boolean;
  message: string;
  status: number;
  value: boolean;
}

export interface DeleteCartResponse {
  errors: string[];
  isSuccess: boolean;
  message: string;
  status: number;
  value: string; // The cartId that was deleted
}

export interface UpdateCartStatusActiveInactiveRequest {
  cartId: string;
  activeFlag: boolean;
}

export interface UpdateCartStatusActiveInactiveResponse {
  isSuccess: boolean;
  status: number;
  value: string;
  errors?: string[];
}