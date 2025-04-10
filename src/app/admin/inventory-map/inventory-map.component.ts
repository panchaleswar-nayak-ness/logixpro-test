import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect} from '@angular/material/select';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router} from '@angular/router';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { AuthService } from '../../common/init/auth.service';
import { AddInvMapLocationComponent } from '../dialogs/add-inv-map-location/add-inv-map-location.component';
import { AdjustQuantityComponent } from '../dialogs/adjust-quantity/adjust-quantity.component';
import { DeleteConfirmationComponent } from '../dialogs/delete-confirmation/delete-confirmation.component';
import { QuarantineConfirmationComponent } from '../dialogs/quarantine-confirmation/quarantine-confirmation.component';
import { ColumnSequenceDialogComponent } from '../dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { RouteHistoryService } from 'src/app/common/services/route-history.service';
import { PrintRangeComponent } from '../dialogs/print-range/print-range.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { CurrentTabDataService } from '../inventory-master/current-tab-data-service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { DialogConstants, StringConditions, ToasterMessages, ToasterTitle, ToasterType, ColumnDef, Style, UniqueConstants } from 'src/app/common/constants/strings.constants';
import { RouteUpdateMenu } from 'src/app/common/constants/menu.constants';
import { AppNames, AppRoutes, } from 'src/app/common/constants/menu.constants';
import { ContextMenuFiltersService } from 'src/app/common/init/context-menu-filters.service';
import { Placeholders } from 'src/app/common/constants/strings.constants';
import { StorageContainerManagementModalComponent } from '../dialogs/storage-container-management/storage-container-management.component';

@Component({
  selector: 'app-inventory-map',
  templateUrl: './inventory-map.component.html',
  styleUrls: ['./inventory-map.component.scss']
})

export class InventoryMapComponent implements OnInit {
  companyObj = { storageContainer: false };
  placeholders = Placeholders;
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
    
   INVMAP_DATA = [
    { colHeader: "locationID", colDef: "Alternate Light", colTitle: "Alternate Light" },
    { colHeader: "bin", colDef: "Bin", colTitle: this.fieldMappings?.bin || this.placeholders.binFallback },
    { colHeader: "carousel", colDef: "Carousel", colTitle: this.fieldMappings?.carousel || this.placeholders.carouselFallback },
    { colHeader: "cellSize", colDef: "Cell Size", colTitle: "Cell Size" },
    { colHeader: "dateSensitive", colDef: "Date Sensitive", colTitle: "Date Sensitive" },
    { colHeader: "dedicated", colDef: "Dedicated", colTitle: "Dedicated" },
    { colHeader: "description", colDef: "Description", colTitle: "Description" },
    { colHeader: "expirationDate", colDef: "Expiration Date", colTitle: "Expiration Date" },
    { colHeader: "invMapID", colDef: "Inv Map ID", colTitle: "Inv Map ID" },
    { colHeader: "itemNumber", colDef: "Item Number", colTitle: this.fieldMappings?.itemNumber || this.placeholders.itemNumberFallback },
    { colHeader: "itemQuantity", colDef: "Item Quantity", colTitle: "Item Quantity" },
    { colHeader: "laserX", colDef: "Laser X", colTitle: "Laser X" },
    { colHeader: "laserY", colDef: "Laser Y", colTitle: "Laser Y" },
    { colHeader: "location", colDef: "Location", colTitle: "Location" },
    { colHeader: "locationNumber", colDef: "Location Number", colTitle: "Location Number" },
    { colHeader: "lotNumber", colDef: "Lot Number", colTitle: "Lot Number" },
    { colHeader: "masterInvMapID", colDef: "Master Inv Map ID", colTitle: "Master Inv Map ID" },
    { colHeader: "masterLocation", colDef: "Master Location", colTitle: "Master Location" },
    { colHeader: "maxQuantity", colDef: "Maximum Quantity", colTitle: "Maximum Quantity" },
    { colHeader: "minQuantity", colDef: "Min Quantity", colTitle: "Min Quantity" },
    { colHeader: "putAwayDate", colDef: "Put Away Date", colTitle: "Put Away Date" },
    { colHeader: "quantityAllocatedPick", colDef: "Quantity Allocated Pick", colTitle: "Quantity Allocated Pick" },
    { colHeader: "quantityAllocatedPutAway", colDef: "Quantity Allocated Put Away", colTitle: "Quantity Allocated Put Away" },
    { colHeader: "revision", colDef: "Revision", colTitle: "Revision" },    
    { colHeader: "row", colDef: "Row", colTitle: this.fieldMappings?.row || this.placeholders.rowFallback },
    { colHeader: "serialNumber", colDef: "Serial Number", colTitle: "Serial Number" },
    { colHeader: "shelf", colDef: "Shelf", colTitle: this.fieldMappings?.shelf || this.placeholders.shelfFallback },
    { colHeader: "unitOfMeasure", colDef: "Unit of Measure", colTitle: this.fieldMappings?.unitOfMeasure || this.placeholders.unitOfMeasureFallback },
    { colHeader: "userField1", colDef: "User Field1", colTitle: this.fieldMappings?.userField1 || this.placeholders.userField1Fallback },
    { colHeader: "userField2", colDef: "User Field2", colTitle: this.fieldMappings?.userField2 || this.placeholders.userField2Fallback },
    { colHeader: "goldenZone", colDef: "Velocity Code", colTitle: "Velocity Code" },
    { colHeader: "warehouse", colDef: "Warehouse", colTitle: "Warehouse" },
    { colHeader: "zone", colDef: "Zone", colTitle: "Zone" },
  ];

