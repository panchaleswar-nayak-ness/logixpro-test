import { AdminApiService } from "./admin-api.service"

export interface IAdminApiService extends AdminApiService
{
    TransactionQtyReplenishmentUpdate(payload : any);
      ReplenishmentsByDelete(payload : any);
      DeleteRangeBegin(payload : any);
      DeleteRangeEnd(payload : any);
      SystemReplenishNewTA(payload : any);
      ReplenishmentsIncludeAllUpdate(payload : any);
      ReplenishmentsIncludeUpdate(payload : any);
      ProcessReplenishments(payload : any);
      ReplenishmentInsert(payload : any);
      SystemReplenishmentNewTable(payload : any);
      SystemReplenishmentTable(payload : any);
      ReplenishReportSearchTA(payload : any);
      SystemReplenishmentCount(payload : any);
      FiltersItemNumInsert(payload : any);
      GetLocAssPutAwayTable() ;
      LocationAssignmentOrderInsert(payload : any);
      GetLocationAssignmentPickTable(payload : any);
      GetTransactionTypeCounts(payload : any);
      EventLogTable(payload : any);
      EventLogTypeAhead(payload : any);
      EventRangeDelete(payload : any);
      SelectedEventDelete(payload : any);
      DeleteKit(payload : any);
      InsertKit(payload : any);
      UpdateKit(payload : any);
      GetColumnSequence(payload : any);
      GeneralPreferenceSave(payload : any);
      ordersort() ;
      OSFieldFilterNames();
      AdminCompanyInfo();
      ColumnAlias() ;
      FieldNameSave(payload : any);
      RemoveccQueueRow(payload : any);
      RemoveccQueueAll() ;
      CreateCountRecords() ;
      GetCCQueue(payload : any);
      GetMoveItemsTable(payload : any);
      CreateMoveTransactions(payload : any);
      CycleCountQueueInsert(payload : any);
      BatchResultTable(payload : any);
      GetCountBatches();
      QuantitySelected(payload : any);
      GetCCCountToCostTypeAhead(payload : any);
      GetCCCategoryTypeAhead(payload : any);
      GetCCDescriptionTypeAhead(payload : any);
      CountOrdersDelete(payload : any);
      UpdateReelQuantity(payload : any);
      UpdateReelAll(payload : any);
      RefreshRTS(payload : any);
      UpdateScanCodes(payload : any);
      DeleteScanCode(payload : any);
      InsertScanCodes(payload : any);
      RefreshScanCodes(payload : any);
      getSearchData(payload : any);
      duplicate(payload : any);
      getInventoryMap(payload : any);
      getSetColumnSeq(payload : any);
      SelectBatchesDeleteDrop(payload : any);
      BatchDeleteAll(payload : any);
      PickToteIDUpdate(payload : any);
      BatchInsert(payload : any);
      DetailView(payload : any);
      BatchManagerOrder(payload : any);
      GetBatchManager(payload : any);
      GetAdminMenu() ;
      EmployeeData() ;
      Stats(payload : any);
      Lookup(payload : any);
      Controlname(payload : any);
      Groupname(payload : any);
      Groupnames(payload : any);
      Employee(payload : any);
      DeleteEmployee(payload : any);
      UpdateEmployee(payload : any);
      EmployeeDetails(payload : any);
      Inventorymasterdata(payload : any);
      location(payload : any);
      GetInventory(payload : any);
      GetInventoryItemNumber(payload : any);
      GetInventoryMasterData(payload : any);
      UpdateInventoryMaster(payload : any);
      UpdateItemNumber(payload : any);
      AddNewItem(payload : any);
      NextItemNumber(payload : any);
      GetInventoryMasterLocation(payload : any);
      DeleteItem(payload : any);
      UpdateInventoryMasterOTQuarantine(payload : any);
      UpdateInventoryMasterOTUnQuarantine(payload : any);
      GetLocationTable(payload : any);
      PreviousItemNumber(payload : any);
      getEmployeeData(payload : any);
      getInsertAllAccess(payload : any);
      getUserRights(payload : any);
      getAdminEmployeeLookup(payload : any, isLoader);
      employeeStatsInfo(payload : any);
      saveAdminEmployee(payload : any);
      deleteAdminEmployee(payload : any);
      deleteUserGroup(payload : any); 
      updateAdminEmployee(payload : any);
      cloneGroup(payload : any); 
      getAdminEmployeeDetails(payload : any); 
      getControlName(payload : any); 
      updateControlName(payload : any);
      deleteControlName(payload : any); 
      submitControlResponse(payload : any);
      insertUserGroup(payload : any);   
      getZones() 
      updateEmployeeZone(payload : any); 
      deleteEmployeeZone(payload : any); 
      insertAllAccess(payload : any);  
      insertEmployeeLocation(payload : any); 
      updateEmployeeLocation(payload : any);
      deleteEmployeeLocation(payload : any); 
      insertPickLevels(payload : any); 
      updatePickLevels(payload : any);
      deletePickLevels(payload : any);
      updateAccessGroup(payload : any)
      insertGroup(payload : any);
      insertGroupFunctions(payload : any);
      getFunctionByGroup(payload : any);
      updateEmployeesInGroup(payload : any);
      deleteGroup(payload : any);
      getItemNumDetail(payload : any);
      getLocZTypeInvMap(payload : any);
      updateInventoryMap(payload : any,mapID)
       // check api call 
      createInventoryMap(payload : any)
      GetLocAssCountTable();
      PreviewLocAssignmentPickShortFPZ();
      PreviewLocAssignmentPickShort(); 
    TransactionHistoryTable(payload : any); 
    TransactionModelIndex(payload : any); 
    NextSuggestedTransactions(payload : any); 
    ReprocessTypeahead(payload : any); 
    ReprocessedTransactionTable(payload : any); 
    TransactionForOrderInsert(payload : any); 
    TransactionForOrderUpdate(payload : any);  
    ReprocessedTransactionHistoryTable(payload : any);  
    ReprocessTransactionTable(payload : any); 
    OrderToPost(payload : any);  
    ReprocessIncludeSet(payload : any); 
    
