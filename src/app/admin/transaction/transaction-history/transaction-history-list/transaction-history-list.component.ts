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
import { Column, ColumnDef, DialogConstants, localStorageKeys, StringConditions, TableName, ToasterMessages, ToasterTitle, ToasterType, UniqueConstants } from 'src/app/common/constants/strings.constants';
import { AppNames, AppRoutes, RouteNames, RouteUpdateMenu } from 'src/app/common/constants/menu.constants';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';

@Component({
  selector: 'app-transaction-history-list',
  templateUrl: './transaction-history-list.component.html',
  styleUrls: ['./transaction-history-list.component.scss'],
})
export class TransactionHistoryListComponent implements OnInit, AfterViewInit {
  TRNSC_DATA = [
    { colHeader: 'tH_ID', colDef: 'TH_ID' },
    { colHeader: 'id', colDef: 'ID' },
    { colHeader: 'importDate', colDef: 'Import Date' },
    { colHeader: 'importBy', colDef: 'Import By' },
    { colHeader: 'importFileName', colDef: 'Import Filename' },
    { colHeader: 'transactionType', colDef: 'Transaction Type' },
    { colHeader: 'orderNumber', colDef: 'Order Number' },
    { colHeader: 'priority', colDef: 'Priority' },
    { colHeader: 'itemNumber', colDef: 'Item Number' },
    { colHeader: 'revision', colDef: 'Revision' },
    { colHeader: 'lotNumber', colDef: 'Lot Number' },
    { colHeader: 'expirationDate', colDef: 'Expiration Date' },
    { colHeader: 'serialNumber', colDef: 'Serial Number' },
    { colHeader: 'description', colDef: 'Description' },
    { colHeader: 'transactionQuantity', colDef: 'Transaction Quantity' },
    { colHeader: 'location', colDef: 'Location' },
    { colHeader: 'wareHouse', colDef: 'Warehouse' },
    { colHeader: 'zone', colDef: 'Zone' },
    { colHeader: 'carousel', colDef: 'Carousel' },
    { colHeader: 'row', colDef: 'Row' },
    { colHeader: 'shelf', colDef: 'Shelf' },
    { colHeader: 'bin', colDef: 'Bin' },
    { colHeader: 'completedDate', colDef: 'Completed Date' },
    { colHeader: 'completedBy', colDef: 'Completed By' },
    { colHeader: 'completedQuantity', colDef: 'Completed Quantity' },
    { colHeader: 'batchPickID', colDef: 'Batch Pick ID' },
    { colHeader: 'notes', colDef: 'Notes' },
    { colHeader: 'exportFileName', colDef: 'Export File Name' },
    { colHeader: 'exportDate', colDef: 'Export Date' },
    { colHeader: 'exportedBy', colDef: 'Exported By' },
    { colHeader: 'exportBatchID', colDef: 'Export Batch ID' },
    { colHeader: 'lineNumber', colDef: 'Line Number' },
    { colHeader: 'lineSequence', colDef: 'Line Sequence' },
    { colHeader: 'tableType', colDef: 'Table Type' },
    { colHeader: 'userField1', colDef: 'User Field1' },
    { colHeader: 'userField2', colDef: 'User Field2' },
    { colHeader: 'userField3', colDef: 'User Field3' },
    { colHeader: 'userField4', colDef: 'User Field4' },
    { colHeader: 'userField5', colDef: 'User Field5' },
    { colHeader: 'userField6', colDef: 'User Field6' },
    { colHeader: 'useField7', colDef: 'User Field7' },
    { colHeader: 'userField8', colDef: 'User Field8' },
    { colHeader: 'userField9', colDef: 'User Field9' },
    { colHeader: 'userField10', colDef: 'User Field10' },
    { colHeader: 'unitOfMeasure', colDef: 'Unit of Measure' },
    { colHeader: 'requiredDate', colDef: 'Required Date' },
    { colHeader: 'statusCode', colDef: 'Status Code' },
    { colHeader: 'masterRecord', colDef: 'Master Record' },
    { colHeader: 'masterRecordID', colDef: 'Master Record ID' },
    { colHeader: 'invMapID', colDef: 'Inv Map ID' },
    { colHeader: 'label', colDef: 'Label' },
    { colHeader: 'inProcess', colDef: 'In Process' },
    { colHeader: 'toteID', colDef: 'Tote ID' },
    { colHeader: 'toteNumber', colDef: 'Tote Number' },
    { colHeader: 'cell', colDef: 'Cell' },
    { colHeader: 'hostTransactionID', colDef: 'Host Transaction ID' },
    { colHeader: 'emergency', colDef: 'Emergency' },
    { colHeader: 'inductionBy', colDef: 'Induction By' },
    { colHeader: 'inductionLocation', colDef: 'Induction Location' },
    { colHeader: 'inductionDate', colDef: 'Induction Date' },
  ];

