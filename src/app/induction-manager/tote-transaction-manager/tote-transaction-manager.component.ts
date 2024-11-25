import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/common/init/auth.service';
import { BatchDeleteComponent } from 'src/app/dialogs/batch-delete/batch-delete.component';
import labels from 'src/app/common/labels/labels.json';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ContextMenuFiltersService } from 'src/app/common/init/context-menu-filters.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import {
  ToasterTitle,
  ToasterType,
  ResponseStrings,
  DialogConstants,
  UniqueConstants,
  StringConditions,
  Style,
  TableConstant,
  ColumnDef,
} from 'src/app/common/constants/strings.constants';
import { PrintApiService} from "../../common/services/print-api/print-api.service";
@Component({
  selector: 'app-tote-transaction-manager',
  templateUrl: './tote-transaction-manager.component.html',
  styleUrls: ['./tote-transaction-manager.component.scss'],
})
export class ToteTransactionManagerComponent implements OnInit {
  ELEMENT_DATA: any[] = [
    {
      batch_id: '253215',
      pos_no: '28',
      tote_id: '30022',
      zone: '120322',
      trans_type: 'pick',
      host_trans_id: '123641',
    },
    {
      batch_id: '253215',
      pos_no: '28',
      tote_id: '30022',
      zone: '120322',
      trans_type: 'pick',
      host_trans_id: '123641',
    },
    {
      batch_id: '253215',
      pos_no: '28',
      tote_id: '30022',
      zone: '120322',
      trans_type: 'pick',
      host_trans_id: '123641',
    },
  ];
  public iinductionManagerApi: IInductionManagerApiService;
  pageEvent: PageEvent;
  public dataSource: any = new MatTableDataSource();
  batchId: any = '';
  sortOrder = UniqueConstants.Asc;
  sortCol = 0;
  startRow = 0;
  endRow = 10;
  recordsPerPage = 10;
  totalRecords = 0;
  batchPickId = new Subject<string>();
  userData: any;
  searchAutocompletBatchPick: any = [];
  imPreferences: any;
  public displayedColumns: string[] = [
    TableConstant.BatchPickID,
    'filterCount',
    'toteId',
    TableConstant.transactionType,
    'zoneLabel',
    'hostTransaction',
    ColumnDef.Action,
  ];

  hideRequiredControl = new FormControl(false);
  tableData = this.ELEMENT_DATA;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  dataSourceList: any;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  isActiveTrigger: boolean = false;

