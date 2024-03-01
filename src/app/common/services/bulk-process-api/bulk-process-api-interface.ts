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
  BatchNextTote();
  BatchesNextBatchID();
  BulkPickCreateBatch(body:any);
  updateLocationQuantity(body:any);
}
