import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ICartManagementApiService, CartListResponse } from './cart-management-api.interface';
import { GlobalService } from '../global.service';
import { ApiFuntions } from '../ApiFuntions';
import { RemoveCartContentRequest, ValidateToteRequest, ValidationRequest, ViewDetailsResponse, CompleteCartResponse, ValidateToteResponse, CartSearchRequest, CartStatusCountsDto, CartStatusSummary, CartListRequest, AddCartRequest, AddCartResponse, ValidateCartIdResponse, DeleteCartResponse, UpdateCartStatusActiveInactiveRequest, UpdateCartStatusActiveInactiveResponse } from 'src/app/induction-manager/cart-management/interfaces/cart-management.interface';


@Injectable({
  providedIn: 'root'
})
export class CartManagementApiService implements ICartManagementApiService {


  constructor(
    private global: GlobalService, 
    private Api: ApiFuntions) {
  }

  getCarts(request: CartSearchRequest): Observable<CartListResponse> {
    return this.Api.GetCartListWithParams(request).pipe(
      map(response => response as CartListResponse),
      take(1)
    );
  }

  async getCartById(cartId: string): Promise<ViewDetailsResponse> {
    const wsName = this.global.getCookie("WSName");
    const request: ValidationRequest = {
      cartId: cartId,
      workstationName: wsName
    };
    
    const response = await this.viewCartDetails(request);
    
    // Check if response exists
    if (!response) {
      throw new Error('No response received from viewCartDetails API');
    }
    
    // The actual ViewDetailsResponse is in response.body.value
    const viewDetails = response;
    
    // Validate that we have the required data
    if (!viewDetails) {
      throw new Error('ViewDetailsResponse is null or undefined');
    }
    
    return viewDetails;
  }

  validateCart(request: ValidationRequest) {
    return this.Api.validateCart(request);
  }
  
  async viewCartDetails(request: ValidationRequest): Promise<ViewDetailsResponse> {
    return await this.Api.viewCartDetails(request);
  }

  getCartStatuses(): Observable<CartStatusCountsDto> {
    return this.Api.GetCartStatuses().pipe(take(1));
  }

  getCartStatusSummary(): Observable<CartStatusSummary> {
    return this.getCartStatuses().pipe(
      map((response: CartStatusCountsDto) => {
        const summary: CartStatusSummary = {
          inducting: 0,
          inducted: 0,
          inProgress: 0,
          available: 0,
          inactive: 0
        };

        // Map the API response to our summary format
        if (response && response.value) {
          // Handle the actual API response format: {cartStatusCounts: {Inducting: 1, Inducted: 2, ...}}
          const statusCounts = response.value;
          
          // Map each status directly from the object
          if (statusCounts.Inducting !== undefined) {
            summary.inducting = statusCounts.Inducting;
          }
          if (statusCounts.Inducted !== undefined) {
            summary.inducted = statusCounts.Inducted;
          }
          if (statusCounts['In Progress'] !== undefined) {
            summary.inProgress = statusCounts['In Progress'];
          }
          if (statusCounts.Available !== undefined) {
            summary.available = statusCounts.Available;
          }
          if (statusCounts.Inactive !== undefined) {
            summary.inactive = statusCounts.Inactive;
          }
        }

        return summary;
      }),
      take(1)
    );
  }

  // Method to simulate external cart history updates
  removeCartContent(request: RemoveCartContentRequest) {
    return this.Api.removeCartContent(request);
  }

  validateTotes(request: ValidateToteRequest): Promise<ValidateToteResponse> {
    return this.Api.validateTotes(request);
  }

  async completeCart(cartId: string): Promise<CompleteCartResponse> {
    return await this.Api.completeCart(cartId);
  }

  async addCart(request: AddCartRequest): Promise<AddCartResponse> {
    return await this.Api.addCart(request);
  }

  async validateCartId(cartId: string): Promise<ValidateCartIdResponse> {
    return await this.Api.validateCartId(cartId);
  }

  deleteCart(cartId: string): Observable<DeleteCartResponse> {
    return from(this.Api.deleteCart(cartId));
  }

  async updateCartStatusActiveInactive(cartId: string, activeFlag: boolean): Promise<UpdateCartStatusActiveInactiveResponse> {
    const request: UpdateCartStatusActiveInactiveRequest = {
      cartId,
      activeFlag
    };
    return await this.Api.updateCartStatusActiveInactive(request);
  }

}