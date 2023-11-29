import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/common/init/auth.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PrintReplenLabelsComponent } from 'src/app/dialogs/print-replen-labels/print-replen-labels.component';
import { DeleteRangeComponent } from 'src/app/dialogs/delete-range/delete-range.component';
import labels from 'src/app/common/labels/labels.json';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { SrDeleteOrderComponent } from 'src/app/dialogs/sr-delete-order/sr-delete-order.component';
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {  } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { Subject } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {  } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { ToasterTitle, ToasterType ,TableConstant,ResponseStrings,TransactionType,Column,zoneType,DialogConstants,Style,UniqueConstants,FilterColumnName,ColumnDef} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-sr-current-order',
  templateUrl: './sr-current-order.component.html',
  styleUrls: ['./sr-current-order.component.scss'],
})
export class SrCurrentOrderComponent implements OnInit {
  @ViewChild('openActionDropDown') openActionDropDown: MatSelect;
  @Input() TabIndex:any;
  displayedColumns2: string[] = [
    Column.ItemNumber,
    'Trans Type',
    'warehouse',
    TableConstant.zone,
    zoneType.carousel,
    'row',
    TableConstant.shelf,
    'bin',
    'cell',
    'lotNumber',
    'Trans Qty',
    UniqueConstants.Description,
    Column.OrderNumber,
    'UofM',
    ColumnDef.BatchPickID,
    'Serial Number',
    TableConstant.CompletedDate,
    'Print Date',
    'action',
  ];
  coloumnTable = [
    { defination: Column.ItemNumber, label: 'Item Num', value: 'itemNumber',filterProperty:Column.ItemNumber},
    { defination: 'Trans Type', label: 'Trans Type', value: TableConstant.transactionType,filterProperty:TableConstant.TransactionType },
    { defination: 'warehouse', label: 'Warehouse', value: 'warehouse', filterProperty:'Warehouse'},
    { defination: TableConstant.zone, label: ColumnDef.Zone, value: TableConstant.zone, filterProperty:ColumnDef.Zone },
    { defination: zoneType.carousel, label: 'Carsl', value: zoneType.carousel, filterProperty:TableConstant.Carousel },
    { defination: 'row', label: TableConstant.Row, value: 'row', filterProperty:TableConstant.Row },
    { defination: TableConstant.shelf, label: TableConstant.shelf, value: TableConstant.shelf, filterProperty:TableConstant.shelf },
    { defination: 'bin', label: TableConstant.Bin, value: 'bin', filterProperty:TableConstant.Bin },
    { defination: 'cell', label: TableConstant.Cell, value: 'cell', filterProperty:TableConstant.Cell },
    { defination: 'lotNumber', label: Column.LotNumber, value: 'lotNumber', filterProperty:'lot Number' },
    { defination: 'Trans Qty', label: 'Trans Qty', value: 'transactionQuantity' , filterProperty:'Trans Qty'},
    { defination: UniqueConstants.Description, label: Column.Description, value: UniqueConstants.Description, filterProperty:Column.Description },
    { defination: Column.OrderNumber, label: Column.OrderNumber, value: 'orderNumber', filterProperty:Column.OrderNumber },
    { defination: 'UofM', label: 'UofM', value: 'unitOfMeasure', filterProperty:'UofM' },
    { defination: ColumnDef.BatchPickID, label: ColumnDef.BatchPickID, value: 'batchPickID', filterProperty:ColumnDef.BatchPickID },
    { defination: 'Serial Number', label: 'Serial Number', value: 'serialNumber', filterProperty:'Serial Number' },
    { defination: TableConstant.CompletedDate, label: 'Comp Date', value: 'completedDate', filterProperty:'Comp Date' },
    { defination: 'Print Date', label: 'Print Date', value: 'printDate', filterProperty:'Print Date' },
  ];
  noOfPicks: number = 0;
  noOfPutAways: number = 0;
  public userData: any;
  isActiveTrigger:boolean =false;
  tablePayloadObj: any = {
    draw: 0,
    start: 0,
    length: 10,
    searchString: '',
    searchColumn: '',
    sortColumn: '',
    sortDir: UniqueConstants.Asc,
    status: ResponseStrings.AllCaps,
    filter: UniqueConstants.OneEqualsOne,
    username: '',
    wsid: '',
  };
  tableData: any = [];
  filteredTableData: any = [];
  tableDataTotalCount: number = 0;
  searchColumnOptions: any = [
    {
      value: ColumnDef.BatchPickID,
      viewValue: ColumnDef.BatchPickID,
      sortColumn: '14',
      key: 'batchPickID',
    },
    { value: TableConstant.Bin, viewValue: TableConstant.Bin, sortColumn: '7', key: 'bin' },
    { value: 'Carsl', viewValue: 'Carsl', sortColumn: '4', key: zoneType.carousel },
    { value: TableConstant.Cell, viewValue: TableConstant.Cell, sortColumn: '8', key: 'cell' },
    {
      value: 'Comp Date',
      viewValue: 'Comp Date',
      sortColumn: '16',
      key: 'completedDate',
    },
    {
      value: Column.Description,
      viewValue: Column.Description,
      sortColumn: '11',
      key: UniqueConstants.Description,
    },
    {
      value: Column.ItemNumber,
      viewValue: Column.ItemNumber,
      sortColumn: '0',
      key: 'itemNumber',
    },
    {
      value: Column.LotNumber,
      viewValue: Column.LotNumber,
      sortColumn: '9',
      key: 'lotNumber',
    },
    {
      value: Column.OrderNumber,
      viewValue: Column.OrderNumber,
      sortColumn: '12',
      key: 'orderNumber',
    },
    {
      value: 'Print Date',
      viewValue: 'Print Date',
      sortColumn: '17',
      key: 'printDate',
    },
    { value: TableConstant.Row, viewValue: TableConstant.Row, sortColumn: '5', key: 'row' },
    {
      value: 'Serial Number',
      viewValue: 'Serial Number',
      sortColumn: '15',
      key: 'serialNumber',
    },
    { value: TableConstant.shelf, viewValue: TableConstant.shelf, sortColumn: '6', key: TableConstant.shelf },
    {
      value: 'Trans Qty',
      viewValue: 'Trans Qty',
      sortColumn: '10',
      key: 'transactionQuantity',
    },
    {
      value: TableConstant.TransactionType,
      viewValue: 'Trans Type',
      sortColumn: '1',
      key: TableConstant.transactionType,
    },
    {
      value: 'UofM',
      viewValue: 'UofM',
      sortColumn: '13',
      key: 'unitOfMeasure',
    },
    {
      value: 'Warehouse',
      viewValue: 'Warehouse',
      sortColumn: '2',
      key: 'warehouse',
    },
    { value: ColumnDef.Zone, viewValue: ColumnDef.Zone, sortColumn: '3', key: TableConstant.zone },
  ];
  repByDeletePayload: any = {
    identity: '',
    filter1: '',
    filter2: '',
    searchString: '',
    searchColumn: '',
    status: '',
    username: '',
    wsid: '',
  };
  selectedOrder: any = {};
  public iAdminApiService: IAdminApiService;
  constructor(
    private dialog: MatDialog,
    public adminApiService: AdminApiService,
    private contextMenuService : TableContextMenuService,
    private authService: AuthService,
    private global:GlobalService,
  ) {
    this.iAdminApiService = adminApiService;
  }
  getUniqueColumnDef(column: string): string {
    return `column_${column}`;
  }

  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault()
    this.isActiveTrigger = true;
    setTimeout(() => {
      this.contextMenuService.updateContextMenuState(event, SelectedItem, FilterColumnName, FilterConditon, FilterItemType);
    }, 100);
  }

  filterString : string = UniqueConstants.OneEqualsOne;

  optionSelected(filter : string) {
    this.tablePayloadObj.filter = filter;
    this.resetPagination();
    this.newReplenishmentOrders();    
    this.isActiveTrigger = false;
  }

  hideRequiredControl = new FormControl(false);
  @ViewChild(MatAutocompleteTrigger)
  autocompleteInventory: MatAutocompleteTrigger;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  autocompleteSearchColumn() {
    if (this.tablePayloadObj.searchColumn != '') {
      this.resetPagination();
      this.getSearchOptionsSubscribe.unsubscribe();
      this.getSearchOptions(true);
      this.newReplenishmentOrdersSubscribe.unsubscribe();
      this.newReplenishmentOrders(true);
    }
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  closeautoMenu() {
    this.autocompleteInventory.closePanel();
  }

  announceSortChange(e: any) {
    this.tablePayloadObj.sortColumn = e.active;
    this.tablePayloadObj.sortDir = e.direction;
    this.newReplenishmentOrders();
  }

  @Input('refreshCurrentOrders') refreshCurrentOrders: Subject<any>;
  @Output() replenishmentsDeleted: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.tablePayloadObj.username = this.userData.userName;
    this.tablePayloadObj.wsid = this.userData.wsid;
    this.repByDeletePayload.username = this.userData.userName;
    this.repByDeletePayload.wsid = this.userData.wsid;
    this.newReplenishmentOrders();
    this.refreshCurrentOrders.subscribe((e) => {
      this.newReplenishmentOrders();
    });
  }

  ngOnDestroy() {
    this.refreshCurrentOrders.unsubscribe();
  }

  newReplenishmentOrdersSubscribe: any;

  newReplenishmentOrders(loader: boolean = false) {
    this.newReplenishmentOrdersSubscribe = this.iAdminApiService.SystemReplenishmentTable(this.tablePayloadObj).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.tableData = res.data.sysTable;
        this.tableData.forEach(element => {
          element.isSelected = false;
        });
        this.tableDataTotalCount = res.data.recordsTotal;
        this.filteredTableData = JSON.parse(JSON.stringify(this.tableData));
        this.systemReplenishmentCount(true);
      } else {
        this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
        console.log("SystemReplenishmentTable",res.responseMessage);
      }
    });
  }

  searchAutocompleteList: any;

  updateCounts() {
    this.noOfPutAways = this.filteredTableData.filter(
      (item: any) => item.transactionType == TransactionType.PutAway
    ).length;
    this.noOfPicks = this.filteredTableData.filter(
      (item: any) => item.transactionType == 'Pick'
    ).length;
  }

  paginatorChange(event: PageEvent) {
    this.tablePayloadObj.start = event.pageSize * event.pageIndex;
    this.tablePayloadObj.length = event.pageSize;
    this.newReplenishmentOrders();
  }

  actionChange(event: any) {
    if (this.tableData.length != 0) {
      switch (event) {
        case 'Delete All Orders':
          this.deleteAllOrders();
          break;
        case 'Delete Shown Orders':
          this.deleteShownOrders();
          break;
        case 'Delete Range':
          this.deleteRange();
          break;
        case 'Delete Selected Order':
          this.deleteSelectedOrder();
          break;
        case 'View All Orders':
          this.viewAllOrders();
          break;
        case 'View Unprinted Orders':
          this.viewUnprintedOrders();
          break;
        default:
          break;
      }
    }
    if (event == 'Print Orders') {
      this.printOrders();
    }
    if (event == 'Print Labels') {
      this.printLabels();
    }
  }

  printOrders() {
    switch (this.tablePayloadObj.searchColumn) {
      case 'Trans Type':
        this.tablePayloadObj.searchColumn = TableConstant.TransactionType;
        break;
      case 'Carsl':
        this.tablePayloadObj.searchColumn = TableConstant.Carousel;
        break;
      case 'Trans Qty':
        this.tablePayloadObj.searchColumn = TableConstant.TransactionQuantity;
        break;
      case 'UofM':
        this.tablePayloadObj.searchColumn = FilterColumnName.unitOfMeasure;
        break;
      case 'Comp Date':
        this.tablePayloadObj.searchColumn = TableConstant.CompletedDate;
        break;
      default:
        break;
    }

    this.global.Print(
      `FileName:printReplenishmentReportLabels|searchString:${
        this.repByDeletePayload.searchString
          ? this.repByDeletePayload.searchString
          : ''
      }|searchColumn:${this.tablePayloadObj.searchColumn}|Status:${
        this.tablePayloadObj.status
      }|filter:${this.tablePayloadObj.filter}|ident:Orders`,
      'lbl'
    );
  }

  clearMatSelectList() {
    this.openActionDropDown.options.forEach((data: MatOption) =>
      data.deselect()
    );
  }
  openAction(event: any) {
    this.clearMatSelectList();
  }
  printLabels() {
    const dialogRef: any = this.global.OpenDialog(PrintReplenLabelsComponent, {
      width: '1100px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        switch (this.tablePayloadObj.searchColumn) {
          case 'Trans Type':
            this.tablePayloadObj.searchColumn = TableConstant.TransactionType;
            break;
          case 'Carsl':
            this.tablePayloadObj.searchColumn = TableConstant.Carousel;
            break;
          case 'Trans Qty':
            this.tablePayloadObj.searchColumn = TableConstant.TransactionQuantity;
            break;
          case 'UofM':
            this.tablePayloadObj.searchColumn = FilterColumnName.unitOfMeasure;
            break;
          case 'Comp Date':
            this.tablePayloadObj.searchColumn = TableConstant.CompletedDate;
            break;
          default:
            break;
        }
        this.global.Print(
          `FileName:printReplenishmentReportLabels|searchString:${
            this.repByDeletePayload.searchString
              ? this.repByDeletePayload.searchString
              : ''
          }|searchColumn:${this.tablePayloadObj.searchColumn}|Status:${
            this.tablePayloadObj.status
          }|PrintAll:${1}|filter:${this.tablePayloadObj.filter}|Sort:${
            this.tableData.sort
          }|ident:Labels`,
          'lbl'
        );
      }
    });
  }

  deleteAllOrders() {
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        mode: 'delete-all-current-orders',
        ErrorMessage: 'Are you sure you want to delete all records',
        action: UniqueConstants.delete,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        this.repByDeletePayload.identity = 'ALL';
        this.repByDeletePayload.filter1 = '';
        this.repByDeletePayload.filter2 = '';
        this.repByDeletePayload.searchString = '';
        this.repByDeletePayload.searchColumn = '';
        this.repByDeletePayload.status = '';
        this.ReplenishmentsByDelete();
      }
    });
  }

  deleteShownOrders() {
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        mode: 'delete-shown-current-orders',
        ErrorMessage:
          'Are you sure you want to delete all records that are currently dipslayed',
        action: UniqueConstants.delete,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        this.repByDeletePayload.identity = 'Shown';
        this.repByDeletePayload.filter1 = '';
        this.repByDeletePayload.filter2 = '';
        this.repByDeletePayload.searchString =
          this.tablePayloadObj.searchString;
        this.repByDeletePayload.searchColumn =
          this.tablePayloadObj.searchColumn;
        this.repByDeletePayload.status = this.tablePayloadObj.status;
        this.ReplenishmentsByDelete();
      }
    });
  }

  deleteRange() {
    const dialogRef: any = this.global.OpenDialog(DeleteRangeComponent, {
      width: '900px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newReplenishmentOrders();
      }
    });
  }

  deleteSelectedOrder() {
    if (this.selectedOrder.rowNumber == undefined) {
      const dialogRef: any = this.global.OpenDialog(SrDeleteOrderComponent, {
        height: 'auto',
        width: Style.w600px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          orderNumber: null,
        },
      });
      dialogRef.afterClosed().subscribe((res) => {});
    } else {
      const dialogRef: any = this.global.OpenDialog(
        this.deleteSelectedConfirm,
        {
          width: '550px',
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        }
      );

      dialogRef.afterClosed().subscribe(() => {});
    }
  }

  deleteSelected() {
    this.repByDeletePayload.identity = 'Shown';
    this.repByDeletePayload.filter1 = '';
    this.repByDeletePayload.filter2 = '';
    this.repByDeletePayload.searchString = this.selectedOrder.orderNumber;
    this.repByDeletePayload.searchColumn = Column.OrderNumber;
    this.repByDeletePayload.status = ResponseStrings.AllCaps;
    this.ReplenishmentsByDelete();
    this.selectedOrder = {};
  }

  @ViewChild('deleteSelectedConfirm') deleteSelectedConfirm: TemplateRef<any>;
  isChecked = true;
  checkOptions(event: MatCheckboxChange): void {
    if (event.checked) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
  }

  viewAllOrders() {
    this.filteredTableData = JSON.parse(JSON.stringify(this.tableData));
    this.updateCounts();
  }

  viewUnprintedOrders() {
    this.tableData = JSON.parse(JSON.stringify(this.filteredTableData));
    this.filteredTableData = this.filteredTableData.filter(
      (item: any) => item.printDate == ''
    );
    this.updateCounts();
  }

  showChange(event: any) {
    if (event == ResponseStrings.AllCaps || event == 'Open' || event == 'Completed') {
      this.tablePayloadObj.status = event;
      this.newReplenishmentOrders();
    }
  }

  searchChange(event: any) {
    if (event == '') {
      this.tablePayloadObj.searchString = '';
    }
    this.tablePayloadObj.searchColumn = event;
    this.getSearchOptions();
    this.resetPagination();
    this.newReplenishmentOrders(true);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  resetPagination() {
    this.tablePayloadObj.start = 0;
    this.paginator.pageIndex = 0;
  }

  search() {
    if (
      this.tablePayloadObj.searchColumn != '' &&
      this.tablePayloadObj.searchString != ''
    ) {
      this.resetPagination();
      this.newReplenishmentOrders();
    }
  }

  ReplenishmentsByDelete() {
    this.iAdminApiService.ReplenishmentsByDelete(this.repByDeletePayload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.global.ShowToastr(ToasterType.Success,labels.alert.delete, ToasterTitle.Success);
        this.newReplenishmentOrders();
        this.replenishmentsDeleted.emit();
      } else {
        this.global.ShowToastr(ToasterType.Error,labels.alert.went_worng, ToasterTitle.Error);
        this.dialog.closeAll();
        console.log("ReplenishmentsByDelete",res.responseMessage);
      }
    });
  }

  getSearchOptionsSubscribe: any;
  getSearchOptions(loader: boolean = false) {
    let payload = {
      "searchString": this.tablePayloadObj.searchString,
      "searchColumn": this.tablePayloadObj.searchColumn, 
    }
    this.getSearchOptionsSubscribe = this.iAdminApiService.ReplenishReportSearchTA(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.searchAutocompleteList = res.data.sort();
      }
      else{
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ReplenishReportSearchTA",res.responseMessage);

      }
    });
  }

  viewItemInInventoryMaster(element: any) {
    window.open(
      `/#/admin/inventoryMaster?itemNumber=${element.itemNumber}`,
      UniqueConstants._blank,
      'location=yes'
    );
  }

  systemReplenishmentCount(loader: boolean = false) {
    this.newReplenishmentOrdersSubscribe = this.iAdminApiService.SystemReplenishmentCount(this.tablePayloadObj).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.noOfPicks = res.data.pickCount;
        this.noOfPutAways = res.data.putCount;
      }
      else{
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("SystemReplenishmentCount",res.responseMessage);

      }
    });
  }

  selectRow(row: any) {
    this.filteredTableData.forEach((element) => {
      if (row != element) {
        element.selected = false;
      }
    });
    const selectedRow = this.filteredTableData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }
}

