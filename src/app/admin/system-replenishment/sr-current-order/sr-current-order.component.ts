import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PrintReplenLabelsComponent } from 'src/app/dialogs/print-replen-labels/print-replen-labels.component';
import { DeleteRangeComponent } from 'src/app/dialogs/delete-range/delete-range.component';
import labels from '../../../labels/labels.json';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { SrDeleteOrderComponent } from 'src/app/dialogs/sr-delete-order/sr-delete-order.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContextMenuFiltersService } from 'src/app/init/context-menu-filters.service';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {  } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { Subject } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import {  } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { GlobalService } from 'src/app/common/services/global.service';
@Component({
  selector: 'app-sr-current-order',
  templateUrl: './sr-current-order.component.html',
  styleUrls: ['./sr-current-order.component.scss']
})
export class SrCurrentOrderComponent implements OnInit {
  @ViewChild('openActionDropDown') openActionDropDown: MatSelect;

  displayedColumns2: string[] = ['Item Number', 'Trans Type', 'warehouse', 'zone', 'carousel', 'row', 'shelf', 'bin', 'cell', 'lotNumber', 'Trans Qty', 'description', 'Order Number', 'UofM', 'Batch Pick ID', 'Serial Number', 'Completed Date', 'Print Date','action'];
  noOfPicks: number = 0;
  noOfPutAways: number = 0;
  public userData: any;
  tablePayloadObj: any = {
    draw: 0,
    start: 0,
    length: 10,
    searchString: "",
    searchColumn: "",
    sortColumn: "",
    sortDir: "asc",
    status: "All",
    filter: "1=1",
    username: "",
    wsid: ""
  };
  tableData: any = [];
  filteredTableData: any = [];
  tableDataTotalCount: number = 0;
  searchColumnOptions: any = [
    { value: 'Batch Pick ID', viewValue: 'Batch Pick ID', sortColumn: '14', key: 'batchPickID' },
    { value: 'Bin', viewValue: 'Bin', sortColumn: '7', key: 'bin' },
    { value: 'Carsl', viewValue: 'Carsl', sortColumn: '4', key: 'carousel' },
    { value: 'Cell', viewValue: 'Cell', sortColumn: '8', key: 'cell' },
    { value: 'Comp Date', viewValue: 'Comp Date', sortColumn: '16', key: 'completedDate' },
    { value: 'Description', viewValue: 'Description', sortColumn: '11', key: 'description' },
    { value: 'Item Number', viewValue: 'Item Number', sortColumn: '0', key: 'itemNumber' },
    { value: 'Lot Number', viewValue: 'Lot Number', sortColumn: '9', key: 'lotNumber' },
    { value: 'Order Number', viewValue: 'Order Number', sortColumn: '12', key: 'orderNumber' },
    { value: 'Print Date', viewValue: 'Print Date', sortColumn: '17', key: 'printDate' },
    { value: 'Row', viewValue: 'Row', sortColumn: '5', key: 'row' },
    { value: 'Serial Number', viewValue: 'Serial Number', sortColumn: '15', key: 'serialNumber' },
    { value: 'Shelf', viewValue: 'Shelf', sortColumn: '6', key: 'shelf' },
    { value: 'Trans Qty', viewValue: 'Trans Qty', sortColumn: '10', key: 'transactionQuantity' },
    { value: 'Transaction Type', viewValue: 'Trans Type', sortColumn: '1', key: 'transactionType' },
    { value: 'UofM', viewValue: 'UofM', sortColumn: '13', key: 'unitOfMeasure' },
    { value: 'Warehouse', viewValue: 'Warehouse', sortColumn: '2', key: 'warehouse' },
    { value: 'Zone', viewValue: 'Zone', sortColumn: '3', key: 'zone' },
  ];
  repByDeletePayload: any = {
    identity: "",
    filter1: "",
    filter2: "",
    searchString: "",
    searchColumn: "",
    status: "",
    username: "",
    wsid: ""
  };
  selectedOrder: any = {};

  constructor(
    private dialog: MatDialog,
    private Api: ApiFuntions,
    private toastr: ToastrService,
    private authService: AuthService,
    private filterService: ContextMenuFiltersService,
    private global:GlobalService,
  ) { }