  onDestroy$: Subject<boolean> = new Subject();
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  setStorage;
  fieldNames:any;
  routeFromIM:boolean=false;
  isActiveTrigger:boolean =false;
  isStorageContainer :boolean =false;
  assignedFunctions:any;
  unassignedFunctions:any;
  isClearWholeLocationAvailable: boolean = false;
  routeFromOM:boolean=false;
  public displayedColumns: any ;
  public dataSource: any = [];
  customPagination: any = {
    total : '',
    recordsPerPage : 20,
    startIndex: '',
    endIndex: ''
  }
  columnSearch: any = {
    
    searchColumn : {
      colHeader :'',
      colDef: ''
    },
    searchValue : ''
  }

  sortColumn: any ={
    columnName: 0,
    sortOrder: UniqueConstants.Asc
  }
  userData: any;
  payload: any;

  searchAutocompleteList: any;
  public iAdminApiService: IAdminApiService;
  public columnValues: any = [];
  public itemList: any;
  public filterLoc:any = StringConditions.filterLoc;
  public isSearchColumn:boolean = false;
  spliUrl;

  detailDataInventoryMap: any;
  transHistory:boolean = false;
  inventoryRoute:any;
  clickTimeout:ReturnType<typeof setTimeout>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('matRef') matRef: MatSelect;
  @ViewChild('viewAllLocation') customTemplate: TemplateRef<any>;
  @ViewChild(MatAutocompleteTrigger) autocompleteInventory: MatAutocompleteTrigger;

