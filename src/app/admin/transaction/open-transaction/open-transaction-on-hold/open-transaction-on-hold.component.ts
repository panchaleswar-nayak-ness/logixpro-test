import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, takeUntil, Subscription } from 'rxjs';
import { AdjustQuantityComponent } from 'src/app/admin/dialogs/adjust-quantity/adjust-quantity.component';
import { AuthService } from 'src/app/common/init/auth.service';
import { DeleteConfirmationTransactionComponent } from 'src/app/admin/dialogs/delete-confirmation-transaction/delete-confirmation-transaction.component';
import { FloatLabelType } from '@angular/material/form-field';
import { ColumnSequenceDialogComponent } from 'src/app/admin/dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { FunctionAllocationComponent } from 'src/app/admin/dialogs/function-allocation/function-allocation.component';
import { SendTranHistoryComponent } from 'src/app/admin/dialogs/send-tran-history/send-tran-history.component';
import { SharedService } from 'src/app/common/services/shared.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { Column, DialogConstants, Mode, StringConditions, TableName, ToasterMessages, ToasterTitle, ToasterType, TransactionType, ColumnDef, Style, UniqueConstants, Placeholders } from 'src/app/common/constants/strings.constants';
import { RouteUpdateMenu } from 'src/app/common/constants/menu.constants';
import { AppNames, AppRoutes, RouteNames} from 'src/app/common/constants/menu.constants';
import { DatePipe } from '@angular/common';
import { ContextMenuFiltersService } from 'src/app/common/init/context-menu-filters.service';
import { PrintApiService } from 'src/app/common/services/print-api/print-api.service';
 
// Define a strongly typed enum for date types to avoid using magic strings
enum DateType {
  Start = 'sDate',
  End = 'eDate'
}

@Component({
  selector: 'app-open-transaction-on-hold',
  templateUrl: './open-transaction-on-hold.component.html',
  styleUrls: ['./open-transaction-on-hold.component.scss'],
})
export class OpenTransactionOnHoldComponent implements OnInit, AfterViewInit {

  placeholders = Placeholders;
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');

