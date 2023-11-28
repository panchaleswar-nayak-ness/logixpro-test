import { Component, OnInit, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator'; 
import { AuthService } from 'src/app/common/init/auth.service'; 
import { HoldReasonComponent } from 'src/app/admin/dialogs/hold-reason/hold-reason.component';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { Column, DialogConstants, Mode, ToasterTitle, ToasterType ,Style,UniqueConstants} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-open-transaction-data-table',
  templateUrl: './open-transaction-data-table.component.html',
  styleUrls: ['./open-transaction-data-table.component.scss'],
})
export class OpenTransactionDataTableComponent implements OnInit {
  displayedColumns: string[] = [
    'orderNumber',
    'itemNumber',
    'wareHouse',
    'location',
    'transactionType',
    'transactionQuantity',
    'serialNumber',
    'lotNumber',
    'lineNumber',
    'hostTransactionID',
    'toteID',
    'id',
    'actions',
  ];
  identify=Column.OrderNumber;
  reels='non';
  orderItem='';
  payload: any;
  dataSource: any = [];
  userData;
  customPagination: any = {
    total: '',
    recordsPerPage:10,
    startIndex: 0,
    endIndex: 10,
  };
  public sortCol: any = 5;
  public sortOrder: any = UniqueConstants.Asc;
  public columnValues: any = [];
  pageEvent: PageEvent;

  public iAdminApiService: IAdminApiService;

  constructor(
    public adminApiService: AdminApiService,
    private authService: AuthService,
    private global: GlobalService
  ) {
    this.iAdminApiService = adminApiService;
  }

  @Input()
  set event(event: any) {
    if (event) {
    this.identify = event.selectedOption;
    this.orderItem = event.searchValue;
    this.reels = event.selectedCheck;
    this.getContentData();
    }
  }

  ngOnInit(): void {
    this.customPagination = {
      total: '',
      recordsPerPage: 10,
      startIndex: 0,
      endIndex: 10,
    };
    this.userData = this.authService.userData();
    this.getContentData();
  }

  getContentData() {
    this.payload = {
      draw: 0,
      sRow: this.customPagination.startIndex,
      eRow: this.customPagination.endIndex,
      sortColumnNumber:  this.sortCol,
      sortOrder: this.sortOrder,
      identify: this.identify,
      reels: this.reels,
      orderItem: this.orderItem,
    };
    this.iAdminApiService.HoldTransactionsData(this.payload).subscribe(
      (res: any) => {
        if(res.isExecuted && res.data) this.dataSource = res.data.holdTransactions;
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("HoldTransactionsData",res.responseMessage);
        }
      },
      (error) => {}
    );
  }

  sortChange(event) {
    if (!this.dataSource || event.direction == '') return;
    let index;
    this.displayedColumns.forEach((x, i) => { if (x === event.active) index = i; });
    this.sortCol = index;
    this.sortOrder = event.direction;
    this.getContentData();
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.customPagination.startIndex = e.pageSize * e.pageIndex;
    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;
    this.getContentData();
  }

  holdDeallocate(row){
    const dialogRef: any = this.global.OpenDialog(HoldReasonComponent, {
      height: DialogConstants.auto,
      width: Style.w480px,
      data: {
        mode: Mode.HoldTransactions,
        reel:this.reels,
        orderItem: this.orderItem,
        order:this.identify === Column.OrderNumber,
        id:row.id
      },
    });

    dialogRef.afterClosed().subscribe((res) => { if(res.isExecuted) this.getContentData(); });
  }

  selectRow(row: any) {
    this.dataSource.forEach(element => { if(row != element) element.selected = false; });
    const selectedRow = this.dataSource.find((x: any) => x === row);
    if(selectedRow) selectedRow.selected = !selectedRow.selected;
  }
}
