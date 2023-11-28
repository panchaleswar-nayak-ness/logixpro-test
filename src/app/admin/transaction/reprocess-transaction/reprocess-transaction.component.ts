import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import labels from 'src/app/common/labels/labels.json';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, Subject, Subscription,takeUntil } from 'rxjs';
import { AuthService } from 'src/app/common/init/auth.service';
import { ColumnSequenceDialogComponent } from '../../dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { ReprocessTransactionDetailComponent } from '../../dialogs/reprocess-transaction-detail/reprocess-transaction-detail.component';
import { SharedService } from '../../../common/services/shared.service';
import { FunctionAllocationComponent } from '../../dialogs/function-allocation/function-allocation.component';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { Column, DialogConstants, StringConditions, TableName, ToasterMessages, ToasterTitle, ToasterType ,TableConstant,zoneType,ColumnDef,Style,UniqueConstants,FilterColumnName} from 'src/app/common/constants/strings.constants';


@Component({
  selector: 'app-reprocess-transaction',
  templateUrl: './reprocess-transaction.component.html',
  styleUrls: ['./reprocess-transaction.component.scss'],
})
export class ReprocessTransactionComponent implements OnInit {
  TRNSC_DATA = [
    { colHeader: 'id', colDef: 'ID' },
    { colHeader: TableConstant.ImportDate, colDef: 'Import Date' },
    { colHeader: TableConstant.ImportBy, colDef: 'Import By' },
    { colHeader: 'importFileName', colDef: 'Import Filename' },
    { colHeader: 'transactionType', colDef: TableConstant.TransactionType },
    { colHeader: 'orderNumber', colDef: Column.OrderNumber },
    { colHeader: 'lineNumber', colDef: 'Line Number' },
    { colHeader: TableConstant.LineSequence, colDef: 'Line Sequence' },
    { colHeader: UniqueConstants.Priority, colDef: 'Priority' },
    { colHeader: 'requiredDate', colDef: 'Required Date' },
    { colHeader: 'itemNumber', colDef: Column.ItemNumber },
    { colHeader: 'unitOfMeasure', colDef: FilterColumnName.unitOfMeasure },
    { colHeader: 'lotNumber', colDef: Column.LotNumber },
    { colHeader: 'expirationDate', colDef: TableConstant.ExpirationDate },
    { colHeader: 'serialNumber', colDef: 'Serial Number' },
    { colHeader: UniqueConstants.Description, colDef: Column.Description },
    { colHeader: 'revision', colDef: TableConstant.Revision },
    { colHeader: 'transactionQuantity', colDef: TableConstant.TransactionQuantity },
    { colHeader: 'location', colDef: Column.Location },
    { colHeader: 'wareHouse', colDef: 'Warehouse' },
    { colHeader: TableConstant.zone, colDef: 'Zone' },
    { colHeader: zoneType.carousel, colDef: 'Carousel' },
    { colHeader: 'row', colDef: TableConstant.Row },
    { colHeader: 'shelf', colDef: 'Shelf' },
    { colHeader: 'bin', colDef: 'Bin' },
    { colHeader: 'invMapID', colDef: 'Inv Map ID' },
    { colHeader: 'completedDate', colDef: TableConstant.CompletedDate },
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
    { colHeader: ColumnDef.userField1, colDef: TableConstant.UserField1 },
    { colHeader: ColumnDef.userField2, colDef: TableConstant.UserField2 },
    { colHeader: ColumnDef.userField3, colDef: 'User Field3' },
    { colHeader: ColumnDef.userField4, colDef: 'User Field4' },
    { colHeader: ColumnDef.userField5, colDef: 'User Field5' },
    { colHeader: ColumnDef.userField6, colDef: 'User Field6' },
    { colHeader: ColumnDef.userField7, colDef: 'User Field7' },
    { colHeader: ColumnDef.userField8, colDef: 'User Field8' },
    { colHeader: ColumnDef.userField9, colDef: 'User Field9' },
    { colHeader: ColumnDef.userField10, colDef: 'User Field10' },
    { colHeader: 'toteID', colDef: Column.ToteID },
    { colHeader: 'toteNumber', colDef: 'Tote Number' },
    { colHeader: 'cell', colDef: TableConstant.Cell },
    { colHeader: ColumnDef.HostTransactionId, colDef: TableConstant.HostTransactionID },
    { colHeader: UniqueConstants.emergency, colDef: ColumnDef.Emergency },
    { colHeader: 'reasonMessage', colDef: 'Reason Message' },
    { colHeader: 'dateStamp', colDef: 'Date Stamp' },
    { colHeader: 'reason', colDef: 'Reason' },
    { colHeader: 'nameStamp', colDef: 'Name Stamp' },
    { colHeader: 'blank', colDef: 'blank' },
  ];

  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);

  /*for data col. */
  public columnValues: any = [];
  onDestroy$: Subject<boolean> = new Subject();
  public userData: any;
  public displayedColumns: any;
  public dataSource: any = new MatTableDataSource();
  public payload: any;
  public filterLoc: any = 'Nothing';
  public itemList: any;
  transTypeSelect = StringConditions.AllTransactions;
  transStatusSelect = StringConditions.AllTransactions;
  trueString = StringConditions.True;
  switchTrueString = false;
  falseString = 'false';
  switchFalseString = false;
  searchFieldsTrueFalse = ['Label',ColumnDef.Emergency,'In Process','Master Record'];
  isReprocessedChecked = {flag:false};
  isCompleteChecked = {flag:false};
  isHistoryChecked = {flag:false};
  isHold = false;
  queryString:any = '';
  deleteReplenishment=true;
  deleteSelected=false;
  print=false;
  deleteBySelectedReason=false;
  deleteBySelectedMessage=false;
  deleteByDateTime=false;
  deleteByItemNumber=false; //Only visible if searched
  deleteByOrderNumber=false; //Only visible if searched
  private subscription: Subscription = new Subscription();
 
  @ViewChild(UniqueConstants.Description) description: TemplateRef<any>;

  idx: any;

  createdBy = "";
  transactionDateTime = "";
  reason = "";
  reasonMessage = "";

  orders =
  {
    reprocess: 0,
    complete: 0,
    history: 0,
    reprocessOrders: [{ orderNumber: 0, itemNumber: 0, id: 0 }],
    completeOrders: [{ orderNumber: 0, itemNumber: 0, id: 0 }],
    historyOrders: [{ orderNumber: 0, itemNumber: 0, id: 0 }]
  };
  rowClicked;
  public detailDataInventoryMap: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('viewAllLocation') customTemplate: TemplateRef<any>;
  pageEvent: PageEvent;
  searchAutocompleteListByCol: any;
  public sortCol: any = 5;
  public sortOrder: any = UniqueConstants.Asc;

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
  itemNumber: string = '';
  selectedVariable;
  isHistory: boolean = false;
  orderSelectionSearch: boolean = false;
  toteId: string = '';
  searchByToteId = new Subject<string>();
  searchByOrderNumber = new Subject<string>();
  searchBar = new Subject<string>();
  searchAutocompleteList: any;
  tableEvent = "reprocess";
  isEnabled = true;
  transactionID = 0;
  selectedOrderObj={};
  floatLabelControlColumn = new FormControl('auto' as FloatLabelType);
  hideRequiredFormControl = new FormControl(false);
  searchByColumn = new Subject<string>();

  public iAdminApiService: IAdminApiService;

  constructor( 
    private authService: AuthService,
    private global:GlobalService,
    private sharedService: SharedService,
    public adminApiService: AdminApiService
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.customPagination = {
      total: '',
      recordsPerPage: 20,
      startIndex: 0,
      endIndex: 10,
    };
    this.userData = this.authService.userData();
    this.getColumnsData();
    this.getOrdersWithStatus();
    this.searchByColumn.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      this.customPagination.startIndex=0;
      this.customPagination.length=20;
      this.paginator.pageIndex = 0;
      if(this.searchFieldsTrueFalse.indexOf(this.columnSearch.searchColumn.colDef) > -1)
        if(RegExp(this.columnSearch.searchValue.toLowerCase()).exec(this.trueString)) this.switchTrueString=true;
        else if(RegExp(this.columnSearch.searchValue.toLowerCase()).exec(this.falseString)) this.switchTrueString=false;
      this.autoCompleteSearchColumn(false);
      this.getContentData();
    });
  }

  ngAfterViewInit() {
    this.subscription.add(
      this.sharedService.reprocessItemObserver.subscribe(itemNo => {
        if(itemNo){
          this.columnSearch.searchColumn.colDef = Column.ItemNumber;
          this.columnSearch.searchValue = itemNo;
        }
      })
    );
    this.dataSource.paginator = this.paginator;
  }

  clearDelete(showOptions = "")
  {
    if(showOptions==""){
      this.deleteReplenishment=true;
      this.deleteSelected=false;
      this.deleteBySelectedReason=false;
      this.deleteBySelectedMessage=false;
      this.deleteByDateTime=false;
      this.print = false;
      this.deleteByItemNumber=false; //Only visible if searched
      this.deleteByOrderNumber=false; //Only visible if searched
    }
    else {
      this.deleteReplenishment=true;
      this.deleteSelected=true;
      this.print=true;
      this.deleteBySelectedReason=true;
      this.deleteBySelectedMessage=true;
      this.deleteByDateTime=true;
      this.deleteByItemNumber=true; //Only visible if searched
      this.deleteByOrderNumber=true; //Only visible if searched
    }
  }

  selectedTransaction:any;

  getTransaction(row: any) {
    this.selectedTransaction = row;
    this.isEnabled = false;
    this.transactionID = row.id;
    this.isReprocessedChecked.flag = row.reprocess != 'False';
    this.isCompleteChecked.flag = row.postAsComplete != 'False';
    this.isHistoryChecked.flag = row.sendToHistory != 'False';
    this.itemNumber = row.itemNumber;
    this.orderNumber = row.orderNumber;
    this.clearDelete("1");
  }

  getTransactionInfo(completeInfo: boolean) {
    if (!completeInfo) {
      let payload = { id: '' + this.transactionID + '' }
      this.iAdminApiService.ReprocessTransactionData(payload).subscribe({
        next: (res: any) => {
          if (res.data && res.isExecuted) {
            this.createdBy = res.data[0].nameStamp;
            this.transactionDateTime = res.data[0].dateStamp;
            this.reason = res.data[0].reason;
            this.reasonMessage = res.data[0].reasonMessage;
          } else {
            this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
            console.log("ReprocessTransactionData",res.responseMessage);
          }
        }
      });
    }
  }

  changeTableRowColor(idx: any) {
    this.rowClicked = idx;
  }

  setQueryString() {
    if(this.searchFieldsTrueFalse.indexOf(this.columnSearch.searchColumn.colDef) > -1 && this.switchTrueString) this.queryString = '1';
    else if(this.searchFieldsTrueFalse.indexOf(this.columnSearch.searchColumn.colDef) > -1 && !this.switchTrueString) this.queryString = '0';
    else this.queryString = '';
  }

  async autoCompleteSearchColumn(isSearchByOrder: boolean = false) {
   
    this.setQueryString();

    let searchPayload;
    if (isSearchByOrder) {
      searchPayload = {
        query: this.orderNumber,
        tableName: 2,
        column: Column.OrderNumber,
      };
    } else {
      searchPayload = {
        query: this.queryString != '' ? this.queryString : this.columnSearch.searchValue,
        tableName: 4,
        column: this.columnSearch.searchColumn.colDef, 
      };
    }
    this.iAdminApiService.NextSuggestedTransactions(searchPayload).subscribe({
      next: (res: any) => {
        if(res.isExecuted && res.data){
          if (isSearchByOrder) this.searchAutocompleteList = res.data;
          else this.searchAutocompleteListByCol = res.data;
        } else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("NextSuggestedTransactions",res.responseMessage);
        }
      }
    });
  }

  selectedOrderNumber(value: any) {
    this.orderNumber = value;
    this.isHistory ? this.getHistoryData() : this.getContentData();
  }
  
  selectedItemNum(value: any) {
    this.itemNumber = value;
    this.isHistory ? this.getHistoryData() : this.getContentData();
  }

  filterCleared(evt:any)
  {
    if(evt === 'cleared') {
      this.setResetValues();
      this.isHistory ? this.getHistoryData() : this.getContentData("1");
      this.createdBy = '';
      this.transactionDateTime = '';
      this.reason = '';
      this.reasonMessage = '';
    }
    else {
      this.itemNumber='';
      this.orderNumber='';
    }
  }

  setResetValues(){
    this.itemNumber='';
    this.orderNumber='';
    this.isHistory=false;
    this.isHold = false;
    this.customPagination = {
      total: '',
      recordsPerPage: 20,
      startIndex: 0,
      endIndex: 10,
    };
    this.sortCol= 5;
    this.sortOrder= UniqueConstants.Asc;
  }

  deleteReprocessTrans(opened : boolean) {
    let deletePayload;
        switch (!opened && this.selectedVariable && this.selectedVariable) {
          case 'deleteReplenishment':
            deletePayload = {
              id: 0,
              history: false,
              reason: '',
              message: '',
              dateStamp: '',
              itemNumber: '',
              orderNumber: '',
              replenishments: true,
            };
            break;
          case 'deleteSelected':
            deletePayload = {
              id: this.transactionID,
              history: false,
              reason: '',
              message: '',
              dateStamp: '',
              itemNumber: '',
              orderNumber: '',
              replenishments: false,
            };
            break;
          case 'deleteBySelectedReason':
          case 'deleteBySelectedMessage':
            deletePayload = {
              id: 0,
              history: false,
              reason: this.reason,
              message: '',
              dateStamp: '',
              itemNumber: '',
              orderNumber: '',
              replenishments: false,
            };
            break;
          case 'deleteByDateTime':
            deletePayload = {
              id: 0,
              history: false,
              reason: '',
              message: '',
              dateStamp: this.transactionDateTime,
              itemNumber: '',
              orderNumber: '',
              replenishments: false,
            };
            break;
          case 'deleteByItemNumber':
            deletePayload = {
              id: 0,
              history: false,
              reason: '',
              message: '',
              dateStamp: '',
              itemNumber: this.itemNumber,
              orderNumber: '',
              replenishments: false,
            };
            break;
          case 'deleteByOrderNumber':
            deletePayload = {
              id: 0,
              history: false,
              reason: '',
              message: '',
              dateStamp: '',
              itemNumber: '',
              orderNumber: this.orderNumber,
              replenishments: false,
            };
            break;
          default:
            break;
        }
        
        const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
            height: DialogConstants.auto,
            width: Style.w480px,
            autoFocus: DialogConstants.autoFocus,
            disableClose: true,
            data: {
              mode: '',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result == StringConditions.Yes) {
            this.iAdminApiService.ReprocessTransactionDelete(deletePayload).subscribe((res: any) => {
              if (res.isExecuted) {
                this.selectedVariable = '';
                this.global.ShowToastr(ToasterType.Success, labels.alert.update, ToasterTitle.Success);
                this.getContentData('1');
                this.getOrdersWithStatus();
              } 
              else this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
            });
          } else this.selectedVariable = '';
        });
  }

  actionDialog(opened: boolean) {
    if (this.selectedVariable != undefined) {
      if (!opened && this.selectedVariable && this.selectedVariable === StringConditions.set_column_sq) {
        const dialogRef: any = this.global.OpenDialog(ColumnSequenceDialogComponent, {
          height: DialogConstants.auto,
          width: '960px',
          disableClose: true,
          data: { tableName: TableName.OpenTransactionsTemp }
        });

        dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe((result) => {
          this.selectedVariable = '';
          if (result?.isExecuted) this.getColumnsData();
        });
      } else if (this.selectedVariable.includes(UniqueConstants.delete)) this.deleteReprocessTrans(opened);
    }
  }

  sortChange(event) {
    if (!this.dataSource._data._value || event.direction == '' || event.direction == this.sortOrder) return;
    let index;
    this.columnValues.find((x, i) => { if (x === event.active) index = i; });
    this.sortCol = index;
    this.sortOrder = event.direction;
    this.isHistory ? this.getHistoryData() : this.getContentData();
  }

  searchData() {
    if (this.columnSearch.searchColumn || this.columnSearch.searchColumn == '') this.isHistory ? this.getHistoryData() : this.getContentData();
  }

  getFloatFormabelValue(): FloatLabelType {
    return this.floatLabelControlColumn.value ?? 'auto';
  }

  getProcessSelection(checkValues) {
    this.tableEvent = checkValues;
    if (this.tableEvent === StringConditions.history) {
      this.isHistory = true;
      this.getHistoryData();
    }
    else {
      this.isHistory = false;
      this.getContentData();
    }
  }

  reasonFilterEvent(checkValues) {
    if (checkValues === StringConditions.hold) {
      this.isHold = true;
      this.getContentData();
    }
    else {
      this.isHold = false;
      this.getContentData();
    }
  }

  deleteOrder(id: any, event) {
    if (id == 0 || id == -1) {
      let message = "";
      let command = "";

      if(event == StringConditions.reprocess) { command = "reprocess" }
      else if(event == StringConditions.complete) { command = "complete" }
      else if(event == StringConditions.history) { command = "history" }

      if(id == 0) message = "Click ok to mark all transactions as " + command;
      else message = "Click ok to unmark all transactions";


      const dialogRef : any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: DialogConstants.auto,
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: { message: message }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result == StringConditions.Yes) {
          let MarkAsTrue = (id == 0);
          let column = "";

          if (event == StringConditions.reprocess) column = 'Reprocess';
          else if (event == StringConditions.complete) column = 'Post as Complete';
          else column = 'Send to History';

          let payload = {
            Column: column,
            MarkAsTrue: MarkAsTrue, 
          };
          this.iAdminApiService.SetAllReprocessColumn(payload).subscribe({
            next: (res: any) => {
              if (res.data && res.isExecuted) { 
                this.getContentData();
                this.getOrdersWithStatus();
                this.global.ShowToastr(ToasterType.Success, labels.alert.update, ToasterTitle.Success);
              } else {
                this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
                console.log("SetAllReprocessColumn",res.responseMessage);
              }
            }
          });
        }
      });
    }
    else {
      const dialogRef : any = this.global.OpenDialog(FunctionAllocationComponent, {
        height: DialogConstants.auto,
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose:true,
        data: {
          target: 'unassigned',
          function: null
        }
      });

      dialogRef.afterClosed().subscribe(() => {
        let payloadForReprocess = {
          id: id,
          reprocess: 0,
          postComplete: 0,
          sendHistory: 0,
          field: "", 
        }
        this.iAdminApiService.ReprocessIncludeSet(payloadForReprocess).subscribe({
          next: (res: any) => {
            if (res.data && res.isExecuted) {
              this.getContentData();
              this.getOrdersWithStatus();
              this.global.ShowToastr(ToasterType.Success, labels.alert.update, ToasterTitle.Success);
            } else {
              this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
              console.log("ReprocessIncludeSet",res.responseMessage);
            }
          }
        });
      });
    }
  }

  getOrdersWithStatus() {
    let payload = {};
    this.iAdminApiService.OrderToPost(payload).subscribe({
      next: (res: any) => {
        if (res.isExecuted && res.data) {
          this.orders.reprocess = res.data.reprocessCount;
          this.orders.complete = res.data.completeCount;
          this.orders.history = res.data.historyCount;
          this.orders.reprocessOrders = res.data.reprocess;
          this.orders.completeOrders = res.data.complete;
          this.orders.historyOrders = res.data.history;
        } else {
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("OrderToPost", res.responseMessage);
        }
      }
    });
  }

  itemUpdatedEvent() {
    this.getContentData('1');
    this.getOrdersWithStatus();
    this.isEnabled = false; 
    this.clearTransactionData();
  }

  clearTransactionData() {
    this.isEnabled = true;
  }

  selectOrder(row){
    this.selectedOrderObj['orderNumber'] = row.orderNumber;
    this.selectedOrderObj['itemNumber'] = row.itemNumber;
    this.sharedService.updateReprocess(this.selectedOrderObj)
  }

  getColumnsData() {
    let payload = { tableName: TableName.OpenTransactionsTemp };
    this.iAdminApiService.GetColumnSequence(payload).subscribe({
      next: (res: any) => {
        this.displayedColumns = this.TRNSC_DATA;
        if (res.data) {
          this.columnValues = res.data;
          this.getContentData();
        } else {
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("GetColumnSequence",res.responseMessage);
        }
      }
    });
  }

  getContentData(clear = "") {
    this.rowClicked = "";
    let payload = {
      draw: 0,
      searchString: this.queryString != '' ? this.queryString : this.columnSearch.searchValue,
      searchColumn: this.columnSearch.searchColumn.colDef,
      start: this.customPagination.startIndex,
      length: this.customPagination.recordsPerPage,
      orderNumber: clear == "" ? this.orderNumber : "",
      sortColumnNumber: this.sortCol,
      sortOrder: this.sortOrder,
      itemNumber: clear == "" ? this.itemNumber : "",
      hold: this.isHold, 
    };
    this.iAdminApiService.ReprocessTransactionTable(payload).subscribe({
      next: (res: any) => {
        if(res.isExecuted && res.data) { 
          this.detailDataInventoryMap = res.data?.transactions;
          this.dataSource = new MatTableDataSource(res.data?.transactions);
          this.customPagination.total = res.data?.recordsFiltered;        
          this.dataSource.sort = this.sort;
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("ReprocessTransactionTable",res.responseMessage);
        }
      }
    });
    this.clearTransactionData();
    this.clearDelete();
  }

  getHistoryData() {
    this.rowClicked = "";
    let payload = {
      draw: 0,
      searchString: this.columnSearch.searchValue,
      searchColumn: this.columnSearch.searchColumn.colDef,
      start: this.customPagination.startIndex,
      length: this.customPagination.recordsPerPage,
      sortColumnNumber: this.sortCol,
      sortOrder: this.sortOrder,
      orderNumber: "",
      itemNumber: this.itemNumber, 
    };
    this.iAdminApiService.ReprocessedTransactionHistoryTable(payload).subscribe({
      next: (res: any) => {
        if (res.isExecuted && res.data) {
          this.detailDataInventoryMap = res.data?.transactions;
          this.dataSource = new MatTableDataSource(res.data?.transactions);
          this.customPagination.total = res.data?.recordsFiltered;
          this.dataSource.sort = this.sort;
        } else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("ReprocessedTransactionHistoryTable", res.responseMessage);
        }
      }
    });
    this.clearTransactionData();
  }

  handlePageEvent(e: PageEvent) {    
    this.pageEvent = e;
    this.customPagination.startIndex = e.pageSize * e.pageIndex;
    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;
    if(this.isHistory) this.getHistoryData();
    else this.getContentData();
  }

  resetFields() {
    this.columnSearch.searchValue = '';
    this.searchAutocompleteListByCol = [];
    this.orderSelectionSearch = false
    this.searchByColumn.next('');
  }

  openReasonDialog() {
    this.global.OpenDialog(this.description, {
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });
  }

  openReprocessTransactionDialogue(id: any) {
    const dialogRef:any = this.global.OpenDialog(ReprocessTransactionDetailComponent, {
      height: DialogConstants.auto,
      width: '100%',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        transactionID: id,
        history: this.isHistory
      }
    });

    dialogRef.afterClosed().subscribe((x) => {
      if(x === StringConditions.Add){
        this.itemNumber = '';
        this.orderNumber = '';
        if(this.isHistory) this.getHistoryData();
        else this.getContentData();
      }
    });
  }

  getObjChange(event){
    if(event.radioChange){
      this.orderNumber='';
      this.itemNumber='';
      this.customPagination.startIndex=0;
      this.customPagination.total='';
      this.customPagination.recordsPerPage=20;
      this.customPagination.endIndex='';
      this.paginator.pageIndex = 0;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clear() {
    this.columnSearch.searchValue = ''
    this.getContentData()
  }

  recordsToView: string = "";

  selectedOptionChange($event){
    this.recordsToView = $event;
  }

  printPreview(type : string, print = true) {
    let id: number = this.selectedTransaction?.id;
    let history = this.recordsToView == 'history' ? 1 : 0;
    let reason = this.selectedTransaction?.reason;
    let message = this.selectedTransaction?.reasonMessage;
    let date = this.selectedTransaction?.dateStamp;
    let orderNumber = this.orderNumber;
    let itemNumber = this.itemNumber;

    let queryParams = '';

    switch (type) {
      case 'all':
        queryParams = `FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:|Reason:|Message:|Date:`;
        break;
      case 'selected':
        queryParams = `FileName:printReprocessTransactions|History:${history}|ID:${id}|OrderNumber:|ItemNumber:|Reason:|Message:|Date:`;
        break;
      case 'reason':
        queryParams = `FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:|Reason:${reason}|Message:|Date:`;
        break;
      case 'message':
        queryParams = `FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:|Reason:|Message:${message}|Date:`;
        break;
      case 'date':
        queryParams = `FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:|Reason:|Message:|Date:${date}`;
        break;
      case 'item':
        queryParams = `FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:${itemNumber}|Reason:|Message:|Date:`;
        break;
      case 'order':
        queryParams = `FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:${orderNumber}|ItemNumber:|Reason:|Message:|Date:`;
        break;
    }

    const fileLink = `/#/report-view?file=${queryParams}`;

    if (print) this.global.Print(queryParams);
    else window.open(fileLink, UniqueConstants._blank, `width=${screen.width},height=${screen.height},toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0`);
  }
}
