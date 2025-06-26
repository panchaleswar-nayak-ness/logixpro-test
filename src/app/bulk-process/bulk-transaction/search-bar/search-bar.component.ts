import { Component, ElementRef, EventEmitter, Input, NgZone, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { take, timer } from 'rxjs';
import { BulkTransactionType, BulkTransactionView } from 'src/app/common/constants/bulk-process/bulk-transactions';
import { BatchesResponse, OrderBatchToteQtyResponse, OrderResponse, TotesResponse } from 'src/app/common/Model/bulk-transactions';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  @Input() view: string;
  @Input() orders: (OrderResponse | TotesResponse | BatchesResponse)[];
  @Input() selectedOrders: (OrderResponse | TotesResponse)[];
  @Input() status:OrderBatchToteQtyResponse;
  @Input() batchSeleted: boolean;
  @Input() allowQuickPick: boolean;
  @Input() defaultQuickPick: boolean;
  @Input() isQuickPick: boolean = false;
  @Output() changeViewEmitter = new EventEmitter<any>();
  @Output() addItemEmitter = new EventEmitter<any>();
  @Output() printDetailList = new EventEmitter<any>();
  @Output() isQuickPickChange = new EventEmitter<any>();
  searchText: string = "";
  @Input() bulkTransactionType: string;
  filteredOrders:(OrderResponse | TotesResponse | BatchesResponse)[];
  @ViewChild('openAction') openAction: MatSelect;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;
  @Output() createBatchEmit = new EventEmitter<boolean>();
  BulkTransactionType = BulkTransactionType;
  @ViewChild('quickPickTooltip') quickPickTooltip!: MatTooltip;

  constructor(private ngZone: NgZone,private global: GlobalService) {}

  changeQuickPick(event) {
    this.isQuickPick = event.checked;
    this.isQuickPickChange.emit(this.isQuickPick);
    this.ClearSearch();
  }

  CreateBatch() {
    if (this.selectedOrders.length != 0) {
      this.createBatchEmit.emit(true);
    }
  }

  ngAfterViewInit(): void {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.searchBoxField?.nativeElement.focus();
    });

    this.quickPickTooltip.show();

    timer(10000).pipe(take(1)).subscribe(() => {
      this.quickPickTooltip.hide();
    });
  }


  ClearSearch() {
    this.searchText = ""
    this.filteredOrders = [];
  }

  changeView(event: any) {
    this.changeViewEmitter.emit(event.value);
  }

  search(event: string) {
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

  printShortageZone() {
    if (Array.isArray(this.selectedOrders) && this.selectedOrders.length !== 0) {
      this.global.Print(`FileName:PreviewLocAssPickShortFPZ`);
    }
  }

}
