import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/init/auth.service';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { HttpContext, HttpHeaders } from '@angular/common/http';
import { BYPASS_LOG } from 'src/app/init/http-interceptor';
import { SharedService } from 'src/app/services/shared.service';
import { FilterToteComponent } from 'src/app/admin/dialogs/filter-tote/filter-tote.component';
import { MatDialog } from '@angular/material/dialog';
import { OmChangePriorityComponent } from 'src/app/dialogs/om-change-priority/om-change-priority.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContextMenuFiltersService } from 'src/app/init/context-menu-filters.service';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { ShippingCompleteDialogComponent } from 'src/app/dialogs/shipping-complete-dialog/shipping-complete-dialog.component';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-tran-order-list',
  templateUrl: './tran-order-list.component.html',
  styleUrls: ['./tran-order-list.component.scss'],
})
export class TranOrderListComponent implements OnInit, AfterViewInit {
  public columnValues: any = [];
  public Order_Table_Config = [
    { colHeader: 'status', colDef: 'Status' },
    { colHeader: 'transactionType', colDef: 'Transaction Type' },
    { colHeader: 'completedDate', colDef: 'Completed Date' },
    { colHeader: 'location', colDef: 'Location' },
    { colHeader: 'transactionQuantity', colDef: 'Transaction Quantity' },
    { colHeader: 'itemNumber', colDef: 'Item Number' },
    { colHeader: 'lineNumber', colDef: 'Line Number' },
    { colHeader: 'requiredDate', colDef: 'Required Date' },
    { colHeader: 'description', colDef: 'Description' },
    { colHeader: 'completedQuantity', colDef: 'Completed Quantity' },
    { colHeader: 'toteID', colDef: 'Tote ID' },
    { colHeader: 'priority', colDef: 'Priority' },
    { colHeader: 'completedBy', colDef: 'Completed By' },
    { colHeader: 'unitOfMeasure', colDef: 'Unit of Meure' },
    { colHeader: 'lotNumber', colDef: 'Lot Number' },
    { colHeader: 'expirationDate', colDef: 'Expiration Date' },
    { colHeader: 'serialNumber', colDef: 'Serial Number' },
    { colHeader: 'revision', colDef: 'Revision' },
    { colHeader: 'wareHouse', colDef: 'Warehouse' },
    { colHeader: 'importDate', colDef: 'Import Date' },
    { colHeader: 'batchPickID', colDef: 'Batch Pick ID' },
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
    { colHeader: 'toteNumber', colDef: 'Tote Number' },
    { colHeader: 'cell', colDef: 'Cell' },
    { colHeader: 'hostTransactionID', colDef: 'Host Transaction ID' },
    { colHeader: 'zone', colDef: 'Zone' },
    { colHeader: 'emergency', colDef: 'Emergency' },
    { colHeader: 'id', colDef: 'ID' },
    { colHeader: 'importBy', colDef: 'Import By' },
    { colHeader: 'fileFrom', colDef: 'filefrom' },
    { colHeader: 'orderNumber', colDef: 'Order Number' },
    { colHeader: 'lineSequence', colDef: 'Line Sequence' },
    { colHeader: 'carousel', colDef: 'Carousel' },
    { colHeader: 'row', colDef: 'Row' },
    { colHeader: 'shelf', colDef: 'Shelf' },
    { colHeader: 'bin', colDef: 'Bin' },
    { colHeader: 'invMapID', colDef: 'Inv Map ID' },
    { colHeader: 'notes', colDef: 'Notes' },
    { colHeader: 'exportFileName', colDef: 'Export File Name' },
    { colHeader: 'exportDate', colDef: 'Export Date' },
    { colHeader: 'exportedBy', colDef: 'Exported By' },
    { colHeader: 'exportBatchID', colDef: 'Export Batch ID' },
    { colHeader: 'tableType', colDef: 'Table Type' },

    { colHeader: 'statusCode', colDef: 'Status Code' },
    { colHeader: 'masterRecord', colDef: 'Mter Record' },
    { colHeader: 'masterRecordID', colDef: 'Mter Record ID' },
    { colHeader: 'label', colDef: 'Label' },
    { colHeader: 'inProcess', colDef: 'In Process' },
  ];
  public displayedColumns: string[] = [
    'status',
    'transactionType',
    'completedDate',
    'location',
    'transactionQuantity',
    'itemNumber',
    'lineNumber',
    'requiredDate',
    'description',
    'completedQuantity',
    'toteID',
    'priority',
    'completedBy',
    'unitOfMeasure',
    'lotNumber',
    'expirationDate',
    'serialNumber',
    'revision',
    'wareHouse',
    'importDate',
    'batchPickID',
    'userField1',
    'userField2',
    'userField3',
    'userField4',
    'userField5',
    'userField6',
    'userField7',
    'userField8',
    'userField9',
    'userField10',
    'toteNumber',
    'cell',
    'zone',
    'hostTransactionID',
    'emergency',
    'id',
  ];