    SetAllReprocessColumn(payload : any);  
    ReprocessTransactionData(payload : any); 
    PostReprocessTransaction(payload : any); 
    OrderNumberNext(payload : any); 
    ScanValidateOrder(payload : any); 
    DeleteOrder(payload : any); 
    OrderStatusData(payload : any); 
    OpenTransactionTable(payload : any); 
    HoldTransactionsData(payload : any);  
    UpdateTransaction(payload : any); 
    LocationData(payload : any); 
    PostTransaction(payload : any); 
    ManualTransactionTypeAhead(payload : any);  
    TransactionInfo(payload : any); 
    TransactionDelete(payload : any); 
    TransactionForOrderDelete(payload : any); 
    DeallocateTransactions(payload : any); 
    TransactionByID(payload : any); 
    GernerateOrderTable(payload : any); 
    ManualOrderTypeAhead(payload : any); 
     
    NewTransactionSave(payload : any);
    GetLocations(payload : any);
    ManualOrdersPost(payload : any);
    SendCompletedToTH(payload : any);    
    GetColumnSequenceDetail(payload : any);
    DeleteColumns(payload : any);
    SaveColumns(payload : any);
    AllocatedOrders(payload : any);
    AllocatedItems(payload : any);
    AllAllocatedOrders(payload : any);
    OrderItemsTable(payload : any);
    DeAllocateOrder(payload : any) ; 
    SaveTransaction(payload : any); 
    ReprocessTransactionDelete(payload : any);
    deleteInventoryMap(payload : any); 
    quarantineInventoryMap(payload : any); 
    unQuarantineInventoryMap(payload : any); 
    DevicePreferencesDelete(payload : any);
    GetCartonFlow(payload : any)
    UpdateCartonFlow(payload : any);
    DevicePreferencesTable(payload : any);
    LocationNamesSave(payload : any);
    DeleteLocationNames(payload : any);
    ZoneDevicePreferencesUpdateAll(payload : any);
    DeviceInformation(payload : any);
    DevicePreference(payload : any);
    LocationZoneSave(payload : any);
      LocationZoneDelete(payload : any);
    LocationZoneNewSave(payload : any);
    updateItemQuantity(payload : any);
    LocationZone();
    LocationNames();
    adjustmentlookup();
    getToteCell();
    Getcustomreports(payload : any)
    Getreportdetails(payload : any); 
    selShipComp(payload : any);   
    updateAdjustlookup(payload : any);
    deleteAdjustmentLookup(payload : any);
    userfieldlookup(payload : any);
    updateuserfieldlookup(payload : any);
    deleteUserfieldLookUp(payload : any);
    totesetup(payload : any);    
    deleteTote(payload : any);
    cleartote(payload : any)  
    basicreportdetails(payload : any); 
    ReportFieldsExps(payload : any); 
    reportfieldvalues(payload : any); 
    ReportTitles(payload : any); 
    changefilter(payload : any);
    importFile(payload : any); 
    validateNewDesign(payload : any)
    getLLDesignerNewDesign(payload : any)
    restoreDesign(payload : any) 
    deleteReport(payload : any) 
    pushReportChanges(payload : any);  
    updatereportDetails(payload : any) 
    CommonExport(payload : any);    
    CommonPrint(payload : any) 
    SetReprocessIds(payload : any)
    ToteSetupInsert(payload : any)
    ToteSetupDelete(payload : any)
    ToteSetup();
    UpdateOSPriority(payload : any)
    DeleteOrderStatus(payload : any) 
}