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
  public bulkPickAllOrdersQty(body: any) {
    const payload = {
      username: this.userData.userName,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.bulkPickAllOrdersQty(payload);
  }
  public bulkPickOrders(body: any) {
    const payload = {
      username: this.userData.userName,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.bulkPickOrders(payload);
  }
}
