import { Observable } from 'rxjs';
import { RemoveCartContentRequest, ValidateToteRequest, ValidationRequest, ViewDetailsResponse, ValidateToteResponse, CompleteCartResponse, CartListResponse, CartSearchRequest, CartStatusSummary, CartStatusCountsDto, AddCartRequest, ValidateCartIdResponse, DeleteCartResponse } from 'src/app/induction-manager/cart-management/interfaces/cart-management.interface';

export interface ICartManagementApiService {
  // Cart CRUD operations
  getCarts(request: CartSearchRequest): Observable<CartListResponse>;
  getCartById(cartID: string): Promise<ViewDetailsResponse>; // Changed parameter name
  validateCart(request: ValidationRequest);
  viewCartDetails(request: ValidationRequest): Promise<ViewDetailsResponse>;
  addCart(request: AddCartRequest);
  deleteCart(cartId: string): Observable<DeleteCartResponse>;
  
  // Status summary
  getCartStatusSummary(): Observable<CartStatusSummary>;
  getCartStatuses(): Observable<CartStatusCountsDto>;

  removeCartContent(request: RemoveCartContentRequest);
  validateTotes(request: ValidateToteRequest): Promise<ValidateToteResponse>;
  completeCart(cartId: string): Promise<CompleteCartResponse>;
  validateCartId(cartId: string): Promise<ValidateCartIdResponse>;
}
export { CartListResponse };

