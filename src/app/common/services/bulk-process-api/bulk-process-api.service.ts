import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/common/init/auth.service';
import { IBulkProcessApiService } from './bulk-process-api-interface'

@Injectable({
  providedIn: 'root'
})
export class BulkProcessApiService implements IBulkProcessApiService {

  public userData: any;

  constructor(
    private Api: ApiFuntions,
    private authService: AuthService) {
    this.userData = this.authService.userData();
  }
  public bulkPickoOrderBatchToteQty(body: any) {
    return this.Api.bulkPickoOrderBatchToteQty(body);
  }
  public bulkPickBatches(body: any) {
    return this.Api.bulkPickBatches(body);
  }
  public bulkPickOrders(body: any) {
    return this.Api.bulkPickOrders(body);
  }
  public bulkPickTotes(body: any) {
    return this.Api.bulkPickTotes(body);
  }
}
