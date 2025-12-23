import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, takeUntil, Subscription } from 'rxjs';
import { AuthService } from 'src/app/common/init/auth.service';
import { FloatLabelType } from '@angular/material/form-field';
import { ColumnSequenceDialogComponent } from 'src/app/admin/dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { SharedService } from 'src/app/common/services/shared.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ContextMenuFiltersService } from 'src/app/common/init/context-menu-filters.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { Column, ColumnDef, DialogConstants, localStorageKeys, Placeholders, StringConditions, TableName, ToasterMessages, ToasterTitle, ToasterType, UniqueConstants } from 'src/app/common/constants/strings.constants';
import { AppRoutes, RouteNames } from 'src/app/common/constants/menu.constants';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';
import {TransactionConstants} from 'src/app/common/constants/admin/transaction-constants';

@Component({
  selector: 'app-transaction-history-list',
  templateUrl: './transaction-history-list.component.html',
  styleUrls: ['./transaction-history-list.component.scss'],
})
export class TransactionHistoryListComponent implements OnInit, AfterViewInit {

  placeholders = Placeholders;
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');

  TRNSC_DATA = [
    { colHeader: 'tH_ID', colDef: 'TH_ID', colTitle: 'TH_ID' },
    { colHeader: 'id', colDef: 'ID', colTitle: 'ID' },
    { colHeader: 'importDate', colDef: 'Import Date', colTitle: 'Import Date' },
    { colHeader: 'importBy', colDef: 'Import By', colTitle: 'Import By' },
    { colHeader: 'importFileName', colDef: 'Import Filename', colTitle: 'Import Filename' },
    { colHeader: 'transactionType', colDef: 'Transaction Type', colTitle: 'Transaction Type' },
    { colHeader: 'orderNumber', colDef: 'Order Number', colTitle: 'Order Number' },
    { colHeader: 'priority', colDef: 'Priority', colTitle: 'Priority' },
    { colHeader: 'itemNumber', colDef: 'Item Number', colTitle: this.fieldMappings.itemNumber || Placeholders.itemNumberFallback },
    { colHeader: 'revision', colDef: 'Revision', colTitle: 'Revision' },
    { colHeader: 'lotNumber', colDef: 'Lot Number', colTitle: 'Lot Number' },
    { colHeader: 'expirationDate', colDef: 'Expiration Date', colTitle: 'Expiration Date' },
    { colHeader: 'serialNumber', colDef: 'Serial Number', colTitle: 'Serial Number' },
    { colHeader: 'description', colDef: 'Description', colTitle: 'Description' },
    { colHeader: 'transactionQuantity', colDef: 'Transaction Quantity', colTitle: 'Transaction Quantity' },
    { colHeader: 'location', colDef: 'Location', colTitle: 'Location' },
    { colHeader: 'wareHouse', colDef: 'Warehouse', colTitle: 'Warehouse' },
    { colHeader: 'zone', colDef: 'Zone', colTitle: 'Zone' },
    { colHeader: 'carousel', colDef: 'Carousel', colTitle: this.fieldMappings?.carousel || this.placeholders.carouselFallback },
    { colHeader: 'row', colDef: 'Row', colTitle: this.fieldMappings?.row || this.placeholders.rowFallback },
    { colHeader: 'shelf', colDef: 'Shelf', colTitle: this.fieldMappings?.shelf || this.placeholders.shelfFallback  },
    { colHeader: 'bin', colDef: 'Bin', colTitle: this.fieldMappings?.bin || this.placeholders.binFallback  },
    { colHeader: 'completedDate', colDef: 'Completed Date', colTitle: 'Completed Date' },
    { colHeader: 'completedBy', colDef: 'Completed By', colTitle: 'Completed By' },
    { colHeader: 'completedQuantity', colDef: 'Completed Quantity', colTitle: 'Completed Quantity' },
    { colHeader: 'batchPickID', colDef: 'Batch Pick ID', colTitle: 'Batch Pick ID' },
    { colHeader: 'notes', colDef: 'Notes', colTitle: 'Notes' },
    { colHeader: 'exportFileName', colDef: 'Export File Name', colTitle: 'Export File Name' },
    { colHeader: 'exportDate', colDef: 'Export Date', colTitle: 'Export Date' },
    { colHeader: 'exportedBy', colDef: 'Exported By', colTitle: 'Exported By' },
    { colHeader: 'exportBatchID', colDef: 'Export Batch ID', colTitle: 'Export Batch ID' },
    { colHeader: 'lineNumber', colDef: 'Line Number', colTitle: 'Line Number' },
    { colHeader: 'lineSequence', colDef: 'Line Sequence', colTitle: 'Line Sequence' },
    { colHeader: 'tableType', colDef: 'Table Type', colTitle: 'Table Type' },
    { colHeader: 'userField1', colDef: 'User Field1', colTitle: this.fieldMappings.userField1 || Placeholders.userField1Fallback },
    { colHeader: 'userField2', colDef: 'User Field2', colTitle: this.fieldMappings.userField2 || Placeholders.userField2Fallback },
    { colHeader: 'userField3', colDef: 'User Field3', colTitle: this.fieldMappings.userField3 || Placeholders.userField3Fallback },
    { colHeader: 'userField4', colDef: 'User Field4', colTitle: this.fieldMappings.userField4 || Placeholders.userField4Fallback },
    { colHeader: 'userField5', colDef: 'User Field5', colTitle: this.fieldMappings.userField5 || Placeholders.userField5Fallback },
    { colHeader: 'userField6', colDef: 'User Field6', colTitle: this.fieldMappings.userField6 || Placeholders.userField6Fallback },
    { colHeader: 'useField7', colDef: 'User Field7', colTitle: this.fieldMappings.userField7 || Placeholders.userField7Fallback },
    { colHeader: 'userField8', colDef: 'User Field8', colTitle: this.fieldMappings.userField8 || Placeholders.userField8Fallback } ,
    { colHeader: 'userField9', colDef: 'User Field9', colTitle: this.fieldMappings.userField9 || Placeholders.userField9Fallback },
    { colHeader: 'userField10', colDef: 'User Field10', colTitle: this.fieldMappings.userField10 || Placeholders.userField10Fallback },
    { colHeader: 'unitOfMeasure', colDef: 'Unit of Measure', colTitle: this.fieldMappings.unitOfMeasure || Placeholders.unitOfMeasureFallback },
    { colHeader: 'requiredDate', colDef: 'Required Date', colTitle: 'Required Date' },
    { colHeader: 'statusCode', colDef: 'Status Code', colTitle: 'Status Code' },
    { colHeader: 'masterRecord', colDef: 'Master Record', colTitle: 'Master Record' },
    { colHeader: 'masterRecordID', colDef: 'Master Record ID', colTitle: 'Master Record ID' },
    { colHeader: 'invMapID', colDef: 'Inv Map ID', colTitle: 'Inv Map ID' },
    { colHeader: 'label', colDef: 'Label', colTitle: 'Label' },
    { colHeader: 'inProcess', colDef: 'In Process', colTitle: 'In Process' },
    { colHeader: 'toteID', colDef: 'Tote ID', colTitle: 'Tote ID' },
    { colHeader: 'toteNumber', colDef: 'Tote Number', colTitle: 'Tote Number' },
    { colHeader: 'cell', colDef: 'Cell', colTitle: 'Cell' },
    { colHeader: 'hostTransactionID', colDef: 'Host Transaction ID', colTitle: 'Host Transaction ID' },
    { colHeader: 'emergency', colDef: 'Emergency', colTitle: 'Emergency' },
    { colHeader: 'inductionBy', colDef: 'Induction By', colTitle: 'Induction By' },
    { colHeader: 'inductionLocation', colDef: 'Induction Location', colTitle: 'Induction Location' },
    { colHeader: 'inductionDate', colDef: 'Induction Date', colTitle: 'Induction Date' },
];


