import { HttpContext, HttpHeaders } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { AuthService } from 'src/app/init/auth.service';
import { BYPASS_LOG } from 'src/app/init/http-interceptor'; 
import labels from '../../../../labels/labels.json';
import { SharedService } from 'src/app/services/shared.service';
import { FilterToteComponent } from 'src/app/admin/dialogs/filter-tote/filter-tote.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tran-select-order',
  templateUrl: './tran-select-order.component.html',
  styleUrls: ['./tran-select-order.component.scss'],
})
export class TranSelectOrderComponent implements OnInit {
  orderNumber: any;
  toteID: any;
  searchText: string;
  openOrder: any = 0;
  completeOrder: any = 0;
  reprocessOrder: any = 0;
  orderTypeOrder: any = '-';
  totalLinesOrder: any = 0;
  currentStatusOrder: any = '-';
  locationZoneData: any = [];
  selectOption;
  columnSelect;
  searchField:any;
  filterByTote: boolean;
  searchByOrderNumber = new Subject<string>();
  searchByToteId = new Subject<string>();
  @Output() orderNo = new EventEmitter<any>();
  @Output() toteId = new EventEmitter<any>();
  @Output() clearField = new EventEmitter<any>();
  @Output() clearData = new EventEmitter<Event>();
  private subscription: Subscription = new Subscription();
  searchBar = new Subject<any>();
  @Input() orderStatNextData = []; // decorate the property with @Input()

  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  searchAutocompleteList: any;
  searchAutocompleteListOrderNumber: any = [];
  public userData: any;

  @Output() deleteEvent = new EventEmitter<Event>();

  @Input() set openOrderEvent(event: Event) {
    if (event) {
      this.openOrder = event;
    }
  }

  @Input() set completeOrderEvent(event: Event) {
    if (event) {
      this.completeOrder = event;
    }
  }
  @Input() set reprocessOrderEvent(event: Event) {
    if (event) {
      this.reprocessOrder = event;
    }
  }

  @Input() set orderTypeOrderEvent(event: Event) {
    if (event) {
      this.orderTypeOrder = event;
    }
  }

  @Input() set totalLinesOrderEvent(event: Event) {
    if (event) {
      // this.totalLinesOrder = event;   // getting it from shared service
    }
  }
  @Input() set currentStatusOrderEvent(event: Event) {
    if (event) {
      this.currentStatusOrder = event;
    }
  }
  @Input()
  set clearEvent(event: any) {

    if (event) {
    }
  }

