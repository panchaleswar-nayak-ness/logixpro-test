import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import labels from '../../../labels/labels.json';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, Subscription,takeUntil } from 'rxjs';
import { AuthService } from 'src/app/init/auth.service';
import { ColumnSequenceDialogComponent } from '../../dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { ReprocessTransactionDetailComponent } from '../../dialogs/reprocess-transaction-detail/reprocess-transaction-detail.component';
 
import { SharedService } from '../../../services/shared.service';
import { DialogConfig } from '@angular/cdk/dialog';
import { FunctionAllocationComponent } from '../../dialogs/function-allocation/function-allocation.component';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
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
  { colHeader: 'reasonMessage', colDef: 'Reason Message' },
  { colHeader: 'dateStamp', colDef: 'Date Stamp' },
  { colHeader: 'reason', colDef: 'Reason' },
  { colHeader: 'nameStamp', colDef: 'Name Stamp' },
  { colHeader: 'blank', colDef: 'blank' },
];
@Component({
  selector: 'app-reprocess-transaction',
  templateUrl: './reprocess-transaction.component.html',
  styleUrls: ['./reprocess-transaction.component.scss'],
})
export class ReprocessTransactionComponent implements OnInit {
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
  transTypeSelect = 'All Transactions';
  transStatusSelect = 'All Transactions';
  trueString='true';
  switchTrueString=false;
  falseString='false';
  switchFalseString=false;
  searchFieldsTrueFalse=['Label','Emergency','In Process','Master Record'];
  isReprocessedChecked = {flag:false};
  isCompleteChecked = {flag:false};
  isHistoryChecked = {flag:false};
  isHold = false;
  queryString:any='';
  deleteReplenishment=true;
  deleteSelected=false;
  print=false;
  deleteBySelectedReason=false;
  deleteBySelectedMessage=false;
  deleteByDateTime=false;
  deleteByItemNumber=false; //Only visible if searched
  deleteByOrderNumber=false; //Only visible if searched
  private subscription: Subscription = new Subscription();
 
  @ViewChild('description') description: TemplateRef<any>;


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
  public sortOrder: any = 'asc';

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


  /*for data col. */

  constructor( 
    private Api: ApiFuntions,
    private authService: AuthService,
    private toastr: ToastrService, 
    private dialog: MatDialog,
    private sharedService: SharedService,
    private router: Router,
    private global:GlobalService,
  ) { }

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

