import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MarkoutNewToteAuditDC, MarkoutNewToteAuditKeys, } from 'src/app/common/constants/strings.constants';
import { Placeholders } from 'src/app/common/constants/strings.constants';
import { TableHeaderDefinitions } from 'src/app/common/types/CommonTypes';
import { MarkoutAuditResponse, ToteAudit } from '../models/cm-markout-new-models';
import { MarkoutNewApiService } from 'src/app/common/services/markout-new-api/markout-new-api.service';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GlobalService } from 'src/app/common/services/global.service';
import { IQueryParams } from '../../cm-route-id-management/routeid-list/routeid-IQueryParams';


@Component({
  selector: 'app-markout-new-tote-audit',
  templateUrl: './markout-new-tote-audit.component.html',
  styleUrls: ['./markout-new-tote-audit.component.scss']
})
export class MarkoutNewToteAuditComponent {

  @ViewChild(MatSort) sort!: MatSort;
  private _toteId: number;

  constructor(
    public iMarkoutApiService: MarkoutNewApiService,
    public global: GlobalService,
  ) { }

  searchCol: string = '';
  searchValue: string;

  @Input()
  set toteId(value: number) {
    if (this._toteId !== value && value !== null && value !== undefined) {
      this._toteId = value;
      this.customPagination.pageIndex = 0;
      this.getToteAuditData(value);
    }
  }

  get toteId(): number {
    return this._toteId;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe((sort) => {
      this.customPagination.pageIndex = 0;
      this.getToteAuditData(this.toteId, sort.active, sort.direction);
    });
  }

  customPagination = {
    total: 0,
    pageSize: 5,
    pageIndex: 0,
  };

  // Handles pagination event and fetches updated tote audit data with current sort settings
  handlePageEvent(event: PageEvent) {
    this.customPagination.pageIndex = event.pageIndex;
    this.customPagination.pageSize = event.pageSize;

    // Use current sort info or defaults:
    const sortColumn = this.sort?.active || '';
    const sortOrder = this.sort?.direction || 'desc';

    this.getToteAuditData(this.toteId, sortColumn, sortOrder);
  }

  // Updates search column and value based on user input
  onValueChange(event: { searchCol: string; searchString: string }) {
    this.searchValue = event.searchString;
    if (!event.searchString) {
      this.searchCol = '';
    } else {
      this.searchCol = event.searchCol;
    }
  }

  // Fetches tote audit data with pagination, sorting, and search filters applied
  getToteAuditData(toteId: number, sortColumn: string = '', sortOrder: string = 'desc') {
    let dateSearch: string = '';
    if (this.searchCol.toLowerCase() === MarkoutNewToteAuditDC.StatusDate.toLowerCase() && this.searchValue) {
      dateSearch = this.global.formatSearchDateTimeValue(this.searchValue) || '';
    }
    const rawPayload = {
      page: this.customPagination.pageIndex + 1,
      pageSize: this.customPagination.pageSize,
      searchColumn: this.searchCol
        ? this.global.getColDefForSearchCol(this.searchCol, this.tableColumns)
        : '',
      searchValue: dateSearch ? dateSearch : this.searchValue || '',
      sortColumn: sortColumn,
      sortOrder: sortOrder,
    };

    const payload = this.global.filterQueryParams(rawPayload) as IQueryParams;

    this.iMarkoutApiService
      .GetToteAudit(payload, toteId)
      .subscribe((res: MarkoutAuditResponse) => {
        this.dataSource.data = res.items.map(item => ({
          ...item,
          selected: false
        }));
        this.customPagination.total = res.meta?.totalCount || 0;
        this.customPagination.pageSize = res.meta?.pageSize || 10;
      });
  }

  placeholders = Placeholders;

  displayedColumns: string[] = [
    MarkoutNewToteAuditKeys.Time,
    MarkoutNewToteAuditKeys.Type,
    MarkoutNewToteAuditKeys.Scanner,
    MarkoutNewToteAuditKeys.Divert,
    MarkoutNewToteAuditKeys.Location,
    MarkoutNewToteAuditKeys.Status,
    MarkoutNewToteAuditKeys.StatusDate,
    MarkoutNewToteAuditKeys.DivertReason
  ];

  tableColumns: TableHeaderDefinitions[] = [
    { colHeader: MarkoutNewToteAuditKeys.Time, colDef: MarkoutNewToteAuditDC.Time },
    { colHeader: MarkoutNewToteAuditKeys.Type, colDef: MarkoutNewToteAuditDC.Type },
    { colHeader: MarkoutNewToteAuditKeys.Scanner, colDef: MarkoutNewToteAuditDC.Scanner },
    { colHeader: MarkoutNewToteAuditKeys.Divert, colDef: MarkoutNewToteAuditDC.Divert },
    { colHeader: MarkoutNewToteAuditKeys.Location, colDef: MarkoutNewToteAuditDC.Location },
    { colHeader: MarkoutNewToteAuditKeys.Status, colDef: MarkoutNewToteAuditDC.Status },
    { colHeader: MarkoutNewToteAuditKeys.StatusDate, colDef: MarkoutNewToteAuditDC.StatusDate },
    { colHeader: MarkoutNewToteAuditKeys.DivertReason, colDef: MarkoutNewToteAuditDC.DivertReason }
  ];

  dataSource: MatTableDataSource<ToteAudit> = new MatTableDataSource<ToteAudit>();

  onClearSearch() {
    this.searchValue = '';
    this.getToteAuditData(this.toteId);
  }

  onFilterChange() {
    this.getToteAuditData(this.toteId);
    this.customPagination.pageIndex = 0;
  }
}