  @ViewChild('matRef') matRef: MatSelect;
  isActiveTrigger:boolean =false;
  public columnValues: any = [];
  public userData: any;
  public displayedColumns: any;
  public dataSource: any = new MatTableDataSource();
  @Input() tabIndex:any;
  public detailDataTransHistory: any;
  public startDate: Date = new Date(TransactionConstants.defaultStartDate);
  public endDate: any = new Date();
  public orderNo: any;
  public payload: any;
  public sortCol: any = 0;
  public sortOrder: any = UniqueConstants.Desc;
  selectedVariable: any;
  selectedDropdown = '';
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  searchBar = new Subject<string>();
  searchAutocompleteList: any;
  onDestroy$: Subject<boolean> = new Subject();
  private subscription: Subscription = new Subscription();
  
  // Race condition prevention mechanism
  private readonly cancelOtherCalls$ = new Subject<boolean>();
  private isItemNumberActive: boolean = false;
  private pendingApiCalls: Array<{ timestamp: number }> = [];
  private isWaitingForItemNumber: boolean = false;
  private hasCheckedUrl: boolean = false;

   //Checks if getContentData should be blocked due to race condition prevention
   //@returns true if the call should be blocked, false if it should proceed
  
  private shouldBlockGetContentData(): boolean {
    return this.isItemNumberActive || this.isWaitingForItemNumber;
  }

