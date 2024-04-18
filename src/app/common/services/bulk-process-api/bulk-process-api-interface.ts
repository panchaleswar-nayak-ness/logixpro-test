import {NextToteId} from "../../Model/bulk-transactions";

export interface IBulkProcessApiService {
  bulkPickoOrderBatchToteQty(payload: any);
  bulkPickBatches(paylaod:any);
  bulkPickBatchId(paylaod:any);
  bulkPickOrders(paylaod:any);
  bulkPickTotes(paylaod:any);
  bulkPickZones();
  bulkPickBulkZone();
  addBulkPickBulkZone(paylaod:any);
  updateBulkPickBulkZone(paylaod:any);
  deleteBulkPickBulkZone(paylaod:any);
  bulkPreferences();
  validtote(body:any);
  BatchNextTote(numberOfIds: number);
  BatchesNextBatchID();
  BulkPickCreateBatch(body:any);
  updateLocationQuantity(body:any);
  bulkPickTaskComplete(body:any);
  fullTote(body:any);
}
