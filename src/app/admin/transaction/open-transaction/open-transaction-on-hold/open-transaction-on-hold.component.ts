import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, interval, Subscription, Observable } from 'rxjs';
import { AddInvMapLocationComponent } from 'src/app/admin/dialogs/add-inv-map-location/add-inv-map-location.component';
import { AdjustQuantityComponent } from 'src/app/admin/dialogs/adjust-quantity/adjust-quantity.component';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { QuarantineConfirmationComponent } from 'src/app/admin/dialogs/quarantine-confirmation/quarantine-confirmation.component';  
import { AuthService } from 'src/app/init/auth.service'; 
import { DeleteConfirmationTransactionComponent } from 'src/app/admin/dialogs/delete-confirmation-transaction/delete-confirmation-transaction.component';
import { SetColumnSeqComponent } from 'src/app/admin/dialogs/set-column-seq/set-column-seq.component';
import { FloatLabelType } from '@angular/material/form-field';
import { ColumnSequenceDialogComponent } from 'src/app/admin/dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { FunctionAllocationComponent } from 'src/app/admin/dialogs/function-allocation/function-allocation.component';
import { SendTranHistoryComponent } from 'src/app/admin/dialogs/send-tran-history/send-tran-history.component';
import { SharedService } from 'src/app/services/shared.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';
import { ContextMenuFiltersService } from 'src/app/init/context-menu-filters.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';

const TRNSC_DATA = [
  { colHeader: 'id', colDef: 'ID' },
  { colHeader: 'importDate', colDef: 'Import Date' },
  { colHeader: 'importBy', colDef: 'Import By' },
  { colHeader: 'importFileName', colDef: 'Import Filename' },
  { colHeader: 'transactionType', colDef: 'Transaction Type' },
  { colHeader: 'orderNumber', colDef: 'Order Number' },
  { colHeader: 'lineNumber', colDef: 'Line Number' },
  { colHeader: 'lineSequence', colDef: 'Line Sequence' },
  { colHeader: 'priority', colDef: 'Priority' },
  { colHeader: 'requiredDate', colDef: 'Required Date' },
  { colHeader: 'itemNumber', colDef: 'Item Number' },
  { colHeader: 'unitOfMeasure', colDef: 'Unit of Measure' },
  { colHeader: 'lotNumber', colDef: 'Lot Number' },
  { colHeader: 'expirationDate', colDef: 'Expiration Date' },
  { colHeader: 'serialNumber', colDef: 'Serial Number' },
  { colHeader: 'description', colDef: 'Description' },
  { colHeader: 'revision', colDef: 'Revision' },
  { colHeader: 'transactionQuantity', colDef: 'Transaction Quantity' },
  { colHeader: 'location', colDef: 'Location' },
  { colHeader: 'wareHouse', colDef: 'Warehouse' },
  { colHeader: 'zone', colDef: 'Zone' },
  { colHeader: 'carousel', colDef: 'Carousel' },
  { colHeader: 'row', colDef: 'Row' },
  { colHeader: 'shelf', colDef: 'Shelf' },
  { colHeader: 'bin', colDef: 'Bin' },
  { colHeader: 'invMapID', colDef: 'Inv Map ID' },
  { colHeader: 'completedDate', colDef: 'Completed Date' },
  { colHeader: 'completedBy', colDef: 'Completed By' },
  { colHeader: 'completedQuantity', colDef: 'Completed Quantity' },
  { colHeader: 'batchPickID', colDef: 'Batch Pick ID' },
  { colHeader: 'notes', colDef: 'Notes' },
  { colHeader: 'exportFileName', colDef: 'Export File Name' },
  { colHeader: 'exportDate', colDef: 'Export Date' },
  { colHeader: 'exportedBy', colDef: 'Exported By' },
  { colHeader: 'exportBatchID', colDef: 'Export Batch ID' },
  { colHeader: 'tableType', colDef: 'Table Type' },
  { colHeader: 'statusCode', colDef: 'Status Code' },
  { colHeader: 'masterRecord', colDef: 'Master Record' },
  { colHeader: 'masterRecordID', colDef: 'Master Record ID' },
  { colHeader: 'label', colDef: 'Label' },
  { colHeader: 'inProcess', colDef: 'In Process' },
  { colHeader: 'userField1', colDef: 'User Field1' },
  { colHeader: 'userField2', colDef: 'User Field2' },
  { colHeader: 'userField3', colDef: 'User Field3' },
  { colHeader: 'userField4', colDef: 'User Field4' },
  { colHeader: 'userField5', colDef: 'User Field5' },
  { colHeader: 'userField6', colDef: 'User Field6' },
  { colHeader: 'userField7', colDef: 'User Field7' },
  { colHeader: 'userField8', colDef: 'User Field8' },
  { colHeader: 'userField9', colDef: 'User Field9' },
  { colHeader: 'userField10', colDef: 'User Field10' },
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
  selector: 'app-open-transaction-on-hold',
  templateUrl: './open-transaction-on-hold.component.html',
  styleUrls: ['./open-transaction-on-hold.component.scss'],
})
export class OpenTransactionOnHoldComponent implements OnInit, AfterViewInit {
  @Output() back = new EventEmitter<string>();
  @Output() returnToOrder = new EventEmitter<string>();
  @Output() startdateChange: EventEmitter<MatDatepickerInputEvent<any>> =
    new EventEmitter();
  @Output() enddateChange: EventEmitter<MatDatepickerInputEvent<any>> =
    new EventEmitter();
  @Output() viewOrderChange: EventEmitter<MatDatepickerInputEvent<any>> =
    new EventEmitter();

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
  isDeleteVisible:any=localStorage.getItem('routeFromInduction')
  // isResetVisible:any=localStorage.getItem('routeFromOrderStatus')
 
