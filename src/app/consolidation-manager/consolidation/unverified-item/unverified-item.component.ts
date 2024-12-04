import {LiveAnnouncer} from '@angular/cdk/a11y';
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {LiveAnnouncerMessage, Placeholders} from 'src/app/common/constants/strings.constants';

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
  @Input() focusOnSearch: boolean = false;

  @Output() selected = new EventEmitter<any>();
  @Output() filterVal = new EventEmitter<{ event: KeyboardEvent, filterValue: string }>();
  @Output() verify = new EventEmitter<any>();
  @Output() verifyAllEmit = new EventEmitter<any>();
  @Output() autoComplete = new EventEmitter<any>();
  @Output() row = new EventEmitter<any>();

  searchByItem: any = new Subject<string>();
  placeholders = Placeholders;

  @ViewChild('itemNumberInput') itemNumberInput: ElementRef;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('matSort') sort: MatSort;

  constructor(
    private liveAnnouncer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.searchByItem.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => this.autocompleteSearchColumnItem());
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['focusOnSearch'])
      this.clearAndFocusInput();
    this.unverifiedItems.sort = this.sort;
    this.unverifiedItems.paginator = this.paginator;
  }

  getSelected($event: any) {
    this.selected.emit($event);
  }

  filtervalue($event: any) {
    this.filterVal.emit({ event : $event, filterValue : this.filterValue});
  }

  verifyLine(element: any) {
    this.verify.emit(element);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    else this.liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
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

  clearAndFocusInput() {
    this.filterValue = '';
    this.itemNumberInput.nativeElement.focus();
  }
}
