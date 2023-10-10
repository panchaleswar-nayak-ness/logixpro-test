import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable'; 
import { BaseService } from './base-service.service';
import { AuthService } from '../init/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiFuntions {
   
  constructor(private ApiBase: BaseService,private authService:AuthService) { }
   
  public GetAdminMenu() {
    return  this.ApiBase.Get("/Admin/menu");
  } 
  public EmployeeData() {
    return  this.ApiBase.Get("/Admin/employee/data");
  }
  public Stats(payload:any) {
    return  this.ApiBase.Get("/Admin/employee/Stats",payload);
  }
  public Lookup(payload:any) {
    return  this.ApiBase.Get("/Admin/employee/lookup",payload);
  } 
  public Controlname(payload:any) {
    return  this.ApiBase.Get("/Admin/controlname",payload);
  }
  public  Groupname(payload:any) {
    return  this.ApiBase.Get("/Admin/groupname",payload);
  } 
  public  Groupnames(body:any) {
    return  this.ApiBase.Get("/Admin/groupnames",body);
  }
  public Employee(payload:any) {
    return  this.ApiBase.Post("/Admin/employee",payload);
  } 
  public DeleteEmployee(payload:any) {
    return  this.ApiBase.Delete("/Admin/employee",payload);
  } 
  public UpdateEmployee(payload:any) {
    return  this.ApiBase.Put("/Admin/employee",payload);
  } 
  public EmployeeDetails(payload:any) {
    return  this.ApiBase.Get("/Admin/employee/details",payload);
  } 
  public Inventorymasterdata(payload:any) {
    return  this.ApiBase.Get("/Admin/inventorymasterdata",payload);
  } 
  public location(payload:any) {
    return  this.ApiBase.Get("/Admin/location",payload);
  } 
  public  UserAppNameAdd(payload:any) {
    return  this.ApiBase.Get("/Common/UserAppNameAdd",payload);
  } 
  public Logout(userData:any) {
    return this.ApiBase.Post("/users/Logout", userData);
  }
  public getSecurityEnvironment() {
    return this.ApiBase.Get("/users/securityenvironment");
  }
  public login(userData:any) {
    return this.ApiBase.Post("/users/login", userData);
  }
  public workstationdefaultapp(body?) {
    return this.ApiBase.Get("/GlobalConfig/workstationdefaultapp",body);
  }
  public GlobalMenu(menu:any) {
    return this.ApiBase.Get("/GlobalConfig/menu",menu);
  }
  public AppLicense() {
    return this.ApiBase.Get("/GlobalConfig/AppLicense");
  }

  public getWorkstationapp(body:any) {
    return this.ApiBase.Get("/GlobalConfig/workstationapp",body);
  }
  public workstationapp(body:any) {
    return this.ApiBase.Post("/GlobalConfig/workstationapp",body);
  }
  public WorkStationDelete(body:any) {
    return this.ApiBase.Delete("/GlobalConfig/workstationapp",body);
  }
  public WorkStationDefaultAppAdd(body:any) {
    return this.ApiBase.Get("/GlobalConfig/workstationapp",body);
  }
  public WorkStationDefaultAppAddDefault(body:any) {
    return this.ApiBase.Post("/GlobalConfig/workstationdefaultapp",body);
  }
  public WorkStationAppDelete(body:any) {
    return this.ApiBase.Post("/GlobalConfig/workstationdefaultapp/delete",body);
  }
  public AppNameByWorkstation(body:any) {
    return this.ApiBase.Get("/GlobalConfig/appnamebyworkstation",body);
  }
  public configLogout(body:any): Observable<any> {
    return this.ApiBase.Post("/GlobalConfig/user/logout", body);
  }
  public GetInventory(body:any): Observable<any> {
    return this.ApiBase.Get("/Admin/inventory", body);
  }
  public GetInventoryItemNumber(body:any): Observable<any> {
    return this.ApiBase.Get("/Admin/itemNumber", body);
  }
  public GetInventoryMasterData(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/inventorymasterdata", body);
  }
  public UpdateInventoryMaster(body:any):  Observable<any> {
    return this.ApiBase.Put("/Admin/inventorymaster", body);
  }
  public UpdateItemNumber(body:any):  Observable<any> {
    return this.ApiBase.Put("/Admin/itemnumber", body);
  }
  public AddNewItem(body:any):  Observable<any> {
    return this.ApiBase.Post("/Admin/item",body);
  }
  public NextItemNumber(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/NextItemNumber",body);
  }
  public GetInventoryMasterLocation(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/inventorymasterlocation",body);
  }
  public DeleteItem(body:any):  Observable<any> {
    return this.ApiBase.Post("/Admin/itemdelete",body);
  }
  public UpdateInventoryMasterOTQuarantine(body:any):  Observable<any> {
    return this.ApiBase.Put("/Admin/inventorymasterotquarantine",body);
  }
  public UpdateInventoryMasterOTUnQuarantine(body:any):  Observable<any> {
    return this.ApiBase.Put("/Admin/inventorymasterotunQuarantine",body);
  }
  public GetLocationTable(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/location",body);
  }
  public PreviousItemNumber(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/previousitemnumber",body);
  }
  public getCellSize():  Observable<any> {
    return this.ApiBase.Get("/common/cellsize");
  }
  public saveCellSize(body:any):  Observable<any> {
    return this.ApiBase.Post("/common/cellsize",body);
  }
  public dltCellSize(body:any):  Observable<any> {
    return this.ApiBase.Delete("/common/cellsize",body);
  }
  public getCategory():  Observable<any> {
    return this.ApiBase.Get("/common/categories");
  }
  public   saveCategory(body:any):  Observable<any> {
    return this.ApiBase.Put("/common/category",body);
  }
  public   dltCategory(body:any):  Observable<any> {
    return this.ApiBase.Post("/common/category",body);
  }
  public   getUnitOfMeasure():  Observable<any> {
    return this.ApiBase.Get("/common/unitofmeasure");
  }
  public   saveUnitOfMeasure(body:any):  Observable<any> {
    return this.ApiBase.Post("/common/unitofmeasure",body);
  }
  public   dltUnitOfMeasure(body:any):  Observable<any> {
    return this.ApiBase.Delete("/common/unitofmeasure",body);
  }
  public  UpdateReelQuantity(body:any):  Observable<any> {
    return this.ApiBase.Put("/Admin/reelquantity",body);
  }
  public  UpdateReelAll(body:any):  Observable<any> {
    return this.ApiBase.Put("/Admin/reelall",body);
  }
  public   RefreshRTS(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/rts",body);
  }
  public   UpdateScanCodes(body:any):  Observable<any> {
    return this.ApiBase.Put("/Admin/scancodes",body);
  }
  public  DeleteScanCode(body:any):  Observable<any> {
    return this.ApiBase.Post("/Admin/scancodedelete",body);
  }
  public InsertScanCodes(body:any):  Observable<any> {
    return this.ApiBase.Post("/Admin/scancodes",body);
  }
  public RefreshScanCodes(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/scancodes",body);
  }
  public getSearchData(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/typeaheadinventorymap",body);
  }
  public duplicate(body:any):  Observable<any> {
    return this.ApiBase.Post("/Admin/DuplicateItem",body);
  } 
  public getInventoryMap(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/inventorymap",body);
  }
  public getSetColumnSeq(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/columnsequence",body);
  }
  public SelectBatchesDeleteDrop(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/batchesdeletedrop",body);
  }
  public BatchDeleteAll(body:any):  Observable<any> {
    return this.ApiBase.Post("/Admin/batchdelete",body);
  }
  public PickToteIDUpdate(body:any):  Observable<any> {
    return this.ApiBase.Put("/Admin/picktoteid",body);
  }
  public BatchInsert(body:any):  Observable<any> {
    return this.ApiBase.Post("/Admin/batch",body);
  }
  public DetailView(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/detailview",body);
  }
  public BatchManagerOrder(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/batchmanagerorder",body);
  }
  public GetBatchManager(body:any):  Observable<any> {
    return this.ApiBase.Get("/Admin/batchmanager",body);
  }
  public startSTEService():  Observable<any> {
    return this.ApiBase.Post("/GlobalConfig/startste",{});
  }
  public stopSTEService():  Observable<any> {
    return this.ApiBase.Post("/GlobalConfig/stopste",{});
  }
  public RestartSTEService():  Observable<any> {
    return this.ApiBase.Post("/GlobalConfig/restartste",{});
  }
  public ServiceStatusSTE():  Observable<any> {
    return this.ApiBase.Post("/GlobalConfig/servicestatusste",{});
  }
  public ServiceStatusCCSIF():  Observable<any> {
    return this.ApiBase.Post("/GlobalConfig/servicestatusccsif",{});
  }
  public stopCCSIF():  Observable<any> {
    return this.ApiBase.Post("/GlobalConfig/stopccsif",{});
  }
  public startCCSIF():  Observable<any> {
    return this.ApiBase.Post("/GlobalConfig/startccsif",{});
  }
  public GeneralPreferenceSave(body:any):  Observable<any> {
    return this.ApiBase.Post("/Admin/generalpreference",body);
  }
  public ordersort(): Observable<any> { 
    return this.ApiBase.Get("/Admin/ordersort");
  }
  public OSFieldFilterNames(): Observable<any> { 
    return this.ApiBase.Get("/Admin/OSFieldFilterNames");
  }
  public CompanyInfo(): Observable<any> { 
    return this.ApiBase.Get("/companyinfo");
  }

  public AdminCompanyInfo(): Observable<any> { 
    return this.ApiBase.Get("/Admin/companyinfo");
  }  public ColumnAlias(): Observable<any> { 
    return this.ApiBase.Get("/Admin/ColumnAlias");
  }
  public FieldNameSave(body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/fieldname",body);
  }
  public RemoveccQueueRow(body:any): Observable<any> { 
    return this.ApiBase.Delete("/Admin/ccqueue",body);
  }
  public RemoveccQueueAll(): Observable<any> { 
    return this.ApiBase.Post("/Admin/ccqueueall",{});
  }
  public CreateCountRecords(): Observable<any> { 
    return this.ApiBase.Post("/Admin/countrecords",{});
  }
  public GetCCQueue(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/ccqueue",Body);
  }
  public GetMoveItemsTable(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/moveitems",Body);
  }
  public SearchItem(Body:any): Observable<any> { 
    return this.ApiBase.Get("/common/searchitem",Body);
  }
  public CreateMoveTransactions(Body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/movetransactions",Body);
  }
  public CycleCountQueueInsert(Body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/cyclecountqueue",Body);
  }
  public BatchResultTable(Body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/batchresult",Body);
  }
  public GetCountBatches(): Observable<any> { 
    return this.ApiBase.Get("/Admin/countbatches");
  }
  public LocationEnd(body:any): Observable<any> { 
    return this.ApiBase.Get("/Common/locationend",body);
  }
  public LocationBegin(body:any): Observable<any> { 
    return this.ApiBase.Get("/Common/locationbegin",body);
  }
  public QuantitySelected(body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/quantityselected",body);
  }
  public GetCCCountToCostTypeAhead(body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/cccounttocosttypeahead",body);
  }
  public GetCCCategoryTypeAhead(body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/cccategorytypeahead",body);
  }
  public GetCCDescriptionTypeAhead(body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/ccdescriptiontypeahead",body);
  }
  public CountOrdersDelete(body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/countorders",body);
  }
  public ScanCodeTypes(): Observable<any> { 
    return this.ApiBase.Get("/common/scancodetypes");
  }
  public CodeTypeSave(body:any): Observable<any> { 
    return this.ApiBase.Post("/common/scancodetype",body);
  }
  public ScanCodeTypeDelete(body:any): Observable<any> { 
    return this.ApiBase.Delete("/common/scancodetype",body);
  }
  public DeleteKit(body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/kitdelete",body);
  }
  public InsertKit(body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/kit",body);
  }
  public UpdateKit(body:any): Observable<any> { 
    return this.ApiBase.Put("/Admin/kit",body);
  }
  public OrderManagerPreferenceIndex(): Observable<any> { 
    return this.ApiBase.Get("/OrderManager/preferences");
  }
  public GetColumnSequence(body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/columnsequence",body);
  }
  public SelectOrderManagerTempDTNew(body:any): Observable<any> { 
    return this.ApiBase.Get("/OrderManager/tempdtnew",body);
  }
  public OMOTPendDelete(body:any): Observable<any> { 
    return this.ApiBase.Delete("/OrderManager/omotpend",body);
  }
  public FillOrderManTempData(body:any): Observable<any> { 
    return this.ApiBase.Post("/OrderManager/tempdata",body);
  }
  public ReleaseOrders(body:any): Observable<any> { 
    return this.ApiBase.Post("/OrderManager/releaseorders",body);
  }
  public OrderManagerTempDelete(body:any): Observable<any> { 
    return this.ApiBase.Delete("/OrderManager/temp",body);
  }
  public OrderManagerMenuIndex(): Observable<any> { 
    return this.ApiBase.Get("/OrderManager/menuindex");
  }
  public OrderManagerPreferenceUpdate(Body:any): Observable<any> { 
    return this.ApiBase.Put("/OrderManager/preferences",Body);
  }
  public EventLogTable(Body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/eventlog",Body);
  }
  public EventLogTypeAhead(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/eventlogtypeahead",Body);
  }
  public EventRangeDelete(Body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/eventrange",Body);
  }
  public UserFieldData(): Observable<any> { 
    return this.ApiBase.Get("/OrderManager/userfielddata");
  }
  public UserFieldDataUpdate(Body:any): Observable<any> { 
    return this.ApiBase.Put("/OrderManager/userfielddata",Body);
  }
  public SelectedEventDelete(Body:any): Observable<any> { 
    return this.ApiBase.Delete("/Admin/selectedevent",Body);
  }
  public CreateOrderTypeahead(Body:any): Observable<any> { 
    return this.ApiBase.Get("/OrderManager/ordertypeahead",Body);
  }
  public OTPendDelete(Body:any): Observable<any> { 
    return this.ApiBase.Post("/OrderManager/otpend",Body);
  }
  public CreateOrdersDT(Body:any): Observable<any> { 
    return this.ApiBase.Get("/OrderManager/ordersdt",Body);
  }
  public OrderManagerRecordUpdate(Body:any): Observable<any> { 
    return this.ApiBase.Put("/OrderManager/order",Body);
  }
  public OTTempInsert(Body:any): Observable<any> { 
    return this.ApiBase.Post("/OrderManager/ottemp",Body);
  }
  public OTTempUpdate(Body:any): Observable<any> { 
    return this.ApiBase.Put("/OrderManager/ottemp",Body);
  }
  public GetWarehouses(): Observable<any> { 
    return this.ApiBase.Get("/common/warehouses");
  }
  public GetLocAssPutAwayTable(): Observable<any> { 
    return this.ApiBase.Get("/Admin/LocAssPutAwayTable");
  }
  public LocationAssignmentOrderInsert(Body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/locationassignmentorder",Body);
  }
  public GetLocationAssignmentPickTable(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/locationassignmentpick",Body);
  }
  public GetTransactionTypeCounts(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/transactiontypecounts",Body);
  }
  public SuperBatchIndex(): Observable<any> { 
    return this.ApiBase.Get("/Induction/superbatchindex");
  }
  public ItemZoneDataSelect(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/itemzonedata",body);
  }
  public SuperBatchCreate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/superbatch",body);
  }
  public TotePrintTableInsert(body:any): Observable<any> { 
    return this.ApiBase.Post("/Induction/toteprinttable",body);
  }
  public ReqDateDataSelect(): Observable<any> { 
    return this.ApiBase.Get("/Induction/reqdatedata");
  }

  public MarkToteFull(Body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/marktotefull",Body);
  }
  public CompleteBatch(Body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/completebatch",Body);
  }
  public TotesTable(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/totestable",body);
  }
  public BatchIDTypeAhead(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/batchidtypeahead",body);
  }
  public NextToteUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/nexttote",body);
  }
  public NextBatchID(): Observable<any> { 
    return this.ApiBase.Get("/Induction/nextbatchid");
  }
  public ProcessPutAwayIndex(): Observable<any> { 
    return this.ApiBase.Get("/Induction/processputawayindex");
  }
  public ProcessBatch(body:any): Observable<any> { 
    return this.ApiBase.Post("/Induction/processbatch",body);
  }
  public ValidateTotesForPutAways(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/validatetotesforputaways",body);
  }
  public BatchExist(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/BatchExist",body);
  }
  public BatchTotes(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/batchtotes",body);
  }
  public NextTote(): Observable<any> { 
    return this.ApiBase.Get("/Induction/NextTote");
  }
  public ValidateTote(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/validatetote",body);
  }
  public ValidateItem(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/validateitem",body);
  }
  public ProcessPallet(body:any): Observable<any> { 
    return this.ApiBase.Post("/Induction/processpallet",body);
  }
  public ValidateSerialNumber(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/validateserialnumber",body);
  }
  public DeleteSerialNumber(body:any): Observable<any> { 
    return this.ApiBase.Post("/Induction/serialnumber",body);
  }
  public ToteSetupInsert(body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/totesetup",body);
  }
  public ToteSetupDelete(body:any): Observable<any> { 
    return this.ApiBase.Delete("/Admin/totesetup",body);
  }
  public ToteSetup(): Observable<any> { 
    return this.ApiBase.Get("/Admin/totesetup");
  }
  public TransTableView(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/transtableview",Body);
  }  
  public TransactionForTote(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/transactionfortote",Body);
  }  
  public NextSerialNumber(Body:any): Observable<any> { 
    return this.ApiBase.Put("/induction/nextserialnumber",Body);
  }
  public ReelsCreate(body:any): Observable<any> { 
    return this.ApiBase.Post("/Induction/reels",body);
  }
  public ValidateSn(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/validatesn",Body);
  }  
  public BatchByZone(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/batchbyzone",Body);
  }   
  public DynamicMethod(Payload,BaseUrl): Observable<any> { 
    return this.ApiBase.Put(BaseUrl,Payload);
  }
  
  public TaskComplete(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/taskcomplete",Body);
  }  
  public CrossDock(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/crossdock",Body);
  }  
  public FindLocation(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/findlocation",Body);
  }  
  public CheckForwardLocations(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/checkforwardlocations",Body);
  }  
  public IMUpdate(Body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/im",Body);
  }  
  public ItemDetails(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/itemdetails",Body);
  }  
  public AvailableZone(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/availablezone",Body);
  }  
  public RPDetails(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/rpdetails",Body);
  }  
  public CompletePick(Body:any): Observable<any> { 
    return this.ApiBase.Post("/Induction/completepick",Body);
  }  
  public BatchLocationTypeAhead(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/batchlocationtypeahead",Body);
  }  
  public ReserveLocation(Body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/reservelocation",Body);
  }  
  public BatchTotesDelete(Body:any): Observable<any> { 
    return this.ApiBase.Post("/Induction/batchtote",Body);
  }  
  public AllBatchDelete(): Observable<any> { 
    return this.ApiBase.Delete("/Induction/allbatch");
  }   
  public TransactionQtyReplenishmentUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Admin/transactionqtyreplenishment",body);
  }   
  public ReplenishmentsByDelete(body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/replenishments",body);
  }   
  public DeleteRangeBegin(body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/rangebegin",body);
  }   
  public DeleteRangeEnd(body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/rangeend",body);
  }   
  public SystemReplenishNewTA(body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/systemreplenishnewta",body);
  } 
  public ReplenishmentsIncludeAllUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Admin/replenishmentsincludeall",body);
  } 
  public ReplenishmentsIncludeUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Admin/replenishmentsinclude",body);
  } 
  public ProcessReplenishments(body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/processreplenishments",body);
  } 
  public ReplenishmentInsert(body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/replenishment",body);
  } 
  public SystemReplenishmentNewTable(body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/systemreplenishmentnew",body);
  }   
  public SystemReplenishmentTable(body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/systemreplenishment",body);
  }   
  public ReplenishReportSearchTA(body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/replenishreportsearchta",body);
  }   
  public SystemReplenishmentCount(body:any): Observable<any> { 
    return this.ApiBase.Get("/Admin/systemreplenishmentcount",body);
  }   
  public FiltersItemNumInsert(body:any): Observable<any> { 
    return this.ApiBase.Post("/Admin/filtersitemnum",body);
  }   
  public PickBatchFilterRename(body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/pickbatchfilterrename",body);
  }   
  public ProcessBlossom(body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/processblossom",body);
  }   
  public PickBatchZonesSelect(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/pickbatchzones",body);
  }
  public PickBatchFilterTypeAhead(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/pickbatchfiltertypeahead",body);
  }
  public PickBatchDefaultFilterMark(body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/pickbatchdefaultfiltermark",body);
  }
  public PickBatchDefaultFilterClear(body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/pickbatchdefaultfilterclear",body);
  }
  public PickBatchDefaultFilterSelect(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/pickbatchdefaultfilter",body);
  }
  public PickBatchFilterBatchDelete(body:any): Observable<any> { 
    return this.ApiBase.Delete("/Induction/pickbatchfilterbatch",body);
  }
  public OrdersFilterZoneSelect(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/ordersfilterzone",body);
  }
  public PickToteTransDT(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/picktotetransdt",body);
  }
  public PickBatchFilterOrderData(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/pickbatchfilterorderdata",body);
  }
  public PickBatchFilterUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/pickbatchfilter",body);
  }
  public PickBatchFilterInsert(body:any): Observable<any> { 
    return this.ApiBase.Post("/Induction/pickbatchfilter",body);
  }
  public PickBatchOrderUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/pickbatchorder",body);
  }
  public PickBatchOrderInsert(body:any): Observable<any> { 
    return this.ApiBase.Post("/Induction/pickbatchorder",body);
  }
  public PickBatchOrderDelete(body:any): Observable<any> { 
    return this.ApiBase.Delete("/Induction/pickbatchorder",body);
  }
  public PickBatchZoneDefaultMark(body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/pickbatchzonedefaultmark",body);
  }
  public PickBatchFilterDelete(body:any): Observable<any> { 
    return this.ApiBase.Post("/Induction/pickbatchfilterdelete",body);
  }
  public OrdersInZone(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/ordersinzone",body);
  }
  public WSPickZoneSelect(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/wspickzone",body);
  }
  public PickToteSetupIndex(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/picktotesetupindex");
  }
  public FillOrderNumber(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/fillordernumber",body);
  }
  public ValidateOrderNumber(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/validateordernumber",body);
  }
  public InZoneSetupProcess(body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/inzonesetupprocess",body);
  }
  public PickToteSetupProcess(body:any): Observable<any> { 
    return this.ApiBase.Put("/Induction/picktotesetupprocess",body);
  }
  public LocationZonesSelect(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/locationzones",body);
  }
  public WSPickZoneInsert(body:any): Observable<any> { 
    return this.ApiBase.Post("/Induction/wspickzone",body);
  }
  public WSPickZoneDelete(body:any): Observable<any> { 
    return this.ApiBase.Delete("/Induction/wspickzone",body);
  }
  public ClrWSPickZone(): Observable<any> { 
    return this.ApiBase.Delete("/Induction/clrwspickzone");
  }
  public InZoneTransDT(body:any): Observable<any> { 
    return this.ApiBase.Get("/Induction/inzonetransdt",body);
  }
  public ContIDShipTransUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Consolidation/contidshiptrans",body);
  }
  public CarrierSave(body:any): Observable<any> { 
    return this.ApiBase.Post("/Consolidation/carrier",body);
  }
  public CarrierSelect(): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/carriers"); 
  }
  public ConsolidationData(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/consolidationdata",body); 
  }
  public StagingLocationsUpdate(body:any): Observable<any> { 
    return this.ApiBase.Post("/Consolidation/staginglocation",body); 
  }
  public ConsoleDataSB(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/datasb",body); 
  }
  public ConsolidationPreferenceUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Consolidation/preference",body); 
  }
  public SystemPreferenceEmailSlip(body:any): Observable<any> { 
    return this.ApiBase.Put("/Consolidation/systempreferenceemailslip",body); 
  }
  public ConsolidationPreferenceShipUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Consolidation/preferenceship",body); 
  }
  public ConsolidationIndex(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/index",body); 
  }
  public ShippingButtSet(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/shippingbuttset",body); 
  }
  public VerifyAllItemPost(body:any): Observable<any> { 
    return this.ApiBase.Post("/Consolidation/verifyitems",body); 
  }
  public UnVerifyAll(body:any): Observable<any> { 
    return this.ApiBase.Post("/Consolidation/verifyitemsdelete",body); 
  }
  public VerifyItemPost(body:any): Observable<any> { 
    return this.ApiBase.Post("/Consolidation/verifyitem",body); 
  }
  public DeleteVerified(body:any): Observable<any> { 
    return this.ApiBase.Delete("/Consolidation/verifyitem",body); 
  }
  public ConsoleItemsTypeAhead(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/itemstypeahead",body); 
  }
  public CompleteShipment(body:any): Observable<any> { 
    return this.ApiBase.Put("/Consolidation/completeshipment",body); 
  }
  public SelCountOfOpenTransactionsTemp(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/selcountofopentransactionstemp",body); 
  }
  public ShipmentItemUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Consolidation/shipping",body); 
  }
  public ShipmentItemDelete(body:any): Observable<any> { 
    return this.ApiBase.Post("/Consolidation/shippingdelete",body); 
  }
  public ShippingIndex(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/shipping",body); 
  }
  public ShippingTransactionIndex(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/shippingtransactionindex",body); 
  }
  public CompletePackingUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Consolidation/completepacking",body); 
  } 
  public SplitLineTrans(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/splitlinetrans",body); 
  } 
  public ShipQTYShipTransUpdate(body:any): Observable<any> { 
    return this.ApiBase.Post("/Consolidation/shipqtyshiptrans",body); 
  } 
  public ContainerIdSingleShipTransUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Consolidation/containeridsingleshiptrans",body); 
  } 
  public ShippingItemAdd(body:any): Observable<any> { 
    return this.ApiBase.Post("/Consolidation/shipping",body); 
  } 
  public ItemModelData(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/itemmodel",body); 
  } 
  public ConfPackProcModalUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Consolidation/confpackprocmodal",body); 
  } 
  public ConfPackProcModal(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/confpackprocmodal",body); 
  } 
  public ConfPackSelectDT(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/confpackselectdt",body); 
  } 
  public ConfirmAllConfPack(body:any): Observable<any> { 
    return this.ApiBase.Put("/Consolidation/confirmallconfpack",body); 
  } 
  public ConfirmAndPackingIndex(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/confirmandpackingindex",body); 
  } 
  public ShipTransUnPackUpdate(body:any): Observable<any> { 
    return this.ApiBase.Put("/Consolidation/shiptransunpack",body); 
  } 
  public SelContIDConfirmPack(body:any): Observable<any> { 
    return this.ApiBase.Get("/Consolidation/selcontidconfirmpack",body); 
  } 
  public CompName(): Observable<any> { 
    return this.ApiBase.Get("/Induction/compname"); 
  } 
  public PreferenceIndex(): Observable<any> { 
    return this.ApiBase.Get("/Induction/preferenceindex"); 
  }
  // ---------- Employee service -------------------