  @ViewChild('matRef') matRef: MatSelect;
  isActiveTrigger:boolean =false;
  public columnValues: any = [];
  public userData: any;
  public displayedColumns: any;
  public dataSource: any = new MatTableDataSource();
  @Input() tabIndex:any;
  public detailDataTransHistory: any;
  public startDate: any = new Date(1973,10,7);
  public endDate: any = new Date();
  public orderNo: any;
  public payload: any;
  public sortCol: any = 0;
  public sortOrder: any = UniqueConstants.Asc;
  selectedVariable: any;
  selectedDropdown = '';
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  searchBar = new Subject<string>();
  searchAutocompleteList: any;
  onDestroy$: Subject<boolean> = new Subject();
  private subscription: Subscription = new Subscription();

  @Input() set startDateEvent(event: Event) {
    if (event) {
      this.startDate = event;
      this.getContentData();
    }
  }
  @Input() set endDateEvent(event: Event) {
    if (event) {
      this.endDate = event;
      this.getContentData();
    }
  }
  @Input() set resetEvent(event: any) {
    if (event) {
      this.startDate = event.endDate;
      this.endDate = event.startDate;
      this.getContentData();
    }
  }
  @Input() set orderNoEvent(event: Event) {
      this.orderNo = event;
      this.getContentData();
  }

  @Input()
  set clearEvent(event: Event) {
    if (event) {
      this.selectedDropdown = '';
      this.columnSearch.searchValue = '';
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
  }

  ngOnInit(): void {
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
      this.filterString = "1=1"
      this.getContentData();
    });
    this.getColumnsData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.subscription.add(
    this.sharedService.historyItemObserver.subscribe(itemNo => {
        if(itemNo) {
          this.selectedDropdown = Column.ItemNumber;
          this.columnSearch.searchValue = itemNo;
          this.filterString = this.filterService.onContextMenuCommand( this.columnSearch.searchValue, this.selectedDropdown, "equals to", "string");
        }
      })
    );

    this.subscription.add(
      this.sharedService.reprocessItemObserver.subscribe(itemNo => {
        if(itemNo){
          this.selectedDropdown = Column.ItemNumber;
          this.columnSearch.searchValue = itemNo;
          this.filterString = this.filterService.onContextMenuCommand( this.columnSearch.searchValue ,  this.selectedDropdown, "equals to", "string");
        }
      })
    );

    this.subscription.add(
      this.sharedService.historyLocObserver.subscribe(loc => {
        if(loc){
          this.selectedDropdown = Column.Location;
          this.columnSearch.searchValue = loc;
        }
      })
    );

    this.spliUrl = this.router.url.split('/');
  }

  ngOnDestroy() {
    this.searchBar.unsubscribe();
    this.subscription.unsubscribe();
  }

  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }

  actionDialog(opened: boolean) {
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
          this.getContentData();
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

  getContentData() {
    let payload = {
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
          this.dataSource.sort = this.sort;
        } else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("TransactionHistoryTable",res.responseMessage);
        }
      }
    });
  }

  searchData() {
    if (this.columnSearch.searchColumn || this.columnSearch.searchColumn == '') this.getContentData();
  }

  resetColumn() {
    this.columnSearch.searchColumn.colDef = '';
  }

  resetFields() {
    this.columnSearch.searchValue = '';
    this.searchAutocompleteList = [];
  }

  selectStatus() {
    this.resetColumn();
    this.resetFields();
    this.getContentData();
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.customPagination.startIndex = e.pageSize * e.pageIndex;
    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;
    this.getContentData();
  }

  sortChange(event) {
    if (!this.dataSource._data._value || event.direction == '' || event.direction == this.sortOrder) return;

    let index;
    this.columnValues.find((x, i) => { if (x === event.active) index = i; });
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

  resetPagination(){
    this.customPagination.startIndex = 0;
    this.customPagination.endIndex = 20;
    this.paginator.pageIndex = 0;
  }

  clear(){
    this.columnSearch.searchValue = ''
    this.getContentData()
  }

  spliUrl;

  viewInInventoryMaster(row) {
    localStorage.setItem(localStorageKeys.TransactionTabIndex,"2");
    this.router.navigate([]).then(() => { window.open(`/#${AppRoutes.AdminInventoryMaster}?itemNumber=${row.itemNumber}`, UniqueConstants._self); });
  }


  valueChanges(event:any){
    this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_History] = {
      ...this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_History],
      searchCol: event.searchCol,
      searchString: event.searchString
    };
  }
}