  /*for data col. */
  public columnValues: any = [];
  onDestroy$: Subject<boolean> = new Subject();
  public userData: any;
  public displayedColumns: any;
  public dataSource: any = new MatTableDataSource();
  public payload: any;
  public sortCol: any = 0;
  public sortOrder: any = 'asc';
  selectedVariable;
  public filterLoc: any = 'Nothing';
  public itemList: any;
  transTypeSelect = 'All Transactions';
  transStatusSelect = 'All Transactions';
  rowClicked;
  hideDelete
  hideReset

  directAdmin;
  throughOrderManager
  setVal
  spliUrl;
  orderSelectionSearch  : boolean = true

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
    sortOrder: 'asc',
  };
  /* End */
  statusType: string = 'All Transactions';
  orderNumber: string = '';
  toteId: string = '';

  sdate: any = backDate.toISOString();
  edate: any = new Date().toISOString();
  public transType: any = [
    {
      type: 'All Transactions',
      value: 'All Transactions',
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
      type: 'Put Away',
      value: 'Put Away',
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
      type: 'All Transactions',
      value: 'All Transactions',
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

  constructor(
    private router: Router, 
    private Api: ApiFuntions,
    public authService: AuthService,
    private global:GlobalService,
    private toastr: ToastrService, 
    private dialog: MatDialog,
    private sharedService:SharedService,
    private filterService: ContextMenuFiltersService,
    private currentTabDataService: CurrentTabDataService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state?.['searchValue']) {
      this.columnSearch.searchValue =
        this.router.getCurrentNavigation()?.extras?.state?.['searchValue'];
      this.columnSearch.searchColumn = {
        colDef: this.router.getCurrentNavigation()?.extras?.state?.['colDef'],
        colHeader:
          this.router.getCurrentNavigation()?.extras?.state?.['colHeader'],
      };
    }
  }

  onEndDate(event) {}
  rowClick(row, event) {
  }
  filterVals: any = {
    transactions: '',
  };

  ngOnInit(): void {
    this.setVal = localStorage.getItem('routeFromOrderStatus') 
    if(this.router.url == '/OrderManager/OrderStatus' || this.setVal == 'true'){
      this.throughOrderManager = true;
      this.directAdmin = false;
    }
    else if(this.router.url == '/admin/transaction'|| this.setVal != 'true'){
      this.throughOrderManager = false;
      this.directAdmin = true;
    }
    this.hideDelete=JSON.parse(this.isDeleteVisible);

    // this.hideReset=JSON.parse(this.isResetVisible);


    this.customPagination = {
      total: '',
      recordsPerPage: 10,
      startIndex: 0,
      endIndex: 10,
    };
    // Search by Tote Id Debounce values
    this.searchByToteId
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.toteId = value;
        this.getContentData();
      });
    // Search by Order Number Debounce values
    this.searchByOrderNumber
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((value) => {
        // this.orderNumber = value;
        this.autocompleteSearchColumn(true);
        this.getContentData();
      });

    // Search Bar  Debounce values
    // this.searchBar
    //   .pipe(debounceTime(600), distinctUntilChanged())
    //   .subscribe((value) => {
    //     this.columnSearch.searchValue = value;
    //     if (!this.columnSearch.searchColumn.colDef) return;

    //     this.autocompleteSearchColumn(false);
    //     if (!this.searchAutocompleteListByCol.length) {
    //       this.getContentData();
    //     }
    //   });

    this.searchByColumn
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteSearchColumn(false);
        this.getContentData();
      });

    this.userData = this.authService.userData();
    this.getColumnsData(true);    
  }
  viewOrderInOrder(row) {
    this.returnToOrder.emit();
    // this.router.navigate([]).then((result) => {
    //   window.open(`/#/admin/transaction?orderStatus=${row.orderNumber}`, '_self');
    // });


if( this.spliUrl[1] == 'OrderManager' ){
  this.router.navigate([]).then((result) => {
    // window.open(`/#/OrderManager/OrderStatus?itemNumber=${row.itemNumber}`, '_blank');
    window.open(`/#/OrderManager/OrderStatus?orderStatus=${row.orderNumber}`, '_self');
  });
}
else {
localStorage.setItem('routeFromInduction','false')
this.router.navigate([]).then((result) => {
  window.open(`/#/admin/transaction?orderStatus=${row.orderNumber}`, '_self');
});

}




  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }
  getFloatFormabelValue(): FloatLabelType {
    return this.floatLabelControlColumn.value || 'auto';
  }
  changeTableRowColor(idx: any) {
    if (this.rowClicked === idx) {
      this.rowClicked = -1;
    } else {
      this.rowClicked = idx;
    }
  }

  retunrToPrev() {
    this.back.emit('back');
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.subscription.add(
    this.sharedService.itemObserver.subscribe(itemNo => {
      if(itemNo){
        this.columnSearch.searchColumn.colDef='Item Number';
       this.columnSearch.searchValue=itemNo;
       
      //  this.onOrderNoChange();
      }
       })
    )
    this.spliUrl=this.router.url.split('/');
  }
  /*FUnctions for Table*/
  isAuthorized(controlName: any) {
    return !this.authService.isAuthorized(controlName);
  }
  searchData() {
    if (
      this.columnSearch.searchColumn ||
      this.columnSearch.searchColumn == ''
    ) {
      this.getContentData();
    }
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    // this.customPagination.startIndex =  e.pageIndex
    this.customPagination.startIndex = e.pageSize * e.pageIndex;

    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    // this.length = e.length;
    this.customPagination.recordsPerPage = e.pageSize;
    // this.pageIndex = e.pageIndex;

    // this.initializeApi();
    this.getContentData();
  }
  // autocompleteSearchColumn(){
  //   let searchPayload = {
  //     "columnName": this.columnSearch.searchColumn.colDef,
  //     "value": this.columnSearch.searchValue,
  //     "username": this.userData.userName,
  //     "wsid": this.userData.wsid
  //   }
  //   this.invMapService.getSearchData(searchPayload).pipe(takeUntil(this.onDestroy$)).subscribe((res: any) => {
  //     if(res.data){
  //       this.searchAutocompleteList = res.data;
  //     }

  //   });
  // }
  async autocompleteSearchColumn(isSearchByOrder: boolean = false) {
    let searchPayload;
    if (isSearchByOrder) {
      searchPayload = {
        query: this.orderNumber,
        tableName: 2,
        column: 'Order Number',
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };
    } else {
      searchPayload = {
        query: this.columnSearch.searchValue,
        tableName: 2,
        column: this.columnSearch.searchColumn.colDef,
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };
    }

    this.Api
      .NextSuggestedTransactions(searchPayload)
      .subscribe(
        (res: any) => {
          if (isSearchByOrder) {
            this.searchAutocompleteList = res.data;
          } else {
            this.searchAutocompleteListByCol = res.data;
          }
        },
        (error) => {}
      );
  }

  viewInInventoryMaster(row) {


    
    if( this.spliUrl[1] == 'OrderManager' ){
      this.router.navigate([]).then((result) => {
        window.open(`/#/OrderManager/InventoryMaster?itemNumber=${row.itemNumber}`, '_self');
      });
   }
   else if(this.spliUrl[1] == 'InductionManager' ){
    window.open(`/#/InductionManager/Admin/InventoryMaster?itemNumber=${row.itemNumber}`, '_self');

   }
   else {
    localStorage.setItem('routeFromInduction','false')
    this.router.navigate([]).then((result) => {
      window.open(`/#/admin/inventoryMaster?itemNumber=${row.itemNumber}`, '_self');
    });

   }

    //////////////////////////////////////////////////////////
    // this.router.navigate([]).then((result) => {
    //   window.open(`/#/admin/inventoryMaster?itemNumber=${row.itemNumber}`, '_self');
    // });
  }
  sendComp(event) {
    let dialogRef = this.dialog.open(FunctionAllocationComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        target: 'assigned',
        function: '',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  adjustQuantity(event) {
    let dialogRef = this.dialog.open(AdjustQuantityComponent, {
      height: 'auto',
      width: '800px',
      data: {
        id: event.invMapID,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        this.getContentData();
      });
  }

  deleteItem(event) {
    const dialogRef = this.dialog.open(DeleteConfirmationTransactionComponent, {
      height: 'auto',
      width: '600px',
      data: {
        mode: 'delete-transaction',
        id: event.id,
        orderNo: event.orderNumber,
        transType: event.transactionType,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res == 'Yes') {
        // this.initializeApi();
        this.getContentData();
      }
    });
  }

  resetToTodaysDate() {
    this.edate = new Date().toISOString();
    this.sdate = new Date().toISOString();
    this.columnSearch.searchColumn.colDef='';
    this.columnSearch.searchValue='';
    this.orderNumber='';
    
    this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS] = undefined;
    // this.initializeApi();
    this.getContentData();
  }

  getColumnsData(isInit : boolean = false) {
    let payload = {
      username: this.userData.userName,
      wsid: this.userData.wsid,
      tableName: 'Open Transactions',
    };
    this.Api.GetColumnSequence(payload).subscribe(
      (res: any) => {
        this.displayedColumns = TRNSC_DATA;
        if (res.data) {
          this.columnValues = res.data;
          this.columnValues.push('actions');
          this.getContentData(isInit);
        } else {
          this.toastr.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (error) => {}
    );
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
  announceSortChange(e: any) {
    // let index = this.columnValues.findIndex(x => x === e.active );
    // this.sortColumn = {
    //   columnName: index,
    //   sortOrder: e.direction
    // }
    // this.initializeApi();
    // this.getContentData();
  }

  getContentData(isInit: boolean = false) {
    this.payload = {
      draw: 0,
      sDate: this.sdate,
      eDate: this.edate,
      transType: this.transTypeSelect,
      transStatus: this.transStatusSelect,
      searchString: this.columnSearch.searchValue,
      searchColumn: this.columnSearch.searchColumn.colDef,
      start: this.customPagination.startIndex,
      length: this.customPagination.recordsPerPage,
      orderNumber: this.orderNumber,
      toteID: this.toteId,
      sortColumnNumber: this.sortCol,
      sortOrder: this.sortOrder,
      filter: this.FilterString,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .OpenTransactionTable(this.payload)
      .subscribe(
        (res: any) => {
          // this.getTransactionModelIndex();
          this.detailDataInventoryMap = res.data?.transactions;
          this.dataSource = new MatTableDataSource(res.data?.transactions);
          //  this.dataSource.paginator = this.paginator;
          this.customPagination.total = res.data?.recordsFiltered;
          this.dataSource.sort = this.sort;
          if (isInit && this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS])
          {
            this.ApplySavedItem();
            this.orderSelectionSearch = false;
          }
          else
            this.RecordSavedItem();
        },
        (error) => {}
      );
    // this.invMapService
    //   .getInventoryMap(this.payload)
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe((res: any) => {
    //     debugger;
    //     this.itemList = res.data?.inventoryMaps?.map((arr) => {
    //       return { itemNumber: arr.itemNumber, desc: arr.description };
    //     });

    //     this.detailDataInventoryMap = res.data?.inventoryMaps;
    //     this.dataSource = new MatTableDataSource(res.data?.inventoryMaps);
    //     //  this.dataSource.paginator = this.paginator;
    //     this.customPagination.total = res.data?.recordsFiltered;
    //     this.dataSource.sort = this.sort;
    //   });
  }
  
  ApplySavedItem() {
    if (this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS]) {
      let item = this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS];
      this.detailDataInventoryMap = item.detailDataInventoryMap;
      this.dataSource = item.dataSource;
      //  this.dataSource.paginator = this.paginator;
      this.customPagination.total = item.customPaginationTotal;
      this.dataSource.sort = item.dataSourceSort;
      this.sdate= item.sdate;
      this.edate= item.edate;
      this.statusType= item.statusType;
      this.orderNumber= item.orderNumber;
      this.toteId= item.toteId;
      this.transTypeSelect= item.transTypeSelect;
      this.columnSearch= item.columnSearch
    }
  }
  RecordSavedItem() {
    this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS]= {
          detailDataInventoryMap : this.detailDataInventoryMap,
          dataSource : this.dataSource,
          //  this.dataSource.paginator = this.paginator;
          customPaginationTotal : this.customPagination.total,
          dataSourceSort : this.dataSource.sort,
          sdate: this.sdate,
          edate: this.edate,
          statusType: this.statusType,
          orderNumber: this.orderNumber,
          toteId: this.toteId,
          transTypeSelect: this.transTypeSelect,
          columnSearch: this.columnSearch
    }
  }
  // initializeApi() {
  //   this.userData = this.authService.userData();
  //   this.payload = {
  //     username: this.userData.userName,
  //     wsid: this.userData.wsid,
  //     oqa: this.filterLoc,
  //     searchString: this.columnSearch.searchValue,
  //     searchColumn: this.columnSearch.searchColumn.colDef,
  //     sortColumnIndex: this.sortColumn.columnName,
  //     sRow: this.customPagination.startIndex,
  //     eRow: this.customPagination.endIndex,
  //     sortOrder: this.sortColumn.sortOrder,
  //     filter: '1 = 1',
  //   };
  // }

  getTransactionModelIndex() {
    let paylaod = {
      viewToShow: 2,
      location: '',
      itemNumber: '',
      holds: false,
      orderStatusOrder: '',
      app: 'Admin',
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .TransactionModelIndex(paylaod)
      .subscribe(
        (res: any) => {
          this.columnValues = res.data?.openTransactionColumns;
          this.columnValues.push('actions');
          // this.displayOrderCols=res.data.openTransactionColumns;
        },
        (error) => {}
      );
  }
  /*End of table functions */
  actionDialog(opened: boolean) {
    if (!opened && this.selectedVariable && this.selectedVariable==='set_column_sq') {
      let dialogRef = this.dialog.open(ColumnSequenceDialogComponent, {
        height: 'auto',
        width: '960',
        disableClose: true,
        data: {
          mode: event,
          tableName: 'Open Transactions',
        },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          this.selectedVariable='';
          if (result && result.isExecuted) {
            this.getColumnsData();
          }
        });
    }
  }

  resetFields(event?) {
    // this.orderNo = '';
    this.columnSearch.searchValue = '';
    this.searchAutocompleteListByCol = [];
    this.orderSelectionSearch = false
    this.searchByColumn.next(event);
  }
  resetColumn() {
    this.columnSearch.searchColumn.colDef = '';
  }
  onDateChange(event): void {
    this.resetColumn();
    this.resetFields();
    this.startdateChange.emit();
    this.sdate = new Date(event).toISOString();
    // this.initializeApi();
    this.getContentData();
  }

  onEndDateChange(event): void {
    this.resetColumn();
    this.resetFields();
    this.enddateChange.emit();
    this.edate = new Date(event).toISOString();
    // this.initializeApi();
    this.getContentData();
  }
  selectStatus(event) {
    this.resetColumn();
    this.resetFields();
    this.transStatusSelect = event;
    // this.initializeApi();
    this.getContentData();
  }
  selectTransType(value) {
    this.resetColumn();
    this.resetFields();
    this.transTypeSelect = value;
    // this.initializeApi();
    this.getContentData();
  }
  sendCompletedToHistory() {
    let dialogRef = this.dialog.open(SendTranHistoryComponent, {
      height: 'auto',
      width: '580px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        user: this.userData.userName,
        wsid: this.userData.wsid,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        // if (result.isExecuted) {
          this.getContentData();
        // }
        // this.getContentData();
      });
  }

  ngOnDestroy() {
    this.searchByToteId.unsubscribe();
    this.searchByOrderNumber.unsubscribe();
    this.searchByColumn.unsubscribe();
    this.subscription.unsubscribe();
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

  printCycleCountReport(){
    this.global.Print(`FileName:printCycleCountReport`)
    // window.location.href = `/#/report-view?file=FileName:printCycleCountReport`;
    // window.location.reload();
  }

  previewFiftyPagesOnly(){
    window.open(`/#/report-view?file=CycleCount-lst-prv`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
    // window.location.href = `/#/report-view?file=CycleCount-lst-prv`;
    // window.location.reload();
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
