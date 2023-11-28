import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OmAddRecordComponent } from '../om-add-record/om-add-record.component';
import { OmUserFieldDataComponent } from '../om-user-field-data/om-user-field-data.component';
import { AuthService } from 'src/app/common/init/auth.service';
import { Router } from '@angular/router';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import labels from 'src/app/common/labels/labels.json';
import { MatAutocomplete } from '@angular/material/autocomplete'; 
import { ColumnSequenceDialogComponent } from 'src/app/admin/dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator'; 
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { GlobalService } from 'src/app/common/services/global.service';
import { OrderManagerApiService } from 'src/app/common/services/orderManager-api/order-manager-api.service';
import { IOrderManagerAPIService } from 'src/app/common/services/orderManager-api/order-manager-api-interface';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import {  ToasterTitle ,LiveAnnouncerMessage,ResponseStrings,Column,ToasterType,DialogConstants,TableConstant,ColumnDef,Style,UniqueConstants,FilterColumnName} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-om-create-orders',
  templateUrl: './om-create-orders.component.html',
  styleUrls: ['./om-create-orders.component.scss']
})
export class OmCreateOrdersComponent implements OnInit {
  omPreferences: any;
  @ViewChild('ordfocus') ordfocus: ElementRef;
  displayedColumns: any[] = [];
  isActiveTrigger: boolean = false;
  public iAdminApiService: IAdminApiService;
  sequenceKeyMapping: any = [
    { sequence: 'Transaction Type', key: 'transactionType' },
    { sequence: Column.OrderNumber, key: 'orderNumber' },
    { sequence: 'Priority', key: 'priority' },
    { sequence: 'Required Date', key: 'requiredDate' },
    { sequence: TableConstant.UserField1, key: ColumnDef.userField1 },
    { sequence: TableConstant.UserField2, key: ColumnDef.userField2 },
    { sequence: 'User Field3', key: ColumnDef.userField3 },
    { sequence: 'User Field4', key: ColumnDef.userField4 },
    { sequence: 'User Field5', key: ColumnDef.userField5 },
    { sequence: 'User Field6', key: ColumnDef.userField6 },
    { sequence: 'User Field7', key: ColumnDef.userField7 },
    { sequence: 'User Field8', key: ColumnDef.userField8 },
    { sequence: 'User Field9', key: ColumnDef.userField9 },
    { sequence: 'User Field10', key: ColumnDef.userField10 },
    { sequence: Column.ItemNumber, key: 'itemNumber' },
    { sequence: 'Description', key: 'description' },
    { sequence: 'Line Number', key: 'lineNumber' },
    { sequence: 'Transaction Quantity', key: 'transactionQuantity' },
    { sequence: 'Warehouse', key: 'warehouse' },
    { sequence: 'Line Sequence', key: TableConstant.LineSequence },
    { sequence: 'In Process', key: 'inProcess' },
    { sequence: 'Processing By', key: 'processingBy' },
    { sequence: FilterColumnName.unitOfMeasure, key: 'unitOfMeasure' },
    { sequence: 'Import By', key: 'importBy' },
    { sequence: 'Import Date', key: 'importDate' },
    { sequence: 'Import Filename', key: 'importFilename' },
    { sequence: 'Expiration Date', key: 'expirationDate' },
    { sequence: Column.LotNumber, key: 'lotNumber' },
    { sequence: 'Serial Number', key: 'serialNumber' },
    { sequence: 'Notes', key: 'notes' },
    { sequence: TableConstant.Revision, key: 'revision' },
    { sequence: 'ID', key: 'id' },
    { sequence: TableConstant.HostTransactionID, key: 'hostTransactionID' },
    { sequence: 'Emergency', key: 'emergency' },
    { sequence: 'Label', key: 'label' },
    { sequence: 'Batch Pick ID', key: 'batchPickID' },
    { sequence: Column.ToteID, key: 'toteID' },
    { sequence: 'Cell', key: 'cell' },
    { sequence: 'Label', key: 'label' },
    { sequence: 'Label', key: 'label' },
  ];

  filterColumnNames: any = [];
  sortedFilterColumnNames: any = [];
  createOrdersDTSubscribe: any;
  createOrdersDTPayload: any = {
    orderNumber: "",
    filter: "1 = 1"
  };
  tableData: any = [];
  userData: any;
  allowInProc: any = 'False';
  otcreatecount: any = 0;
  orderNumberSearchList: any;
  @ViewChild("searchauto", { static: false }) autocompleteOpened: MatAutocomplete;
  selectedTransaction: any = {};
  selectedFilterColumn: string = "";
  selectedFilterString: string;
  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild('paginator1') paginator1: MatPaginator;
  public iOrderManagerApi: IOrderManagerAPIService;

