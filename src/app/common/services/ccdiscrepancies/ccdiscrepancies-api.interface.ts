import { ApiResult } from '../../types/CommonTypes';
import { CompareItem } from '../../interface/ccdiscrepancies/CompareItem';
import { PagingRequest } from '../../interface/ccdiscrepancies/PagingRequest';
import { DeleteCompareItemsResponse } from '../../interface/ccdiscrepancies/DeleteCompareItemsResponse';
import { ChangeCompareItemsStateResponse } from '../../interface/ccdiscrepancies/ChangeCompareItemsStateResponse';
import { CompareLineState } from '../../interface/ccdiscrepancies/CompareLineState';
import { CycleCountTransactionRequest } from '../../interface/ccdiscrepancies/CycleCountTransactionRequest';
import { RequestResult } from '../../interface/ccdiscrepancies/RequestResult';

export interface ICCDiscrepanciesApiService {
    getComparedInventoryItems(pagingRequest: PagingRequest): Promise<ApiResult<CompareItem[]>>;
    getCountQueue(pagingRequest: PagingRequest): Promise<ApiResult<CompareItem[]>>;
    deleteComparedItems(ids: string[]): Promise<ApiResult<DeleteCompareItemsResponse>>;
    changeCompareItemsState(ids: string[], newState: CompareLineState): Promise<ApiResult<ChangeCompareItemsStateResponse>>;
    createCycleCountTransaction(request: CycleCountTransactionRequest): Promise<ApiResult<RequestResult>>;
}
