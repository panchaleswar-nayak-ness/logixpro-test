import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/common/init/auth.service';
import { IBulkProcessApiService } from './bulk-process-api-interface'
import {AssignToteToOrderDto, NextToteId} from "../../Model/bulk-transactions";

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
  public bulkPickBatchId(body: any) {
    return this.Api.bulkPickBatchId(body);
  }

  public bulkPickOrders(body: any) {
    return this.Api.bulkPickOrders(body);
  }
  public bulkPickTotes(body: any) {
    return this.Api.bulkPickTotes(body);
  }
  public bulkPickOrdersQuickpick(body: any) {
    return this.Api.bulkPickOrdersQuickpick(body);
  }
  public bulkPickOrdersLocationAssignment(body: any) {
    return this.Api.bulkPickOrdersLocationAssignment(body);
  }
  public bulkPickZones() {
    return this.Api.bulkPickZones();
  }
  public bulkPickBulkZone() {
    return this.Api.bulkPickBulkZone();
  }
  public addBulkPickBulkZone(body: any) {
    const payload = {
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.addBulkPickBulkZone(payload);
  }
  public updateBulkPickBulkZone(body: any) {
    return this.Api.updateBulkPickBulkZone(body);
  }
  public deleteBulkPickBulkZone(body: any) {
    return this.Api.deleteBulkPickBulkZone(body);
  }
  public bulkPreferences() {
    return this.Api.bulkPreferences();
  }
  public validtote(body:any) {
    return this.Api.validtote(body);
  }
  public BatchNextTote(numberOfIds: number) {
    let payload = new NextToteId();
    payload.numberOfIds = numberOfIds;
    return this.Api.BatchNextTote(payload);
  }

  public BatchesNextBatchID() {
    return this.Api.BatchesNextBatchID();
  }
  public BulkPickCreateBatch(body: any) {
    return this.Api.BulkPickCreateBatch(body);
  }

  public updateLocationQuantity(body: any) {
    return this.Api.updateLocationQuantity(body);
  }
  public bulkPickTaskComplete(body: any) {
    return this.Api.bulkPickTaskComplete(body);
  }
  public async fullTote(body: any) {
    return await this.Api.fullTote(body);
  }
  public AssignToteToOrder(orders: AssignToteToOrderDto[]) {
    return this.Api.AssignToteToOrder(orders);
  }

}