  /**
   * Resets race condition prevention flags and clears item number filter
   * Should be called whenever filters are cleared to allow all data to load
   */
  resetItemNumberFilter(): void {
    this.isItemNumberActive = false;
    this.isWaitingForItemNumber = false;
    this.cancelOtherCalls$.next(false);
  }

  /**
   * Handles clearing of search input field and resets all related filters
   * Called when user clicks the clear button (X) in the search textbox
   */
  onClearSearchInput(): void {
    this.selectedDropdown = '';
    this.columnSearch.searchValue = '';
    this.filterString = TransactionConstants.SHOW_ALL_FILTER;
    this.resetItemNumberFilter();
    this.getContentData();
  }

  @Input() set startDateEvent(inputStartDate: Date) {
    if (inputStartDate) {
      this.startDate = inputStartDate;
    } else {
      this.startDate = new Date(TransactionConstants.defaultStartDate);
    }
    
    // Don't call getContentData if item number filter is active or waiting for item number
    if (!this.shouldBlockGetContentData()) {
      this.getContentData();
    }
  }
    

  @Input() set endDateEvent(event: Event) {
    if (event) {
      this.endDate = event;
    }else{
       this.endDate = new Date();
    }
    
    // Don't call getContentData if item number filter is active or waiting for item number
    if (!this.shouldBlockGetContentData()) {
      this.getContentData();
    }
    }
  
  @Input() set resetEvent(event: any) {
    if (event) {
      this.startDate = event.endDate;
      this.endDate = event.startDate;
      
      // Don't call getContentData if item number filter is active or waiting for item number
      if (!this.isItemNumberActive && !this.isWaitingForItemNumber) {
        this.getContentData();
      }
    }
  }
  @Input() set orderNoEvent(event: Event) {
      this.orderNo = event;
      
      // Don't call getContentData if item number filter is active or waiting for item number
      if (!this.isItemNumberActive && !this.isWaitingForItemNumber) {
        this.getContentData();
      }
  }

  @Input()
  set clearEvent(event: Event) {
    if (event) {
      this.selectedDropdown = '';
      this.columnSearch.searchValue = '';
      this.isItemNumberActive = false;
      this.cancelOtherCalls$.next(false);
      this.filterString = TransactionConstants.SHOW_ALL_FILTER; // Reset filter to show all data
      this.getContentData(); // Refresh data after clearing
    }
  }

  @Input() set cleanFilter(event: Event) {
  if (event) {
    this.startDate = new Date(TransactionConstants.defaultStartDate);
    this.endDate = new Date();
    this.orderNo = '';
    this.isItemNumberActive = false;
    this.cancelOtherCalls$.next(false);
    this.getContentData(); // Refresh data after resetting filters
  }
}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pageEvent: PageEvent;

  cols = [];
  customPagination: any = {
    total: '',
    recordsPerPage: 20,
    startIndex: 0,
    endIndex: 20,
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

  public iAdminApiService: IAdminApiService;

  constructor(
    private authService: AuthService,
    public datepipe: DatePipe,
    private contextMenuService: TableContextMenuService,
    public adminApiService: AdminApiService,
    private global: GlobalService,
    private sharedService: SharedService,
    private filterService: ContextMenuFiltersService, 
    private router: Router,
    private currentTabDataService: CurrentTabDataService
  ) {
    this.filterService.filterString= "";
    this.userData = this.authService.userData();
    this.iAdminApiService = adminApiService;
    
    // Set waiting flag immediately in constructor to catch early calls
    this.isWaitingForItemNumber = true;
  }

  ngOnInit(): void {
    // Set waiting flag to queue early calls
    this.isWaitingForItemNumber = true;
    
    // Check for item number in URL FIRST
    this.checkForItemNumberInUrl();
    
    if (this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_History]) {
      let param = this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_History];
      this.selectedDropdown = param.searchCol;
      this.columnSearch.searchValue = param.searchString;
    }
    else{
      this.selectedDropdown = ''
      this.columnSearch.searchValue = ''
    }
    this.customPagination = {
      total: '',
      recordsPerPage: 20,
      startIndex: 0,
      endIndex: 20,
    };
    this.searchBar.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.autoCompleteSearchColumn();
      this.filterString = TransactionConstants.SHOW_ALL_FILTER
      
