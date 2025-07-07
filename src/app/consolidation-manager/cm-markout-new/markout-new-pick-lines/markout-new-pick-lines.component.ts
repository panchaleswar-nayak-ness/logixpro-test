import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MarkoutNewPickLinesDC, MarkoutNewPickLinesKeys } from 'src/app/common/constants/strings.constants';
import { Placeholders } from 'src/app/common/constants/strings.constants';
import { TableHeaderDefinitions } from 'src/app/common/types/CommonTypes';
import { MarkoutPickLine, MarkoutPickLinesResponse} from '../models/cm-markout-new-models';
import { MarkoutNewApiService } from 'src/app/common/services/markout-new-api/markout-new-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IQueryParams } from '../../cm-route-id-management/routeid-list/routeid-IQueryParams';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const DEFAULT_TOTAL_COUNT = 0;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SEARCH_VALUE = '';
const DEFAULT_SEARCH_COLUMN = '';
const DEFAULT_PAGE = 1;

@Component({
  selector: 'app-markout-new-pick-lines',
  templateUrl: './markout-new-pick-lines.component.html',
  styleUrls: ['./markout-new-pick-lines.component.scss']
})

export class MarkoutNewPickLinesComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  private _toteId: number;

  placeholders = Placeholders;
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  ItemNumber: string = this.fieldMappings.itemNumber;
  
  displayedColumns: string[] = [
    MarkoutNewPickLinesKeys.Item,
    MarkoutNewPickLinesKeys.Status,
    MarkoutNewPickLinesKeys.ShortReason,
    MarkoutNewPickLinesKeys.StatusDate,
    MarkoutNewPickLinesKeys.Quantity,
    MarkoutNewPickLinesKeys.CompletedQuantity,
    MarkoutNewPickLinesKeys.LocationID,
    MarkoutNewPickLinesKeys.CompletedBy,
  ];

  tableColumns: TableHeaderDefinitions[] = [
    { colHeader: MarkoutNewPickLinesKeys.Item, colDef: MarkoutNewPickLinesDC.Item },
    { colHeader: MarkoutNewPickLinesKeys.Quantity, colDef: MarkoutNewPickLinesDC.Quantity },
    { colHeader: MarkoutNewPickLinesKeys.LocationID, colDef: MarkoutNewPickLinesDC.LocationID },
    { colHeader: MarkoutNewPickLinesKeys.Status, colDef: MarkoutNewPickLinesDC.Status },
    { colHeader: MarkoutNewPickLinesKeys.StatusDate, colDef: MarkoutNewPickLinesDC.StatusDate },
    { colHeader: MarkoutNewPickLinesKeys.CompletedQuantity, colDef: MarkoutNewPickLinesDC.CompletedQuantity },
    { colHeader: MarkoutNewPickLinesKeys.CompletedBy, colDef: MarkoutNewPickLinesDC.CompletedBy },
    { colHeader: MarkoutNewPickLinesKeys.ShortReason, colDef: MarkoutNewPickLinesDC.ShortReason }
  ];

  dataSource: MatTableDataSource<MarkoutPickLine> = new MatTableDataSource<MarkoutPickLine>();

  // --- Suggestive search additions ---
  searchByColumn = new Subject<string>();
  searchAutocompleteListByCol: string[] = [];
  // --- End suggestive search additions ---

  // Mapping from display name to internal key for search columns
  displayNameToKey = {
    "item number": MarkoutNewPickLinesKeys.Item,
    "status": MarkoutNewPickLinesKeys.Status,
    "location": MarkoutNewPickLinesKeys.LocationID,
    "location id": MarkoutNewPickLinesKeys.LocationID,
    "locationid": MarkoutNewPickLinesKeys.LocationID,
    "short reason": MarkoutNewPickLinesKeys.ShortReason,
    "quantity": MarkoutNewPickLinesKeys.Quantity,
    "completed quantity": MarkoutNewPickLinesKeys.CompletedQuantity,
    "completed by": MarkoutNewPickLinesKeys.CompletedBy,
    "status date": MarkoutNewPickLinesKeys.StatusDate,
    // Add more mappings as needed
  };

  constructor(
    public iMarkoutApiService: MarkoutNewApiService,
    public global : GlobalService,
  ) {
    // fire autocomplete 400 ms after the last keystroke
  this.searchByColumn
  .pipe(debounceTime(400), distinctUntilChanged())
  .subscribe(() => this.autoCompleteSearchColumn());
  }

  searchCol: string = '';
  searchValue: string;
  selectedColumnDisplay = '';

  customPagination = {
    total: 0,
    pageSize: 5,
    pageIndex: 0,
  };

  onValueChange(event: { searchCol: string; searchString: string }) {
    this.searchValue = event.searchString;
    this.selectedColumnDisplay = event.searchCol;
    // Normalize the searchCol for robust mapping
    const normalizedCol = event.searchCol.replace(/\s+/g, '').toLowerCase();
    // Try with spaces removed, then with spaces
    this.searchCol = this.displayNameToKey[normalizedCol] || this.displayNameToKey[event.searchCol.toLowerCase()] || event.searchCol;
    // --- Suggestive search: trigger suggestions ---
    this.searchByColumn.next(event.searchString);
    // --- End suggestive search ---
  }

  onFilterChange() {
    if (this.toteId) {
        this.getTotePickLines(this.toteId);
    }
  }

  onClearSearch() {
    this.searchCol = '';
    this.searchValue = '';
    this.searchAutocompleteListByCol = [];
    this.onFilterChange();
  }

  handlePageEvent(event: PageEvent) {
    this.customPagination.pageIndex = event.pageIndex;
    this.customPagination.pageSize = event.pageSize;

    // Use current sort info or defaults:
    const sortColumn = this.sort?.active || '';
    const sortOrder = this.sort?.direction || 'desc';

    this.getTotePickLines(this.toteId,sortColumn, sortOrder);
  }

  ngOnInit(): void {
    this.customPagination.pageIndex = 0;
    if (this.toteId) {
        this.getTotePickLines(this.toteId);
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe((sort) => {
      this.customPagination.pageIndex=0;
      this.getTotePickLines(this.toteId,sort.active, sort.direction);
    });
  }

  // Sets toteId input, resets pagination, and fetches pick lines if the value changes
  @Input()
  set toteId(value: number) {
    if (this._toteId !== value && value !== null && value !== undefined) {
      this._toteId = value;
      this.customPagination.pageIndex = 0;
      this.getTotePickLines(value);
    }
  }
  get toteId(): number {
    return this._toteId;
  }

  // Fetches tote pick lines data with pagination, sorting, and search filters applied
  getTotePickLines(toteId: number,   sortColumn: string = '', sortOrder: string = 'desc') {
    let dateSearch:string = '';
    if (this.searchCol.toLowerCase() === MarkoutNewPickLinesDC.StatusDate.toLowerCase() && this.searchValue) {
      dateSearch=this.global.formatSearchDateTimeValue(this.searchValue) || '';
    }

    const rawPayload = {
        page: this.customPagination.pageIndex + 1,
        pageSize: this.customPagination.pageSize,
        searchColumn: this.searchCol
          ? this.global.getColDefForSearchCol(this.searchCol,this.tableColumns)
          : '',
        searchValue:dateSearch ? dateSearch : this.searchValue || '',
        sortColumn: sortColumn,
        sortOrder: sortOrder,
    };

    const payload = this.global.filterQueryParams(rawPayload) as IQueryParams;

    this.iMarkoutApiService
      .GetTotePickLines(payload, toteId)
      .subscribe((res: MarkoutPickLinesResponse) => {
        this.dataSource.data = res.items.map(item => ({
          ...item
        }));
        this.customPagination.total = res.meta?.totalCount ?? DEFAULT_TOTAL_COUNT;
        this.customPagination.pageSize = res.meta?.pageSize ?? DEFAULT_PAGE_SIZE;
        this.searchAutocompleteListByCol = this.mapSuggestions(
          res.suggestions || []
        );
      });  
  }

  // --- Suggestive search: API call for column autocomplete ---
  private autoCompleteSearchColumn() {
    // 1) bail out if there's nothing to search
    if (!this.searchCol || !this.searchValue) {
      this.searchAutocompleteListByCol = [];
      return;
    }
  
    // 2) build a "suggestions only" payload
    const rawPayload: IQueryParams = {
      page:        DEFAULT_PAGE,          
      pageSize:    DEFAULT_PAGE_SIZE,         
      searchColumn: this.searchCol,
      searchValue:  this.searchValue,
      sortColumn:   '',         
      sortOrder:    ''
    };
  
    // 3) hit the same API and pull out .suggestions
    this.iMarkoutApiService
      .GetTotePickLines(rawPayload, this.toteId)
      .subscribe((res: MarkoutPickLinesResponse) => {
        this.searchAutocompleteListByCol = this.mapSuggestions(
          res.suggestions || []
        );
      });
  }
  // --- End suggestive search ---

  private mapSuggestions(raw: MarkoutPickLine[]): string[] {
    // debugger;
    switch (this.searchCol) {
      case MarkoutNewPickLinesKeys.Item:
        return raw.map((x) => x.itemNumber);
      case MarkoutNewPickLinesKeys.Status:
        return raw.map((x) => x.status);
      case MarkoutNewPickLinesKeys.LocationID:
        return raw.map((x) => x.locationId);
      case MarkoutNewPickLinesKeys.Quantity:
        return raw.map((x) => String(x.quantity));
      case MarkoutNewPickLinesKeys.CompletedQuantity:
        return raw.map((x) => String(x.completeQty));
      case MarkoutNewPickLinesKeys.CompletedBy:
        return raw.map((x) => x.completedBy);
      case MarkoutNewPickLinesKeys.StatusDate:
        return raw.map((x) => x.statusDate);
      case MarkoutNewPickLinesKeys.ShortReason:
        return raw.map((x) => x.shortReason);

      default:
        // fallback if you ever support other columns
        return raw.map((x) => 'N/A');
    }
  }
}