public getLocationList(url, payload ): Observable<any> { 
  return this.ApiBase.Get(url, payload);
} 
public getEmployeeData(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/employee/data`, Body);
} 

public getInsertAllAccess(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/allaccess`, Body);
}
public getUserRights(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/employee/details`, Body);
} 
public getAdminEmployeeLookup(Body: any ,isLoader): Observable<any> {
  return this.ApiBase.Get(`/Admin/employee/lookup`, Body,isLoader);
}  
public employeeStatsInfo(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/employee/Stats`, Body);
}


public saveAdminEmployee(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/employee`, Body);
}

public deleteAdminEmployee(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/employee/delete`, Body);
}
public deleteUserGroup(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/usergroup/delete`, Body);
}


public updateAdminEmployee(Body: any ): Observable<any> {
  return this.ApiBase.Put(`/Admin/employee`, Body);
}
public cloneGroup(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/clonegroup`, Body);
}

public getAdminEmployeeDetails(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/employee/details`, Body);
}

public getControlName(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/controlname`, Body);
}

public updateControlName(Body: any ): Observable<any> {
  return this.ApiBase.Put(`/Admin/control`, Body);
}
public CategoryDelete(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/common/category`, Body);
}

public deleteControlName(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/control`, Body);
}

public submitControlResponse(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/controlresponse`, Body);
}
public insertUserGroup(Body: any): Observable<any> {
  return this.ApiBase.Post(`/Admin/usergroup`, Body);
}

//zone

public getZones( ): Observable<any> {
return this.ApiBase.Get(`/Admin/zones`);
}

public updateEmployeeZone(Body: any ): Observable<any> {
return this.ApiBase.Put(`/Admin/employee/zone`, Body);
}

//deleteEmployeeZone

public deleteEmployeeZone(Body: any ): Observable<any> {
return this.ApiBase.Post(`/Admin/employee/zone`, Body);
}

//AllAccess
public insertAllAccess(Body: any ): Observable<any> {
return this.ApiBase.Post(`/Admin/allaccess`, Body);
}

//EmployeeLocation
public insertEmployeeLocation(Body: any ): Observable<any> {
return this.ApiBase.Post(`/Admin/employee/location`, Body);
}

public updateEmployeeLocation(Body: any ): Observable<any> {
return this.ApiBase.Put(`/Admin/employee/location`, Body);
}




public deleteEmployeeLocation(Body: any ): Observable<any> {
return this.ApiBase.Post(`/Admin/employee/locationdelete`, Body);
}


//picklevels




public insertPickLevels(Body: any ): Observable<any> {
return this.ApiBase.Post(`/Admin/picklevels`, Body);
}

public updatePickLevels(Body: any ): Observable<any> {
return this.ApiBase.Put(`/Admin/picklevels`, Body);
}


public deletePickLevels(Body: any ): Observable<any> {
return this.ApiBase.Post(`/Admin/picklevelsdelete`, Body);
}



//updateAccessGroup

public updateAccessGroup(Body: any ): Observable<any> {
return this.ApiBase.Put(`/Admin/accessgroup`, Body);
}


public insertGroup(Body: any ): Observable<any> {
return this.ApiBase.Post(`/Admin/group`, Body);
}

public insertGroupFunctions(Body: any ): Observable<any> {
return this.ApiBase.Post(`/Admin/groupfunctions`, Body);
}


public getFunctionByGroup(Body: any ): Observable<any> {
return this.ApiBase.Get(`/Admin/functionbygroup`, Body);
}

public updateEmployeesInGroup(Body: any ): Observable<any> {
return this.ApiBase.Put(`/Admin/employeesingroup`, Body);
}

public deleteGroup(Body: any ): Observable<any> {
return this.ApiBase.Delete(`/Admin/group`, Body);
} 
public GetAllPrinters(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/GlobalConfig/getallprinters`, Body);
 } 
 public UpdWSPrefsPrinters(Body: any ): Observable<any> {
  return this.ApiBase.Put(`/GlobalConfig/PrefsPrinters`, Body);
 } 