    this.searchByColumn
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.customPagination.startIndex=0;
        this.customPagination.length=20;
        this.paginator.pageIndex = 0;
        if(this.searchFieldsTrueFalse.indexOf(this.columnSearch.searchColumn.colDef) > -1){
          if(this.trueString.match(this.columnSearch.searchValue.toLowerCase())){
              this.switchTrueString=true;
          }else if(this.falseString.match(this.columnSearch.searchValue.toLowerCase())){
            this.switchTrueString=false;
          }
        }   
        this.autocompleteSearchColumn(false);
        this.getContentData();
      });
  }
  ngAfterViewInit() {
    this.subscription.add(
    this.sharedService.reprocessItemObserver.subscribe(itemNo => {
      if(itemNo){
        this.columnSearch.searchColumn.colDef='Item Number';
        this.columnSearch.searchValue=itemNo;
       
      //  this.onOrderNoChange();
      }
       })
    )
    this.dataSource.paginator = this.paginator;
  }
  clearDelete(showOptions="")
  {
  if(showOptions=="")
  {
    this.deleteReplenishment=true;
    this.deleteSelected=false;
    this.deleteBySelectedReason=false;
    this.deleteBySelectedMessage=false;
    this.deleteByDateTime=false;
    this.print = false;
  
    this.deleteByItemNumber=false; //Only visible if searched
    this.deleteByOrderNumber=false; //Only visible if searched
  }
  else 
  {
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
    console.log(this.selectedTransaction);

    this.isEnabled = false;
    this.transactionID = row.id;

    this.isReprocessedChecked.flag = row.reprocess == 'False' ? false : true;
    this.isCompleteChecked.flag = row.postAsComplete == 'False' ? false : true;
    this.isHistoryChecked.flag = row.sendToHistory == 'False' ? false : true;


    this.itemNumber   = row.itemNumber;
    this.orderNumber  = row.orderNumber;

    this.clearDelete("1");
  }

  getTransactionInfo(completeInfo: boolean) {
    if (!completeInfo) {
      var payload = {
        id: '' + this.transactionID + '',
        username: this.userData.userName,
        wsid: this.userData.wsid,
      }
      this.Api.ReprocessTransactionData(payload).subscribe(
        (res: any) => {
          if (res.data && res.isExecuted) {
            this.createdBy = res.data[0].nameStamp;
            this.transactionDateTime = res.data[0].dateStamp;
            this.reason = res.data[0].reason;
            this.reasonMessage = res.data[0].reasonMessage;
          } else {
            this.toastr.error('Something went wrong', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        },
        (error) => { }
      );
    }
    else {
      //Get complete info for edit popup
    }
  }

  changeTableRowColor(idx: any) {
    this.rowClicked = idx;
  }



  async autocompleteSearchColumn(isSearchByOrder: boolean = false) {
   
    if(this.searchFieldsTrueFalse.indexOf(this.columnSearch.searchColumn.colDef) > -1 && this.switchTrueString){
      this.queryString='1';
    }
    else if(this.searchFieldsTrueFalse.indexOf(this.columnSearch.searchColumn.colDef) > -1 && !this.switchTrueString){
      this.queryString='0';
    }else{
      this.queryString='';
    }


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
        query: this.queryString!=''?this.queryString:this.columnSearch.searchValue,
        tableName: 4,
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
        (error) => { }
      );
  }

  selectedOrderNumber(value: any) {
    this.orderNumber = value;
    // this.getContentData();
    this.isHistory ? this.getHistoryData() : this.getContentData();
  }
  selectedItemNum(value: any) {
    this.itemNumber = value;
    // this.getContentData();
    this.isHistory ? this.getHistoryData() : this.getContentData();
  }

  filterCleared(evt:any)
  {
    if(evt==='cleared'){
      this.setResetValues();
    this.isHistory ? this.getHistoryData() : this.getContentData("1");

    }
    else{
      this.itemNumber='';
      this.orderNumber='';
    // this.isHistory ? this.getHistoryData() : this.getContentData("1");

    }
  
    // this.getContentData("1");
  
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
     this.sortOrder= 'asc';
  }

  actionDialog(opened: boolean) {
    if(this.selectedVariable!=undefined)
    {
      if (!opened && this.selectedVariable && this.selectedVariable === 'set_column_sq') {
        let dialogRef = this.dialog.open(ColumnSequenceDialogComponent, {
          height: 'auto',
          width: '960px',
          disableClose: true,
          data: {
            mode: event,
            tableName: 'Open Transactions Temp',
          },
        });
        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((result) => {
            this.selectedVariable = '';
            if (result && result.isExecuted) {
              this.getColumnsData();
            }
          });
      }
      else
      {
        if(this.selectedVariable.includes('delete'))
        {
          let deletePayload ;
          if (!opened && this.selectedVariable && this.selectedVariable =='deleteReplenishment') 
          {
          deletePayload = 
          {
            "id": 0,
            "history": false,
            "reason": "",
            "message": "",
            "dateStamp": "",
            "itemNumber": "",
            "orderNumber": "",
            "replenishments": true,
            "username": this.userData.userName,
            "wsid": this.userData.wsid
          }
          }
          else if (!opened && this.selectedVariable && this.selectedVariable =='deleteSelected') 
          {
            deletePayload = 
            {
              "id": this.transactionID,
              "history": false,
              "reason": "",
              "message": "",
              "dateStamp": "",
              "itemNumber": "",
              "orderNumber": "",
              "replenishments": false,
              "username": this.userData.userName,
              "wsid": this.userData.wsid
            }
          }
          else if (!opened && this.selectedVariable && this.selectedVariable =='deleteBySelectedReason') 
          {
            deletePayload = 
            {
              "id": 0,
              "history": false,
              "reason": this.reason,
              "message": "",
              "dateStamp": "",
              "itemNumber": "",
              "orderNumber": "",
              "replenishments": false,
              "username": this.userData.userName,
              "wsid": this.userData.wsid
            }
          }
          else if (!opened && this.selectedVariable && this.selectedVariable =='deleteBySelectedMessage') 
          {
            deletePayload = 
            {
              "id": 0,
              "history": false,
              "reason": "",
              "message": this.reasonMessage,
              "dateStamp": "",
              "itemNumber": "",
              "orderNumber": "",
              "replenishments": false,
              "username": this.userData.userName,
              "wsid": this.userData.wsid
            }
          }
          else if (!opened && this.selectedVariable && this.selectedVariable =='deleteByDateTime') 
          {
            deletePayload = 
            {
              "id": 0,
              "history": false,
              "reason": "",
              "message": "",
              "dateStamp": this.transactionDateTime,
              "itemNumber": "",
              "orderNumber": "",
              "replenishments": false,
              "username": this.userData.userName,
              "wsid": this.userData.wsid
            }
          }
          else if (!opened && this.selectedVariable && this.selectedVariable =='deleteByItemNumber') 
          {
            deletePayload = 
            {
              "id": 0,
              "history": false,
              "reason": "",
              "message": "",
              "dateStamp": "",
              "itemNumber": this.itemNumber,
              "orderNumber": "",
              "replenishments": false,
              "username": this.userData.userName,
              "wsid": this.userData.wsid
            }
          }
          else if (!opened && this.selectedVariable && this.selectedVariable =='deleteByOrderNumber') 
          {
            
            deletePayload = 
            {
              "id": 0,
              "history": false,
              "reason": "",
              "message": "",
              "dateStamp": "",
              "itemNumber": "",
              "orderNumber": this.orderNumber,
              "replenishments": false,
              "username": this.userData.userName,
              "wsid": this.userData.wsid
            }
          }
          const dialogRef =  this.dialog.open(DeleteConfirmationComponent, {
            height: 'auto',
            width: '480px',
            autoFocus: '__non_existing_element__',
      disableClose:true,
            data: {
              mode: '',
            }
          })
          dialogRef.afterClosed().subscribe(result => {
            if(result=='Yes')
            {
              this.Api.ReprocessTransactionDelete(deletePayload).subscribe((res: any) => {
    
                this.selectedVariable = "";
                this.toastr.success(labels.alert.update, 'Success!',{
                  positionClass: 'toast-bottom-right',
                  timeOut:2000
               });
  
               this.getContentData("1");
               this.getOrdersWithStatus();
      
          (error) => {
            this.toastr.error('Something went wrong', 'Error!', {
                      positionClass: 'toast-bottom-right',
                      timeOut: 2000,
                    });
          }
        });
            }
            else 
            {
              this.selectedVariable = "";
            }
      
          })
        }

  
        
  
      } 
    }

   

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
    this.isHistory ? this.getHistoryData() : this.getContentData();
  }

  searchData() {
    if (
      this.columnSearch.searchColumn ||
      this.columnSearch.searchColumn == ''
    ) {
      // this.getContentData();
      this.isHistory ? this.getHistoryData() : this.getContentData();
    }
  }
  getFloatFormabelValue(): FloatLabelType {
    return this.floatLabelControlColumn.value || 'auto';
  }
  getProcessSelection(checkValues) {
    this.tableEvent = checkValues;
    if (this.tableEvent === 'history') {
      this.isHistory = true;
      this.getHistoryData();
    }
    else {
      this.isHistory = false;
      this.getContentData();
    }
  }
  reasonFilterEvent(checkValues) {
    if (checkValues === 'hold') {
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
      var message = "";
      var command = "";


      if(event=='reprocess'){command = "reprocess"}
      else if(event=='complete'){command = "complete"}
      else if(event=='history'){command = "history"}

      if(id==0) 
      {
      message = "Click ok to mark all transactions as "+command;
      }
      else 
      {
      message = "Click ok to unmark all transactions";
      }


      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          message: message
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        if(result=='Yes'){

          var MarkAsTrue = (id == 0 ? true : false);
          var column = "";
          if (event == 'reprocess') {
            column = 'Reprocess';
          }
          else if (event == 'complete') {
            column = 'Post as Complete';
          }
          else {
            //history
            column = 'Send to History';
          }
          var payload = {
            Column: column,
            MarkAsTrue: MarkAsTrue,
            username: this.userData.userName,
            wsid: this.userData.wsid,
          }
          this.Api.SetAllReprocessColumn(payload).subscribe(
            (res: any) => {
              if (res.data && res.isExecuted) { 
                this.getContentData();
                this.getOrdersWithStatus();
                this.toastr.success(labels.alert.update, 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000
                });
              } else {
                this.toastr.error('Something went wrong', 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
              }
            },
            (error) => { }
          );


        }
        

      })

    }
    else 
    {


      let dialogRef = this.dialog.open(FunctionAllocationComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          target: 'unassigned',
          function: null
        }
      })
      dialogRef.afterClosed().subscribe(result => {
            var payloadForReprocess = {
              id: id,
              reprocess: 0,
              postComplete: 0,
              sendHistory: 0,
              field: "",
              username: this.userData.userName,
              wsid: this.userData.wsid,
            }
            this.Api.ReprocessIncludeSet(payloadForReprocess).subscribe(
              (res: any) => {
                if (res.data && res.isExecuted) {
                  this.getContentData();
                  this.getOrdersWithStatus();
                  this.toastr.success(labels.alert.update, 'Success!', {
                    positionClass: 'toast-bottom-right',
                    timeOut: 2000
                  });
                } else {
                  this.toastr.error('Something went wrong', 'Error!', {
                    positionClass: 'toast-bottom-right',
                    timeOut: 2000,
                  });
                }
              },
              (error) => { }
            );
  
  
  
          
      
      })
  
  
  
    }



  }
  getOrdersWithStatus() {
    let payload = {
      username: this.userData.userName,
      wsid: this.userData.wsid
    };
    this.Api.OrderToPost(payload).subscribe(
      (res: any) => {
        if (res.data) {
          this.orders.reprocess = res.data.reprocessCount;
          this.orders.complete = res.data.completeCount;
          this.orders.history = res.data.historyCount;

          // if(this.orders.reprocessOrders.length&&this.orders.reprocessOrders.length>0)
          // {
          //   this.orders.reprocessOrders.shift();
          // }
          // if(this.orders.completeOrders.length&&this.orders.completeOrders.length>0)
          // {
          //   this.orders.completeOrders.shift();
          // }
          // if(this.orders.historyOrders.length&&this.orders.historyOrders.length>0)
          // {
          //   this.orders.historyOrders.shift();
          // }
          this.orders.reprocessOrders = res.data.reprocess;

          this.orders.completeOrders = res.data.complete;
          this.orders.historyOrders = res.data.history;

        } else {
          this.toastr.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (error) => { }
    );

  }

  deleteReprocessOrder(record: any) { }

  itemUpdatedEvent(event: any) {
    //alert("TRIGGERED");
    this.getContentData('1');
    this.getOrdersWithStatus();
    this.isEnabled = false; 
    this.clearTransactionData();
  }

  clearTransactionData() {
    this.isEnabled = true;
  }
  selectOrder(row){
    
    this.selectedOrderObj['orderNumber']=row.orderNumber;
    this.selectedOrderObj['itemNumber']=row.itemNumber;

    this.sharedService.updateReprocess(this.selectedOrderObj)
  }
  getColumnsData() {
    let payload = {
      username: this.userData.userName,
      wsid: this.userData.wsid,
      tableName: 'Open Transactions Temp',
    };
    this.Api.GetColumnSequence(payload).subscribe(
      (res: any) => {
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
      (error) => { }
    );
  }


  getContentData(clear="") {
    this.rowClicked = "";
    let payload = {
      draw: 0,
      searchString: this.queryString!=''?this.queryString:this.columnSearch.searchValue,
      searchColumn: this.columnSearch.searchColumn.colDef,
      start: this.customPagination.startIndex,
      length: this.customPagination.recordsPerPage,
      orderNumber: clear==""?this.orderNumber:"",
      sortColumnNumber: this.sortCol,
      sortOrder: this.sortOrder,
      itemNumber: clear==""?this.itemNumber:"" ,
      hold: this.isHold,
      username: this.userData.userName,
      wsid: this.userData.wsid
    };
    this.Api
      .ReprocessTransactionTable(payload)
      .subscribe(
        (res: any) => { 
          // this.getTransactionModelIndex();
          this.detailDataInventoryMap = res.data?.transactions;
          this.dataSource = new MatTableDataSource(res.data?.transactions);
          // this.dataSource.paginator = this.paginator;
          this.customPagination.total = res.data?.recordsFiltered;        
          
          // this.pageEvent = this.paginator;          
          // this.customPagination.startIndex = this.paginator.pageIndex;
          // this.customPagination.endIndex = res.data?.recordsFiltered;
          // this.customPagination.recordsPerPage = this.paginator.pageSize;

          this.dataSource.sort = this.sort;
        },
        (error) => { }
      );


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
      // hold: false,
      username: this.userData.userName,
      wsid: this.userData.wsid
    };
    this.Api
      .ReprocessedTransactionHistoryTable(payload)
      .subscribe(
        (res: any) => {
          // this.getTransactionModelIndex();
          this.detailDataInventoryMap = res.data?.transactions;
          this.dataSource = new MatTableDataSource(res.data?.transactions);
          //  this.dataSource.paginator = this.paginator;
          this.customPagination.total = res.data?.recordsFiltered;
          this.dataSource.sort = this.sort;
        },
        (error) => { }
      );


    this.clearTransactionData();
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
    if(this.isHistory){
      this.getHistoryData()
    }else{
      this.getContentData();
    }
 
  }

  resetFields(event?) {
    // this.orderNo = '';
    this.columnSearch.searchValue = '';
    this.searchAutocompleteListByCol = [];
    this.orderSelectionSearch = false
    this.searchByColumn.next('');
  }

  openReasonDialog(reasonMessage:any)
  {
    const dialogRef = this.dialog.open(this.description, {
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((x) => {

      if (x) {
        //e.description =  this.dialogDescription!=""?this.dialogDescription:e.description 
      }
    })
  }

  openReprocessTransactionDialogue(id: any) {
    const dialogRef = this.dialog.open(ReprocessTransactionDetailComponent, {
      height: 'auto',
      width: '100%',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        transactionID: id,
        history: this.isHistory
      }
    });
    dialogRef.afterClosed().subscribe((x) => {
      
      if(x==='add'){
        this.itemNumber='';
        this.orderNumber='';
        if(this.isHistory){
          this.getHistoryData()
        }else{
          this.getContentData()
        }
      }
      
    })
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
  clear(){
    this.columnSearch.searchValue = ''
    this.getContentData()
  }

  recordsToView: string = "";
  selectedOptionChange($event){
    this.recordsToView = $event;
  }

  printPreview(type:string,print=true){
    let id: number = this.selectedTransaction?.id;
    let history = this.recordsToView == 'history' ? 1 : 0;
    let reason = this.selectedTransaction?.reason;
    let message = this.selectedTransaction?.reasonMessage;
    let date = this.selectedTransaction?.dateStamp;
    let orderNumber = this.orderNumber;
    let itemNumber = this.itemNumber;
    if(type == 'all'){
      if(print){
        this.global.Print(`FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:|Reason:|Message:|Date:`);  
      }
      else{
        window.open(`/#/report-view?file=FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:|Reason:|Message:|Date:`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
      }
    }
    else if(type == 'selected'){
      if(print){
        this.global.Print(`FileName:printReprocessTransactions|History:${history}|ID:${id}|OrderNumber:|ItemNumber:|Reason:|Message:|Date:`);  
      }
      else{
        window.open(`/#/report-view?file=FileName:printReprocessTransactions|History:${history}|ID:${id}|OrderNumber:|ItemNumber:|Reason:|Message:|Date:`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
      }
    }
    else if(type == 'reason'){
      if(print){
        this.global.Print(`FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:|Reason:${reason}|Message:|Date:`);  
      }
      else{
        window.open(`/#/report-view?file=FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:|Reason:${reason}|Message:|Date:`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
      }
    }
    else if(type == 'message'){
      if(print){
        this.global.Print(`FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:|Reason:|Message:${message}|Date:`);  
      }
      else{
        window.open(`/#/report-view?file=FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:|Reason:|Message:${message}|Date:`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
      }
    }
    else if(type == 'date'){
      if(print){
        this.global.Print(`FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:|Reason:|Message:|Date:${date}`);
      }
      else{
        window.open(`/#/report-view?file=FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:|Reason:|Message:|Date:${date}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
      }
    }
    else if(type == 'item'){
      if(print){
        this.global.Print(`FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:${itemNumber}|Reason:|Message:|Date:`);
      }
      else{
        window.open(`/#/report-view?file=FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:|ItemNumber:${itemNumber}|Reason:|Message:|Date:`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
      }
    }
    else if(type == 'order'){
      if(print){
        this.global.Print(`FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:${orderNumber}|ItemNumber:|Reason:|Message:|Date:`);
      }
      else{
        window.open(`/#/report-view?file=FileName:printReprocessTransactions|History:${history}|ID:|OrderNumber:${orderNumber}|ItemNumber:|Reason:|Message:|Date:`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
      }
    }
  }
}
