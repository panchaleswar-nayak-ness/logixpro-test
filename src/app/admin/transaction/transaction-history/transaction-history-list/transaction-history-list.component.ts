import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, Subscription } from 'rxjs'; 
import { AuthService } from 'src/app/init/auth.service'; 
import { FloatLabelType } from '@angular/material/form-field';
import { ColumnSequenceDialogComponent } from 'src/app/admin/dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { SharedService } from 'src/app/services/shared.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ContextMenuFiltersService } from 'src/app/init/context-menu-filters.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

const TRNSC_DATA = [
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
  { colHeader: 'tH_ID', colDef: 'Inv Map ID' },
  { colHeader: 'label', colDef: 'Label' },
  { colHeader: 'inProcess', colDef: 'In Process' },
  { colHeader: 'toteID', colDef: 'Tote ID' },
  { colHeader: 'toteNumber', colDef: 'Tote Number' },
  { colHeader: 'cell', colDef: 'Cell' },
  { colHeader: 'hostTransactionID', colDef: 'Host Transaction ID' },
  { colHeader: 'emergency', colDef: 'Emergency' },
];
let today = new Date();
let year = today.getFullYear();
let month = today.getMonth();
let day = today.getDate();
let backDate = new Date(year - 50, month, day);
@Component({
  selector: 'app-transaction-history-list',
  templateUrl: './transaction-history-list.component.html',
  styleUrls: ['./transaction-history-list.component.scss'],
})
export class TransactionHistoryListComponent implements OnInit, AfterViewInit {
  @ViewChild('matRef') matRef: MatSelect;
  public columnValues: any = [];
  public userData: any;
  public displayedColumns: any;
  public dataSource: any = new MatTableDataSource();
  public detailDataTransHistory: any;
  public startDate: any = backDate.toISOString();
  public endDate: any = new Date().toISOString();
  public orderNo: any;
  public payload: any;
  public sortCol: any = 0;
  public sortOrder: any = 'asc';
  selectedVariable: any;
  selectedDropdown='';
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
      this.selectedDropdown='';
      this.columnSearch.searchValue = ''
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
    sortOrder: 'asc',
  };
  constructor(
    private router: Router, 
    private Api:ApiFuntions,
    private authService: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private sharedService:SharedService,
    private filterService: ContextMenuFiltersService
  ) {
    this.userData = this.authService.userData();
  }

  ngOnInit(): void {
    

    this.customPagination = {
      total: '',
      recordsPerPage: 20,
      startIndex: 0,
      endIndex: 20,
    };
    this.searchBar
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
 

        this.autocompleteSearchColumn();
          this.getContentData();
      });

    this.getColumnsData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.subscription.add(
    this.sharedService.historyItemObserver.subscribe(itemNo => { 
      if(itemNo){
        this.selectedDropdown='Item Number';
        this.columnSearch.searchValue=itemNo;
       
      }
       })
    )

    this.subscription.add(
    this.sharedService.reprocessItemObserver.subscribe(itemNo => { 
      if(itemNo){
        this.selectedDropdown='Item Number';
        this.columnSearch.searchValue=itemNo;
       
      }
       })
    )

    

    this.subscription.add(
      this.sharedService.historyLocObserver.subscribe(loc => {
        if(loc){
          this.selectedDropdown='Location';
          this.columnSearch.searchValue=loc;        
        }
      })
    );

  }
  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  actionDialog(opened: boolean) {
    if (!opened && this.selectedVariable === 'set_column_sq') {
      this.sortCol=0;
      let dialogRef = this.dialog.open(ColumnSequenceDialogComponent, {
        height: 'auto',
        width: '960px',
        disableClose: true,
        data: {
          mode: event,
          tableName: 'Transaction History',
        },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          this.clearMatSelectList();
          this.selectedDropdown='';
          if (result?.isExecuted) {
            this.getColumnsData();
          }
        });
    }
  }
  async autocompleteSearchColumn() {
    let searchPayload = {
      query: this.columnSearch.searchValue,
      tableName: 3,
      column: this.selectedDropdown,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .NextSuggestedTransactions(searchPayload)
      .subscribe(
        {next: (res: any) => {
          this.searchAutocompleteList = res.data;
        },
        error: (error) => {}}
      );
  }
  getColumnsData() {
    let payload = {
      username: this.userData.userName,
      wsid: this.userData.wsid,
      tableName: 'Transaction History',
    };
    this.Api
      .GetColumnSequence(payload)
      .subscribe(
        {next: (res: any) => {
          this.displayedColumns = TRNSC_DATA;
          if (res.data) {
            this.columnValues = res.data;
            this.getContentData();
          } else {
            this.toastr.error('Something went wrong', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        },
        error: (error) => {}}
      );
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
      app: 'Admin',
      username: this.userData?.userName,
      wsid:this.userData?.wsid,
    };
    this.Api
      .TransactionModelIndex(paylaod)
      .subscribe(
        {next: (res: any) => {
          this.columnValues = res.data?.transactionHistoryColumns;
        },
        error: (error) => {}}
      );
  }

  getContentData() {
    let payload = {
      draw: 0,
      sDate: this.startDate,
      eDate: this.endDate,
      searchString: this.columnSearch.searchValue,
      searchColumn: this.selectedDropdown,
      start: this.customPagination.startIndex,
      length: this.customPagination.recordsPerPage,
      orderNumber: this.orderNo,
      sortColumnNumber: this.sortCol,
      sortOrder: this.sortOrder,
      filter: this.FilterString ,
      username: this.userData?.userName,
      wsid: this.userData?.wsid,
    }; 
    
    this.Api
      .TransactionHistoryTable(payload)
      .subscribe(
        {next: (res: any) => {
          this.detailDataTransHistory = res.data?.transactions;
          this.dataSource = new MatTableDataSource(res.data?.transactions);
          this.customPagination.total = res.data?.recordsFiltered;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {}}
      );
  }
  searchData() {
    if (
      this.columnSearch.searchColumn ||
      this.columnSearch.searchColumn == ''
    ) {
      this.getContentData();
    }
  }

  resetColumn() {
    this.columnSearch.searchColumn.colDef = '';
  }

  resetFields(event?) {
    this.columnSearch.searchValue = '';
    this.searchAutocompleteList = [];
  }
  selectStatus(event) {
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
    if (
      !this.dataSource._data._value ||
      event.direction == '' ||
      event.direction == this.sortOrder
    )
      return;

    let index;
    this.columnValues.find((x, i) => {
      if (x === event.active) {
        index = i;
      }
    });

    this.sortCol = index;
    this.sortOrder = event.direction;
    this.getContentData();
  }


  ngOnDestroy() {
    this.searchBar.unsubscribe();
    this.subscription.unsubscribe();
  }
  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (Number(value) < 0) {
      this.columnSearch.searchValue = 0;
    }
  }


  @ViewChild('trigger') trigger: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  FilterString: string = "1 = 1";

  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.trigger.menuData = { item: { SelectedItem: SelectedItem, FilterColumnName: FilterColumnName, FilterConditon: FilterConditon, FilterItemType: FilterItemType } };
    this.trigger.menu?.focusFirstItem('mouse');
    this.trigger.openMenu();
  }

  onContextMenuCommand(SelectedItem: any, FilterColumnName: any, Condition: any, Type: any) { 
    this.FilterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, "clear", Type);
    if(FilterColumnName != "" || Condition == "clear"){
      this.FilterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, Condition, Type);
      this.FilterString = this.FilterString != "" ? this.FilterString : "1=1";
      this.resetPagination();
      this.getContentData();
    }
  }

  resetPagination(){
    this.customPagination.startIndex = 0;
    this.customPagination.endIndex = 20;
    this.paginator.pageIndex = 0;
  }

  getType(val): string {
    return this.filterService.getType(val);
  }

  InputFilterSearch(FilterColumnName: any, Condition: any, TypeOfElement: any) {
    const dialogRef = this.dialog.open(InputFilterComponent, {
      height: 'auto',
      width: '480px',
      data: {
        FilterColumnName: FilterColumnName,
        Condition: Condition,
        TypeOfElement: TypeOfElement
      },
      autoFocus: '__non_existing_element__',
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.onContextMenuCommand(result.SelectedItem, result.SelectedColumn, result.Condition, result.Type)
    }
    );
  }

  clear(){
    this.columnSearch.searchValue = ''
    this.getContentData()
  }
}