  TRNSC_DATA =[
    { colHeader: 'id', colDef: 'ID' , colTitle: 'ID' },
    { colHeader: 'importDate', colDef: 'Import Date' , colTitle: 'Import Date' },
    { colHeader: 'importBy', colDef: 'Import By' , colTitle: 'Import By' },
    { colHeader: 'importFileName', colDef: 'Import Filename' , colTitle: 'Import Filename' },
    { colHeader: 'transactionType', colDef: 'Transaction Type' , colTitle: 'Transaction Type' },
    { colHeader: 'orderNumber', colDef: 'Order Number' , colTitle: 'Order Number' },
    { colHeader: 'lineNumber', colDef: 'Line Number', colTitle: 'Line Number'},
    { colHeader: 'lineSequence', colDef: 'Line Sequence' , colTitle: 'Line Sequence' },
    { colHeader: 'priority', colDef: 'Priority' , colTitle: 'Priority' },
    { colHeader: 'requiredDate', colDef: 'Required Date' , colTitle: 'Required Date' },
    { colHeader: 'itemNumber', colDef: 'Item Number', colTitle: this.fieldMappings?.itemNumber || this.placeholders.itemNumberFallback  },
    { colHeader: 'unitOfMeasure', colDef: 'Unit of Measure', colTitle: this.fieldMappings?.unitOfMeasure || this.placeholders.unitOfMeasureFallback  },
    { colHeader: 'lotNumber', colDef: 'Lot Number' , colTitle: 'Lot Number' },
    { colHeader: 'expirationDate', colDef: 'Expiration Date' , colTitle: 'Expiration Date' },
    { colHeader: 'serialNumber', colDef: 'Serial Number' , colTitle: 'Serial Number' },
    { colHeader: 'description', colDef: 'Description' , colTitle: 'Description' },
    { colHeader: 'revision', colDef: 'Revision' , colTitle: 'Revision' },
    { colHeader: 'transactionQuantity', colDef: 'Transaction Quantity' , colTitle: 'Transaction Quantity' },
    { colHeader: 'location', colDef: 'Location' , colTitle: 'Location' },
    { colHeader: 'wareHouse', colDef: 'Warehouse' , colTitle: 'Warehouse' },
    { colHeader: 'zone', colDef: 'Zone' , colTitle: 'Zone' },
    { colHeader: 'carousel', colDef: 'Carousel' , colTitle: this.fieldMappings?.carousel || this.placeholders.carouselFallback },
    { colHeader: 'row', colDef: 'Row' , colTitle: this.fieldMappings?.row || this.placeholders.rowFallback },
    { colHeader: 'shelf', colDef: 'Shelf' , colTitle: this.fieldMappings?.shelf || this.placeholders.shelfFallback  },
    { colHeader: 'bin', colDef: 'Bin' , colTitle: this.fieldMappings?.bin || this.placeholders.binFallback  },
    { colHeader: 'invMapID', colDef: 'Inv Map ID' , colTitle: 'Inv Map ID' },
    { colHeader: 'completedDate', colDef: 'Completed Date' , colTitle: 'Completed Date' },
    { colHeader: 'completedBy', colDef: 'Completed By' , colTitle: 'Completed By' },
    { colHeader: 'completedQuantity', colDef: 'Completed Quantity' , colTitle: 'Completed Quantity' },
    { colHeader: 'batchPickID', colDef: 'Batch Pick ID' , colTitle: 'Batch Pick ID' },
    { colHeader: 'notes', colDef: 'Notes' , colTitle: 'Notes' },
    { colHeader: 'exportFileName', colDef: 'Export File Name' , colTitle: 'Export File Name' },
    { colHeader: 'exportDate', colDef: 'Export Date' , colTitle: 'Export Date' },
    { colHeader: 'exportedBy', colDef: 'Exported By', colTitle: 'Exported By' },
    { colHeader: 'exportBatchID', colDef: 'Export Batch ID', colTitle: 'Export Batch ID' },
    { colHeader: 'tableType', colDef: 'Table Type', colTitle: 'Table Type' },
    { colHeader: 'statusCode', colDef: 'Status Code', colTitle: 'Status Code' },
    { colHeader: 'masterRecord', colDef: 'Master Record', colTitle: 'Master Record' },
    { colHeader: 'masterRecordID', colDef: 'Master Record ID', colTitle: 'Master Record ID' },
    { colHeader: 'label', colDef: 'Label', colTitle: 'Label' },
    { colHeader: 'inProcess', colDef: 'In Process', colTitle: 'In Process' },
    { colHeader: 'userField1', colDef: 'User Field1', colTitle: this.fieldMappings?.userField1 || this.placeholders.userField1Fallback },
    { colHeader: 'userField2', colDef: 'User Field2', colTitle: this.fieldMappings?.userField2 || this.placeholders.userField2Fallback  },
    { colHeader: 'userField3', colDef: 'User Field3', colTitle: this.fieldMappings?.userField3 || this.placeholders.userField3Fallback  },
    { colHeader: 'userField4', colDef: 'User Field4', colTitle: this.fieldMappings?.userField4 || this.placeholders.userField4Fallback  },
    { colHeader: 'userField5', colDef: 'User Field5', colTitle: this.fieldMappings?.userField5 || this.placeholders.userField5Fallback  },
    { colHeader: 'userField6', colDef: 'User Field6', colTitle: this.fieldMappings?.userField6 || this.placeholders.userField6Fallback  },
    { colHeader: 'userField7', colDef: 'User Field7', colTitle: this.fieldMappings?.userField7 || this.placeholders.userField7Fallback  },
    { colHeader: 'userField8', colDef: 'User Field8', colTitle: this.fieldMappings?.userField8 || this.placeholders.userField8Fallback  },
    { colHeader: 'userField9', colDef: 'User Field9', colTitle: this.fieldMappings?.userField9 || this.placeholders.userField9Fallback  },
    { colHeader: 'userField10', colDef: 'User Field10', colTitle: this.fieldMappings?.userField10 || this.placeholders.userField10Fallback  },
    { colHeader: 'toteID', colDef: 'Tote ID', colTitle: 'Tote ID' },
    { colHeader: 'toteNumber', colDef: 'Tote Number', colTitle: 'Tote Number' },
    { colHeader: 'cell', colDef: 'Cell', colTitle: 'Cell' },
    { colHeader: 'hostTransactionID', colDef: 'Host Transaction ID', colTitle: 'Host Transaction ID' },
    { colHeader: 'emergency', colDef: 'Emergency', colTitle: 'Emergency' },
    { colHeader: 'inductionBy', colDef: 'Induction By', colTitle: 'Induction By' },
    { colHeader: 'inductionLocation', colDef: 'Induction Location', colTitle: 'Induction Location' },
    { colHeader: 'inductionDate', colDef: 'Induction Date', colTitle: 'Induction Date' },
  ];