public StatusPrintService(Body: any ): Observable<any> {
    return this.ApiBase.Post(`/GlobalConfig/statusprintservice`, Body);
 } 
public StartPrintService(Body: any ): Observable<any> {
      return this.ApiBase.Post(`/GlobalConfig/startprintservice`, Body);
 } 
public StopPrintService(Body: any ): Observable<any> {
        return this.ApiBase.Post(`/GlobalConfig/stopprintservice`, Body);
 } 
 public RestartPrintService(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/GlobalConfig/restartprintservice`, Body);
} 
public deletePrinter(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/GlobalConfig/deleteprinter`, Body);
} 
public InsertNewPrinter(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/GlobalConfig/insertnewprinter`, Body);
} 
public UpdateCurrentPrinter(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/GlobalConfig/updatecurrentprinter`, Body);
} 
public ValidateLicenseSave(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/GlobalConfig/applicense`, Body);
} 
public LoginUser(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/GlobalConfig/user/login`, Body);
} 
public Menu(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/GlobalConfig/menu`, Body);
} 
public ConnectionUserPassword(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/GlobalConfig/connectionuserpassword`, Body);
} 
public ConnectionSave(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/GlobalConfig/connection`, Body);
} 
public LAConnectionStringSet(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/GlobalConfig/laconnectionstring`, Body);
} 
public ChangeGlobalAccount(Body: any ): Observable<any> {
  return this.ApiBase.Put(`/GlobalConfig/globalaccount`, Body);
} 
public changePassword(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/users/changepassword`, Body);
}
public getItemNumDetail(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/itemdetail`, Body);
} 
public getLocZTypeInvMap(body?: any ): Observable<any> {
  let userData = this.authService.userData();
    let paylaod = {
      "location": body?.location,
      "zone": body?.zone,
      "username": userData.userName,
      "wsid": userData.wsid,
    }
  return this.ApiBase.Get(`/Admin/locationzonetypeaheadinventorymap`, paylaod);
} 
public getSearchedItem(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Common/searchitem`, Body);
} 
public updateInventoryMap(body: any ,mapID?): Observable<any> {
  body.inventoryMapID= mapID?.invMapID ?? 0;
  body.masterInventoryMapID=mapID?.masterInvMapID ?? 0;
   const asArray = Object.entries(body); 
   const filtered = asArray.filter(([key, value]) =>  value != ''); 
   let payload = Object.fromEntries(filtered); 
   let userData = this.authService.userData(); 
    payload['username'] = userData.userName;
    payload["wsid"] =userData.wsid;
  return this.ApiBase.Put(`/Admin/inventorymap`, payload);
} 
  
public createInventoryMap(body?:any): Observable<any> {
  const asArray = Object.entries(body); 
  let payload = Object.fromEntries(asArray); 
  let userData = this.authService.userData();
  payload['username'] = userData.userName;
  payload["wsid"] =userData.wsid; 
  return this.ApiBase.Post(`/Admin/inventorymap`,body);
} 
public ConnectedUser(): Observable<any> {
  return this.ApiBase.Get(`/GlobalConfig/users`);
} 
public itemquantity(body:any): Observable<any> {
  return this.ApiBase.Put(`/FlowRackReplenish/itemquantity`,body);
} 
public verifyitemquantity(body:any): Observable<any> {
  return this.ApiBase.Get(`/FlowRackReplenish/verifyitemquantity`,body);
} 
public verifyitemlocation(body:any): Observable<any> {
  return this.ApiBase.Get(`/FlowRackReplenish/verifyitemlocation`,body);
} 
public ItemLocation(body:any): Observable<any> {
  return this.ApiBase.Get(`/FlowRackReplenish/ItemLocation`,body);
} 
public openlocation(body:any): Observable<any> {
  return this.ApiBase.Get(`/FlowRackReplenish/openlocation`,body);
} 
public CFData(body:any): Observable<any> {
  return this.ApiBase.Get(`/FlowRackReplenish/CFData`,body);
} 
public wslocation(body:any): Observable<any> {
  return this.ApiBase.Get(`/FlowRackReplenish/wslocation`,body);
} 
public ConnectionUserPasswordUpdate(Body: any ): Observable<any> {
  return this.ApiBase.Put(`/GlobalConfig/connectionuserpassword`, Body);
} 
public ConnectionDelete(Body: any ): Observable<any> {
  return this.ApiBase.Delete(`/GlobalConfig/connection`, Body);
} 
public UpdateOSPriority(Body: any ): Observable<any> {
  return this.ApiBase.Put(`/Admin/ospriority`, Body);
} 
public DeleteOrderStatus(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/orderstatus`, Body);
} 
public CarrierDelete(Body: any ): Observable<any> {
  return this.ApiBase.Delete(`/Consolidation/carrier`, Body);
} 
public TransactionHistoryTable(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/transactionhistory`, Body);
} 
public TransactionModelIndex(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/transactionmodelindex`, Body);
} 
public NextSuggestedTransactions(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/nextsuggestedtransactions`, Body);
} 
public ReprocessTypeahead(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/reprocesstypeahead`, Body);
} 
public ReprocessedTransactionTable(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/reprocessedtransaction`, Body);
} 
public TransactionForOrderInsert(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/transactionfororder`, Body);
} 
public TransactionForOrderUpdate(Body: any ): Observable<any> {
  return this.ApiBase.Put(`/Admin/transactionfororder`, Body);
} 
public ItemExists(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Common/itemexists`, Body);
} 
public ReprocessedTransactionHistoryTable(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/reprocessedtransactionhistory`, Body);
}  
public ReprocessTransactionTable(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/reprocesstransaction`, Body);
} 
public OrderToPost(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/ordertopost`, Body);
}  
public ReprocessIncludeSet(Body: any ): Observable<any> {
  return this.ApiBase.Put(`/Admin/reprocessincludeset`, Body);
} 