  constructor(
    private global: GlobalService,
    private contextMenuService: TableContextMenuService,
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<OmCreateOrdersComponent>,
    public adminApiService: AdminApiService,
    public orderManagerApi: OrderManagerApiService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.iOrderManagerApi = orderManagerApi;
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getColumnSequence();
    this.omPreferences = this.global.getOmPreferences();
  }

  openOmAddRecord() {
    let dialogRef: any = this.global.OpenDialog(OmAddRecordComponent, {
      height: 'auto',
      width: '75vw',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        from: "add-new-order",
        heading: "Adding a New Order Number",
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createOrdersDTPayload.orderNumber = result.orderNumber;
        this.createOrdersDT();
      }
    });
  }

  openOmEditTransaction(element: any) {
    let dialogRef: any = this.global.OpenDialog(OmAddRecordComponent, {
      height: 'auto',
      width: '75vw',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        from: "edit-transaction",
        heading: `Updating a transaction for ${this.createOrdersDTPayload.orderNumber}`,
        transaction: element,
        orderNumber: this.createOrdersDTPayload.orderNumber
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createOrdersDTPayload.orderNumber = result.orderNumber;
        this.createOrdersDT();
      }
    });
  }

  announceSortChange(sortState: Sort) {
    sortState.active = this.sequenceKeyMapping.filter((x: any) => x.sequence == sortState.active)[0]?.key;
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.tableData.sort = this.sort1;
  }

  openOmAddTransaction(element: any = {}) {
    if (this.tableData.filteredData.length == 0) {
      return;
    }
    if (!element.orderNumber && this.tableData.filteredData.length == 1) {
      element = this.tableData.filteredData[0];
    }
    let dialogRef: any = this.global.OpenDialog(OmAddRecordComponent, {
      height: 'auto',
      width: '75vw',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        from: "add-transaction",
        heading: `Adding a new transaction for ${this.createOrdersDTPayload.orderNumber}`,
        transaction: element,
        orderNumber: this.createOrdersDTPayload.orderNumber
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createOrdersDTPayload.orderNumber = result.orderNumber;
        this.createOrdersDT();
      }
    });
  }

  openOmUserFieldData() {
    let dialogRef: any = this.global.OpenDialog(OmUserFieldDataComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe(result => {


    })
  }

  createOrdersDT(loader: boolean = false) {
    if (this.createOrdersDTPayload.orderNumber.trim() != '') {
      this.iOrderManagerApi.CreateOrdersDT(this.createOrdersDTPayload).subscribe((res: any) => {
        if (res.isExecuted) {
          if (res.data) {
            this.tableData = new MatTableDataSource(res.data);
            this.tableData.paginator = this.paginator1;
          } else {
            this.tableData = new MatTableDataSource();
          }
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("CreateOrdersDT", res.responseMessage);
        }
      });
    }
    else {
      this.tableData = new MatTableDataSource([]);
    }
  }

  goToOrderStatus() {
    this.router.navigate(
      ['/OrderManager/OrderStatus']
    );
    this.dialogRef.close();
  }

  releaseOrders() {
    if (this.allowInProc == "False" && this.otcreatecount > 0) {
      this.global.ShowToastr(ToasterType.Error, '"You may not release an Order that is already in progress', 'Release Transactions');
      return;
    }

    let dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        heading: 'Release Transaction',
        message: 'Release all orders for this order number?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        let payload = {
          "val": this.createOrdersDTPayload.orderNumber,
          "page": "Create Orders",
        };
        this.iOrderManagerApi.ReleaseOrders(payload).subscribe((res: any) => {
          if (res.isExecuted && res.data) {
            this.global.ShowToastr(ToasterType.Success, "Order Released Successfully!", ToasterTitle.Success);
          }
          else {
            this.global.ShowToastr(ToasterType.Success, "Order Released Successfully!", ToasterTitle.Success);
            console.log("ReleaseOrders", res.responseMessage);

          }
          this.createOrdersDTPayload.orderNumber = '';
          this.createOrdersDT();
          dialogRef.close();
        });
      }
    });
  }

  printViewed() {
    this.omPreferences = this.global.getOmPreferences();
    let tabIDs = this.tableData.filteredData?.length > 0 ? this.tableData.filteredData.map((x: any) => x.id).toString() : '';

    if (this.omPreferences.printDirectly) {
      this.global.Print(`FileName:PrintReleaseOrders|tabIDs:${tabIDs}|View:|Table:|Page:${'Create Orders'}|WSID:${this.userData.wsid}`);

    } else {
      window.open(`/#/report-view?file=FileName:PrintReleaseOrders|tabIDs:${tabIDs}|View:|Table:|Page:${'Create Orders'}|WSID:${this.userData.wsid}`, UniqueConstants._blank, 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

    }

  }

  deleteViewed() {
    if (this.tableData.length == 0) {
      this.global.ShowToastr(ToasterType.Error, 'There are currently no records within the table', 'Warning');
    }
    else {
      let ids = [];
      ids = this.tableData.filteredData.map(x => x.id.toString());
      const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
        height: 'auto',
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          mode: 'release-all-orders',
          ErrorMessage: 'Are you sure you want to delete these records?',
          action: 'delete'
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === ResponseStrings.Yes) {
          let payload = {
            "ids": ids,
            "user": this.userData.userName,
          };
          this.iOrderManagerApi.OTPendDelete(payload).subscribe((res: any) => {
            if (res.isExecuted && res.data) {
              this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
              this.createOrdersDTPayload.filter = "1 = 1";
              this.selectedFilterColumn = '';
              this.selectedFilterString = '';
              this.createOrdersDT();
              dialogRef.close();
            } else {
              this.global.ShowToastr(ToasterType.Error, "An error has occurred while deleting the viewed records", ToasterTitle.Error);
              console.log("OTPendDelete", res.responseMessage);
            }
          });
        }
      });
    }
  }

  selectColumnSequence() {
    let dialogRef: any = this.global.OpenDialog(ColumnSequenceDialogComponent, {
      height: 'auto',
      width: '960px',
      disableClose: true,
      data: {
        mode: event,
        tableName: 'Order Manager Create',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.isExecuted) {
        this.getColumnSequence();
      }
    });
  }

  searchItem(loader: boolean = false, searchData: boolean = false) {
    if (this.createOrdersDTPayload.orderNumber.trim() != '') {
      let payload = {
        "orderNumber": this.createOrdersDTPayload.orderNumber,
      }
      this.iOrderManagerApi.CreateOrderTypeahead(payload).subscribe((res: any) => {
        if (res.isExecuted && res.data) {
          this.orderNumberSearchList = res.data.sort();
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("CreateOrderTypeahead", res.responseMessage);

        }
      });
      if (searchData) {
        this.createOrdersDT();
      }
    }
    else {
      this.orderNumberSearchList = [];
    }
  }

  onSearchSelect(e: any) {
    this.createOrdersDTPayload.orderNumber = e.option.value;
    this.createOrdersDT();
    this.orderNumberSearchList = [];
  }

  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault()
    this.isActiveTrigger = true;
    setTimeout(() => {
      this.contextMenuService.updateContextMenuState(event, SelectedItem, FilterColumnName, FilterConditon, FilterItemType);
    }, 100);
  }

  optionSelected(filter: string) {
    this.createOrdersDTPayload.filter = filter;
    this.paginator1.pageIndex = 0;
    this.createOrdersDT(true);
    this.isActiveTrigger = false;
  }

  getColumnSequence(refresh: boolean = false) {
    let payload = {
      tableName: 'Order Manager Create'
    };
    this.iAdminApiService.GetColumnSequence(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.filterColumnNames = JSON.parse(JSON.stringify(res.data));
        this.sortedFilterColumnNames = [...this.filterColumnNames.sort()];
        this.displayedColumns = [];
        res.data.forEach((x: any) => {
          if (this.sequenceKeyMapping.filter((y: any) => x == y.sequence)[0]?.key) {
            this.displayedColumns.push(this.sequenceKeyMapping.filter((y: any) => x == y.sequence)[0]?.key)
          }
        });
        this.displayedColumns.push('actions');
        if (refresh) this.createOrdersDT();
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("GetColumnSequence", res.responseMessage);

      }
    });
  }

  autocompleteSearchColumn() {
    if (this.selectedFilterColumn != "") {
      if (this.selectedFilterString != "") {
        this.createOrdersDTPayload.filter = `[${this.selectedFilterColumn}] = '${this.selectedFilterString}'`;
      }
      else {
        this.createOrdersDTPayload.filter = "1=1";
      }
      this.createOrdersDT(true);
    }
  }

  focusinmethod() {
    document.getElementById("scrr")?.setAttribute("style", "overflow: hidden;");
  }

  focusoutmethod() {
    document.getElementById("scrr")?.setAttribute("style", "overflow: auto;");
  }

  actionDialog(matEvent: MatSelectChange) {
    const matSelect: MatSelect = matEvent.source;
    matSelect.writeValue(null);
  }
  ngAfterViewInit(): void {
    this.ordfocus.nativeElement.focus();
  }

  selectRow(row: any) {
    this.tableData.filteredData.forEach(element => {
      if (row != element) {
        element.selected = false;
      }
    });
    const selectedRow = this.tableData.filteredData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }

}