  @Output() back = new EventEmitter<string>();
  @Output() returnToOrder = new EventEmitter<string>();
  @Input() tabIndex:any;
  @Output() startDateChange: EventEmitter<MatDatepickerInputEvent<any>> = new EventEmitter();
  @Output() endDateChange: EventEmitter<MatDatepickerInputEvent<any>> = new EventEmitter();
  @Output() viewOrderChange: EventEmitter<MatDatepickerInputEvent<any>> = new EventEmitter();

  isActiveTrigger: boolean = false;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  floatLabelControlColumn = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  hideRequiredFormControl = new FormControl(false);
  searchByToteId = new Subject<string>();
  searchByColumn = new Subject<string>();
  searchByOrderNumber = new Subject<string>();
  searchBar = new Subject<string>();
  searchAutocompleteList: any;
  searchAutocompleteListByCol: any;
  isDeleteVisible: any = localStorage.getItem(RouteUpdateMenu.RouteFromInduction);

  /*for data col. */
  public columnValues: any = [];
  onDestroy$: Subject<boolean> = new Subject();
  public userData: any;
  public displayedColumns: any;
  public dataSource: any = new MatTableDataSource();
  public payload: any;
  public sortCol: any = 0;
  public sortOrder: any = UniqueConstants.Asc;
  selectedVariable;
  public filterLoc: any = 'Nothing';
  public itemList: any;
  transTypeSelect = StringConditions.AllTransactions;
  transStatusSelect = StringConditions.AllTransactions;
  rowClicked;
  hideDelete;
  hideReset;
  directAdmin;
  throughOrderManager;
  setVal;
  spliUrl;
  orderSelectionSearch : boolean = true
  public detailDataInventoryMap: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('viewAllLocation') customTemplate: TemplateRef<any>;

  pageEvent: PageEvent;
  private subscription: Subscription = new Subscription();

  cols = [];
  customPagination: any = {
    total: '',
    recordsPerPage: 20,
    startIndex: '',
    endIndex: '',
  };
  columnSearch: any = {
    searchColumn: {
      colHeader: '',
      colDef: '',
    },
    searchValue: '',
  };

  sortColumn: any = {
    columnName: 32,
    sortOrder: UniqueConstants.Asc,
  };
  /* End */
  statusType: string = StringConditions.AllTransactions;
  orderNumber: string = '';
  toteId: string = '';
  sDate: Date = new Date();
  eDate: Date = new Date();