public SetAllReprocessColumn(Body: any ): Observable<any> {
  return this.ApiBase.Put(`/Admin/allreprocesscolumn`, Body);
}  
public ReprocessTransactionData(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/reprocesstransactiondata`, Body);
} 
public PostReprocessTransaction(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/postreprocesstransaction`, Body);
} 
public OrderNumberNext(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/ordernumbernext`, Body);
} 
public ScanValidateOrder(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/scanvalidateorder`, Body);
} 
public DeleteOrder(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/Order`, Body);
} 
public OrderStatusData(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/orderstatusdata`, Body);
} 
public OpenTransactionTable(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/opentransaction`, Body);
} 
public HoldTransactionsData(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/holdtransactionsdata`, Body);
} 
public SupplierItemIDInfo(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Common/supplieriteminfo/id`, Body);
}  
public UpdateTransaction(Body: any ): Observable<any> {
  return this.ApiBase.Put(`/Admin/transaction`, Body);
} 
public LocationData(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/locationdata`, Body);
} 
public PostTransaction(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/posttransaction`, Body);
} 
public ManualTransactionTypeAhead(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/manualtransactiontypeahead`, Body);
}  
public TransactionInfo(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/transaction`, Body);
} 
public TransactionDelete(Body: any ): Observable<any> {
  return this.ApiBase.Delete(`/Admin/transaction`, Body);
} 
public TransactionForOrderDelete(Body: any ): Observable<any> {
  return this.ApiBase.Delete(`/Admin/transactionfororder`, Body);
} 
public DeallocateTransactions(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/deallocatetransactions`, Body);
} 
public TransactionByID(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/transactionbyid`, Body);
} 
public GernerateOrderTable(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/gernerateorder`, Body);
} 
public ManualOrderTypeAhead(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/manualordertypeahead`, Body);
} 
public UserFieldGetByID(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Common/userfield/id`, Body);
} 
public UserFieldTypeAhead(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Common/userfieldtypeahead`, Body);
} 
public UserFieldMTSave(Body: any ): Observable<any> {
  return this.ApiBase.Put(`/Common/userfieldmtsave`, Body);
}  
public NewTransactionSave(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/newtransaction`, Body);
}
public GetLocations(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Admin/locations`, Body);
}
public ManualOrdersPost(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/manualorders`, Body);
}
public SupplierItemTypeAhead(Body: any ): Observable<any> {
  return this.ApiBase.Get(`/Common/supplieritemtypeahead`, Body);
}
public SendCompletedToTH(Body: any ): Observable<any> {
  return this.ApiBase.Post(`/Admin/completedtoth`, Body);
}
public GetLocAssCountTable(): Observable<any> {
  return this.ApiBase.Get(`/Admin/locasscounttable`);
}
public PreviewLocAssignmentPickShortFPZ(): Observable<any> {
  return this.ApiBase.Get(`/Admin/previewlocassignmentpickshortfpz`);
}
public PreviewLocAssignmentPickShort(): Observable<any> {
  return this.ApiBase.Get(`/Admin/previewlocassignmentpickshort`);
}

