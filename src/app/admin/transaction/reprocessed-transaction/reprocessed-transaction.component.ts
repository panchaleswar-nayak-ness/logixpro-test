import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/init/auth.service';
import { ColumnSequenceDialogComponent } from '../../dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

const TRNSC_DATA = [
  { colHeader: 'importDate', colDef: 'Import Date' },
  { colHeader: 'importBy', colDef: 'Import By' },
  { colHeader: 'importFileName', colDef: 'Import Filename' },
  { colHeader: 'transactionType', colDef: 'Transaction Type' },
  { colHeader: 'orderNumber', colDef: 'Order Number' },
  { colHeader: 'lineNumber', colDef: 'Line Number' },
  { colHeader: 'itemNumber', colDef: 'Item Number' },
  { colHeader: 'lotNumber', colDef: 'Lot Number' },
  { colHeader: 'expirationDate', colDef: 'Expiration Date' },
  { colHeader: 'serialNumber', colDef: 'Serial Number' },
  { colHeader: 'transactionQuantity', colDef: 'Transaction Quantity' },
  { colHeader: 'reasonMessage', colDef: 'Reason Message' },
  { colHeader: 'reason', colDef: 'Reason' },
  { colHeader: 'dateStamp', colDef: 'Date Stamp' },
  { colHeader: 'nameStamp', colDef: 'Name Stamp' },
  { colHeader: 'reprocessDate', colDef: 'ReProcess Date' },
  { colHeader: 'reprocessBy', colDef: 'ReProcess By' },
  { colHeader: 'reprocessType', colDef: 'ReProcess Type' },
];
@Component({
  selector: 'app-reprocessed-transaction',
  templateUrl: './reprocessed-transaction.component.html',
  styleUrls: ['./reprocessed-transaction.component.scss'],
})
export class ReprocessedTransactionComponent implements OnInit {
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
  public sortCol:any=5;
  public sortOrder:any='asc';
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
    sortOrder: 'asc',
  };
  constructor(
    private Api: ApiFuntions,
    private authService: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.searchBar
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (!this.columnSearch.searchColumn.colDef){
          this.getContentData();
        }
        else{
          this.autocompleteSearchColumn();
        }
      });

    this.userData = this.authService.userData();
    this.getColumnsData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getColumnsData() {
    let payload = {
      username: this.userData.userName,
      wsid: this.userData.wsid,
      tableName: 'ReProcessed',
    };
    this.Api.GetColumnSequence(payload).subscribe(
      {next: (res: any) => {
        this.displayedColumns = TRNSC_DATA;
        if (res.data) {
          this.columnValues = res.data;
          this.getContentData();
        } else {
          this.toastr.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      error: (error) => {}}
    );
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
      app: 'Admin',
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .TransactionModelIndex(paylaod)
      .subscribe(
        {next: (res: any) => {
          this.columnValues = res.data?.reprocessedColumns;
        },
        error: (error) => {}}
      );
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
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .ReprocessedTransactionTable(this.payload)
      .subscribe(
        {next: (res: any) => {
          this.detailDataTransHistory = res.data?.transactions;
          this.dataSource = new MatTableDataSource(res.data?.transactions);
          this.customPagination.total = res.data?.recordsFiltered;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {}}
      );
  }
  searchData(event) {
    if (event == this.columnSearch.searchValue) return;
    if (
      this.columnSearch.searchColumn ||
      this.columnSearch.searchColumn == ''
    ) {
      this.getContentData();
    }
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  async autocompleteSearchColumn() {
    let searchPayload = {
      query: this.columnSearch.searchValue,
      tableName: 6,
      column: this.columnSearch.searchColumn.colDef,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .NextSuggestedTransactions(searchPayload)
      .subscribe(
       { next: (res: any) => {
          this.searchAutocompleteList = res.data;
          this.getContentData();
        },
        error: (error) => {}}
      );
  }
  sortChange(event) {
    if (!this.dataSource._data._value || event.direction=='' || event.direction==this.sortOrder) return;
    let index;
    this.displayedColumns.find((x, i) => {
      if (x.colDef === event.active) {
        index = i;
      }
    });

    this.sortCol = index;
    this.sortOrder = event.direction;
    this.getContentData();
  }

  
  actionDialog(opened: boolean) {
    if (!opened && this.selectedVariable) {
      this.sortCol=0;
      let dialogRef = this.dialog.open(ColumnSequenceDialogComponent, {
        height: 'auto',
        width: '960px',
        disableClose: true,
        data: {
          mode: event,
          tableName: 'ReProcessed',
        },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          this.clearMatSelectList();
          if (result?.isExecuted) {
            this.getColumnsData();
          }
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
    this.columnSearch.searchValue = ''
    this.getContentData()

  }

  resetFields(event?) {
    this.columnSearch.searchValue = '';
    this.searchAutocompleteList = [];
    this.orderSelectionSearch = false
    this.searchBar.next('');
  }
}
