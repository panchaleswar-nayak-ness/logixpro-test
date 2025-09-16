import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { ICCDiscrepanciesApiService } from './ccdiscrepancies-api.interface';
import { ApiResult } from '../../types/CommonTypes';
import { CompareItem } from '../../interface/ccdiscrepancies/CompareItem';
import { PagingRequest } from '../../interface/ccdiscrepancies/PagingRequest';
import { DeleteCompareItemsResponse } from '../../interface/ccdiscrepancies/DeleteCompareItemsResponse';
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

    async deleteComparedItems(ids: string[]): Promise<ApiResult<DeleteCompareItemsResponse>> {
        return await this.apiService.DeleteComparedItems(ids);
    }
}
