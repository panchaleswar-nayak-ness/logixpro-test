import { ZoneListPayload } from "src/app/bulk-process/preferences/preference.models";
import {AssignToteToOrderDto, NextToteId} from "../../Model/bulk-transactions";

export interface IBulkProcessApiService {
  bulkPickoOrderBatchToteQty(payload: any);
  bulkPickBatches(payload:any);
  bulkPickBatchId(payload:any);
  bulkPickOrders(payload:any);
  bulkPickTotes(payload:any);
  bulkPickOrdersQuickpick(payload:any);
  bulkPickOrdersLocationAssignment(payload:any);
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