public GetColumnSequenceDetail(body:any): Observable<any> {
  return this.ApiBase.Get(`/Admin/columnsequencedetail`,body);
}
public DeleteColumns(body:any): Observable<any> {
  return this.ApiBase.Delete(`/Admin/columns`,body);
}
public SaveColumns(body:any): Observable<any> {
  return this.ApiBase.Post(`/Admin/columns`,body);
}


public ClearPickToteInfo(body:any): Observable<any> {
  return this.ApiBase.Put(`/Induction/picktoteinfo`,body);
}
public SelectBatchPickTA(body:any): Observable<any> {
  return this.ApiBase.Get(`/Induction/batchpickta`,body);
}
public SelectToteTransManTable(body:any): Observable<any> {
  return this.ApiBase.Get(`/Induction/totetransmantable`,body);
}

// -----------------------------De-Allocate Order API--------------------

public AllocatedOrders(paylaod:any): Observable<any> {
  return this.ApiBase.Get(`/Admin/allocatedorders`,paylaod);
}
public AllocatedItems(paylaod:any): Observable<any> {
  return this.ApiBase.Get(`/Admin/allocateditems`,paylaod);
}
public AllAllocatedOrders(paylaod:any): Observable<any> {
  return this.ApiBase.Get(`/Admin/allallocatedorders`,paylaod);
}
public OrderItemsTable(paylaod:any): Observable<any> {
  return this.ApiBase.Get(`/Admin/orderitems`,paylaod);
}
public DeAllocateOrder(paylaod:any): Observable<any> {
  return this.ApiBase.Post(`/Admin/deallocateorder`,paylaod);
}

