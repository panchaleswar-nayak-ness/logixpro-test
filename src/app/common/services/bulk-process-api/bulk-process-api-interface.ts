export interface IBulkProcessApiService {
  bulkPickoOrderBatchToteQty(payload: any);
  bulkPickBatches(paylaod:any);
  bulkPickOrders(paylaod:any);
  bulkPickTotes(paylaod:any);
  bulkPickZones();
  bulkPickBulkZone();
  addBulkPickBulkZone(paylaod:any);
  updateBulkPickBulkZone(paylaod:any);
  deleteBulkPickBulkZone(paylaod:any);
}