  public transType: any = [
    {
      type: StringConditions.AllTransactions,
      value: StringConditions.AllTransactions,
    },
    {
      type: 'Adjustment',
      value: 'Adjustment',
    },
    {
      type: 'Complete',
      value: 'Complete',
    },
    {
      type: 'Count',
      value: 'Count',
    },
    {
      type: 'Location Change',
      value: 'Location Change',
    },

    {
      type: 'Pick',
      value: 'Pick',
    },

    {
      type: TransactionType.PutAway,
      value: TransactionType.PutAway,
    },

    {
      type: 'Shipping',
      value: 'Shipping',
    },
    {
      type: 'Shipping Complete',
      value: 'Shipping Complete',
    },
  ];
  public transStatus: any = [
    {
      type: StringConditions.AllTransactions,
      value: StringConditions.AllTransactions,
    },
    {
      type: 'Open Transactions',
      value: 'Open Transactions',
    },
    {
      type: 'Completed Transactions',
      value: 'Completed Transactions',
    },
  ];

  clickTimeout: ReturnType<typeof setTimeout>;

  public iAdminApiService: IAdminApiService;

  constructor(
    private router: Router,
    public adminApiService: AdminApiService,
    private printApiService: PrintApiService,
    public datepipe:DatePipe,
    public authService: AuthService,
    private global: GlobalService,
    private contextMenuService: TableContextMenuService,
    private sharedService: SharedService,
    private currentTabDataService: CurrentTabDataService,
    private filterService:ContextMenuFiltersService
  ) {
    this.filterService.filterString= "";
    this.iAdminApiService = adminApiService;
    if (this.router.getCurrentNavigation()?.extras?.state?.[UniqueConstants.searchValue]) {
      this.columnSearch.searchValue = this.router.getCurrentNavigation()?.extras?.state?.[UniqueConstants.searchValue];
      this.columnSearch.searchColumn = {
        colDef: this.router.getCurrentNavigation()?.extras?.state?.['colDef'],
        colHeader: this.router.getCurrentNavigation()?.extras?.state?.['colHeader'],
      };
    }
  }

  filterVals: any = {
    transactions: '',
  };

