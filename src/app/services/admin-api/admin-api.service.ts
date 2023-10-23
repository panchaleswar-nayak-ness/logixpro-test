import { Injectable } from '@angular/core';
import { ApiFuntions } from '../ApiFuntions';
import { AuthService } from 'src/app/init/auth.service';
import { IAdminApiService } from './admin-api-interface'

@Injectable({
  providedIn: 'root'
})
export class AdminApiService implements IAdminApiService {

  public userData: any;

  constructor(
    private Api: ApiFuntions,
    private authService: AuthService) { 
      this.userData = this.authService.userData();
    }
  public TransactionQtyReplenishmentUpdate(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.TransactionQtyReplenishmentUpdate(payload);
  }
  public ReplenishmentsByDelete(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.ReplenishmentsByDelete(payload);
  }
  public DeleteRangeBegin(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.DeleteRangeBegin(payload);
  }
  public DeleteRangeEnd(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.DeleteRangeEnd(payload);
  }
  public SystemReplenishNewTA(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.SystemReplenishNewTA(payload);
  }
  public ReplenishmentsIncludeAllUpdate(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.ReplenishmentsIncludeAllUpdate(payload);
  }
  public ReplenishmentsIncludeUpdate(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.ReplenishmentsIncludeUpdate(payload);
  }
  public ProcessReplenishments(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.ProcessReplenishments(payload);
  }
  public ReplenishmentInsert(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.ReplenishmentInsert(payload);
  }
  public SystemReplenishmentNewTable(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.SystemReplenishmentNewTable(payload);
  }
  public SystemReplenishmentTable(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.SystemReplenishmentTable(payload);
  }
  public ReplenishReportSearchTA(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.ReplenishReportSearchTA(payload);
  }
  public SystemReplenishmentCount(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.SystemReplenishmentCount(payload);
  }
  public FiltersItemNumInsert(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.FiltersItemNumInsert(payload);
  }
  public GetLocAssPutAwayTable() {
    return this.Api.GetLocAssPutAwayTable();
  }
  public LocationAssignmentOrderInsert(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.LocationAssignmentOrderInsert(payload);
  }
  public GetLocationAssignmentPickTable(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetLocationAssignmentPickTable(payload);
  }
  public GetTransactionTypeCounts(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetTransactionTypeCounts(payload);
  }
  public EventLogTable(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.EventLogTable(payload);
  }
  public EventLogTypeAhead(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.EventLogTypeAhead(payload);
  }
  public EventRangeDelete(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.EventRangeDelete(payload);
  }
  public SelectedEventDelete(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.SelectedEventDelete(payload);
  }
  public DeleteKit(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.DeleteKit(payload);
  }
  public InsertKit(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.InsertKit(payload);
  }
  public UpdateKit(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.UpdateKit(payload);
  }
  public GetColumnSequence(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetColumnSequence(payload);
  }

  public GeneralPreferenceSave(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GeneralPreferenceSave(payload);
  }
  public ordersort() {
    return this.Api.ordersort();
  }
  public OSFieldFilterNames() {
    return this.Api.OSFieldFilterNames();
  }  public AdminCompanyInfo() {
    return this.Api.AdminCompanyInfo();
  } public ColumnAlias() {
    return this.Api.ColumnAlias();
  }
  public FieldNameSave(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.FieldNameSave(payload);
  }
  public RemoveccQueueRow(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.RemoveccQueueRow(payload);
  }
  public RemoveccQueueAll() {
    return this.Api.RemoveccQueueAll();
  }
  public CreateCountRecords() {
    return this.Api.CreateCountRecords();
  }
  public GetCCQueue(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetCCQueue(payload);
  }
  public GetMoveItemsTable(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetMoveItemsTable(payload);
  }

