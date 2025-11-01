import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { debounceTime, Subject, take, takeUntil, timer } from 'rxjs';
import { BulkTransactionType, BulkTransactionView } from 'src/app/common/constants/bulk-process/bulk-transactions';
import { PrintReports } from 'src/app/common/constants/strings.constants';
import { BatchesResponse, OrderBatchToteQtyResponse, OrderResponse, TotesResponse } from 'src/app/common/Model/bulk-transactions';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnDestroy, AfterViewInit {

  @Input() view: string;
  @Input() orders: (OrderResponse | TotesResponse | BatchesResponse)[];
  @Input() selectedOrders: (OrderResponse | TotesResponse)[];
  @Input() status:OrderBatchToteQtyResponse;
  @Input() batchSeleted: boolean;
  @Input() allowQuickPick: boolean;
  @Input() defaultQuickPick: boolean;
  @Input() isQuickPick: boolean = false;
  @Input() hasEmergencyPick: boolean = false;
  @Input() isEmergencyPick: boolean = false;
  @Output() changeViewEmitter = new EventEmitter<any>();
  @Output() addItemEmitter = new EventEmitter<any>();
  @Output() printDetailList = new EventEmitter<any>();
  @Output() isQuickPickChange = new EventEmitter<any>();
  @Output() isEmergencyPickChange = new EventEmitter<boolean>();
  searchText: string = "";
  @Input() bulkTransactionType: string;
  filteredOrders:(OrderResponse | TotesResponse | BatchesResponse)[];
  @ViewChild('openAction') openAction: MatSelect;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;
  @Output() createBatchEmit = new EventEmitter<boolean>();
  BulkTransactionType = BulkTransactionType;
  @ViewChild('quickPickTooltip') quickPickTooltip!: MatTooltip;
  @ViewChild('emergencyPickTooltip') emergencyPickTooltip!: MatTooltip;

  // Debounce related properties
  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();
  private readonly SEARCH_DEBOUNCE_TIME = 500;
  private readonly TOOLTIP_DURATION = 10000; // 10 seconds

  get showQuickPickLabel(): boolean {
    return this.bulkTransactionType === this.BulkTransactionType.PICK && this.isQuickPick && !this.isEmergencyPick;
  }

  get showEmergencyPickLabel(): boolean {
    return this.bulkTransactionType === this.BulkTransactionType.PICK && this.isEmergencyPick;
  }

  // Validation functions for disabled expressions
  isBatchOptionDisabled(): boolean {
    // Emergency pick overrides quick pick - if emergency is enabled, use emergency count logic
    if (this.isEmergencyPick) {
      return this.status.batchCount < 1;
    }
    return (this.bulkTransactionType == BulkTransactionType.PICK && this.isQuickPick) || this.status.batchCount < 1;
  }

  isToteOptionDisabled(): boolean {
    // Emergency pick overrides quick pick - if emergency is enabled, use emergency count logic
    if (this.isEmergencyPick) {
      return this.status.toteCount < 1;
    }
    return (this.bulkTransactionType == BulkTransactionType.PICK && this.isQuickPick) || this.status.toteCount < 1;
  }

  isOrderOptionDisabled(): boolean {
    // Emergency pick overrides quick pick - if emergency is enabled, use emergency count logic
    if (this.isEmergencyPick) {
      return this.status.orderCount < 1;
    }
    return (this.bulkTransactionType == BulkTransactionType.PICK && this.isQuickPick) || this.status.orderCount < 1;
  }

  get showPickOptions(): boolean {
    return this.bulkTransactionType === this.BulkTransactionType.PICK && (this.allowQuickPick || this.hasEmergencyPick);
  }

  constructor(private readonly ngZone: NgZone, private readonly global: GlobalService) {
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(this.SEARCH_DEBOUNCE_TIME),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  changeQuickPick(event) {
    this.isQuickPick = event.checked;
    this.isQuickPickChange.emit(this.isQuickPick);
    this.ClearSearch();
  }

  changeEmergencyPick(event) {
    this.isEmergencyPick = event.checked;
    this.isEmergencyPickChange.emit(this.isEmergencyPick);
    this.ClearSearch();
  }

  CreateBatch() {
    if (this.selectedOrders.length != 0) {
      this.createBatchEmit.emit(true);
    }
  }

  showTooltip(isEmergency: boolean): void {
    const tooltip = isEmergency ? this.emergencyPickTooltip : this.quickPickTooltip;
    tooltip.show();
    timer(this.TOOLTIP_DURATION).pipe(take(1)).subscribe(() => tooltip.hide());
  }

  ngAfterViewInit(): void {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.searchBoxField?.nativeElement.focus();
    });

    this.showTooltip(this.isEmergencyPick);
  }


  ClearSearch() {
    this.searchText = ""
    this.filteredOrders = [];
  }

  changeView(event: any) {
    this.changeViewEmitter.emit(event.value);
  }

  // This method will be called from template - triggers debounced search
  search(event: string) {
    this.searchSubject.next(event);
  }

  // Actual search implementation with debounce
  private performSearch(event: string) {
    if (!event) {
      this.filteredOrders = [];
      return;
    }

    const getId = (item: any): string | undefined => {
      switch (this.view) {
        case BulkTransactionView.BATCH:
          return (item as BatchesResponse).batchId;
        case BulkTransactionView.TOTE:
          return (item as TotesResponse).toteId;
        case BulkTransactionView.ORDER:
          return (item as OrderResponse).orderNumber;
        default:
          return undefined;
      }
    };

    this.filteredOrders = this.orders.filter(item => {
      const id = getId(item);
      return !!id && id.toLowerCase().startsWith(event.toLowerCase());
    });
  }

  addItem() {

    const matchedOrder = this.filteredOrders.find(
      (o): o is OrderResponse =>
        'orderNumber' in o && o.orderNumber === this.searchText
    );

    if (!this.batchSeleted && matchedOrder) {
      this.addItemEmitter.emit(matchedOrder);
    }
    this.filteredOrders = [];
    this.searchText = "";
  }

  dropdownSelect(event: string) {
    if (!this.batchSeleted) {
      this.addItemEmitter.emit(event);
      this.filteredOrders = [];
    }
    this.searchText = "";
  }

  PrintDetailList() {
    if (this.selectedOrders.length != 0) {
      this.printDetailList.emit();
    }
  }

  clearMatSelectList() {
    this.openAction?.options.forEach((data: MatOption) => data.deselect());
  }

  getDisplayValue(option: OrderResponse | TotesResponse | BatchesResponse): string {
    switch (this.view) {
      case BulkTransactionView.BATCH:
        return 'batchId' in option ? option.batchId ?? '' : '';
      case BulkTransactionView.TOTE:
        return 'toteId' in option ? option.toteId ?? '' : '';
      case BulkTransactionView.ORDER:
        return 'orderNumber' in option ? option.orderNumber ?? '' : '';
      default:
        return '';
    }
  }

  async printPickShortage() {
    if (Array.isArray(this.selectedOrders) && this.selectedOrders.length !== 0) {
      const orders: string[] = this.selectedOrders
        .map(order => order.orderNumber)
        .filter((orderNumber): orderNumber is string => orderNumber !== undefined);

      await this.global.printReportForSelectedOrders(orders, PrintReports.LOC_ASS_PICK_SHORTAGE,true);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
