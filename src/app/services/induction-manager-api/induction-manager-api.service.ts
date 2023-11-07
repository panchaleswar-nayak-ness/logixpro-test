import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/init/auth.service';
import { IInductionManagerApiService } from './induction-manager-api-interface'

@Injectable({
  providedIn: 'root'
})
export class InductionManagerApiService implements IInductionManagerApiService {

  public userData: any;

  constructor(
    private Api: ApiFuntions,
    private authService: AuthService) { 
      this.userData = this.authService.userData();
    }  
public getPickBatchTransactionTable(body:any) { 
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.getPickBatchTransactionTable(payload);
}

public AllBatchDelete() { 
  return this.Api.AllBatchDelete();
}   
public GetFromToteTypeAhead() { 
  return this.Api.GetFromToteTypeAhead();
}
public SuperBatchIndex() { 
  return this.Api.SuperBatchIndex();
}
public NextBatchID() { 
  return this.Api.NextBatchID();
}
public ProcessPutAwayIndex() { 
  return this.Api.ProcessPutAwayIndex();
}
public NextTote() { 
  return this.Api.NextTote();
}
public completeTransaction(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.completeTransaction(payload);
}
public completePickBatch(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.completePickBatch(payload);
}
public shortTransaction(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.shortTransaction(payload);
}
public blossomTote(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.blossomTote(payload);
} 
public ClearPickToteInfo(payloadParams:any) {
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ClearPickToteInfo(payload);
}
public SelectBatchPickTA(payloadParams:any) {
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.SelectBatchPickTA(payload);
}
public SelectToteTransManTable(payloadParams:any) {
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.SelectToteTransManTable(payload);
}
public CompName() { 
  return this.Api.CompName();
} 
public PreferenceIndex() { 
  return this.Api. PreferenceIndex();
}
public PickBatchFilterRename(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchFilterRename(payload);
}   
public ProcessBlossom(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ProcessBlossom(payload);
}   
public PickBatchZonesSelect(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchZonesSelect(payload);
}
public PickBatchFilterTypeAhead(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchFilterTypeAhead(payload);
}
public PickBatchDefaultFilterMark(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchDefaultFilterMark(payload);
}
public PickBatchDefaultFilterClear(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchDefaultFilterClear(payload);
}
public PickBatchDefaultFilterSelect(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchDefaultFilterSelect(payload);
}
public PickBatchFilterBatchDelete(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchFilterBatchDelete(payload);
}
public OrdersFilterZoneSelect(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.OrdersFilterZoneSelect(payload);
}
public PickToteTransDT(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickToteTransDT(payload);
}
public PickBatchFilterOrderData(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchFilterOrderData(payload);
}
public PickBatchFilterUpdate(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchFilterUpdate(payload);
}
public PickBatchFilterInsert(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchFilterInsert(payload);
}
public PickBatchOrderUpdate(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchOrderUpdate(payload);
}
public PickBatchOrderInsert(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchOrderInsert(payload);
}
public PickBatchOrderDelete(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchOrderDelete(payload);
}
public PickBatchZoneDefaultMark(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchZoneDefaultMark(payload);
}
public PickBatchFilterDelete(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickBatchFilterDelete(payload);
}
public OrdersInZone(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.OrdersInZone(payload);
}
public WSPickZoneSelect(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.WSPickZoneSelect(payload);
}
public PickToteSetupIndex(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickToteSetupIndex(payload);
}
  public FillOrderNumber(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
    return this.Api.FillOrderNumber(payload);
}
public ValidateOrderNumber(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ValidateOrderNumber(payload);
}
public InZoneSetupProcess(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.InZoneSetupProcess(payload);
}
public PickToteSetupProcess(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.PickToteSetupProcess(payload);
}
public LocationZonesSelect(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.LocationZonesSelect(payload);
}
public WSPickZoneInsert(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.WSPickZoneInsert(payload);
}
public WSPickZoneDelete(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.WSPickZoneDelete(payload);
}
public ClrWSPickZone() { 
  return this.Api.ClrWSPickZone();
}
public InZoneTransDT(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.InZoneTransDT(payload);
}
public TaskComplete(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.TaskComplete(payload);
}  
public CrossDock(payloadParams:any) { 
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.CrossDock(payload);
}  
public FindLocation(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.FindLocation(payload);
}  
public CheckForwardLocations(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.CheckForwardLocations(payload);
}  
public IMUpdate(payloadParams:any) { 
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.IMUpdate(payload);
}  
public ItemDetails(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ItemDetails(payload);
}  
public AvailableZone(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.AvailableZone(payload);
}  
public RPDetails(payloadParams:any) { 
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.RPDetails(payload);
}  
public CompletePick(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.CompletePick(payload);
}  
public BatchLocationTypeAhead(payloadParams:any) { 
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.BatchLocationTypeAhead(payload);
}  
public ReserveLocation(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ReserveLocation(payload);
}  
public BatchTotesDelete(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.BatchTotesDelete(payload);
}   
public TransTableView(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.TransTableView(payload);
}  
public TransactionForTote(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.TransactionForTote(payload);
}  
public NextSerialNumber(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.NextSerialNumber(payload);
}
public ReelsCreate(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ReelsCreate(payload);
}
public ValidateSn(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ValidateSn(payload);
}  
public BatchByZone(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.BatchByZone(payload);
}    

public ItemZoneDataSelect(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ItemZoneDataSelect(payload);
}
public SuperBatchCreate(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.SuperBatchCreate(payload);
}
public TotePrintTableInsert(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.TotePrintTableInsert(payload);
}
public ReqDateDataSelect() { 
  return this.Api.ReqDateDataSelect();
} 
public MarkToteFull(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.MarkToteFull(payload);
}
public CompleteBatch(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.CompleteBatch(payload);
}
public TotesTable(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.TotesTable(payload);
}
public BatchIDTypeAhead(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.BatchIDTypeAhead(payload);
}
public NextToteUpdate(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.NextToteUpdate(payload);
}

public ProcessBatch(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ProcessBatch(payload);
}
public ValidateTotesForPutAways(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ValidateTotesForPutAways(payload);
}
public BatchExist(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.BatchExist(payload);
}
public BatchTotes(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.BatchTotes(payload);
}

public ValidateTote(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ValidateTote(payload);
}
public ValidateItem(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ValidateItem(payload);
}
public ProcessPallet(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ProcessPallet(payload);
}
public ValidateSerialNumber(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.ValidateSerialNumber(payload);
}
public DeleteSerialNumber(payloadParams:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...payloadParams
  }
  return this.Api.DeleteSerialNumber(payload);
}

  public DynamicMethod(payloadParams:any, url : any) { 
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...payloadParams
    }
    return this.Api.DynamicMethod(payload, url);
  }

}