      // Don't call getContentData if item number filter is active or waiting for item number
      if (!this.shouldBlockGetContentData()) {
        this.getContentData();
      }
    });
    
    this.getColumnsData();
  }

  /**
   * Checks URL for item number parameter and sets up filtering if found
   * Prevents race conditions by blocking other API calls until URL is processed
   */
  private checkForItemNumberInUrl(): void {
    this.hasCheckedUrl = true;
    
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const itemNumber = urlParams.get('itemNumber');
    const type = urlParams.get('type');
    
    if (itemNumber && type === TransactionConstants.TRANSACTION_HISTORY_TYPE) {
      this.setupItemNumberFilter(itemNumber.trim());
    } else {
      this.isWaitingForItemNumber = false;
    }
  }

  //Sets up item number filter and activates cancellation mechanism
  //@param itemNumber - The item number to filter by
  
  private setupItemNumberFilter(itemNumber: string): void {
    this.isItemNumberActive = true;
    this.cancelOtherCalls$.next(true);
    
    this.selectedDropdown = Column.ItemNumber;
    this.columnSearch.searchValue = itemNumber;
    this.filterString = TransactionConstants.ITEM_NUMBER_FILTER_TEMPLATE.replace('{0}', itemNumber);
    
    this.isWaitingForItemNumber = false;
    this.pendingApiCalls = [];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
    // If item number is active from URL, make the API call now
    if (this.isItemNumberActive) {
      this._executeGetContentData();
    }
    
    this.subscription.add(
      this.sharedService.historyItemObserver.subscribe(itemNo => {
        if(itemNo) {
          // Activate cancellation for other calls
          this.isItemNumberActive = true;
          this.cancelOtherCalls$.next(true);
          
          this.selectedDropdown = Column.ItemNumber;
          this.columnSearch.searchValue = itemNo;
          
          // Create a simple, direct filter string
          this.filterString = TransactionConstants.ITEM_NUMBER_FILTER_TEMPLATE.replace('{0}', itemNo);
          
          // Use direct method to bypass cancellation
          this._executeGetContentData();
        }
      })
    );

    this.subscription.add(
      this.sharedService.reprocessItemObserver.subscribe(itemNo => {
        if(itemNo){
          this.selectedDropdown = Column.ItemNumber;
          this.columnSearch.searchValue = itemNo;
          this.filterString = TransactionConstants.ITEM_NUMBER_FILTER_TEMPLATE.replace('{0}', itemNo);
          this.getContentData();
        }
      })
    );

    this.subscription.add(
      this.sharedService.historyLocObserver.subscribe(loc => {
        if(loc){
          this.selectedDropdown = Column.Location;
          this.columnSearch.searchValue = loc;
          this.filterString = `[Location] = '${loc}'`;
          this.getContentData();
        }
      })
    );

    this.spliUrl = this.router.url.split('/');
  }

  ngOnDestroy(): void {
    this.searchBar.unsubscribe();
    this.subscription.unsubscribe();
    this.cancelOtherCalls$.complete();
  }

  clearMatSelectList(): void {
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }

  actionDialog(opened: boolean): void {
    if (!opened && this.selectedVariable === StringConditions.set_column_sq) {
      this.sortCol = 0;

      const dialogRef : any = this.global.OpenDialog(ColumnSequenceDialogComponent, {
        height: DialogConstants.auto,
        width: '960px',
        disableClose: true,
        data: {
          mode: event,
          tableName: TableName.TransactionHistory,
        },
      });

      dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe((result) => {
        this.clearMatSelectList();
        this.selectedDropdown = '';
        if (result?.isExecuted) this.getColumnsData();
      });
    }
  }

  async autoCompleteSearchColumn() {
    let searchPayload = {
      query: this.columnSearch.searchValue,
      tableName: 3,
      column: this.selectedDropdown,
    };
    this.iAdminApiService.NextSuggestedTransactions(searchPayload).subscribe({
      next: (res: any) => {
        if(res.isExecuted && res.data) this.searchAutocompleteList = res.data;
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("NextSuggestedTransactions",res.responseMessage);
        }
      }
    });
  }

  getColumnsData() {
    let payload = { tableName: TableName.TransactionHistory };
    this.iAdminApiService.GetColumnSequence(payload).subscribe({
      next: (res: any) => {
        this.displayedColumns = this.TRNSC_DATA;
        if (res.data) {
          this.columnValues = res.data;
          this.columnValues.push(ColumnDef.Actions);
          
          // Use direct method if item number is active, otherwise use regular method
          if (this.isItemNumberActive) {
            this._executeGetContentData();
          } else {
            this.getContentData();
          }
        } else this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
      }
    });
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  getTransactionModelIndex() {
    let paylaod = {
      viewToShow: 2,
      location: '',
      itemNumber: '',
      holds: false,
      orderStatusOrder: '',
      app: RouteNames.Admin
    };
    this.iAdminApiService.TransactionModelIndex(paylaod).subscribe({
      next: (res: any) => {
        if(res.isExecuted && res.data) this.columnValues = res.data?.transactionHistoryColumns;
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("TransactionModelIndex",res.responseMessage);
        }
      }
    });
  }

  
   // Main data fetching method with race condition prevention
   // Blocks automatic calls until URL is checked, but allows user interactions (pagination, sorting)
   
  getContentData(): void {
    if (!this.hasCheckedUrl) {
      return; // Block all calls until URL is checked
    }
    
    if (this.isWaitingForItemNumber && !this.isItemNumberActive) {
      this.pendingApiCalls.push({ timestamp: Date.now() });
      return; // Queue calls while waiting for item number
    }
    
    // Allow all calls to proceed - user interactions (pagination, sorting) should work
    // even when item number filter is active
    this._executeGetContentData();
  }

  //Executes the actual API call with current filters
  //Bypasses race condition prevention for direct calls
  private _executeGetContentData(): void {
    const payload = {
      draw: 0,
      sDate: this.datepipe.transform(this.startDate, 'MM/dd/yyyy'),
      eDate: this.datepipe.transform(this.endDate, 'MM/dd/yyyy'),
      searchString: this.columnSearch.searchValue,
      searchColumn: this.selectedDropdown,
      start: this.customPagination.startIndex,
      length: this.customPagination.recordsPerPage,
      orderNumber: this.orderNo,
      sortColumnNumber: this.sortCol,
      sortOrder: this.sortOrder,
      filter: this.filterString
    };
 
    this.iAdminApiService.TransactionHistoryTable(payload).subscribe({
      next: (res: any) => {
        if(res.isExecuted && res.data) {
          this.detailDataTransHistory = res.data?.transactions;
          this.dataSource = new MatTableDataSource(res.data?.transactions);
          this.customPagination.total = res.data?.recordsFiltered;
        } else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("TransactionHistoryTable",res.responseMessage);
        }
      }
    });
  }

  searchData(): void {
    if (this.columnSearch.searchColumn || this.columnSearch.searchColumn == '') this.getContentData();
  }

  resetColumn(): void {
    this.columnSearch.searchColumn.colDef = '';
  }

  resetFields(): void {
    this.columnSearch.searchValue = '';
    this.searchAutocompleteList = [];
  }

  selectStatus(): void {
    this.resetColumn();
    this.resetFields();
    this.getContentData();
  }

  handlePageEvent(e: PageEvent): void {
    this.pageEvent = e;
    this.customPagination.startIndex = e.pageSize * e.pageIndex;
    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;
    this.getContentData();
  }

  sortChange(event) {
    this.resetPagination();

    if (!this.dataSource._data._value || event.direction == '') return;

    let index: number = 0; // Initialize with default value
    this.columnValues.find((x, i) => { 
      if (x === event.active) {
        index = i;
        return true; // Stop searching once found
      }
      return false;
    });
    this.sortCol = index;
    this.sortOrder = event.direction;
    this.getContentData();
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (Number(value) < 0) this.columnSearch.searchValue = 0;
  }

  @ViewChild('trigger') trigger: MatMenuTrigger;

  onContextMenuCommand(SelectedItem: any, FilterColumnName: any, Condition: any, Type: any) {
    this.filterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, StringConditions.clear, Type);
    if(FilterColumnName != "" || Condition == StringConditions.clear) {
      this.filterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, Condition, Type);
      this.filterString = this.filterString != "" ? this.filterString : "1=1";
      this.resetPagination();
      this.getContentData();
    }
  }

  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault();
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

  resetPagination(): void {
    this.customPagination.startIndex = 0;
    this.customPagination.endIndex = 20;
    this.paginator.pageIndex = 0;
  }

  clear(): void {
    this.columnSearch.searchValue = '';
    this.selectedDropdown = ''; // Reset selected dropdown
    this.filterString = TransactionConstants.SHOW_ALL_FILTER; // Reset filter to show all data
    this.resetItemNumberFilter(); // Reset race condition flags when clearing search
    this.getContentData();
  }

  spliUrl;

  viewInInventoryMaster(row) {
    localStorage.setItem(localStorageKeys.TransactionTabIndex, "2");
    this.router.navigate([]).then(() => { 
      window.open(`/#${AppRoutes.AdminInventoryMaster}?itemNumber=${row.itemNumber}`, UniqueConstants._self); 
    });
  }


  valueChanges(event:any){
    this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_History] = {
      ...this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_History],
      searchCol: event.searchCol,
      searchString: event.searchString
    };
  }
}