// -----------------------------De-Allocate Order API--------------------


public SaveTransaction(payload:any): Observable<any>{
  return this.ApiBase.Post(`/Admin/Transaction`, payload);
}

public ReprocessTransactionDelete(payload:any): Observable<any>{
 
  return this.ApiBase.Post(`/Admin/reprocesstransaction`, payload);
}

public updateAppName(userName:any, wsid:any, appName:any = ''): Observable<any> {
  
    let payLoad = {
      "userName":userName,
      "wsid": wsid,
      "appName":appName   
    }; 
    return this.ApiBase.Post(`/Common/UserAppNameAdd`, payLoad,);           
}

public saveWareHouse(body: any): Observable<any> { 
  return this.ApiBase.Post(`/Common/warehouse`, body);
}
public dltWareHouse(body: any): Observable<any> { 
  return this.ApiBase.Delete(`/Common/warehouse`, body);
}
 
public deleteInventoryMap(reqPaylaod:any): Observable<any>{ 
  return this.ApiBase.Delete(`/Admin/inventorymap`, reqPaylaod);
}

public quarantineInventoryMap(reqPaylaod:any): Observable<any>{ 
  return this.ApiBase.Put(`/Admin/inventorymapotquarantine`, reqPaylaod);
}

public unQuarantineInventoryMap(reqPaylaod:any): Observable<any>{ 
  return this.ApiBase.Put(`/Admin/inventorymapotUnquarantine`, reqPaylaod);
} 
public getVelocityCode(body?: any): Observable<any> { 
  return this.ApiBase.Get(`/Common/velocitycode`);
}
public saveVelocityCode(body: any): Observable<any> { 
  return this.ApiBase.Post(`/Common/velocitycode`, body);
}
public dltVelocityCode(body: any): Observable<any> { 
  return this.ApiBase.Delete(`/Common/velocitycode`, body);
}
public DevicePreferencesDelete(body){
  return this.ApiBase.Post(`/Admin/deviceperference/delete`, body);
}