  ngOnInit(): void {
    this.setVal = localStorage.getItem('routeFromOrderStatus');

    if(this.router.url == AppRoutes.OrderManagerOrderStatus || this.setVal == StringConditions.True){
      this.throughOrderManager = true;
      this.directAdmin = false;
    }
    else if(this.router.url == AppRoutes.AdminTransaction || this.setVal != StringConditions.True){
      this.throughOrderManager = false;
      this.directAdmin = true;
    }

    this.hideDelete=JSON.parse(this.isDeleteVisible);

    this.customPagination = {
      total: '',
      recordsPerPage: 20,
      startIndex: 0,
      endIndex: 10,
    };

    // Search by Tote Id Debounce values
    this.searchByToteId.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      this.toteId = value;
      this.getContentData();
    });

    // Search by Order Number Debounce values
    this.searchByOrderNumber.pipe(debounceTime(600), distinctUntilChanged()).subscribe((value) => {
      this.autoCompleteSearchColumn(true);
      this.getContentData();
    });

    this.searchByColumn.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      this.autoCompleteSearchColumn(false);
      this.filterString = "1=1"
      this.getContentData();
    });

    this.userData = this.authService.userData();
    this.getColumnsData(true);
  }

  viewOrderInOrder(row) {
    this.returnToOrder.emit();

    if( this.spliUrl[1] == AppNames.OrderManager) {
      this.router.navigate([]).then((result) => window.open(`/#${AppRoutes.OrderManagerOrderStatus}?orderStatus=${row.orderNumber}`, UniqueConstants._self));
    }
    else {
      localStorage.setItem(RouteUpdateMenu.RouteFromInduction,'false');
      this.router.navigate([]).then((result) => window.open(`${AppRoutes.AdminTransaction}?orderStatus=${row.orderNumber}`, UniqueConstants._self));
    }
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  getFloatFormabelValue(): FloatLabelType {
    return this.floatLabelControlColumn.value ?? 'auto';
  }

  changeTableRowColor(idx: any) {
    if (this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  retunrToPrev() {
    this.back.emit('back');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.subscription.add(
      this.sharedService.itemObserver.subscribe(itemNo => {
        if(itemNo) {
          this.columnSearch.searchColumn.colDef = Column.ItemNumber;
          this.columnSearch.searchValue = itemNo;
          this.filterString = this.filterService.onContextMenuCommand(this.columnSearch.searchValue, this.columnSearch.searchColumn.colDef , "equals to", "string");
        }
      })
    );
    this.spliUrl = this.router.url.split('/');
  }

  /*FUnctions for Table*/
  isAuthorized(controlName: any) {
    return !this.authService.isAuthorized(controlName);
  }

  searchData() {
    if (this.columnSearch.searchColumn || this.columnSearch.searchColumn == '') this.getContentData();
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.customPagination.startIndex = e.pageSize * e.pageIndex;
    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;
    this.getContentData();
  }

  async autoCompleteSearchColumn(isSearchByOrder: boolean = false) {
    let searchPayload;
    if (isSearchByOrder) {
      searchPayload = {
        query: this.orderNumber,
        tableName: 2,
        column: 'orderNumber',
      };
    } else {
      searchPayload = {
        query: this.columnSearch.searchValue,
        tableName: 2,
        column: this.columnSearch.searchColumn.colDef,
      };
    }

    this.iAdminApiService.NextSuggestedTransactions(searchPayload).subscribe({
      next: (res: any) => {
        if (res.data)
          if (isSearchByOrder) this.searchAutocompleteList = res.data;
          else this.searchAutocompleteListByCol = res.data;
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("NextSuggestedTransactions",res.responseMessage);
        }
      },
      error: (error) => {}
    });
  }

  viewInInventoryMaster(row) {
    clearTimeout(this.clickTimeout); 
    localStorage.setItem("prevTab","/admin/transaction");
    if(this.spliUrl[1] == AppNames.OrderManager) this.router.navigate([]).then(() => window.open(`/#/OrderManager/InventoryMaster?itemNumber=${row.itemNumber}`, UniqueConstants._self));
    else if(this.spliUrl[1] == AppNames.InductionManager) window.open(`/#${AppRoutes.InductionManagerAdminInvMap}?itemNumber=${row.itemNumber}`, UniqueConstants._self);
    else {
      localStorage.setItem(RouteUpdateMenu.RouteFromInduction,'false')
      this.router.navigate([]).then(() => { window.open(`/#${AppRoutes.AdminInventoryMaster}?itemNumber=${row.itemNumber}`, UniqueConstants._self); });
    }
  }

  sendComp() {
    this.global.OpenDialog(FunctionAllocationComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        target: 'assigned',
        function: '',
      },
    });
  }

  adjustQuantity(event) {
    const dialogRef : any = this.global.OpenDialog(AdjustQuantityComponent, {
      height: DialogConstants.auto,
      width: '800px',
      data: { id: event.invMapID },
    });

    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(() => this.getContentData());
  }

  deleteItem(event) {
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationTransactionComponent, {
      height: 'auto',
      width: Style.w600px,
      data: {
        mode: Mode.DeleteTransaction,
        id: event.id,
        orderNo: event.orderNumber,
        transType: event.transactionType,
      },
    });

    dialogRef.afterClosed().subscribe((res) => { if (res == StringConditions.Yes) this.getContentData(); });
  }

  resetToTodaysDate() {
    this.eDate = new Date();
    this.sDate = new Date();
    this.columnSearch.searchColumn.colDef = '';
    this.columnSearch.searchValue = '';
    this.orderNumber = '';
    this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS] = undefined;
    this.getContentData();
  }

  getColumnsData(isInit : boolean = false) {
    let payload = { tableName: TableName.OpenTransactions };
    this.iAdminApiService.GetColumnSequence(payload).subscribe({
      next: (res: any) => {
        this.displayedColumns = this.TRNSC_DATA;
        if (res.data) {
          this.columnValues = res.data;
          this.columnValues.push(ColumnDef.Actions);
          this.getContentData(isInit);
        } else {
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("GetColumnSequence",res.responseMessage);
        }
      },
      error: (error) => {}
    });
  }

  sortChange(event) {
    if (!this.dataSource._data._value || event.direction == '' || event.direction == this.sortOrder) return;
    let index;
    this.columnValues.find((x, i) => { if(x === event.active) index = i; });
    this.sortCol = index;
    this.sortOrder = event.direction;
    this.resetPagination();
    this.getContentData();
  }

  getContentData(isInit: boolean = false) {
    this.payload = {
      draw: 0,
      sDate: this.datepipe.transform(this.sDate, 'MM/dd/yyyy'),
      eDate: this.datepipe.transform(this.eDate, 'MM/dd/yyyy'),
      transType: this.transTypeSelect == 'All Transactions' ? '' : this.transTypeSelect,
      transStatus: this.transStatusSelect,
      searchString: this.columnSearch.searchValue,
      searchColumn: this.columnSearch.searchColumn.colDef,
      start: this.customPagination.startIndex,
      length: this.customPagination.recordsPerPage,
      orderNumber: this.orderNumber,
      toteID: this.toteId,
      sortColumnNumber: this.sortCol,
      sortOrder: this.sortOrder,
      filter: this.filterString,
    };
    this.iAdminApiService.OpenTransactionTable(this.payload).subscribe({
      next: (res: any) => {
        this.detailDataInventoryMap = res.data?.transactions;
        this.dataSource = new MatTableDataSource(res.data?.transactions);
        this.customPagination.total = res.data?.recordsFiltered;
        this.dataSource.sort = this.sort;
        if (isInit && this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS]){
          this.applySavedItem();
          this.orderSelectionSearch = false;
        }
        else this.recordSavedItem();
      },
      error: (error) => {}
    });
  }

  applySavedItem() {
    if (this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS]) {
      let item = this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS];
      this.detailDataInventoryMap = item.detailDataInventoryMap;
      this.dataSource = item.dataSource;
      this.customPagination.total = item.customPaginationTotal;
      this.dataSource.sort = item.dataSourceSort;
      this.sDate = item.sdate;
      this.eDate = item.edate;
      this.statusType = item.statusType;
      this.orderNumber = item.orderNumber;
      this.toteId = item.toteId;
      this.transTypeSelect = item.transTypeSelect;
      this.columnSearch = item.columnSearch
    }
  }

  recordSavedItem() {
    this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS] = {
      detailDataInventoryMap: this.detailDataInventoryMap,
      dataSource: this.dataSource,
      customPaginationTotal: this.customPagination.total,
      dataSourceSort: this.dataSource.sort,
      sdate: this.sDate,
      edate: this.eDate,
      statusType: this.statusType,
      orderNumber: this.orderNumber,
      toteId: this.toteId,
      transTypeSelect: this.transTypeSelect,
      columnSearch: this.columnSearch
    };
  }

  getTransactionModelIndex() {
    let paylaod = {
      viewToShow: 2,
      location: '',
      itemNumber: '',
      holds: false,
      orderStatusOrder: '',
      app: RouteNames.Admin,
    };
    this.iAdminApiService.TransactionModelIndex(paylaod).subscribe({
      next: (res: any) => {
        if(res.isExecuted && res.data){
          this.columnValues = res.data?.openTransactionColumns;
          this.columnValues.push(ColumnDef.Actions);
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("TransactionModelIndex",res.responseMessage);
        }
      },
      error: (error) => {}
    });
  }
  /*End of table functions */

  actionDialog(opened: boolean) {
    if (!opened && this.selectedVariable && this.selectedVariable === 'set_column_sq') {
      let dialogRef:any = this.global.OpenDialog(ColumnSequenceDialogComponent, {
        height: DialogConstants.auto,
        width: '960',
        disableClose: true,
        data: {
          mode: event,
          tableName: TableName.OpenTransactions,
        },
      });

      dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe((result) => {
        this.selectedVariable='';
        if (result?.isExecuted) this.getColumnsData();
      });
    }
  }

  resetFields(event?) {
    this.columnSearch.searchValue = '';
    this.searchAutocompleteListByCol = [];
    this.orderSelectionSearch = false
    this.searchByColumn.next(event);
  }

  resetColumn() {
    this.columnSearch.searchColumn.colDef = '';
  }

