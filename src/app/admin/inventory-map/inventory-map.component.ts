import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import {AppRoutes, DialogConstants, StringConditions, ToasterMessages, ToasterTitle, ToasterType,AppNames,Column,zoneType,ColumnDef,TableConstant,Style,UniqueConstants,FilterColumnName,RouteUpdateMenu} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-inventory-map',
  templateUrl: './inventory-map.component.html',
  styleUrls: ['./inventory-map.component.scss']
})

export class InventoryMapComponent implements OnInit {
   INVMAP_DATA = [
    { colHeader: "locationID", colDef: "Alternate Light" },
    { colHeader: "bin", colDef: TableConstant.Bin },
    { colHeader: zoneType.carousel, colDef: TableConstant.Carousel },
    { colHeader: UniqueConstants.cellSize, colDef: "Cell Size" },
    { colHeader: "dateSensitive", colDef: "Date Sensitive" },
    { colHeader: "dedicated", colDef: "Dedicated" },
    { colHeader: UniqueConstants.Description, colDef: Column.Description },
    { colHeader: "expirationDate", colDef: TableConstant.ExpirationDate },
    { colHeader: "invMapID", colDef: "Inv Map ID" },
    { colHeader: "itemNumber", colDef: Column.ItemNumber },
    { colHeader: "itemQuantity", colDef: "Item Quantity" },
    { colHeader: "laserX", colDef: "Laser X" },
    { colHeader: "laserY", colDef: "Laser Y" },
    { colHeader: "location", colDef: Column.Location },
    { colHeader: "locationNumber", colDef: "Location Number" },
    { colHeader: "lotNumber", colDef: Column.LotNumber },
    { colHeader: "masterInvMapID", colDef: "Master Inv Map ID" },
    { colHeader: "masterLocation", colDef: "Master Location" },
    { colHeader: "maxQuantity", colDef: "Maximum Quantity" },
    { colHeader: "minQuantity", colDef: "Min Quantity" },
    { colHeader: "putAwayDate", colDef: "Put Away Date" },
    { colHeader: "quantityAllocatedPick", colDef: "Quantity Allocated Pick" },
    { colHeader: "quantityAllocatedPutAway", colDef: "Quantity Allocated Put Away" },
    { colHeader: "revision", colDef: TableConstant.Revision },
    { colHeader: "row", colDef: TableConstant.Row },
    { colHeader: "serialNumber", colDef: "Serial Number" },
    { colHeader: TableConstant.shelf, colDef: TableConstant.shelf },
    { colHeader: "unitOfMeasure", colDef: FilterColumnName.unitOfMeasure },
    { colHeader: ColumnDef.userField1, colDef: TableConstant.UserField1 },
    { colHeader: ColumnDef.userField2, colDef: TableConstant.UserField2 },
    { colHeader: UniqueConstants.goldenZone, colDef: "Velocity Code" },
    { colHeader: "warehouse", colDef: "Warehouse" },
    { colHeader: TableConstant.zone, colDef: ColumnDef.Zone },
  ];
  onDestroy$: Subject<boolean> = new Subject();
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  setStorage;
  fieldNames:any;
  routeFromIM:boolean=false;
  isActiveTrigger:boolean =false;
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
 
    this.customPagination = {
      total : '',
      recordsPerPage : 20,
      startIndex: 0,
      endIndex: 20
    }

    this.OSFieldFilterNames();
    this.initializeApi();
    this.getColumnsData();
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

        this.columnValues.push('actions');
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
    if(event.itemQuantity > 0){
      this.global.OpenDialog(ConfirmationDialogComponent, {
        height: DialogConstants.auto,
        width: Style.w786px,
        data: {
          message: "This location currently has a positive item quantity and cannot be deleted.",
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

 printSelected(event: any){
  this.global.Print(`FileName:printIMReport|invMapID:${event.invMapID}|groupLikeLoc:false|beginLoc:|endLoc:|User:${this.userData.userName}`)

}

selectRow(row: any) {
  this.dataSource.filteredData.forEach(element => {
    if(row != element){
      element.selected = false;
    }
  });
  const selectedRow = this.dataSource.filteredData.find((x: any) => x === row);
  if (selectedRow) {
    selectedRow.selected = !selectedRow.selected;
  }
}

}