public GetCartonFlow(body?: any): Observable<any> { 
  return this.ApiBase.Get(`/Admin/loczonescartonflow`);
}

public UpdateCartonFlow(body){    // ------------ update cartonflow
  return this.ApiBase.Put(`/Admin/workstationsettings`, body);
}

public DevicePreferencesTable(body){
  return this.ApiBase.Get(`/Admin/deviceperference`, body);
}
public LocationNamesSave(body){
  return this.ApiBase.Post(`/Admin/locationnames`, body);
}
public LocationNames(){
  return this.ApiBase.Get(`/Admin/locationnames`);
}
public DeleteLocationNames(body){
  return this.ApiBase.Delete(`/Admin/locationnames`,body);
}
public ZoneDevicePreferencesUpdateAll(body){
  return this.ApiBase.Put(`/Admin/zonedevicepreferencesall`,body);
}
public DeviceInformation(body){
  return this.ApiBase.Get(`/Admin/deviceinformation`,body);
}
public DevicePreference(body){
  return this.ApiBase.Post(`/Admin/deviceperference`,body);
}
public LocationZoneSave(body){
  return this.ApiBase.Post(`/Admin/locationzone`,body);
}
public LocationZone(){
  return this.ApiBase.Get(`/Admin/locationzone`);
}
public LocationZoneDelete(body){
  return this.ApiBase.Delete(`/Admin/locationzone`,body);
}
public LocationZoneNewSave(body){
  return this.ApiBase.Post(`/Admin/locationzonenew`,body);
}
public updateItemQuantity(body){
  let payload = body; 
  let userData = this.authService.userData(); 
   payload['username'] = userData.userName;
   payload["wsid"] =userData.wsid;
  
  return this.ApiBase.Put(`/Admin/itemquantity`,payload);
}
public getAdjustmentReasonsList(){
  let userData = this.authService.userData(); 
  let payload = {
    'username': userData.userName,
    'wsid': userData.wsid
  }
  return this.ApiBase.Get(`/Common/adjustquantityreason`,payload);
} 