  constructor(
    private global: GlobalService,
    private contextMenuService: TableContextMenuService,
    private authService: AuthService,
    public inductionManagerApi: InductionManagerApiService,
    private filterService: ContextMenuFiltersService,
    private printApiService: PrintApiService
  ) {
    this.filterService.filterString = '';
    this.userData = this.authService.userData();
    this.iinductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.autocompleteSearchColumn();
    this.batchPickId
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteSearchColumn();
      });

    this.getToteTrans();
    this.imPreferences = this.global.getImPreferences();
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  clearBatchButt() {
    this.batchId = '';
    this.searchAutocompletBatchPick.length = 0;
    this.FilterString = UniqueConstants.OneEqualsOne;
    this.resetPagination();
    this.getToteTrans();
  }

  clearInfo(type, row?) {
    let enablebatch = false;
    if (row?.batchPickID != '') {
      enablebatch = true;
    }
    if (type != 'pickTote') {
      const dialogRef: any = this.global.OpenDialog(BatchDeleteComponent, {
        height: 'auto',
        width: '60vw',
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          deleteAllDisable: true,
          enableClear: enablebatch,
          batchId: row?.batchPickID ? row.batchPickID : '',
          toteId: row?.toteId ? row.toteId : '',
          userName: this.userData.userName,
          wsid: this.userData.wsid,
          delButtonHide: true,
          transType: row.transactionType
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res.isExecuted) {
          this.getToteTrans();
        }
      });
    } else {
      const dialogRef: any = this.global.OpenDialog(
        DeleteConfirmationComponent,
        {
          height: 'auto',
          width: Style.w600px,
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
          data: {
            mode: 'clear-pick-tote-info',
            action: StringConditions.clear,
            actionMessage:
              type === 'pickTote'
                ? 'the info for all pick batches'
                : 'this batch or tote id',
          },
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (res === ResponseStrings.Yes) {
          this.clearToteInfo();
        }
      });
      // Clear tote info
    }
  }

  getToteTrans() {
    let payload = {
      BatchID: this.batchId ? this.batchId : '',
      StartRow: this.startRow,
      EndRow: this.endRow,
      SortCol: this.sortCol,
      SortOrder: this.sortOrder,
      Filter: this.FilterString,
    };
    this.iinductionManagerApi
      .SelectToteTransManTable(payload)
      .subscribe((res: any) => {
        if (res.isExecuted && res.data) {
          this.totalRecords = res?.data[0]?.totalCount
            ? res.data[0].totalCount
            : 0;
          this.dataSource = new MatTableDataSource(res?.data);
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
          console.log('SelectToteTransManTable', res.responseMessage);
        }
      });
  }

  async autocompleteSearchColumn() {
    let searchPayload = {
      batchID: this.batchId,
    };
    this.iinductionManagerApi
      .SelectBatchPickTA(this.batchId ? searchPayload : null)
      .subscribe(
        (res: any) => {
          if (res.isExecuted && res.data) {
            this.searchAutocompletBatchPick = res.data;
            this.getToteTrans();
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
            console.log('SelectBatchPickTA', res.responseMessage);
          }
        },
        (error) => {}
      );
  }
  clearToteInfo() {
    let payload = {
      appName: '',
    };
    this.iinductionManagerApi
      .ClearPickToteInfo(payload)
      .subscribe((res: any) => {
        if (res.isExecuted) {
          this.getToteTrans();
          this.global.ShowToastr(
            ToasterType.Success,
            labels.alert.delete,
            ToasterTitle.Success
          );
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
          console.log('ClearPickToteInfo', res.responseMessage);
        }
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.startRow = e.pageSize * e.pageIndex;

    this.endRow = e.pageSize * e.pageIndex + e.pageSize;
    this.recordsPerPage = e.pageSize;
    this.getToteTrans();
  }

  sortChange(event) {
    if (
      !this.dataSource._data._value ||
      event.direction == '' ||
      event.direction == this.sortOrder
    )
      return;

    let index;
    this.displayedColumns.forEach((x, i) => {
      if (x === event.active) {
        index = i;
      }
    });

    this.sortCol = index;
    this.sortOrder = event.direction;
    this.getToteTrans();
  }
  printToteList(type, row) {
    switch (type) {
      case 'printCarouselList':
        if (this.imPreferences.printDirectly) {
          this.printApiService.ProcessOffCarListTote(row.toteId, row.transactionType);
        }
        break;
      case 'printToteContents':
        if (this.imPreferences.printDirectly) {
          this.printApiService.ProcessToteContent(row.toteId, row.zone, row.transactionType);
        }
        break;
      case 'printToteLabels':
        if (this.imPreferences.printDirectly) {
          this.printApiService.PrintPrevToteContentsLabel(row.toteId, row.Zone, row.transactionType, -2, '');
        }
        break;
      default:
        break;
    }
  }

  onContextMenu(
    event: MouseEvent,
    SelectedItem: any,
    FilterColumnName?: any,
    FilterConditon?: any,
    FilterItemType?: any
  ) {
    event.preventDefault();
    this.isActiveTrigger = true;
    setTimeout(() => {
      this.contextMenuService.updateContextMenuState(
        event,
        SelectedItem,
        FilterColumnName,
        FilterConditon,
        FilterItemType
      );
    }, 100);
  }

  FilterString: string = UniqueConstants.OneEqualsOne;

  optionSelected(filter: string) {
    this.FilterString = filter;
    this.getToteTrans();
    this.isActiveTrigger = false;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  resetPagination() {
    this.startRow = 0;
    this.paginator.pageIndex = 0;
  }

  ngAfterViewInit() {
    this.searchBoxField?.nativeElement.focus();
  }

  test() {
    this.batchPickId.next('');
    this.batchId = '';
  }

  selectRow(row: any) {
    this.dataSource.filteredData.forEach((element) => {
      if (row != element) {
        element.selected = false;
      }
    });
    const selectedRow = this.dataSource.filteredData.find(
      (x: any) => x === row
    );
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }
}
