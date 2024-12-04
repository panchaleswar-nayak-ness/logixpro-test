import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/common/init/auth.service';
import { ColumnSequenceDialogComponent } from '../../dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { DialogConstants, TableName, ToasterMessages, ToasterTitle, ToasterType ,Column,TableConstant,UniqueConstants,ColumnDef, Placeholders} from 'src/app/common/constants/strings.constants';
import { RouteNames } from 'src/app/common/constants/menu.constants';

@Component({
  selector: 'app-reprocessed-transaction',
  templateUrl: './reprocessed-transaction.component.html',
  styleUrls: ['./reprocessed-transaction.component.scss'],
})
export class ReprocessedTransactionComponent implements OnInit {
  placeholders = Placeholders;
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');

  TRNSC_DATA = [
    { colHeader: TableConstant.ImportDate, colDef: 'Import Date' , colTitle: 'Import Date' },
    { colHeader: TableConstant.ImportBy, colDef: 'Import By', colTitle: 'Import By' },
    { colHeader: 'importFileName', colDef: 'Import Filename', colTitle: 'Import Filename' },
    { colHeader: TableConstant.transactionType, colDef: TableConstant.TransactionType, colTitle: TableConstant.TransactionType },
    { colHeader: UniqueConstants.OrderNumber, colDef: Column.OrderNumber, colTitle: Column.OrderNumber },
    { colHeader: TableConstant.LineNumber, colDef: 'Line Number', colTitle: 'Line Number' },
    { colHeader: 'itemNumber', colDef: Column.ItemNumber, colTitle: this.fieldMappings?.itemNumber || this.placeholders.itemNumberFallback },
    { colHeader: TableConstant.LotNumber, colDef: Column.LotNumber, colTitle: Column.LotNumber },
    { colHeader: ColumnDef.ExpirationDate, colDef: TableConstant.ExpirationDate, colTitle: TableConstant.ExpirationDate },
    { colHeader: TableConstant.SerialNumber, colDef: ColumnDef.SerialNumber, colTitle: ColumnDef.SerialNumber },
    { colHeader: ColumnDef.TransactionQuantity, colDef: TableConstant.TransactionQuantity, colTitle: TableConstant.TransactionQuantity },
    { colHeader: 'reasonMessage', colDef: 'Reason Message', colTitle: 'Reason Message' },
    { colHeader: 'reason', colDef: 'Reason', colTitle: 'Reason' },
    { colHeader: 'dateStamp', colDef: 'Date Stamp', colTitle: 'Date Stamp' },
    { colHeader: 'nameStamp', colDef: 'Name Stamp', colTitle: 'Name Stamp' },
    { colHeader: 'reprocessDate', colDef: 'ReProcess Date', colTitle: 'ReProcess Date' },
    { colHeader: 'reprocessBy', colDef: 'ReProcess By', colTitle: 'ReProcess By' },
    { colHeader: 'reprocessType', colDef: 'ReProcess Type', colTitle: 'ReProcess Type' },
  ];
  public columnValues: any = [];
  public userData: any;
  public displayedColumns: any;
  public dataSource: any = new MatTableDataSource();
  public detailDataTransHistory: any;
  selectedVariable: any;
  onDestroy$: Subject<boolean> = new Subject();
  payload;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  searchBar = new Subject<string>();
  searchAutocompleteList: any;
  public iAdminApiService: IAdminApiService;
  public sortCol:any=0;
  public sortOrder:any=UniqueConstants.Asc;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('matRef') matRef: MatSelect;
  orderSelectionSearch:boolean  = true
  pageEvent: PageEvent;
  cols = [];
  customPagination: any = {
    total: '',
    recordsPerPage: 20,
    startIndex: 0,
    endIndex: 20,
  };
  columnSearch: any = {
    searchColumn: {
      colHeader: '',
      colDef: '',
    },
    searchValue: '',
  };
  sortColumn: any = {
    columnName: 0,
    sortOrder: UniqueConstants.Asc,
  };
  constructor(
    private authService: AuthService,
    public adminApiService: AdminApiService,
    private global:GlobalService
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.searchBar.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => {
      if (!this.columnSearch.searchColumn.colDef) this.getContentData();
      else this.autoCompleteSearchColumn();
    });
    this.userData = this.authService.userData();
    this.getColumnsData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getColumnsData() {
    let payload = { tableName: TableName.ReProcessed };
    this.iAdminApiService.GetColumnSequence(payload).subscribe({
      next: (res: any) => {
        this.displayedColumns = this.TRNSC_DATA;
        if (res.data) {
          this.columnValues = res.data;
          this.getContentData();
        } else {
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("GetColumnSequence",res.responseMessage);
        }
      }
    });
  }

  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }

  getTransactionModelIndex() {
    let paylaod = {
      viewToShow: 2,
      location: '',
      itemNumber: '',
      holds: false,
      orderStatusOrder: '',
      app: RouteNames.Admin,
    };
    this.iAdminApiService.TransactionModelIndex(paylaod).subscribe({
      next: (res: any) => {
        if(res.isExecuted && res.data) this.columnValues = res.data?.reprocessedColumns;
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("TransactionModelIndex",res.responseMessage);
        }
      }
    });
  }

  getContentData() {
    this.payload = {
      draw: 0,
      searchString: this.columnSearch.searchValue,
      searchColumn: this.columnSearch.searchColumn?.colDef ? this.columnSearch.searchColumn?.colDef : "",
      start: this.customPagination.startIndex,
      length: this.customPagination.endIndex,
      sortColumnNumber: this.sortCol,
      sortOrder: this.sortOrder,
    };
    this.iAdminApiService.ReprocessedTransactionTable(this.payload).subscribe({
      next: (res: any) => {
        if(res.isExecuted && res.data) {
          this.detailDataTransHistory = res.data?.transactions;
          this.dataSource = new MatTableDataSource(res.data?.transactions);
          this.customPagination.total = res.data?.recordsFiltered;
          this.dataSource.sort = this.sort;
        } else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("ReprocessedTransactionTable",res.responseMessage);
        }
      }
    });
  }

  searchData(event) {
    if (event == this.columnSearch.searchValue) return;
    if (this.columnSearch.searchColumn || this.columnSearch.searchColumn == '') this.getContentData();
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  async autoCompleteSearchColumn() {
    let searchPayload = {
      query: this.columnSearch.searchValue,
      tableName: 6,
      column: this.columnSearch.searchColumn.colDef,
    };
    this.iAdminApiService.NextSuggestedTransactions(searchPayload).subscribe({
      next: (res: any) => {
        if(res.isExecuted && res.data) {
          this.searchAutocompleteList = res.data;
          this.getContentData();
        } else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("NextSuggestedTransactions",res.responseMessage);
        }
      }
    });
  }

  sortChange(event) {
    if (!this.dataSource._data._value || event.direction=='' || event.direction==this.sortOrder) return;
    let index;
    this.displayedColumns.find((x, i) => { if (x.colDef === event.active) index = i; });
    this.sortCol = index;
    this.sortOrder = event.direction;
    this.getContentData();
  }

  actionDialog(opened: boolean) {
    if (!opened && this.selectedVariable) {
      this.sortCol=0;
      const dialogRef:any = this.global.OpenDialog(ColumnSequenceDialogComponent, {
        height: DialogConstants.auto,
        width: '960px',
        disableClose: true,
        data: {
          mode: event,
          tableName: TableName.ReProcessed,
        },
      });

      dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe((result) => {
        this.clearMatSelectList();
        if (result?.isExecuted) this.getColumnsData();
      });
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.customPagination.startIndex = e.pageSize * e.pageIndex;
    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;
    this.getContentData();
  }

  ngOnDestroy() {
    this.searchBar.unsubscribe();
  }

  clear(){
    this.columnSearch.searchValue = '';
    this.getContentData()
  }

  resetFields() {
    this.columnSearch.searchValue = '';
    this.searchAutocompleteList = [];
    this.orderSelectionSearch = false
    this.searchBar.next('');
  }
}