onImportDateChange(event: Date | null): void {
  // Reset filters and data columns
  this.resetColumn();
  this.resetFields();

  // Notify any listeners about the start date change
  this.startDateChange.emit();

  // Update the start date value with the selected or default date
  this.setDateOnBlank(event, DateType.Start);

  // Refresh content data based on the new date
  this.getContentData();

}

onEndDateChange(event: Date | null): void {
  // Reset filters and data columns
  this.resetColumn();
  this.resetFields();

  // Notify any listeners about the end date change
  this.endDateChange.emit();

  // Update the end date value with the selected or default date
  this.setDateOnBlank(event, DateType.End);

  // Refresh content data based on the new date
  this.getContentData();
}

/**
 * Sets the appropriate date property (sDate or eDate) to either the given date
 * or the current date if the input is null.
 */
setDateOnBlank(event: Date | null, dateType: DateType): void {
  const date = event ? new Date(event) : new Date();

  if (dateType === DateType.Start) {
    this.sDate = date;
  } else if (dateType === DateType.End) {
    this.eDate = date;
  }
}


  selectStatus(event) {
    this.resetColumn();
    this.resetFields();
    this.transStatusSelect = event;
    this.getContentData();
  }

  selectTransType(value) {
    this.resetColumn();
    this.resetFields();
    this.transTypeSelect = value;
    this.getContentData();
  }

  sendCompletedToHistory() {
    const dialogRef : any = this.global.OpenDialog(SendTranHistoryComponent, {
      height: DialogConstants.auto,
      width: '580px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        user: this.userData.userName,
        wsid: this.userData.wsid,
      },
    });

    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(() => this.getContentData());
  }

  ngOnDestroy() {
    this.searchByToteId.unsubscribe();
    this.searchByOrderNumber.unsubscribe();
    this.searchByColumn.unsubscribe();
    this.subscription.unsubscribe();
  }

  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault()
    this.isActiveTrigger = true;
    setTimeout(() => this.contextMenuService.updateContextMenuState(event, SelectedItem, FilterColumnName, FilterConditon, FilterItemType), 100);
  }

  filterString : string = UniqueConstants.OneEqualsOne;

  optionSelected(filter : string) {
    this.filterString = filter;
    this.resetPagination();
    this.getContentData();
    this.isActiveTrigger = false;
  }

  resetPagination(){
    this.customPagination.startIndex = 0;
    this.customPagination.endIndex = 20;
    this.paginator.pageIndex = 0;
  }

  clearFilter(fieldName:string){
    if(fieldName == 'toteId')
    {
      this.toteId='';
    }
    else if (fieldName == 'orderNumber'){
      this.orderNumber='';
    }
    this.getContentData();
  }
  clear() {
    this.columnSearch.searchValue = '';
    this.getContentData();
  }

  printCycleCountReport() {
    var searchString = this.columnSearch.searchValue;
    var searchColumn = this.columnSearch.searchColumn.colDef;
    var filter = this.filterString;

    this.printApiService.ProcessCycleCountPrint(searchString, searchColumn, filter);
    
    //this.global.Print(`FileName:printCycleCountReport`)
  }

  previewFiftyPagesOnly(){
    window.open(`${AppRoutes.ReportView}?file=CycleCount-lst-prv`, UniqueConstants._blank, 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
  }

  selectRow(row: any) {
    this.clickTimeout = setTimeout(() => {
      this.dataSource.filteredData.forEach(element => { if(row != element) element.selected = false; });
      const selectedRow = this.dataSource.filteredData.find((x: any) => x === row);
      if(selectedRow) selectedRow.selected = !selectedRow.selected;
    }, 250); 
  }

}
