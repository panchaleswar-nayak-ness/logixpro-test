import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { ICCDiscrepanciesApiService } from './ccdiscrepancies-api.interface';
import { ApiResult } from '../../types/CommonTypes';
import { CompareItem } from '../../interface/ccdiscrepancies/CompareItem';
import { PagingRequest } from '../../interface/ccdiscrepancies/PagingRequest';
import { DeleteCompareItemsResponse } from '../../interface/ccdiscrepancies/DeleteCompareItemsResponse';
import { ChangeCompareItemsStateResponse } from '../../interface/ccdiscrepancies/ChangeCompareItemsStateResponse';
import { CompareLineState } from '../../interface/ccdiscrepancies/CompareLineState';
import { CycleCountTransactionRequest } from '../../interface/ccdiscrepancies/CycleCountTransactionRequest';
import { RequestResult } from '../../interface/ccdiscrepancies/RequestResult';
import { ToasterMessages } from '../../constants/strings.constants';

@Injectable({
    providedIn: 'root'
})
export class CCDiscrepanciesApiService implements ICCDiscrepanciesApiService {
    constructor(private apiService: ApiFuntions) {}

    async getComparedInventoryItems(pagingRequest: PagingRequest): Promise<ApiResult<CompareItem[]>> {
        const response = await this.apiService.GetCompairedInventoryItems(pagingRequest).toPromise();
        if (!response) {
            return { isSuccess: false, value: null, errorMessage: ToasterMessages.APIErrorMessage };
        }
        return response;
    }

    async getCountQueue(pagingRequest: PagingRequest): Promise<ApiResult<CompareItem[]>> {
        const response = await this.apiService.GetCountQueue(pagingRequest).toPromise();
        if (!response) {
            return { isSuccess: false, value: null, errorMessage: ToasterMessages.APIErrorMessage };
        }
        return response;
    }

    async deleteComparedItems(ids: string[]): Promise<ApiResult<DeleteCompareItemsResponse>> {
        return await this.apiService.DeleteComparedItems(ids);
    }

    async changeCompareItemsState(ids: string[], newState: CompareLineState): Promise<ApiResult<ChangeCompareItemsStateResponse>> {
        return await this.apiService.ChangeCompareItemsState(ids, newState);
    }

    async createCycleCountTransaction(request: CycleCountTransactionRequest): Promise<ApiResult<RequestResult>> {
        const response = await this.apiService.CreateCycleCountTransaction(request).toPromise();
        if (!response) {
            return { isSuccess: false, value: null, errorMessage: ToasterMessages.APIErrorMessage };
        }
        return response;
    }
}