  public CreateMoveTransactions(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.CreateMoveTransactions(payload);
  }
  public CycleCountQueueInsert(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.CycleCountQueueInsert(payload);
  }
  public BatchResultTable(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.BatchResultTable(payload);
  }
  public GetCountBatches() {

    return this.Api.GetCountBatches();

  }
  public QuantitySelected(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.QuantitySelected(payload);
  }
  public GetCCCountToCostTypeAhead(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetCCCountToCostTypeAhead(payload);
  }
  public GetCCCategoryTypeAhead(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetCCCategoryTypeAhead(payload);
  }
  public GetCCDescriptionTypeAhead(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetCCDescriptionTypeAhead(payload);
  }
  public CountOrdersDelete(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.CountOrdersDelete(payload);
  }
  public UpdateReelQuantity(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.UpdateReelQuantity(payload);
  }
  public UpdateReelAll(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.UpdateReelAll(payload);
  }
  public RefreshRTS(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.RefreshRTS(payload);
  }
  public UpdateScanCodes(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.UpdateScanCodes(payload);
  }
  public DeleteScanCode(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.DeleteScanCode(payload);
  }
  public InsertScanCodes(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.InsertScanCodes(payload);
  }
  public RefreshScanCodes(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.RefreshScanCodes(payload);
  }
  public getSearchData(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.getSearchData(payload);
  }
  public duplicate(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.duplicate(payload);
  }
  public getInventoryMap(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.getInventoryMap(payload);
  }
  public getSetColumnSeq(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.getSetColumnSeq(payload);
  }
  public SelectBatchesDeleteDrop(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.SelectBatchesDeleteDrop(payload);
  }
  public BatchDeleteAll(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.BatchDeleteAll(payload);
  }
  public PickToteIDUpdate(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.PickToteIDUpdate(payload);
  }
  public BatchInsert(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.BatchInsert(payload);
  }
  public DetailView(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.DetailView(payload);
  }
  public BatchManagerOrder(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.BatchManagerOrder(payload);
  }
  public GetBatchManager(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetBatchManager(payload);
  }
  public GetAdminMenu() {
    return this.Api.GetAdminMenu();
  }
  public EmployeeData() {
    return this.Api.EmployeeData();
  }
  public Stats(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.Stats(payload);
  }
  public Lookup(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.Lookup(payload);
  }
  public Controlname(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.Controlname(payload);
  }
  public Groupname(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.Groupname(payload);
  }
  public Groupnames(body: any) {
    const payload = {
      // username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.Groupnames(payload);
  }
  public Employee(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.Employee(payload);
  }
  public DeleteEmployee(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.DeleteEmployee(payload);
  }
  public UpdateEmployee(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.UpdateEmployee(payload);
  }
  public EmployeeDetails(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.EmployeeDetails(payload);
  }
  public Inventorymasterdata(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.Inventorymasterdata(payload);
  }
  public location(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.location(payload);
  }
  public GetInventory(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetInventory(payload);
  }
  public GetInventoryItemNumber(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetInventoryItemNumber(payload);
  }
  public GetInventoryMasterData(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetInventoryMasterData(payload);
  }
  public UpdateInventoryMaster(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.UpdateInventoryMaster(payload);
  }
  public UpdateItemNumber(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.UpdateItemNumber(payload);
  }
  public AddNewItem(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.AddNewItem(payload);
  }
  public NextItemNumber(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.NextItemNumber(payload);
  }
  public GetInventoryMasterLocation(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetInventoryMasterLocation(payload);
  }
  public DeleteItem(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.DeleteItem(payload);
  }
  public UpdateInventoryMasterOTQuarantine(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.UpdateInventoryMasterOTQuarantine(payload);
  }
  public UpdateInventoryMasterOTUnQuarantine(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.UpdateInventoryMasterOTUnQuarantine(payload);
  }
  public GetLocationTable(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.GetLocationTable(payload);
  }
  public PreviousItemNumber(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.PreviousItemNumber(payload);
  }

  public getEmployeeData(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.getEmployeeData(payload);
  }

  public getInsertAllAccess(body: any) {
    const payload = { 
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.getInsertAllAccess(payload);
  }
  public getUserRights(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.getUserRights(payload);
  }
  public getAdminEmployeeLookup(body: any, isLoader) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.getAdminEmployeeLookup(payload, isLoader);
  }
  public employeeStatsInfo(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.employeeStatsInfo(payload);
  }
  public saveAdminEmployee(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.saveAdminEmployee(payload);
  }

  public deleteAdminEmployee(body: any) {
    const payload = { 
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.deleteAdminEmployee(payload);
  }
  public deleteUserGroup(body: any) {
    const payload = { 
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.deleteUserGroup(payload);
  }  public updateAdminEmployee(body: any) {
    const payload = {  
      ...body
    }
    return this.Api.updateAdminEmployee(payload);
  }
  public cloneGroup(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.cloneGroup(payload);
  }

  public getAdminEmployeeDetails(body: any) {
    const payload = { 
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.getAdminEmployeeDetails(payload);
  }

  public getControlName(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.getControlName(payload);
  }

  public updateControlName(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.updateControlName(payload);
  }
  public deleteControlName(body: any) {
    const payload = { 
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.deleteControlName(payload);
  }

  public submitControlResponse(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.submitControlResponse(payload);
  }
  public insertUserGroup(body: any) {
    const payload = { 
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.insertUserGroup(payload);
  }

  //zone

  public getZones() {
    return this.Api.getZones()
  }
  public updateEmployeeZone(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.updateEmployeeZone(payload);
  }

  //deleteEmployeeZone

  public deleteEmployeeZone(body: any) {
    const payload = { 
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.deleteEmployeeZone(payload);
  }

  //AllAccess
  public insertAllAccess(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.insertAllAccess(payload);
  }

  //EmployeeLocation
  public insertEmployeeLocation(body: any) {
    const payload = {
      // username: this.userData.username,
      // wsid: this.userData.wsid,
      ...body
    }
    return this.Api.insertEmployeeLocation(payload);
  }

  public updateEmployeeLocation(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.updateEmployeeLocation(payload);
  }
  
  public deleteEmployeeLocation(body: any) {
    const payload = { 
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.deleteEmployeeLocation(payload);
  }
 
  public insertPickLevels(body: any) {
    const payload = {
      // username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.insertPickLevels(payload);
  }

  public updatePickLevels(body: any) {
    const payload = {
      // username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.updatePickLevels(payload);
  }  
  
  public deletePickLevels(body: any) {
    const payload = { 
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.deletePickLevels(payload);
  } 

  public updateAccessGroup(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.updateAccessGroup(payload);
  }  public insertGroup(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.insertGroup(payload);
  }

  public insertGroupFunctions(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.insertGroupFunctions(payload);
  }  public getFunctionByGroup(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.getFunctionByGroup(payload);
  }

  public updateEmployeesInGroup(body: any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.updateEmployeesInGroup(payload);
  } 
  public deleteGroup(body: any) {
    const payload = { 
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.deleteGroup(payload);
  }
  public getItemNumDetail(body: any ) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.getItemNumDetail(payload);
  } 
  public getLocZTypeInvMap(body?: any ) {
    let userData = this.authService.userData();
      let paylaod = {
        "location": body?.location,
        "zone": body?.zone,
        "username": userData.userName,
        "wsid": userData.wsid,
      }
    return this.Api.getLocZTypeInvMap(paylaod);
  } 
  
  public updateInventoryMap(body: any ,mapID?) {
    body.inventoryMapID= mapID?.invMapID ?? 0;
    body.masterInventoryMapID=mapID?.masterInvMapID ?? 0;
     const asArray = Object.entries(body); 
     const filtered = asArray.filter(([key, value]) =>  value != ''); 
     let payload = Object.fromEntries(filtered); 
     let userData = this.authService.userData(); 
      payload['username'] = userData.userName;
      payload["wsid"] =userData.wsid;
    return this.Api.updateInventoryMap(payload);
  } 
   // check api call 
  public createInventoryMap(body?:any) {
    const asArray = Object.entries(body); 
    let payload = Object.fromEntries(asArray); 
    let userData = this.authService.userData();
    payload['username'] = userData.userName;
    payload["wsid"] =userData.wsid; 
    return this.Api.createInventoryMap(payload);
  } 
  public GetLocAssCountTable(){
    return this.Api.GetLocAssCountTable();
  }
  public PreviewLocAssignmentPickShortFPZ(){
    return this.Api.PreviewLocAssignmentPickShortFPZ();
  }
  public PreviewLocAssignmentPickShort(){
    return this.Api.PreviewLocAssignmentPickShort();
  }
  
public TransactionHistoryTable(body: any){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.TransactionHistoryTable(payload);
} 
public TransactionModelIndex(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.TransactionModelIndex(payload);
} 
public NextSuggestedTransactions(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.NextSuggestedTransactions(payload);
} 
public ReprocessTypeahead(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ReprocessTypeahead(payload);
} 
public ReprocessedTransactionTable(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ReprocessedTransactionTable(payload);
} 
public TransactionForOrderInsert(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.TransactionForOrderInsert(payload);
} 
public TransactionForOrderUpdate(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.TransactionForOrderUpdate(payload);
}  
public ReprocessedTransactionHistoryTable(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ReprocessedTransactionHistoryTable(payload);
}  
public ReprocessTransactionTable(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ReprocessTransactionTable(payload);
} 
public OrderToPost(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.OrderToPost(payload);
}  
public ReprocessIncludeSet(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ReprocessIncludeSet(payload);
} 

public SetAllReprocessColumn(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.SetAllReprocessColumn(payload);
}  
public ReprocessTransactionData(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ReprocessTransactionData(payload);
} 
public PostReprocessTransaction(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.PostReprocessTransaction(payload);
} 
public OrderNumberNext(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.OrderNumberNext(payload);
} 
public ScanValidateOrder(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ScanValidateOrder(payload);
} 
public DeleteOrder(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.DeleteOrder(payload);
} 
public OrderStatusData(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.OrderStatusData(payload);
} 
public OpenTransactionTable(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.OpenTransactionTable(payload);
} 
public HoldTransactionsData(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.HoldTransactionsData(payload);
}  
public UpdateTransaction(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.UpdateTransaction(payload);
} 
public LocationData(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.LocationData(payload);
} 
public PostTransaction(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.PostTransaction(payload);
} 
public ManualTransactionTypeAhead(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ManualTransactionTypeAhead(payload);
}  
public TransactionInfo(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.TransactionInfo(payload);
} 
public TransactionDelete(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.TransactionDelete(payload);
} 
public TransactionForOrderDelete(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.TransactionForOrderDelete(payload);
} 
public DeallocateTransactions(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.DeallocateTransactions(payload);
} 
public TransactionByID(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.TransactionByID(payload);
} 
public GernerateOrderTable(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.GernerateOrderTable(payload);
} 
public ManualOrderTypeAhead(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ManualOrderTypeAhead(payload);
} 
 
public NewTransactionSave(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.NewTransactionSave(payload);
}
public GetLocations(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.GetLocations(payload);
}
public ManualOrdersPost(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ManualOrdersPost(payload);
}
 
public SendCompletedToTH(body: any ){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.SendCompletedToTH(payload);
} 

public GetColumnSequenceDetail(body:any){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.GetColumnSequenceDetail(payload);
}
public DeleteColumns(body:any){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.DeleteColumns(payload);
}
public SaveColumns(body:any){
      const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.SaveColumns(payload);
}

public AllocatedOrders(body:any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.AllocatedOrders(payload);
}
public AllocatedItems(body:any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.AllocatedItems(payload);
}
public AllAllocatedOrders(body:any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.AllAllocatedOrders(payload);
}
public OrderItemsTable(body:any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.OrderItemsTable(payload);
}
public DeAllocateOrder(body:any) {
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.DeAllocateOrder(payload);
} 
public SaveTransaction(body:any){
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.SaveTransaction(payload);
} 
public ReprocessTransactionDelete(body:any){ 
    const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ReprocessTransactionDelete(payload);
}

public deleteInventoryMap(body:any){ 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.deleteInventoryMap(payload);
}

public quarantineInventoryMap(body:any){ 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.quarantineInventoryMap(payload);
}

public unQuarantineInventoryMap(body:any){ 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.unQuarantineInventoryMap(payload);
} 
public DevicePreferencesDelete(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.DevicePreferencesDelete(payload);
}

public GetCartonFlow(body?: any) { 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.GetCartonFlow(payload);
}

public UpdateCartonFlow(body){     
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.UpdateCartonFlow(payload);
}

public DevicePreferencesTable(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.DevicePreferencesTable(payload);
}
public LocationNamesSave(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.LocationNamesSave(payload);
}

public DeleteLocationNames(body:any){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.DeleteLocationNames(payload)
}

 
public ZoneDevicePreferencesUpdateAll(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ZoneDevicePreferencesUpdateAll(payload);
}
public DeviceInformation(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.DeviceInformation(payload);
}
public DevicePreference(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.DevicePreference(payload);
}
public LocationZoneSave(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.LocationZoneSave(payload);
}

  public LocationZoneDelete(body:any){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
    return this.Api.LocationZoneDelete(payload);
}
public LocationZoneNewSave(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.LocationZoneNewSave(payload);
}
public updateItemQuantity(body){
  let payload = body; 
  let userData = this.authService.userData(); 
   payload['username'] = userData.userName;
   payload["wsid"] =userData.wsid;
  
  return this.Api.updateItemQuantity(payload);
}
public LocationZone(){
  return this.Api.LocationZone()
}
public LocationNames(){
  return this.Api.LocationNames()
}
public adjustmentlookup() {
  return this.Api.adjustmentlookup();
}
public getToteCell() {
  return this.Api.getToteCell();
}
public Getcustomreports(body) { 
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.Getcustomreports(payload);
}
public Getreportdetails(body) { 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.Getreportdetails(payload);
} 
public selShipComp(body) { 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.selShipComp(payload);
}   
public updateAdjustlookup(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.updateAdjustlookup(payload);
}

public deleteAdjustmentLookup(body:any) {
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return  this.Api.deleteAdjustmentLookup(payload);
} 

public userfieldlookup(body ) {
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.userfieldlookup(payload);
}
public updateuserfieldlookup(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.updateuserfieldlookup(payload);
}

public deleteUserfieldLookUp(body:any) {
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return  this.Api.deleteUserfieldLookUp(payload);
}  

public totesetup(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.totesetup(payload);
}

public deleteTote(body:any) {
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return  this.Api.deleteTote(payload);
} 



public cleartote(body) {
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.cleartote(payload);
}
 
public basicreportdetails(body) { 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.basicreportdetails(payload);
} 
public ReportFieldsExps(body) { 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ReportFieldsExps(payload);
} 
public reportfieldvalues(body) { 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.reportfieldvalues(payload);
} 
public ReportTitles(body) { 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.ReportTitles(payload);
} 
public changefilter(body) { 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.changefilter(payload);
}
 
public importFile(body){ 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.importFile(payload);
}

public validateNewDesign(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.validateNewDesign(payload);
}
public getLLDesignerNewDesign(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.getLLDesignerNewDesign(payload);
}
public restoreDesign(body){
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.restoreDesign(payload);
}

public deleteReport(body:any) {
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return  this.Api.deleteReport(payload);
} 

public pushReportChanges(body) { 
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.pushReportChanges(payload);
} 

public updatereportDetails(body) {
     const payload = {
      username: this.userData.username,
      wsid: this.userData.wsid,
      ...body
    }
  return this.Api.updatereportDetails(payload);
}
public CommonExport(body) {
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.CommonExport(payload);
}

public async CommonPrint(body)  {
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
   return  await this.Api.CommonPrint(payload);
} 

public SetReprocessIds(body: any ) {
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.SetReprocessIds(payload);
} 
public ToteSetupInsert(body:any) { 
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ToteSetupInsert(payload);
}
public ToteSetupDelete(body:any) { 
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.ToteSetupDelete(payload);
}
public ToteSetup() { 
  return this.Api.ToteSetup();
}
public UpdateOSPriority(body: any ) {
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.UpdateOSPriority(payload);
} 
public DeleteOrderStatus(body: any ) {
  const payload = {
    username: this.userData.username,
    wsid: this.userData.wsid,
    ...body
  }
  return this.Api.DeleteOrderStatus(payload);
} 
}
