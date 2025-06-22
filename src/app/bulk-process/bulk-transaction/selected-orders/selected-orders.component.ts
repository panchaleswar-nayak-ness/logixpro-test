import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BulkTransactionView } from 'src/app/common/constants/bulk-process/bulk-transactions';
import { LiveAnnouncerMessage, TableName } from 'src/app/common/constants/strings.constants';
import { BatchesResponse, OrderResponse, TotesResponse } from 'src/app/common/Model/bulk-transactions';

@Component({
  selector: 'app-selected-orders',
  templateUrl: './selected-orders.component.html',
  styleUrls: ['./selected-orders.component.scss']
})
export class SelectedOrdersComponent {

  @Input() selectedDisplayedColumns: string[];
  @Output() removeOrderEmitter = new EventEmitter<(OrderResponse | TotesResponse | BatchesResponse)>();
  @Output() removeAllEmitter = new EventEmitter();

  private _view: string;
  @Input()
  set view(value: string) {
    this._view = value;
    this.updateTableHeading();
  }

  get view(): string {
    return this._view;
  }

  private _selectedOrders: (OrderResponse | TotesResponse)[] = [];
  @Input()
  set selectedOrders(value: (OrderResponse | TotesResponse)[]) {
    this._selectedOrders = value ?? [];
    this.updateDataSource();
  }

  get selectedOrders(): (OrderResponse | TotesResponse)[] {
    return this._selectedOrders;
  }

  tableHeading = TableName.SelectedOrders;
  datasource: MatTableDataSource<(OrderResponse | TotesResponse)>;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _liveAnnouncer: LiveAnnouncer
  ) { }


  private updateTableHeading() {
    this.tableHeading = (this.view === BulkTransactionView.BATCH || this.view === BulkTransactionView.ORDER)
      ? TableName.SelectedOrders
      : TableName.SelectedTotes;
  }

  private updateDataSource() {
    this.datasource = new MatTableDataSource(this.selectedOrders);
    if (this.selectedOrders.length) {
      this.datasource.sort = this.sort;
    }
    this.datasource.paginator = this.paginator1;
  }

  removeOrder(order: OrderResponse | TotesResponse | BatchesResponse) {
    this.removeOrderEmitter.emit(order);
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator1;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.datasource.sort = this.sort;
  }

  removeAll() {
    this.removeAllEmitter.emit();
  }

}