  public dataSource: any = new MatTableDataSource();
  public userData: any;
  public detailDataInventoryMap: any;
  public orderNo: any = '';
  public toteId: any = '';
  public searchCol: any = '';
  public searchString: any = '';
  public payload;
  public sortCol: any = 3;
  public sortOrder: any = 'asc';
  public getOrderForTote: any = ''; // get orderNumber from api to pass it to Filter By ToteID
  @ViewChild(MatSort) sort: MatSort;
  private subscription: Subscription = new Subscription();
  public catchToteId;
  isToolTipDisabled = false;
  searchByInput = new Subject<string>();
  setVal

  compDate = '';
  @Input()
  set deleteEvnt(event: Event) {
    if (event) {
      this.getContentData(); 
    }
  }

  @Input() set orderNoEvent(event: any) {
    if (event) {
      this.toteId =
        event.columnFIeld != 'Order Number' ? event.searchField : '';
      this.orderNo =
        event.columnFIeld === 'Order Number' ? event.searchField : '';
      this.searchCol = '';
      this.searchString = '';

      console.log('orderNoEvent',this.orderNo,event);
      this.getContentData();
      this.selShipComp(event);
    }
  }

  @Input() set toteIdEvent(event: Event) {
    if (event) {
      this.toteId = event;
    }
  }
  // Emitters
  @Output() openOrders = new EventEmitter<any>();
  @Output() completeOrders = new EventEmitter<any>();
  @Output() reprocessOrders = new EventEmitter<any>();
  @Output() orderTypeOrders = new EventEmitter<any>();
  @Output() totalLinesOrders = new EventEmitter<any>();
  @Output() locationZones = new EventEmitter<any>();
  @Output() currentStatus = new EventEmitter<any>();
  @Output() clearFromListChange = new EventEmitter<Event>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('viewAllLocation') customTemplate: TemplateRef<any>;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  pageEvent: PageEvent;
  searchAutocompleteList;
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
    columnName: 3,
    sortOrder: 'asc',
  };

  @Input()
  set clearEvent(event: Event) {
    if (event) {
      this.searchCol = '';
      this.searchString = '';
      this.orderNo = '';
      this.dataSource = new MatTableDataSource();
    }
  }

  public priority = false;
  shippingComplete = false;

  constructor(
    private Api:ApiFuntions,
    private authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private global:GlobalService,
    private router: Router,
    private filterService: ContextMenuFiltersService
  ) {
    this.setVal = localStorage.getItem('routeFromOrderStatus')
    if(router.url == '/OrderManager/OrderStatus' || router.url == '/OrderManager/OrderStatus?type=TransactionHistory'|| this.setVal == 'true'){
      this.priority = true;
    }
    else if(router.url == '/admin/transaction'){
      this.priority = false;
    }
  }

  
  getContentData() {
    
     
    this.payload = { 
      draw: 0,
      compDate: this.compDate,
      identify: this.orderNo ? 0 : 1,
      searchString: this.searchString,
      direct: 'asc',
      searchColumn: this.searchCol,
      sRow: this.customPagination.startIndex,
      eRow: this.customPagination.endIndex,
      checkValue: true,
      checkColumn: 0,
      orderNumber: this.orderNo,
      toteID: this.toteId,
      sortColumnNumber: this.sortCol,
      sortOrder: this.sortOrder,
      filter: this.FilterString,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .OrderStatusData(this.payload)
      .subscribe(
        {next: (res: any) => {
          
          this.detailDataInventoryMap = res.data?.orderStatus;
          this.getOrderForTote = res.data?.orderNo;
          this.dataSource = new MatTableDataSource(res.data?.orderStatus);

          this.columnValues = res.data?.orderStatusColSequence;
          this.customPagination.total = res.data?.totalRecords;
          this.getOrderForTote =
            res?.data?.orderStatus[0]?.orderNumber;
          if (res.data) {
            this.onOpenOrderChange(res.data?.opLines);
            this.onCompleteOrderChange(res.data?.compLines);
            this.onReprocessOrderChange(res.data?.reLines);
            if (
              res?.data?.orderStatus?.length > 0
            ) {
              res.data.orderStatus.find((el) => {
                return el.completedDate === ''
                  ? (res.data.completedStatus = 'In Progress')
                  : (res.data.completedStatus = 'Completed');
              });
            }
            this.onOrderTypeOrderChange(
              
                res?.data?.orderStatus?.length > 0 &&
                res?.data?.orderStatus[0]?.transactionType
            );
            
            this.currentStatusChange(res.data.completedStatus);
            this.totalLinesOrderChange(res.data?.totalRecords);
            this.sharedService.updateOrderStatusSelect({
              totalRecords: res.data?.totalRecords,
            });
          }

          if (res.data?.onCar.length) {
            res.data.onCar.filter((item) => {
              return (item.carousel = 'on');
            });
            this.onLocationZoneChange(res.data?.onCar);
          } else if (res.data?.offCar.length) {
            res.data.offCar.filter((item) => {
              return (item.carousel = 'off');
            });
            this.onLocationZoneChange(res.data?.offCar);
          } else {
            this.onLocationZoneChange(res.data?.onCar);
          }
        },
        error: (error) => {}}
      );
  }

  selShipComp(event:any){
    if(event.searchField != "" && event.columnFIeld == "Order Number"){
      this.Api.selShipComp({ orderNumber: event.searchField }).subscribe((res: any) => {
        if (res.isExecuted) {
          if (res.data == "") {
            this.shippingComplete = false;
          } else {
            this.shippingComplete = true;
          }
        }
      });
    }
    else{
      this.shippingComplete = false;
    }
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }
  deleteSelectedOrder() {
    this.detailDataInventoryMap.this.payload = {
      transType: '',
      orderNumber: '',
      id: 0,
      itemNumber: '',
      lineNumber: '',
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };

    this.Api
      .DeleteOrder(this.payload)
      .subscribe(
        {next: (res: any) => { 
        },
        error: (error) => {}}
      );
  }
  orderNoChange(event: Event) {
    this.orderNoEvent = event;
  }
  toteIdChange(event: Event) {
    this.orderNoEvent = event;
  }
  onOpenOrderChange(event) {
    this.openOrders.emit(event);
  }
  onOrderTypeOrderChange(event) {
    this.orderTypeOrders.emit(event);
  }
  onReprocessOrderChange(event) {
    this.reprocessOrders.emit(event);
  }
  totalLinesOrderChange(event) {
    this.totalLinesOrders.emit(event);
  }
  currentStatusChange(event) {
    this.currentStatus.emit(event);
  }
  onCompleteOrderChange(event) {
    this.completeOrders.emit(event);
  }
  onLocationZoneChange(event) {
    this.locationZones.emit(event);
  }
  
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
        {next: (res: any) => {
        },
        error: (error) => {}}
      );
  }
  clearData(event) {
    this.dataSource = new MatTableDataSource();
    this.searchCol = '';
    this.searchString = '';
    this.clearFromListChange.emit(event);
  }
  getClass(element) {
    return 'addRow';
  }
  getTransTypeColor(element) {
    if (element.transactionType.toLowerCase() === 'pick') {
      return 'background-color: #CF9ECF';
    } else if (element.transactionType.toLowerCase() === 'putaway' || element.transactionType.toLowerCase() ===  'put away') {
      return 'background-color: #d9edf7';
    } else if (element.transactionType.toLowerCase() === 'count') {
      return 'background-color: #FFDBB8';
    } else if (element.transactionType.toLowerCase() === 'complete') {
      return 'background-color: #e0e0d1';
    } else if (element.transactionType.toLowerCase() === 'locationChange') {
      return 'background-color: #ADAD85';
    } else if (element.transactionType.toLowerCase() === 'shipping') {
      return 'background-color: #8585A6';
    } else if (element.transactionType.toLowerCase() === 'shippingcomplete' || element.transactionType.toLowerCase() === 'shipping complete' ) {
      return 'background-color: #ff708c';
    } else if (element.transactionType.toLowerCase() === 'adjustment') {
      return 'background-color: #85A37A';
    } else {
      return;
    }
  }

  getStatus(element){
    if (
      element.tableType.toLowerCase() === 'open' &&
      element.completedDate == '' &&
      element.fileFrom.toLowerCase() == 'open'
    ) {
      return 'Open';
    } else if (element.completedDate != '') {
      return 'Completed';
    } else if (element.fileFrom.toLowerCase() != 'open') {
      return 'Re-process';
    } else {
      return;
    }
  }
  getColor(element) {
    if (
      element.tableType.toLowerCase() === 'open' &&
      element.completedDate == '' &&
      element.fileFrom.toLowerCase() == 'open'
    ) {
      return 'background-color: #FFF0D6;color:#4D3B1A';
    } else if (element.completedDate != '') {
      return 'background-color: #C8E2D8;color:#114D35';
    } else if (element.fileFrom.toLowerCase() != 'open') {
      return 'background-color: #F7D0DA;color:#4D0D1D';
    } else {
      return;
    }
  }
  getColumnsData() {
    this.getContentData();
  }
  async autocompleteSearchColumn() {
    
    let searchPayload = {
      query: this.searchString,
      tableName: 1,
      column: this.searchCol,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };

    // NextSuggestedTransactions
    // OrderNumberNext
    this.Api
      .NextSuggestedTransactions(searchPayload)
      .subscribe(
        {next: (res: any) => {
          this.searchAutocompleteList = res.data;
        },
        error: (error) => {}}
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
    this.displayedColumns.forEach((x, i) => {
      if (x === event.active) {
        index = i;
      }
    });

    this.sortCol = index;
    this.sortOrder = event.direction;
    this.getContentData();
  }

  actionDialog(event) {
    if (this.toteId != '') {
      this.catchToteId = this.toteId;
    } else {
      this.toteId = '';
    }

    this.searchCol = event;
    this.searchString = '';
    this.searchAutocompleteList = [];
    this.searchByInput.next(event)
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.customPagination.startIndex = e.pageSize * e.pageIndex;

    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;

    this.getContentData();
  }

  announceSortChange(sortState: Sort) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.orderNo = '';
    this.toteId = '';
    this.searchByInput
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteSearchColumn();
        this.getContentData();
      });

    // Data coming from select order when user enter / check tote filter by Id it gets object type it tote id selected only
    // then it will do send back the order number to select order component and set order field and also check if
    // scanValidate to check dates available if available it shows popup and when we select date it filters data by passing compdate to
    // orderstatus table generation api .
    this.subscription.add(
      this.sharedService.orderStatusObjObserver.subscribe((obj) => {
        if (obj.type === 'Tote ID') {
          this.sharedService.updateOrderStatusOrderNo(this.getOrderForTote);
          this.orderNo = this.getOrderForTote;
          this.toteId = '';
          this.getContentData();
          let payload = {
            orderNumber: this.getOrderForTote, // 1974869 //this.getOrderForTote
            username: this.userData.userName,
            wsid: this.userData.wsid,
          };
          this.Api
            .ScanValidateOrder(payload)
            .subscribe(
              {next: (res: any) => {
                if (
                  res.isExecuted &&
                  res.data.length > 0 &&
                  res.data.length >= 2
                ) {
                  res.data[0] = 'Entire Order';
                  // add default check for tote id
                  this.sharedService.updateToteFilterCheck(true);
                  const dialogRef = this.dialog.open(FilterToteComponent, {
                    width: '650px',
                    autoFocus: '__non_existing_element__',
      disableClose:true,
                    data: {
                      dates: res.data,
                      orderName: this.getOrderForTote,
                    },
                  });
                  dialogRef.afterClosed().subscribe((res) => {
                    if (
                      res.selectedDate != '' &&
                      res.selectedDate != undefined
                    ) {
                      if (res.selectedDate == 'Entire Order') {
                        this.compDate = '';
                      } else {
                        this.compDate = res.selectedDate;
                      }

                      this.getContentData();
                    }
                  });
                } else {
                  this.compDate = '';
                }
              },
              error: (error) => {}}
            );
        }
      })
    );

    this.subscription.add(
      this.sharedService.updateCompDateObserver.subscribe((obj) => {
        this.compDate = '';
      })
    );
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openGcBeginTest() { 
    let dialogRef = this.dialog.open(OmChangePriorityComponent, { 
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true, 
      data: {
        orderNo: this.orderNo,
        priorityTable: this.dataSource.filteredData[0].priority,
        
        
      }
    })
    dialogRef.afterClosed().subscribe(result =>{
      if( result.isExecuted){
        this.getContentData();
      }
    })
    }

  @ViewChild('trigger') trigger: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  FilterString: string = "1 = 1";

  getColDef(colHeader:any){
    return this.Order_Table_Config.filter((item) => item.colHeader == colHeader)[0]?.colDef ?? '';
  }

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


  ShippingCompleteDialog() {
    const dialogRef = this.dialog.open(ShippingCompleteDialogComponent,{
      height: 'auto',
      width: '100vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        orderNumber: this.orderNo,
      },
    });

  }

  printReport(){
    this.global.Print(`FileName:printOSReport|OrderNum:${this.orderNo}|ToteID:|Identifier:0`)
  }

  previewReport(){ 
    window.open(`/#/report-view?file=OrderStatus-lst-prv|field:Order Number|exptype:=|expone:${this.orderNo}|exptwo:`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
  }
}
