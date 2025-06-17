import { Component, EventEmitter, OnInit, Output, ViewChild, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalService } from 'src/app/common/services/global.service';
import { DialogConstants, MarkoutNewPickTotesDC, MarkoutNewPickTotesKeys, Style, ToasterType, ToasterTitle, ToasterMessages, ConfirmationHeadings,ConfirmationMessages, ResponseStrings } from 'src/app/common/constants/strings.constants';
import { Placeholders } from 'src/app/common/constants/strings.constants';
import { ApiResponseData, TableHeaderDefinitions } from 'src/app/common/types/CommonTypes';
import { ToteIdDetailsComponent } from '../dialogs/tote-id-details/tote-id-details.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MarkoutResponse, PickTotes } from '../models/cm-markout-new-models';
import { MarkoutNewApiService } from 'src/app/common/services/markout-new-api/markout-new-api.service';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { IQueryParams } from '../../cm-route-id-management/routeid-list/routeid-IQueryParams';
import { switchMap, EMPTY } from 'rxjs';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-markout-new-pick-totes',
  templateUrl: './markout-new-pick-totes.component.html',
  styleUrls: ['./markout-new-pick-totes.component.scss'],
})
export class MarkoutNewPickTotesComponent implements OnInit {
  @Output() rowSelected = new EventEmitter<PickTotes>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('actionModel') actionModel: NgModel;
  selectedAction: string = '';

  placeholders = Placeholders;

  displayedColumns: string[] = [
    MarkoutNewPickTotesKeys.ToteID,
    MarkoutNewPickTotesKeys.MarkoutStatus,
    MarkoutNewPickTotesKeys.StatusDate,
    MarkoutNewPickTotesKeys.RouteId,
    MarkoutNewPickTotesKeys.DivertReason,
    MarkoutNewPickTotesKeys.Location,
    MarkoutNewPickTotesKeys.Destination,
    MarkoutNewPickTotesKeys.Details,
  ];

  tableColumns: TableHeaderDefinitions[] = [
    {
      colHeader: MarkoutNewPickTotesKeys.ToteID,
      colDef: MarkoutNewPickTotesDC.ToteID,
    },
    {
      colHeader: MarkoutNewPickTotesKeys.MarkoutStatus,
      colDef: MarkoutNewPickTotesDC.MarkoutStatus,
    },
    {
      colHeader: MarkoutNewPickTotesKeys.StatusDate,
      colDef: MarkoutNewPickTotesDC.StatusDate,
    },
    {
      colHeader: MarkoutNewPickTotesKeys.RouteId,
      colDef: MarkoutNewPickTotesDC.RouteId,
    },
    {
      colHeader: MarkoutNewPickTotesKeys.DivertReason,
      colDef: MarkoutNewPickTotesDC.DivertReason,
    },
    {
      colHeader: MarkoutNewPickTotesKeys.Location,
      colDef: MarkoutNewPickTotesDC.Location,
    },
    {
      colHeader: MarkoutNewPickTotesKeys.Destination,
      colDef: MarkoutNewPickTotesDC.Destination,
    },
  ];

  searchCol: string = '';
  searchValue: string;
  dataSource: MatTableDataSource<PickTotes> = new MatTableDataSource<PickTotes>(
    []
  );
  clickTimeout: ReturnType<typeof setTimeout>;

  constructor(
    public iMarkoutApiService: MarkoutNewApiService,
    public readonly global: GlobalService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  customPagination = {
    total: 0,
    pageSize: 10,
    pageIndex: 0,
  };

  handlePageEvent(event: PageEvent) {
    this.customPagination.pageIndex = event.pageIndex;
    this.customPagination.pageSize = event.pageSize;

    // Use current sort info or defaults:
    const sortColumn = this.sort?.active || '';
    const sortOrder = this.sort?.direction || 'desc';

    this.getToteData(sortColumn, sortOrder);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe((sort) => {
      this.getToteData(sort.active, sort.direction);
    });
  }

  getToteData(sortColumn: string = '', sortOrder: string = 'desc') {
    let dateSearch: string = '';
    if (this.searchCol.toLowerCase() === MarkoutNewPickTotesDC.StatusDate.toLowerCase() && this.searchValue) {
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
      .GetMarkoutNewData(payload)
      .subscribe((res: MarkoutResponse) => {
        this.dataSource.data = res.items.map((item) => ({
          ...item,
          selected: false,
        }));

        this.customPagination.total = res.meta?.totalCount || 0;
        this.customPagination.pageSize = res.meta?.pageSize || 10;
        // Optionally select the first row
        if (this.dataSource.data.length > 0) {
          this.selectRow(this.dataSource.data[0]);
        }
        this.refreshTime = new Date();
      });
  }

  refreshTime: Date = new Date();
  refresh() {
    this.getToteData();
  }

  selectRow(row: PickTotes) {
    this.clickTimeout = setTimeout(() => {
      this.dataSource.filteredData.forEach((element) => {
        if (row != element) {
          element.selected = false;
        }
      });
      const selectedRow = this.dataSource.filteredData.find(
        (x: PickTotes) => x === row
      );
      if (selectedRow) {
        selectedRow.selected = true;
        this.rowSelected.emit(row);
      }
    }, 250);
  }

  toteIdDetails(toteData: PickTotes) {
    this.global.OpenDialog(ToteIdDetailsComponent, {
      height: DialogConstants.auto,
      width: Style.w786px,
      data: {
        ...toteData,
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });
  }
  
  // Opens confirmation dialog to resolve the tote; calls API and shows appropriate toast message based on response
  resolved() {
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '560px',
        data: {
          heading: ConfirmationHeadings.ResolveToteId,
          message: ConfirmationMessages.ResolvedToteConfirmation,
          message2: ConfirmationMessages.IrreversibleActionWarning ,
          customButtonText: true,
          btn1Text: ResponseStrings.Resolved,
          btn2Text: ResponseStrings.Cancel,
          checkBox: true,
        },
      })
      .afterClosed()
      .pipe(
        switchMap((result: string) => {
          this.actionModel.reset();
          if (result === ResponseStrings.Yes) {
             const selectedTote = this.dataSource.data.find(tote => tote.selected);
              if (selectedTote) {
                return this.iMarkoutApiService.ResolveMarkoutTote(selectedTote.toteId);
              }
              else{
                return EMPTY;
              }
          } else {
            return EMPTY;
          }
        })
      )
     .subscribe((res: ApiResponseData | null) => {
      if (res?.status === 'Success') {
        this.global.ShowToastr(
          ToasterType.Success,
          ToasterMessages.Resolved,
          ToasterTitle.Success
        );
        this.refresh();
      } else if (res?.errors?.length) {
        this.global.ShowToastr(
          ToasterType.Error,
          res.errors.join(', '),
          ToasterTitle.Error
        );
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.ErrorOccured, // fallback generic message
          ToasterTitle.Error
        );
      }
    });
      
  }
  // Called when filter value changes (column or search string)
  onFilterChange() {
    this.getToteData();
  }

  onValueChange(event: { searchCol: string; searchString: string }) {
    this.searchValue = event.searchString;
    this.searchCol = event.searchCol;
  }

  // Called when input field is cleared
  onClearSearch() {
    this.searchCol='';
    this.searchValue = '';
    this.getToteData();
  }
  
  onActionChange(value: string) {
    if (value === 'resolved') {
      this.resolved();
    }
  }

}
