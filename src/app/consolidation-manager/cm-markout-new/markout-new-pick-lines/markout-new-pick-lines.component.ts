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
    MarkoutNewPickLinesKeys.Quantity,
    MarkoutNewPickLinesKeys.LocationID,
    MarkoutNewPickLinesKeys.Status,
    MarkoutNewPickLinesKeys.StatusDate,
    MarkoutNewPickLinesKeys.CompletedBy,
    MarkoutNewPickLinesKeys.CompletedQuantity,
    MarkoutNewPickLinesKeys.ShortReason
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

    constructor(
      public iMarkoutApiService: MarkoutNewApiService,
      public global : GlobalService,
    ) { }
  
  searchCol: string = '';
  searchValue: string;

  customPagination = {
    total: 0,
    pageSize: 5,
    pageIndex: 0,
  };

  onValueChange(event: { searchCol: string; searchString: string }) {
    this.searchValue = event.searchString;
    if (!event.searchString) {
      this.searchCol = '';
    } else {
      this.searchCol = event.searchCol;
    }
  }

  onFilterChange() {
    if (this.toteId) {
        this.getTotePickLines(this.toteId);
    }
  }

    onClearSearch() {
    this.searchCol = '';
    this.searchValue = '';
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
      this.customPagination.total = res.meta?.totalCount || 0;
      this.customPagination.pageSize = res.meta?.pageSize || 10;
    });  
}

}