  //---------------------for mat menu start ----------------------------

  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault()
    this.isActiveTrigger = true;
    setTimeout(() => {
      this.contextMenuService.updateContextMenuState(event, SelectedItem, FilterColumnName, FilterConditon, FilterItemType);
    }, 100);
  }

  filterString : string = UniqueConstants.OneEqualsOne;

  optionSelected(filter : string) {
    this.filterString = filter;
    this.initializeApi();
    this.getContentData();    
    this.isActiveTrigger = false;
  }

 //---------------------for mat menu End ----------------------------
 previousUrl: string;
  constructor(
    private global:GlobalService,
    private authService: AuthService,
    public adminApiService: AdminApiService,
    private dialog:MatDialog,
    private router: Router,
    private routeHistoryService: RouteHistoryService,
    private currentTabDataService: CurrentTabDataService,
    private filterService : ContextMenuFiltersService,
    private contextMenuService : TableContextMenuService
  ) {
    this.previousUrl = this.routeHistoryService.getPreviousUrl();
    this.iAdminApiService = adminApiService;
    
    if(this.router.getCurrentNavigation()?.extras?.state?.[UniqueConstants.searchValue] ){
      this.columnSearch.searchValue = this.router.getCurrentNavigation()?.extras?.state?.[UniqueConstants.searchValue] ;
      this.columnSearch.searchColumn = {
        colDef: this.router.getCurrentNavigation()?.extras?.state?.['colDef'],
        colHeader: this.router.getCurrentNavigation()?.extras?.state?.['colHeader']
      }
      this.isSearchColumn = true;
    }
    else if (this.currentTabDataService.savedItem[this.currentTabDataService.INVENTORY_MAP])
      {
          this.applySavedItem();
          this.isSearchColumn = true;
      }
    if(router.url == AppRoutes.OrderManagerInventoryMap){
      this.transHistory = true;
    }
    else if(router.url ==AppRoutes.AdminInventoryMap  || AppRoutes.InductionManagerAdminInventoryMap){
      this.transHistory = false;
    }

  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.filterService.filterString = "";
    this.customPagination = {
      total : '',
      recordsPerPage : 20,
      startIndex: 0,
      endIndex: 20
    }

    this.OSFieldFilterNames();
    this.initializeApi();
    this.getColumnsData();
    this.companyInfo();
  }
  
  public companyInfo() {
    this.iAdminApiService.AccessLevelByGroupFunctions().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        // storage container management access level
         this.isStorageContainer =  res.data.accessstorageContainer;
         // inv map clear whole locaiton  access level
         this.isClearWholeLocationAvailable =   res.data.accessClearWholeLocation;
      }
    });

    this.iAdminApiService.WorkstationSetupInfo().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.companyObj.storageContainer = res.data.storageContainer;        }
      else {
        //this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("AdminCompanyInfo", res.responseMessage);
      }
    })
  }

  public OSFieldFilterNames() { 
    this.iAdminApiService.ColumnAlias().subscribe((res: any) => {
      if(res.isExecuted && res.data)
      {
        this.fieldNames = res.data;
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ColumnAlias",res.responseMessage);

      }
    })
  }

  ngAfterViewInit() {
    this.setStorage =localStorage.getItem(RouteUpdateMenu.RouteFromInduction)
 
    this.spliUrl=this.router.url.split('/'); 

    if( this.spliUrl[1] == AppNames.InductionManager || this.spliUrl[1] == AppNames.OrderManager ){
       this.inventoryRoute =false
    }
    else {
      this.inventoryRoute = true

    }
    }
  pageEvent: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;

    this.customPagination.startIndex =  e.pageSize*e.pageIndex

    this.customPagination.endIndex =  (e.pageSize*e.pageIndex + e.pageSize)
    this.customPagination.recordsPerPage = e.pageSize;

   this.dataSource.sort = this.sort;

   this.initializeApi();
   this.getContentData()
   
  }

  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }

  initializeApi(){
    this.userData = this.authService.userData();
    if(this.filterString == "")
    {
      this.filterString = UniqueConstants.OneEqualsOne
    }
    this.payload = { 
     "oqa": this.filterLoc,
     "searchString": this.columnSearch.searchValue,
     "searchColumn": this.columnSearch.searchColumn.colDef,
     "sortColumnIndex": this.sortColumn.columnName,
     "sRow":  this.customPagination.startIndex,
     "eRow": this.customPagination.endIndex,
     "sortOrder": this.sortColumn.sortOrder,
     "filter": this.filterString
   }
  }
  getColumnsData() {
    let payload = { 
      "tableName": "Inventory Map"
    }
    this.iAdminApiService.getSetColumnSeq(payload).pipe(takeUntil(this.onDestroy$)).subscribe((res) => {
      this.displayedColumns = this.INVMAP_DATA;

      if(res.data){
        this.columnValues =  res.data;

        this.columnValues.push(ColumnDef.Actions);
        this.getContentData();
      } else {
        this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
        console.log("getSetColumnSeq",res.responseMessage);
      }
    });
  }
  applySavedItem() {
    if(this.router.getCurrentNavigation()?.extras?.state?.[UniqueConstants.searchValue] ) return;
    
    this.dataSource = this.currentTabDataService.savedItem[this.currentTabDataService.INVENTORY_MAP].dataSource;
    this.columnSearch = this.currentTabDataService.savedItem[this.currentTabDataService.INVENTORY_MAP].columnSearch;
    this.filterLoc= this.currentTabDataService.savedItem[this.currentTabDataService.INVENTORY_MAP].filterLoc;
  }
  recordSavedItem() {
    this.currentTabDataService.savedItem[this.currentTabDataService.INVENTORY_MAP]= {
      dataSource: this.dataSource,
      columnSearch: this.columnSearch,
      filterLoc: this.filterLoc
    };
  }
  
  getContentData(){
    this.iAdminApiService.getInventoryMap(this.payload).pipe(takeUntil(this.onDestroy$)).subscribe((res: any) => {
      this.itemList =  res.data?.inventoryMaps?.map((arr => {
        return {'itemNumber': arr.itemNumber, 'desc': arr.description}
      }))
       
      this.detailDataInventoryMap= res.data?.inventoryMaps;
      this.dataSource = new MatTableDataSource(res.data?.inventoryMaps);
      this.dataSource.sort = this.sort;
      this.recordSavedItem();
    
      this.customPagination.total = res.data?.recordsFiltered;

    });
  }

  addLocDialog() { 
    let dialogRef:any = this.global.OpenDialog(AddInvMapLocationComponent, {
      height: DialogConstants.auto,
      width: '100%',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        mode: 'addInvMapLocation',
        itemList : this.itemList,
        fieldName:this.fieldNames
      }
    })
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {
      
      if(result != DialogConstants.close){
        this.getContentData();
      }
        
    })
  }
  inventoryMapAction(actionEvent: any) {
    if (actionEvent.value === 'set_column_sq') {

      let dialogRef:any = this.global.OpenDialog(ColumnSequenceDialogComponent, {
        height: DialogConstants.auto,
        width: '960px',
        disableClose: true,
        data: {
          mode: event,
          tableName: 'Inventory Map',
        },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          this.clearMatSelectList();
          if (result?.isExecuted) {
            this.getColumnsData();
          }
        });
    }
  }

  applyFilter(filterValue:any, colHeader:any) {
    //need to test this
    this.dataSource.filter = "";
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewAllLocDialog(): void {
    const dialogRef:any = this.global.OpenDialog(this.customTemplate, {
       width: Style.w560px,
       autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      
    });
  }

  viewLocFilter(){
    this.initializeApi();
    this.getContentData();
    this.dialog.closeAll();
  }


  edit(event: any){
 
    let dialogRef:any = this.global.OpenDialog(AddInvMapLocationComponent, {
      height: DialogConstants.auto,
      width: '100%',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        isClearWholeLocationAvailable: this.isClearWholeLocationAvailable,
        mode: 'editInvMapLocation',
        itemList : this.itemList,
        detailData : event,
        fieldName:this.fieldNames
      }
    })
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {
      if(this.router.url=="/InductionManager/Admin/InventoryMap" || this.router.url=="/OrderManager/InventoryMap"){
        this.getContentData();
      }
      if(result != DialogConstants.close){
      
        this.getContentData();
      }
    })

  
  }

  delete(event: any){ 
  if (event.itemQuantity > 0 || event.QuantityAllocatedPick > 0 || event.quantityAllocatedPutAway > 0) 
    {
      this.global.OpenDialog(ConfirmationDialogComponent, {
        height: DialogConstants.auto,
        width: Style.w560px,
        data: {
          message: "This location currently has a positive item quantity or quantity is allocated and cannot be deleted",
          hideCancel: true
        },
        autoFocus: DialogConstants.autoFocus
      });
    }
    else{ 
      let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        height: DialogConstants.auto,
        width: Style.w480px,
        autoFocus: DialogConstants.autoFocus,
      disableClose:true,
        data: {
          action: UniqueConstants.delete,
          mode: 'delete-inventory-map',
          id: event.invMapID
        }
      })
      dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(() => {
  
        this.getContentData();
      })
    }
    
  }


  quarantine(event){
    let dialogRef:any = this.global.OpenDialog(QuarantineConfirmationComponent, {
      height: DialogConstants.auto,
      width: Style.w480px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        mode: 'inventory-map-quarantine',
        id: event.invMapID
      }
    })
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      setTimeout(() => {
        this.getContentData();
      },1000);
    })
  }

  unQuarantine(event){
    let dialogRef:any = this.global.OpenDialog(QuarantineConfirmationComponent, {
      height: DialogConstants.auto,
      width: Style.w480px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        mode: 'inventory-map-unquarantine',
        id: event.invMapID
      }
    })
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      
      setTimeout(() => {
        this.getContentData();
      },1000);
    })
  }

  adjustQuantity(event){
    if(event.itemNumber == ""){
      return;
    }
    let dialogRef:any = this.global.OpenDialog(AdjustQuantityComponent, {
      height: DialogConstants.auto,
      width: '800px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    
      data: {
        id: event.invMapID,
        fieldNames:this.fieldNames.itemNumber
      }
    })
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.getContentData();
    })
  }

  duplicate(event){
    let obj:any = { 
      inventoryMapID:event.invMapID
    }
  this.iAdminApiService.duplicate(obj).pipe(takeUntil(this.onDestroy$)).subscribe((res) => {
    this.displayedColumns = this.INVMAP_DATA;

    if(res.data){
      this.getContentData();
      this.global.ShowToastr(ToasterType.Success,res.responseMessage, ToasterTitle.Success);
    } else {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
      console.log("duplicate",res.responseMessage);
    }
  });

  }

  viewInInventoryMaster(row){
    clearTimeout(this.clickTimeout);
    if( this.spliUrl[1] == AppNames.OrderManager ){
      this.router.navigate([]).then(() => {
        window.open(`/#/OrderManager/InventoryMaster?itemNumber=${row.itemNumber}`, UniqueConstants._self);
      });
   }else if(this.spliUrl[1] == AppNames.InductionManager ){
    window.open(`/#/InductionManager/Admin/InventoryMaster?itemNumber=${row.itemNumber}`, UniqueConstants._self);

   }
   else {
    localStorage.setItem(RouteUpdateMenu.RouteFromInduction,'false')
    this.router.navigate([]).then(() => {
      window.open(`/#/admin/inventoryMaster?itemNumber=${row.itemNumber}`, UniqueConstants._self);
    });

   }

   
  }

  viewLocationHistory(row : any){

    if( this.spliUrl[1] == AppNames.OrderManager ){
      this.router.navigate([]).then(() => {
        window.open(`/#/OrderManager/OrderStatus?location=${row.locationNumber}`, UniqueConstants._self);
      });
   }
   
   else if( this.spliUrl[1] == AppNames.InductionManager ){
    this.router.navigate([]).then(() => {
      window.open(`/#/InductionManager/Admin/TransactionJournal?location=${row.locationNumber}`, UniqueConstants._self);
    });
 }
   else {
    localStorage.setItem(RouteUpdateMenu.RouteFromInduction,'false')
    this.router.navigate([]).then(() => {
      window.open(`/#/admin/transaction?location=${row.locationNumber}`, UniqueConstants._self);
    });

   }


   
  }

  autoCompleteSearchColumn(){
    let searchPayload = {
      "columnName": this.columnSearch.searchColumn.colDef,
      "value": this.columnSearch.searchValue
    }
    this.iAdminApiService.getSearchData(searchPayload).pipe(takeUntil(this.onDestroy$)).subscribe((res: any) => {
      if(res.data){
        this.searchAutocompleteList = res.data;
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("getSearchData",res.responseMessage);

        }

    });
  }

  searchColumn(){ 
    if(this.columnSearch.searchColumn === ''|| this.columnSearch.searchColumn === undefined){
      this.isSearchColumn = false;
      this.payload.searchString = ''
      this.payload.searchColumn = ''
      this.getContentData();
    }else{
      this.isSearchColumn = true;
    }
    
    this.searchAutocompleteList = [];
    if(this.columnSearch.searchValue){
      this.columnSearch.searchValue = '';
      this.initializeApi();
      this.getContentData();
    }
  }
  closeAutoMenu()
  {
    this.autocompleteInventory.closePanel(); 
  }
  searchData(){
    
    if( this.columnSearch.searchColumn &&  this.columnSearch.searchColumn !== '' ){
      this.initializeApi();
      this.getContentData();
    }
  }

  reset(){
   
    if( this.columnSearch.searchValue==''){
    
      this.initializeApi()
      this.getContentData()
    }
  
  }

  announceSortChange(e : any){
    
    let index = this.columnValues.findIndex(x => x === e.active );
    this.sortColumn = {
      columnName: index,
      sortOrder: e.direction
    }

    this.initializeApi();
    this.getContentData();

  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }
  compareObjects(o1: any, o2: any): boolean {
    return o1.colDef === o2.colDef && o1.colHeader === o2.colHeader;
  }
  
  isAuthorized(controlName:any) {
    return !this.authService.isAuthorized(controlName);
 }


 tranHistory(seletedRecord:any){

  this.router.navigate([]).then(() => {
      let url = `/#/OrderManager/OrderStatus?itemNumber=${seletedRecord.itemNumber}&type=TransactionHistory`;
      window.open(url, UniqueConstants._blank);
  });
 }

 printRange(){
  this.global.OpenDialog(PrintRangeComponent, {
    height: DialogConstants.auto,
    width: '932px',
    autoFocus: DialogConstants.autoFocus
  });
 }

  printSelected(event: any) {
    this.adminApiService.PrintInvMap(event.invMapID, false, "", "");

}

selectRow(row: any) {
  this.clickTimeout = setTimeout(() => {
    this.dataSource.filteredData.forEach(element => {
      if(row != element){
        element.selected = false;
      }
    });
    const selectedRow = this.dataSource.filteredData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }, 250);
}

storageContainerManagement(){
  console.log('Storage Container Management option selected.');

  let dialogRef:any = this.global.OpenDialog(StorageContainerManagementModalComponent, {
    height: DialogConstants.auto,
    width: Style.w786px,
    autoFocus: DialogConstants.autoFocus,
    
    data: {
      rowFieldAlias: this.fieldMappings?.row || "Storage Container",
    }
  })
  dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {
    this.getContentData();
  })
}


@HostListener('copy', ['$event'])
onCopy(event: ClipboardEvent) {
  const selection = window.getSelection()?.toString().trim(); // Trim copied text
  if (selection) {
    event.clipboardData?.setData('text/plain', selection);
    event.preventDefault(); // Prevent default copy behavior
  }
}

}