  @ViewChild('trigger') trigger: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.trigger.menuData = { item: { SelectedItem: SelectedItem, FilterColumnName: FilterColumnName, FilterConditon: FilterConditon, FilterItemType: FilterItemType } };
    this.trigger.menu?.focusFirstItem('mouse');
    this.trigger.openMenu();
  }

  onClick() { 
    this.trigger.closeMenu();
  }

  getType(val): string {
    return this.filterService.getType(val);
  }

  FilterString: string = "1 = 1";
  onContextMenuCommand(SelectedItem: any, FilterColumnName: any, Condition: any, Type: any) {
    if ((SelectedItem != undefined && FilterColumnName != "") || Condition == "clear") {
      this.FilterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, "clear", Type);
      this.FilterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, Condition, Type);
    }
    this.tablePayloadObj.filter = this.FilterString != "" ? this.FilterString : "1 = 1";
    this.resetPagination();
    this.newReplenishmentOrders();
  }

  InputFilterSearch(FilterColumnName: any, Condition: any, TypeOfElement: any) {
    const dialogRef = this.dialog.open(InputFilterComponent, {
      height: 'auto',
      width: '480px',
      data: {
        FilterColumnName: FilterColumnName,
        Condition: Condition,
        TypeOfElement: TypeOfElement
      },
      autoFocus: '__non_existing_element__',
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe((result) => {
      ;
      this.onContextMenuCommand(result.SelectedItem, result.SelectedColumn, result.Condition, result.Type)
    }
    );
  }

  ClearFilters() {
    this.tablePayloadObj.filter = "1=1";
    this.newReplenishmentOrders();
  }

  hideRequiredControl = new FormControl(false);
  @ViewChild(MatAutocompleteTrigger) autocompleteInventory: MatAutocompleteTrigger;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  autocompleteSearchColumn() {
    if (this.tablePayloadObj.searchColumn != "") {
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
    this.refreshCurrentOrders.subscribe(e => {
      this.newReplenishmentOrders();
    });
  }

  ngOnDestroy() {
    this.refreshCurrentOrders.unsubscribe();
  }

  newReplenishmentOrdersSubscribe: any;

  newReplenishmentOrders(loader: boolean = false) {
    this.newReplenishmentOrdersSubscribe = this.Api.SystemReplenishmentTable(this.tablePayloadObj).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.tableData = res.data.sysTable;
        this.tableData.forEach(element => {
          element.isSelected = false;
        });
        this.tableDataTotalCount = res.data.recordsTotal;
        this.filteredTableData = JSON.parse(JSON.stringify(this.tableData));
        this.systemReplenishmentCount(true);
      } else {
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    });
  }

  searchAutocompleteList: any;

  updateCounts() {
    this.noOfPutAways = this.filteredTableData.filter((item: any) => item.transactionType == 'Put Away').length;
    this.noOfPicks = this.filteredTableData.filter((item: any) => item.transactionType == 'Pick').length;
  }

  paginatorChange(event: PageEvent) {
    this.tablePayloadObj.start = event.pageSize * event.pageIndex;
    this.tablePayloadObj.length = event.pageSize;
    this.newReplenishmentOrders();
  }

  actionChange(event: any) {
    if (this.tableData.length != 0) {
      if (event == 'Delete All Orders') {
        this.deleteAllOrders();
      }
      else if (event == 'Delete Shown Orders') {
        this.deleteShownOrders();
      }
      else if (event == 'Delete Range') {
        this.deleteRange();
      }
      else if (event == 'Delete Selected Order') {
        this.deleteSelectedOrder();
      }
      else if (event == 'View All Orders') {
        this.viewAllOrders();
      }
      else if (event == 'View Unprinted Orders') {
        this.viewUnprintedOrders();
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

    switch ( this.tablePayloadObj.searchColumn) {
      case 'Trans Type':
        this.tablePayloadObj.searchColumn='Transaction Type'
        break;
        case 'Carsl':
          this.tablePayloadObj.searchColumn='Carousel'
          break;
          case 'Trans Qty':
            this.tablePayloadObj.searchColumn='Transaction Quantity'
            break;
            case 'UofM':
              this.tablePayloadObj.searchColumn='Unit of Measure'
              break;
              case 'Comp Date':
                this.tablePayloadObj.searchColumn='Completed Date'
                break;
      default:
        break;
    }
   
    this.global.Print(`FileName:printReplenishmentReportLabels|searchString:${this.repByDeletePayload.searchString?this.repByDeletePayload.searchString:''}|searchColumn:${this.tablePayloadObj.searchColumn}|Status:${this.tablePayloadObj.status}|filter:${this.tablePayloadObj.filter}|ident:Orders`,'lbl')
    
    
  }

  clearMatSelectList(){
    this.openActionDropDown.options.forEach((data: MatOption) => data.deselect());
  }
  openAction(event:any){
    this.clearMatSelectList();
  }
  printLabels() {
 
    const dialogRef = this.dialog.open(PrintReplenLabelsComponent, {
      width: '1100px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        switch ( this.tablePayloadObj.searchColumn) {
          case 'Trans Type':
            this.tablePayloadObj.searchColumn='Transaction Type'
            break;
            case 'Carsl':
              this.tablePayloadObj.searchColumn='Carousel'
              break;
              case 'Trans Qty':
                this.tablePayloadObj.searchColumn='Transaction Quantity'
                break;
                case 'UofM':
                  this.tablePayloadObj.searchColumn='Unit of Measure'
                  break;
                  case 'Comp Date':
                    this.tablePayloadObj.searchColumn='Completed Date'
                    break;
          default:
            break;
        }
        this.global.Print(`FileName:printReplenishmentReportLabels|searchString:${this.repByDeletePayload.searchString?this.repByDeletePayload.searchString:''}|searchColumn:${this.tablePayloadObj.searchColumn}|Status:${this.tablePayloadObj.status}|PrintAll:${1}|filter:${this.tablePayloadObj.filter}|Sort:${this.tableData.sort}|ident:Labels`,'lbl')
         
      }
    });
  }

  deleteAllOrders() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete-all-current-orders',
        ErrorMessage: 'Are you sure you want to delete all records',
        action: 'delete'
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Yes') {
        this.repByDeletePayload.identity = "ALL";
        this.repByDeletePayload.filter1 = "";
        this.repByDeletePayload.filter2 = "";
        this.repByDeletePayload.searchString = "";
        this.repByDeletePayload.searchColumn = "";
        this.repByDeletePayload.status = "";
        this.ReplenishmentsByDelete();
      }
    });
  }

  deleteShownOrders() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete-shown-current-orders',
        ErrorMessage: 'Are you sure you want to delete all records that are currently dipslayed',
        action: 'delete'
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Yes') {
        this.repByDeletePayload.identity = "Shown";
        this.repByDeletePayload.filter1 = "";
        this.repByDeletePayload.filter2 = "";
        this.repByDeletePayload.searchString = this.tablePayloadObj.searchString;
        this.repByDeletePayload.searchColumn = this.tablePayloadObj.searchColumn;
        this.repByDeletePayload.status = this.tablePayloadObj.status;
        this.ReplenishmentsByDelete();
      }
    });
  }

  deleteRange() {
    const dialogRef = this.dialog.open(DeleteRangeComponent, {
      width: '900px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
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
      const dialogRef = this.dialog.open(SrDeleteOrderComponent, {
        height: 'auto',
        width: '600px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          orderNumber: null,
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        
      });
    }
    else {
      const dialogRef = this.dialog.open(this.deleteSelectedConfirm, {
        width: '550px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
      });

      dialogRef.afterClosed().subscribe(() => {
      });
    }
  }

  deleteSelected() {
    this.repByDeletePayload.identity = "Shown";
    this.repByDeletePayload.filter1 = "";
    this.repByDeletePayload.filter2 = "";
    this.repByDeletePayload.searchString = this.selectedOrder.orderNumber;
    this.repByDeletePayload.searchColumn = "Order Number";
    this.repByDeletePayload.status = "All";
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
    this.filteredTableData = this.filteredTableData.filter((item: any) => item.printDate == '');
    this.updateCounts();
  }

  showChange(event: any) {
    if (event == 'All' || event == 'Open' || event == 'Completed') {
      this.tablePayloadObj.status = event;
      this.newReplenishmentOrders();
    }
    
  }

  searchChange(event: any) {
    if(event == ""){
      this.tablePayloadObj.searchString = "";
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
    if (this.tablePayloadObj.searchColumn != "" && this.tablePayloadObj.searchString != "") {
      this.resetPagination();
      this.newReplenishmentOrders();
    }
  }

  ReplenishmentsByDelete() {
    this.Api.ReplenishmentsByDelete(this.repByDeletePayload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.toastr.success(labels.alert.delete, 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        this.newReplenishmentOrders();
        this.replenishmentsDeleted.emit();
      } else {
        this.toastr.error(labels.alert.went_worng, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        this.dialog.closeAll();
      }
    });
  }

  getSearchOptionsSubscribe: any;
  getSearchOptions(loader: boolean = false) {
    let payload = {
      "searchString": this.tablePayloadObj.searchString,
      "searchColumn": this.tablePayloadObj.searchColumn,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    }
    this.getSearchOptionsSubscribe = this.Api.ReplenishReportSearchTA(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.searchAutocompleteList = res.data.sort();
      }
    });
  }

  viewItemInInventoryMaster(element: any) {
    window.open(`/#/admin/inventoryMaster?itemNumber=${element.itemNumber}`, '_blank', "location=yes");
  }


  systemReplenishmentCount(loader: boolean = false) {
    this.newReplenishmentOrdersSubscribe = this.Api.SystemReplenishmentCount(this.tablePayloadObj).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.noOfPicks = res.data.pickCount;
        this.noOfPutAways = res.data.putCount;
      }
    });
  }

  selectRow(row: any) {
    this.filteredTableData.forEach(element => {
      if(row != element){
        element.selected = false;
      }
    });
    const selectedRow = this.filteredTableData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }

}