public getItemQuantityDetail(id){
  let userData = this.authService.userData();
   
  let payload = {
    "mapID": id,
    'username': userData.userName,
    'wsid': userData.wsid
  }

  return this.ApiBase.Get(`/Common/AdjustQuantity`,payload);
}

public getPickBatchTransactionTable(body:any): Observable<any> { 
  return this.ApiBase.Get("/induction/pickbatchtransactiontable",body);
}

public completeTransaction(body:any): Observable<any> { 
  return this.ApiBase.Put("/induction/completetransaction",body);
}
public completePickBatch(body:any): Observable<any> { 
  return this.ApiBase.Put("/induction/completepickbatch",body);
}
public shortTransaction(body:any): Observable<any> { 
  return this.ApiBase.Put("/induction/shorttransaction",body);
}
public blossomTote(body:any): Observable<any> { 
  return this.ApiBase.Put("/induction/blossomtote",body);
} 
public Getcustomreports(body): Observable<any> { 
  return this.ApiBase.Get("/Admin/customreports/index",body);
}
public Getreportdetails(body): Observable<any> { 
  return this.ApiBase.Get("/Admin/customreports/reportdetails",body);
} 

public GetFromToteTypeAhead(): Observable<any> { 
  return this.ApiBase.Get("/induction/selecttotes");
}

public viewShipping(body): Observable<any> { 
  return this.ApiBase.Get("/consolidation/viewshipping",body);
} 

public selShipComp(body): Observable<any> { 
  return this.ApiBase.Get("/Admin/selshipcomp",body);
} 

public adjustmentlookup( ): Observable<any> {
  return this.ApiBase.Get(`/Admin/adjustmentlookup`, );
}

public updateAdjustlookup(body){
  return this.ApiBase.Post(`/Admin/adjustmentlookup`,body);
}

public deleteAdjustmentLookup(payload:any) {
  return  this.ApiBase.Delete("/Admin/adjustmentlookup",payload);
} 

public userfieldlookup(body ): Observable<any> {
  return this.ApiBase.Get(`/Admin/userfieldlookup`,body);
}
public updateuserfieldlookup(body){
  return this.ApiBase.Post(`/Admin/userfieldlookup`,body);
}

public deleteUserfieldLookUp(payload:any) {
  return  this.ApiBase.Post("/Admin/userfieldlookupdelete",payload);
} 


public getToteCell( ): Observable<any> {
  return this.ApiBase.Get(`/Admin/totesetup`);
}

public totesetup(body){
  return this.ApiBase.Post(`/Admin/totesetup`,body);
}

public deleteTote(payload:any) {
  return  this.ApiBase.Delete("/Admin/totesetup",payload);
} 



public cleartote(body): Observable<any> {
  return this.ApiBase.Put(`/Admin/cleartotes`,body);
}
// public cleartote( ): Observable<any> {
//   return this.ApiBase.Post(`/Admin/cleartotes`, Body);
//   }
public basicreportdetails(body): Observable<any> { 
  return this.ApiBase.Get("/Admin/customreports/basicreportdetails",body);
} 
public ReportFieldsExps(body): Observable<any> { 
  return this.ApiBase.Put("/Admin/customreports/ReportFieldsExps",body);
} 
public reportfieldvalues(body): Observable<any> { 
  return this.ApiBase.Put("/Admin/customreports/reportfieldvalues",body);
} 
public ReportTitles(body): Observable<any> { 
  return this.ApiBase.Put("/Admin/customreports/ReportTitles",body);
} 
public changefilter(body): Observable<any> { 
  return this.ApiBase.Get("/Admin/customreports/changefilter",body);
}
 
public importFile(body){ 
  return this.ApiBase.PostFormData(`/Admin/customreports/importFile`,body);
}

public validateNewDesign(body){
  return this.ApiBase.Post(`/Admin/customreports/ValidateNewDesign`,body);
}
public getLLDesignerNewDesign(body){
  return this.ApiBase.Post(`/Admin/customreports/GetLLDesignerNewDesign`,body);
}
public restoreDesign(body){
  return this.ApiBase.Post(`/Admin/customreports/GetLLDesignerNewDesign`,body);
}

public deleteReport(payload:any) {
  return  this.ApiBase.Post("/Admin/customreports/CustomReportDelete",payload);
} 

public pushReportChanges(body): Observable<any> { 
  return this.ApiBase.Post("/Admin/customreports/PushReportChanges",body);
} 

public updatereportDetails(body): Observable<any> {
  return this.ApiBase.Put(`/Admin/customreports/reportdetails`,body);
}

public ShowCMPackPrintModal(body:any): Observable<any> { 
  return this.ApiBase.Get("/consolidation/cmPackPrintmodalshow",body);
}
public CommonExport(body): Observable<any> {
  return this.ApiBase.Get(`/Admin/reports/export`,body);
}

public async CommonPrint(body)  {
   return  await this.ApiBase.GetAsync(`/Admin/reports/print`,body);
} 
public GetWorkStatPrinters(): Observable<any> {
  return this.ApiBase.Get(`/GlobalConfig/WorkStatPrinters`);
} 
public SetReprocessIds(Body: any ): Observable<any> {
  return this.ApiBase.Put(`/Admin/setreprocessids`, Body);
} 


}
