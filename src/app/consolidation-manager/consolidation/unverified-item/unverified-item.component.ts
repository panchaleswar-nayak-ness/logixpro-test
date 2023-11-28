import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-unverified-item',
  templateUrl: './unverified-item.component.html',
  styleUrls: ['./unverified-item.component.scss']
})

export class UnverifiedItemComponent implements OnInit {

  @Input() startSelectFilterLabel: any;
  @Input() startSelectFilter: any;
  @Input() filterOption: any;
  @Input() filterValue: any;
  @Input() unverifiedItems: any;
  @Input() isItemVisible: any;
  @Input() isSupplyVisible: any;
  @Input() verifyBtn: any;
  @Input() searchAutoCompleteItemNum: any;
  @Input() unverifiedItemsColumns: any;

  @Output() selected = new EventEmitter<any>();
  @Output() filterVal = new EventEmitter<any>();
  @Output() verify = new EventEmitter<any>();
  @Output() verifyAllEmit = new EventEmitter<any>();
  @Output() autoComplete = new EventEmitter<any>();
  @Output() row = new EventEmitter<any>();

  searchByItem: any = new Subject<string>();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('matSort') sort: MatSort;

  constructor(
    private liveAnnouncer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.searchByItem.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => this.autocompleteSearchColumnItem());
  }

  ngOnChanges() {
    this.unverifiedItems.sort = this.sort;
    this.unverifiedItems.paginator = this.paginator;
  }

  getSelected($event: any) {
    this.selected.emit($event);
  }

  filtervalue($event: any) {
    this.filterVal.emit($event);
  }

  verifyLine(element: any) {
    this.verify.emit(element);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    else this.liveAnnouncer.announce('Sorting cleared');
    this.unverifiedItems.sort = this.sort;
  }

  verifyAll() {
    this.verifyAllEmit.emit(true);
  }

  getRow(val: any) {
    this.row.emit(val);
  }

  autocompleteSearchColumnItem() {
    this.autoComplete.emit(this.filterValue)
  }
}
