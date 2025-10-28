import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/common/init/auth.service';
import { IBulkProcessApiService } from './bulk-process-api-interface'
import { AssignToteToOrderDto, BatchesRequest, BatchesResponse, EmergencyPickOrdersRequest, NextToteId, OrderLineResource, OrderResponse, OrdersRequest, PartialToteIdRequest, PartialToteIdResponse, QuickPickOrdersRequest, RemoveOrderLinesRequest, RemoveOrderLinesResponse, TotesRequest, TotesResponse } from "../../Model/bulk-transactions";
import { ZoneListPayload } from 'src/app/bulk-process/preferences/preference.models';
import { ApiResult } from '../../types/CommonTypes';
import { Observable } from 'rxjs';
import { PagingRequest } from '../../interface/ccdiscrepancies/PagingRequest';
import { UpdateOTsNewBatchIdRequest } from '../../Model/bulk-transactions';

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
  public bulkPickBatches(body: BatchesRequest) : Observable<ApiResult<BatchesResponse[]>> {
    return this.Api.bulkPickBatches(body);
  }
  public bulkPickBatchId(body: any) {
    return this.Api.bulkPickBatchId(body);
  }

  public bulkPickOrders(body: OrdersRequest) : Observable<ApiResult<OrderResponse[]>> {
    return this.Api.bulkPickOrders(body);
  }
  public bulkPickTotes(body: TotesRequest) : Observable<ApiResult<TotesResponse[]>> {
    return this.Api.bulkPickTotes(body);
  }
  public bulkPickOrdersQuickpick(body: QuickPickOrdersRequest) : Observable<ApiResult<OrderResponse[]>> {
    return this.Api.bulkPickOrdersQuickpick(body);
  }
  public getEmergencyPickOrders(body: PagingRequest) {
    return this.Api.getEmergencyPickOrders(body);
  }
  public getEmergencyOrdersInfo(){
    return this.Api.getEmergencyOrdersInfo();
  }
  public bulkPickOrdersLocationAssignment(body: any) {
    return this.Api.bulkPickOrdersLocationAssignment(body);
  }

  public bulkPickOrdersCheckLocationAssignment(body: string[]) {
    return this.Api.bulkPickOrdersCheckLocationAssignment(body);
  }

  public bulkPickOrdersCheckOffCarouselPicks(body: string[]) {
    return this.Api.bulkPickOrdersCheckOffCarouselPicks(body);
  }

  public GetOrdersMovedToReprocessAsync(body: string[]) {
    return this.Api.GetOrdersMovedToReprocessAsync(body);
  }

  public getOrderLinesAssignedLocations(body: string[]) {
    return this.Api.getOrderLinesAssignedLocations(body);
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
  public deleteAllBulkPickBulkZone(body: ZoneListPayload) {
    return this.Api.deleteAllBulkPickBulkZone(body);
  }
  public addAllBulkPickBulkZone(body: ZoneListPayload) {
    return this.Api.addAllBulkPickBulkZone(body);
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

  public updateOpenTransactionsZoneCaseQuantity(body: OrderLineResource[]) {
    return this.Api.updateOpenTransactionsZoneCaseQuantity(body);
  }

  public async GetNextToteIdForSlapperLabelAsync(request: PartialToteIdRequest[]): Promise<PartialToteIdResponse[]> {
    return await this.Api.GetNextToteIdForSlapperLabelAsync(request);
  }

  public async SubmitCaseWiseOrders(request: PartialToteIdResponse[]): Promise<ApiResult<PartialToteIdResponse[]>> {
    return await this.Api.SubmitCaseWiseOrders(request);
  }

  public async RemoveOrderLinesFromTote(request: RemoveOrderLinesRequest): Promise<RemoveOrderLinesResponse> {
    return await this.Api.RemoveOrderLinesFromTote(request);
  }

  public async bulkPickBatchesCount(payload: BatchesRequest): Promise<ApiResult<number>> {
    return await this.Api.bulkPickBatchesCount(payload);
  }

  public async bulkPickOrdersCount(payload: OrdersRequest): Promise<ApiResult<number>> {
    return await this.Api.bulkPickOrdersCount(payload);
  }

  public async bulkPickTotesCount(payload: TotesRequest): Promise<ApiResult<number>> {
    return await this.Api.bulkPickTotesCount(payload);
  }

  public async UpdateOTsNewBatchIdRequest(request: UpdateOTsNewBatchIdRequest): Promise<string> {
    return await this.Api.updateOTsNewBatchId(request);
  }
}
