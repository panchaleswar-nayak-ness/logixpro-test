import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject, Subscription } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { AuthService } from 'src/app/common/init/auth.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';
import { ActivatedRoute } from '@angular/router';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { Column, DialogConstants, Mode, ToasterTitle, ToasterType ,StringConditions,Style,UniqueConstants} from 'src/app/common/constants/strings.constants';

class info {
  title: string;
  value: string;
  colorClass: string;
}

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
  dropDownDefault: string = '';
  displayOrderNumber: string = "";
  displayToteID: string = "";
  @Output() orderNo = new EventEmitter<any>();
  @Output() toteId = new EventEmitter<any>();
  @Output() clearField = new EventEmitter<any>();
  @Output() clearData = new EventEmitter<Event>();

  private subscription: Subscription = new Subscription();
  searchBar = new Subject<any>();

  @Input() orderStatNextData = []; // decorate the property with @Input()
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  searchControl = new FormControl();
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  searchAutocompleteList: any;
  searchAutocompleteListOrderNumber: any = [];
  public userData: any;

  info: info[] =  [
    { title: 'Complete', value: this.completeOrder, colorClass: 'Compete-cart' },
    { title: 'Re-process', value: this.reprocessOrder, colorClass: 'Reprocess-card' },
    { title: 'Open', value: this.openOrder, colorClass: 'Open-card' },
    { title: 'Order type', value: this.orderTypeOrder, colorClass: 'Order-type' },
    { title: 'Total-lines', value: this.totalLinesOrder, colorClass: 'Total-lines' },
    { title: 'Current Status', value: this.currentStatusOrder, colorClass: 'Current-status' }
  ];

  @Output() deleteEvent = new EventEmitter<Event>();

  @Input() set openOrderEvent(event: { value: number }) {
    if (event?.value != null) {
      this.openOrder = event.value;
      this.info[2].value = this.openOrder;
    }
  }
  @Input() set completeOrderEvent(event: { value: number }) {
    if (event?.value != null) {
      this.completeOrder = event.value;
      this.info[0].value = this.completeOrder;
    }
  }
  @Input() set reprocessOrderEvent(event: { value: number }) {
    if (event?.value != null) {
      this.reprocessOrder = event.value;
      this.info[1].value = this.reprocessOrder;
    }
  }
  @Input() set orderTypeOrderEvent(event: { value: string }) {
    if (event?.value != null) {
      this.orderTypeOrder = event.value;
      this.info[3].value = this.orderTypeOrder;
    }
  }
  @Input() set totalLinesOrderEvent(event: { value: number }) {
    if (event?.value != null) {
      this.totalLinesOrder = event.value;
      this.info[4].value = this.totalLinesOrder;
    }
  }
  @Input() set currentStatusOrderEvent(event: { value: string }) {
    if (event?.value != null) {
      this.currentStatusOrder = event.value;
      this.info[5].value = this.currentStatusOrder;
    }
  }


  @Input() set clearFromListEvent(event: Event) {
    if (event) {
      this.clear();
    }
  }
  public iAdminApiService: IAdminApiService;

  constructor(
    public authService: AuthService,
    private global:GlobalService,
    public adminApiService: AdminApiService,
    private sharedService: SharedService,
    private currentTabDataService: CurrentTabDataService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['orderStatNextData']) this.searchAutocompleteListOrderNumber = changes['orderStatNextData'][StringConditions.currentValue];
  }

  checkFilter(e) {
    this.filterByTote = e;
  }

  selectOrderByTote() {
    
    if (this.totalLinesOrder > 0) {
      
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
    this.resetLines();
    this.onOrderNoChange();
    if(this.columnSelect == Column.ToteID){
      this.displayToteID = this.searchField;
      this.displayOrderNumber = "";
    }
    else{
      this.displayOrderNumber = this.searchField;
      this.displayToteID = "";
    }
    this.searchField = "";
    this.searchAutocompleteList = [];
  }

  
  onSelectionChange(e: any){
    this.dropDownDefault = e;
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    },0)
    localStorage.setItem('OrderStatusSelectionDefaultValue', JSON.stringify(this.dropDownDefault));
    this.actionDialog(e);
  }
  ngAfterViewInit() {
    this.subscription.add(
      this.sharedService.orderStatusObserver.subscribe((orderNo) => {
        if (orderNo) {
          this.columnSelect = Column.OrderNumber;
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

        if (this.columnSelect === Column.OrderNumber) {
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
    const savedValue = localStorage.getItem('OrderStatusSelectionDefaultValue');
    const defaultVal = savedValue ? JSON.parse(savedValue) : 'Order Number';
    
    this.dropDownDefault = defaultVal;
    this.columnSelect = defaultVal;
    
    if (!savedValue) {
      localStorage.setItem('OrderStatusSelectionDefaultValue', JSON.stringify(defaultVal));
    }
      this.searchControl.valueChanges.pipe(
        debounceTime(1500) // Wait for 1.5 seconds
      ).subscribe(value => {
        this.autoCompleteSearchColumn();
      });

    this.userData = this.authService.userData();

    this.subscription.add(
      this.sharedService.orderStatusSendOrderObserver.subscribe((orderNo) => {
        if (orderNo) {
          this.displayOrderNumber = orderNo;
          this.filterByTote = false;
          if(this.searchAutocompleteList){
            this.searchAutocompleteList.length = 0;
          }
        }
      })
    );

    this.subscription.add(
      this.sharedService.updateToteFilterCheckObserver.subscribe(() => {
        if(!this.filterByTote) this.filterByTote = true;
        else return;
      })
    );

    this.subscription.add(
      this.sharedService.updateOrderStatusSelectObserver.subscribe((obj) => {
        this.totalLinesOrder = obj.totalRecords ? obj.totalRecords : 0
      })
    );
  }

  getNextItemNo(event: any) {
    if(event.code !== 'CapsLock') {
      this.searchControl.setValue(event.target.value, {emitEvent: true}); // Update the value of the FormControl
    }
  }

  resetLines() {
    this.info[0].value = '0';
    this.info[1].value = '0';
    this.info[2].value = '0';
    this.info[3].value = '-';
    this.info[4].value = '0';
    this.info[5].value = '-';

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
    return this.floatLabelControl.value ?? 'auto';
  }

  onOrderNoChange(option?) {
    let obj = {
      searchField: this.searchField,
      columnFIeld: this.columnSelect,
      completedDate: option?.completedDate ? option?.completedDate : "",
      optionSelect: option ? true : false
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

  searchData(option) {
    this.onOrderNoChange(option);
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
    this.displayOrderNumber = "";
    this.displayToteID = "";
    this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_ORDER_SELECT] = undefined;
  }

  deleteOrder() {
    let payload = {
      OrderNumber: this.searchField,
      TotalLines: JSON.stringify(this.totalLinesOrder)
    };

    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        mode: Mode.DeleteOrderStatus,
        payload: payload,
        action:UniqueConstants.delete
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res.isExecuted) {
        this.deleteEvent.emit(res);
        this.resetLines();
      }
    });
  }

  async autoCompleteSearchColumn() {
    const isOrderNumber = this.columnSelect === Column.OrderNumber;
    const searchPayload = isOrderNumber
      ? { orderNumber: this.searchField }
      : { query: this.searchField, tableName: 1, column: this.columnSelect };
  
    const apiCall = isOrderNumber
      ? this.iAdminApiService.OrderNumberNext(searchPayload)
      : this.iAdminApiService.NextSuggestedTransactions(searchPayload);
  
    apiCall.subscribe({
      next: (res: any) => {
        if (res.isExecuted && res.data) {
          if (!this.searchField){
            this.searchAutocompleteList = [];
            return;
          } 
          this.searchAutocompleteList = res.data;
        } else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log(isOrderNumber ? "OrderNumberNext" : "NextSuggestedTransactions", res.responseMessage);
        }
      }
    });
  }

  actionDialog(event) {
    this.searchField = '';
    this.searchAutocompleteList = [];
    this.sharedService.updateCompDate(event)
  }

  ngOnDestroy() {
    this.searchByOrderNumber.unsubscribe();
    this.searchByToteId.unsubscribe();
    this.subscription.unsubscribe();
  }
}
