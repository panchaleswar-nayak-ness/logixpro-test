import { ApiResult } from '../../types/CommonTypes';
import { CompareItem } from '../../interface/ccdiscrepancies/CompareItem';
import { PagingRequest } from '../../interface/ccdiscrepancies/PagingRequest';
import { DeleteCompareItemsResponse } from '../../interface/ccdiscrepancies/DeleteCompareItemsResponse';

export interface ICCDiscrepanciesApiService {
    getComparedInventoryItems(pagingRequest: PagingRequest): Promise<ApiResult<CompareItem[]>>;
    deleteComparedItems(ids: string[]): Promise<ApiResult<DeleteCompareItemsResponse>>;
}
