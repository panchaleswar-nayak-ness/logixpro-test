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
public completeTransaction(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.completeTransaction(payload);
}
public completePickBatch(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.completePickBatch(payload);
}
public shortTransaction(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.shortTransaction(payload);
}
public blossomTote(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.blossomTote(payload);
} 
public ClearPickToteInfo(body:any) {
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ClearPickToteInfo(payload);
}
public SelectBatchPickTA(body:any) {
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.SelectBatchPickTA(payload);
}
public SelectToteTransManTable(body:any) {
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.SelectToteTransManTable(payload);
}
public CompName() { 
  return this.Api.CompName();
} 
public PreferenceIndex() { 
  return this.Api. PreferenceIndex();
}
public PickBatchFilterRename(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchFilterRename(payload);
}   
public ProcessBlossom(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ProcessBlossom(payload);
}   
public PickBatchZonesSelect(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchZonesSelect(payload);
}
public PickBatchFilterTypeAhead(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchFilterTypeAhead(payload);
}
public PickBatchDefaultFilterMark(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchDefaultFilterMark(payload);
}
public PickBatchDefaultFilterClear(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchDefaultFilterClear(payload);
}
public PickBatchDefaultFilterSelect(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchDefaultFilterSelect(payload);
}
public PickBatchFilterBatchDelete(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchFilterBatchDelete(payload);
}
public OrdersFilterZoneSelect(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.OrdersFilterZoneSelect(payload);
}
public PickToteTransDT(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickToteTransDT(payload);
}
public PickBatchFilterOrderData(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchFilterOrderData(payload);
}
public PickBatchFilterUpdate(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchFilterUpdate(payload);
}
public PickBatchFilterInsert(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchFilterInsert(payload);
}
public PickBatchOrderUpdate(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchOrderUpdate(payload);
}
public PickBatchOrderInsert(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchOrderInsert(payload);
}
public PickBatchOrderDelete(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchOrderDelete(payload);
}
public PickBatchZoneDefaultMark(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchZoneDefaultMark(payload);
}
public PickBatchFilterDelete(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickBatchFilterDelete(payload);
}
public OrdersInZone(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.OrdersInZone(payload);
}
public WSPickZoneSelect(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.WSPickZoneSelect(payload);
}
public PickToteSetupIndex(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickToteSetupIndex(payload);
}
  public FillOrderNumber(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
    return this.Api.FillOrderNumber(payload);
}
public ValidateOrderNumber(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ValidateOrderNumber(payload);
}
public InZoneSetupProcess(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.InZoneSetupProcess(payload);
}
public PickToteSetupProcess(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.PickToteSetupProcess(payload);
}
public LocationZonesSelect(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.LocationZonesSelect(payload);
}
public WSPickZoneInsert(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.WSPickZoneInsert(payload);
}
public WSPickZoneDelete(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.WSPickZoneDelete(payload);
}
public ClrWSPickZone() { 
  return this.Api.ClrWSPickZone();
}
public InZoneTransDT(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.InZoneTransDT(payload);
}
public TaskComplete(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.TaskComplete(payload);
}  
public CrossDock(body:any) { 
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.CrossDock(payload);
}  
public FindLocation(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.FindLocation(payload);
}  
public CheckForwardLocations(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.CheckForwardLocations(payload);
}  
public IMUpdate(body:any) { 
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.IMUpdate(payload);
}  
public ItemDetails(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ItemDetails(payload);
}  
public AvailableZone(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.AvailableZone(payload);
}  
public RPDetails(body:any) { 
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.RPDetails(payload);
}  
public CompletePick(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.CompletePick(payload);
}  
public BatchLocationTypeAhead(body:any) { 
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.BatchLocationTypeAhead(payload);
}  
public ReserveLocation(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ReserveLocation(payload);
}  
public BatchTotesDelete(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.BatchTotesDelete(payload);
}   
public TransTableView(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.TransTableView(payload);
}  
public TransactionForTote(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.TransactionForTote(payload);
}  
public NextSerialNumber(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.NextSerialNumber(payload);
}
public ReelsCreate(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ReelsCreate(payload);
}
public ValidateSn(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ValidateSn(payload);
}  
public BatchByZone(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.BatchByZone(payload);
}    

public ItemZoneDataSelect(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ItemZoneDataSelect(payload);
}
public SuperBatchCreate(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.SuperBatchCreate(payload);
}
public TotePrintTableInsert(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.TotePrintTableInsert(payload);
}
public ReqDateDataSelect() { 
  return this.Api.ReqDateDataSelect();
} 
public MarkToteFull(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.MarkToteFull(payload);
}
public CompleteBatch(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.CompleteBatch(payload);
}
public TotesTable(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.TotesTable(payload);
}
public BatchIDTypeAhead(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.BatchIDTypeAhead(payload);
}
public NextToteUpdate(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.NextToteUpdate(payload);
}

public ProcessBatch(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ProcessBatch(payload);
}
public ValidateTotesForPutAways(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ValidateTotesForPutAways(payload);
}
public BatchExist(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.BatchExist(payload);
}
public BatchTotes(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.BatchTotes(payload);
}

public ValidateTote(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ValidateTote(payload);
}
public ValidateItem(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ValidateItem(payload);
}
public ProcessPallet(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ProcessPallet(payload);
}
public ValidateSerialNumber(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ValidateSerialNumber(payload);
}
public DeleteSerialNumber(body:any) { 
    const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.DeleteSerialNumber(payload);
}

}