  @Input() set clearFromListEvent(event: Event) {
    if (event) {
      this.clear();
    }
  }
  constructor(
    public authService: AuthService,
    private Api:ApiFuntions,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private currentTabDataService: CurrentTabDataService,
    private route: ActivatedRoute
  ) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['orderStatNextData']) {
      this.searchAutocompleteListOrderNumber =
        changes['orderStatNextData']['currentValue'];
    }
  }
  checkFilter(e) {
    this.filterByTote = e;
  }

  selectOrderByTote() {
    // && this.totalLinesOrder > 0
    if (this.columnSelect === 'Tote ID' && this.totalLinesOrder > 0) {
      // if data populate and tote id selected then filter only

      this.sharedService.updateFilterByTote({
        filterCheck: this.filterByTote,
        type: this.columnSelect,
      });
      
      this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_ORDER_SELECT] = {
        searchField: this.searchField,
        columnSelect: this.columnSelect,
        filterByTote: this.filterByTote,
        totalLinesOrder: this.totalLinesOrder
      };
    }
  }

  ngAfterViewInit() {
    this.subscription.add(
      this.sharedService.orderStatusObserver.subscribe((orderNo) => {
        if (orderNo) {
          this.columnSelect = 'Order Number';
          this.searchField = orderNo;
          this.onOrderNoChange();
        }
        
      })
    );
    const hasOrderStatus = this.route.snapshot.queryParamMap.has('orderStatus');
    
    if (!hasOrderStatus) {
      if (this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_ORDER_SELECT])
      {
        let param = this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_ORDER_SELECT];
        this.searchField = param.searchField;
        this.columnSelect = param.columnSelect;
        this.filterByTote = param.filterByTote;
        this.totalLinesOrder = param.totalLinesOrder;

        if (this.columnSelect === 'Order Number') {
          this.sharedService.updateOrderStatus(param.searchField);
          this.onOrderNoChange();
        }
        else {
          this.selectOrderByTote();
          this.onOrderNoChange();
        }
      }
      // Perform actions based on the order status
    } 
  }
  ngOnInit(): void {
    
  
    this.userData = this.authService.userData();

    this.subscription.add(
      this.sharedService.orderStatusSendOrderObserver.subscribe((orderNo) => {
        if (orderNo) {
          this.columnSelect = 'Order Number';
          this.searchField = orderNo;
          this.filterByTote = false;
          this.searchAutocompleteList.length=0;
        }
      })

      
    );

    this.subscription.add(
      this.sharedService.updateToteFilterCheckObserver.subscribe((isChecked) => {
        if(!this.filterByTote) {
          this.filterByTote=true;
        }else{
          return
        }

         })
    );

    
    this.subscription.add(
      this.sharedService.updateOrderStatusSelectObserver.subscribe((obj) => {
          this.totalLinesOrder=obj.totalRecords?obj.totalRecords:0
         })
    );


    // this.subscription.add(
    //   this.searchBar
    //     .pipe(debounceTime(300), distinctUntilChanged())
    //     .subscribe((value) => {
    //       if (!value) {
    //         this.resetLines();
    //         this.columnSelect = '';
    //       }
    //       this.autocompleteSearchColumn();
    //       this.onOrderNoChange();
    //     }));

    

  }

  getNextItemNo(event:any){
     
      if(event.target.value==''){
         this.resetLines();
            this.columnSelect = '';
      }
    this.autocompleteSearchColumn();
    this.onOrderNoChange();
  }

  resetLines() {
    this.openOrder = 0;
    this.completeOrder = 0;
    this.reprocessOrder = 0;
    this.orderTypeOrder = '-';
    this.totalLinesOrder = 0;
    this.orderNumber = '';
    this.currentStatusOrder = '-';
    this.filterByTote = false;
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }
  onOrderNoChange() {
    let obj = {
      searchField: this.searchField,
      columnFIeld: this.columnSelect,
    };
    this.orderNo.emit(obj);
    this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_ORDER_SELECT] = {
      searchField: this.searchField,
      columnSelect: this.columnSelect,
      filterByTote: this.filterByTote,
      totalLinesOrder: this.totalLinesOrder
    };
  }
  onToteIdChange(event) {
    this.toteId.emit(event);
  }
  searchData() {
    this.onOrderNoChange();
  }

  selectFieldsReset() {
    this.columnSelect = '';
    this.filterByTote = false;
  }
  clear() {
    this.clearData.emit(event);
    this.resetLines();
    this.sharedService.updateCompDate('Order')
    this.searchAutocompleteList = [];
    this.searchField = '';
    this.columnSelect = '';
    this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_ORDER_SELECT] = undefined; 
  }
  deleteOrder() {

    
    let paylaod = {
      OrderNumber: this.searchField,
      TotalLines: JSON.stringify(this.totalLinesOrder),
      UserName: this.userData.userName,
      WSID: this.userData.wsid,
    };
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete-order-status',
        paylaod: paylaod,
        action:'delete'
        //itemList : this.itemList,
        //  detailData : event
      },

     
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.isExecuted) {
        this.deleteEvent.emit(res);
        this.resetLines();
        // this.deleteEvent.emit(res);

        // this.transactionService
        //   .get(paylaod, '/Admin/DeleteOrderStatus')
        //   .subscribe(
        //     (res: any) => {
        //       if (res.isExecuted) {
        //         this.toastr.success(labels.alert.success, 'Success!', {
        //           positionClass: 'toast-bottom-right',
        //           timeOut: 2000,
        //         });
        //         this.deleteEvent.emit(res.isExecuted);
        //       } else {
        //         this.toastr.error(labels.alert.went_worng, 'Error!', {
        //           positionClass: 'toast-bottom-right',
        //           timeOut: 2000,
        //         });
        //       }
        //     },
        //     (error) => {}
        //     // this.columnValues = res.data?.openTransactionColumns;
        //     // this.columnValues.push('actions');
        //     // this.displayOrderCols=res.data.openTransactionColumns;
        //   );
      }
    });
  }

  async autocompleteSearchColumn() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ',
      }),
      context: new HttpContext().set(BYPASS_LOG, true),
    };
    let searchPayload;
    if (this.columnSelect == 'Order Number') {
      searchPayload = {
        orderNumber: this.searchField,
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };
    } else {
      searchPayload = {
        query: this.searchField,
        tableName: 1,
        column: this.columnSelect,
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };
    }
 
   if( this.columnSelect == 'Order Number'){
    this.Api.OrderNumberNext(searchPayload).subscribe(
      (res: any) => {
        this.searchAutocompleteList = res.data;
      },
      (error) => {}
    );
   }else{
    this.Api.NextSuggestedTransactions(searchPayload).subscribe(
      (res: any) => {
        this.searchAutocompleteList = res.data;
      },
      (error) => {}
    );
   }
  }
  // async autocompleteSearchColumn() {
  //   let searchPayload = {
  //     orderNumber: this.orderNumber,
  //     username: this.userData.userName,
  //     wsid: this.userData.wsid,
  //   };
  //   this.transactionService
  //     .get(searchPayload, '/Admin/OrderNumberNext')
  //     .subscribe(
  //       (res: any) => {
  //         this.searchAutocompleteList = res.data;
  //       },
  //       (error) => {}
  //     );
  // }
  actionDialog(event) {
    this.searchField = '';
    this.searchAutocompleteList = [];
    this.resetLines();
    this.sharedService.updateCompDate(event)
  }
  ngOnDestroy() {
    this.searchByOrderNumber.unsubscribe();
    this.searchByToteId.unsubscribe();
    // this.searchBar.unsubscribe();
    this.subscription.unsubscribe();
  }
}
