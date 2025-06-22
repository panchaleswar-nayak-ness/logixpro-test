import { ZoneListPayload } from "src/app/bulk-process/preferences/preference.models";
import {AssignToteToOrderDto, NextToteId} from "../../Model/bulk-transactions";

export interface IBulkProcessApiService {
  bulkPickoOrderBatchToteQty(payload: any);
  bulkPickBatches(paylaod:any);
  bulkPickBatchId(paylaod:any);
  bulkPickOrders(paylaod:any);
  bulkPickTotes(paylaod:any);
  bulkPickOrdersQuickpick(paylaod:any);
  bulkPickOrdersLocationAssignment(paylaod:any);
  bulkPickOrdersCheckLocationAssignment(paylaod:string[]);
  bulkPickOrdersCheckOffCarouselPicks(paylaod:string[]);
  bulkPickZones();
  bulkPickBulkZone();
  addBulkPickBulkZone(payload:any);
  updateBulkPickBulkZone(payload:any);
  deleteBulkPickBulkZone(payload:any);
  deleteAllBulkPickBulkZone(payload:ZoneListPayload);
  addAllBulkPickBulkZone(payload:ZoneListPayload);
  bulkPreferences();
  validtote(body:any);
  BatchNextTote(numberOfIds: number);
  BatchesNextBatchID();
  BulkPickCreateBatch(body:any);
  updateLocationQuantity(body:any);
  bulkPickTaskComplete(body:any);
  fullTote(body:any);
  AssignToteToOrder(orders: AssignToteToOrderDto[]);
}
