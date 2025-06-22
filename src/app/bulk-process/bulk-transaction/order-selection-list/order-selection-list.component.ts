import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BatchesResponse, Order, OrderResponse, TotesResponse } from 'src/app/common/Model/bulk-transactions';
import { BulkTransactionView } from 'src/app/common/constants/bulk-process/bulk-transactions';
import { DialogConstants, LiveAnnouncerMessage, Style, TableName } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { OrderDetailsComponent } from 'src/app/dialogs/order-details/order-details.component';

@Component({
  selector: 'app-order-selection-list',
  templateUrl: './order-selection-list.component.html',
  styleUrls: ['./order-selection-list.component.scss']
})
export class OrderSelectionListComponent {
  @Input() url: string;
  @Input() displayedColumns: string[];
  @Input() batchSeleted: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectOrderEmitter = new EventEmitter<Order>();
  @Output() appendAllEmitter = new EventEmitter<any>();
  @ViewChild('paginator1') paginator1: MatPaginator;

  private _view: string;
  @Input() set view(value: string) {
    this._view = value;
    this.setTableHeading();
  }

  get view(): string {
    return this._view;
  }

  private _orders: (OrderResponse | TotesResponse | BatchesResponse)[];
  @Input() set orders(value: (OrderResponse | TotesResponse | BatchesResponse)[]) {
    this._orders = value;
    this.updateDatasource();
  }

  tableHeading: string = TableName.BatchSelectionList;
  datasource: MatTableDataSource<(OrderResponse | TotesResponse | BatchesResponse)>;

  constructor(
    private readonly _liveAnnouncer: LiveAnnouncer,
    private readonly global: GlobalService,
  ) { }

  private setTableHeading(): void {
    switch (this._view) {
      case BulkTransactionView.BATCH:
        this.tableHeading = TableName.BatchSelectionList;
        break;
      case BulkTransactionView.TOTE:
        this.tableHeading = TableName.ToteSelectionList;
        break;
      case BulkTransactionView.ORDER:
        this.tableHeading = TableName.OrderSelectionList;
        break;
    }
  }

  private updateDatasource(): void {
    if (!this._orders) return;
    this.datasource = new MatTableDataSource(this._orders);
    if (this._orders.length) this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator1;
  }

  announceSortChange(sortState: Sort) { 
    if (sortState.direction) this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    else this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    this.datasource.sort = this.sort;
  }

  selectOrder(order : Order) {
    if(!this.batchSeleted){
      this.selectOrderEmitter.emit(order);
      this.datasource.paginator = this.paginator1;
      this.datasource.sort = this.sort;
    }
  }

  appendAll(){
    this.appendAllEmitter.emit();
  }

  viewDetails(element : Order) {
    this.global.OpenDialog(OrderDetailsComponent, {
      height: DialogConstants.auto,
      width: Style.w96vw,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        details: element.orderLines
      }
    });
  }
}
