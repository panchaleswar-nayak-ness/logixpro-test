import { OrderManagerApiService } from "./order-manager-api.service"

export interface IOrderManagerAPIService extends OrderManagerApiService
{
    SelectOrderManagerTempDTNew(payload: any);
    OrderManagerPreferenceIndex ();
    OMOTPendDelete(payload: any);
    FillOrderManTempData(payload: any);
    ReleaseOrders(payload: any);
    OrderManagerTempDelete(payload: any);
    OrderManagerMenuIndex();
    OrderManagerPreferenceUpdate(payload: any);
    UserFieldData();
    UserFieldDataUpdate(payload: any);
    CreateOrderTypeahead(payload: any);    
    OTPendDelete(payload: any);
    CreateOrdersDT(payload: any);
    OrderManagerRecordUpdate(payload: any);
    OTTempInsert(payload: any);
    OTTempUpdate(paylaod: any);
}