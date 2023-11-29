import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TransactionQtyEditComponent } from 'src/app/dialogs/transaction-qty-edit/transaction-qty-edit.component'; 
import { AuthService } from 'src/app/common/init/auth.service';
import labels from 'src/app/common/labels/labels.json';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FilterItemNumbersComponent } from '../../dialogs/filter-item-numbers/filter-item-numbers.component';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FloatLabelType } from '@angular/material/form-field';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { ToasterTitle, ToasterType ,ResponseStrings,Column,DialogConstants,Style,UniqueConstants,StringConditions,ColumnDef} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-sr-new-order',
  templateUrl: './sr-new-order.component.html',
  styleUrls: ['./sr-new-order.component.scss']
})
export class SrNewOrderComponent implements OnInit {
  @ViewChild('openActionDropDown') openActionDropDown: MatSelect;
 @Input() tabIndex:any;
  displayedColumns: string[] = [Column.ItemNumber, Column.Description, 'Warehouse', 'Stock Qty', 'Replenishment Point', 'Replenishment Level', 'Available Qty', 'Replenishment Qty', 'Case Qty', 'Transaction Qty', 'Replenish', 'Replenish Exists', 'Alloc Pick', 'Alloc Put', ColumnDef.Action];
  tableData: any = [];
  filteredTableData: any = [];
  public userData: any;
  kanban: boolean = false;
  isActiveTrigger:boolean =false;
  numberSelectedRep: number = 0;
  tablePayloadObj: any = {
    draw: 0,
    start: 0,
    length: 10,
    searchString: "",
    sortColumn: 0,
    searchColumn: "",
    sortDir: UniqueConstants.Asc,
    reOrder: false,
    filter: "1=1",
    username: "",
    wsid: ""
  };
  tableDataTotalCount: number = 0;
  filterItemNumbersText: string = "";
  searchColumnOptions: any = [
    { value: 'Alloc Pick', viewValue: 'Alloc Pick', sortValue: '12', key: 'allocPick', colDef: 'Alloc Pick' },
    { value: 'Alloc Put', viewValue: 'Alloc Put', sortValue: '13', key: 'allocPut', colDef: 'Alloc Put' },
    { value: 'Available Qty', viewValue: 'Available Qty', sortValue: '6', key: 'availableQuantity', colDef: 'Available Qty' },
    { value: 'Case Qty', viewValue: 'Case Qty', sortValue: '8', key: 'caseQuantity', colDef: 'Case Qty' },
    { value: Column.Description, viewValue: Column.Description, sortValue: '1', key: UniqueConstants.Description, colDef: Column.Description },
    { value: Column.ItemNumber, viewValue: Column.ItemNumber, sortValue: '0', key: 'itemNumber', colDef: Column.ItemNumber },
    { value: 'Replenish', viewValue: 'Replenish', sortValue: '10', key: 'replenish', colDef: 'Replenish' },
    { value: 'Replenish Exists', viewValue: 'Replenish Exists', sortValue: '11', key: 'replenishExists', colDef: 'Replenish Exists' },
    { value: 'Replenishment Level', viewValue: 'Replenishment Level', sortValue: '5', key: 'replenishmentLevel', colDef: 'Replenishment Level' },
    { value: 'Replenishment Point', viewValue: 'Replenishment Point', sortValue: '4', key: 'replenishmentPoint', colDef: 'Replenishment Point' },
    { value: 'Replenishment Qty', viewValue: 'Replenishment Qty', sortValue: '7', key: 'replenishmentQuantity', colDef: 'Replenishment Qty' },
    { value: 'Stock Qty', viewValue: 'Stock Qty', sortValue: '3', key: 'stockQuantity', colDef: 'Stock Qty' },
    { value: 'Transaction Qty', viewValue: 'Transaction Qty', sortValue: '9', key: ColumnDef.TransactionQuantity, colDef: 'Transaction Qty' },
    { value: 'Warehouse', viewValue: 'Warehouse', sortValue: '2', key: 'warehouse', colDef: 'Warehouse' },
  ];
  searchAutocompleteList: any;
  newOrderListCreated:boolean = false;
  public iAdminApiService: IAdminApiService;
  constructor(
    private global:GlobalService,
    private contextMenuService : TableContextMenuService,
    private authService: AuthService,
    public adminApiService: AdminApiService
  ) { 
    this.iAdminApiService = adminApiService;
  }

  @Input('refreshNewOrders') refreshNewOrders:Subject<any>;
  @Output() replenishmentsProcessed: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.tablePayloadObj.username = this.userData.userName;
    this.tablePayloadObj.wsid = this.userData.wsid;
    this.refreshNewOrders.subscribe(e => {
      
    });
  }

  ngOnDestroy() {
    this.refreshNewOrders.unsubscribe();
  }

  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault()
    this.isActiveTrigger = true;
    setTimeout(() => {
      this.contextMenuService.updateContextMenuState(event, SelectedItem, FilterColumnName, FilterConditon, FilterItemType);
    }, 100);
  }

  optionSelected(filter : string) {
    this.tablePayloadObj.filter = filter;
    this.resetPagination();
    this.newReplenishmentOrders(); 
    this.isActiveTrigger = false;
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

  editTransDialog(element: any): void {
    const dialogRef:any = this.global.OpenDialog(TransactionQtyEditComponent, {
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        rP_ID: element.rP_ID,
        transactionQuantity: element.transactionQuantity,
        availableQuantity: element.availableQuantity,
        replenishmentQuantity: element.replenishmentQuantity
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filteredTableData.filter((item: any) => {
          if (item.rP_ID == result.rP_ID) {
            item.transactionQuantity = result.transactionQuantity;
          }
        });
      }
    });
  }

  newReplenishmentOrdersSubscribe: any;
  newReplenishmentOrders(loader:boolean =false) {
    if(this.newOrderListCreated){
      this.tablePayloadObj.searchString = this.tablePayloadObj.searchString.toString();
      this.newReplenishmentOrdersSubscribe = this.iAdminApiService.SystemReplenishmentNewTable(this.tablePayloadObj).subscribe((res: any) => {
        if (res.isExecuted && res.data) {
          this.tableData = res.data.sysTable;
          this.numberSelectedRep = res.data.selectedOrders;
          this.tableDataTotalCount = res.data.recordsFiltered;
          this.filteredTableData = JSON.parse(JSON.stringify(this.tableData));
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("SystemReplenishmentNewTable",res.responseMessage);

        } 
      });
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  resetPagination() {
    this.tablePayloadObj.start = 0;
    this.paginator.pageIndex = 0;
  }

  onChangeKanban(ob: MatCheckboxChange) {
    this.resetPagination();
    this.createNewReplenishments(ob.checked);
  }

  createNewOrdersList() {
    this.createNewReplenishments(this.kanban);
  }

  createNewReplenishments(kanban: boolean) {
    let paylaod = {
      "kanban": kanban, 
    }
    this.iAdminApiService.ReplenishmentInsert(paylaod).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.newOrderListCreated = true;
      }
      this.newReplenishmentOrders();
    });
  }

  actionChange(event: any) {
    if(this.tableData.length != 0){
      if (event == '1') {
        this.filterItemNo();
      }
      else if (event == '5') {
        this.selectAll();
      }
      else if (event == '6' && this.numberSelectedRep != 0) {
        this.unSelectAll();
      }
    }
    if (event == '2') {
      this.print();
    }
  }

  showChange(event: any) {
    if (event == '1') {
      this.tablePayloadObj.reOrder = false;
      this.newReplenishmentOrders();
    }
    else if (event == '2') {
      this.tablePayloadObj.reOrder = true;
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


  paginatorChange(event: PageEvent) {
    this.tablePayloadObj.start = event.pageSize * event.pageIndex;
    this.tablePayloadObj.length = event.pageSize;
    this.newReplenishmentOrders();
  }

  viewItemInInventoryMaster(element: any) {
    
    window.open(`/#/admin/inventoryMaster?itemNumber=${element.itemNumber}`, UniqueConstants._blank, "location=yes");
  }

  print() {

  
    let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        message: 'Click OK to print a replenishment report.',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == ResponseStrings.Yes) {
        this.global.Print(`FileName:printNewReplenishmentReport|reorder:${this.tablePayloadObj.reOrder}`) ;

      }
    });
  }

  clearMatSelectList(){
    this.openActionDropDown.options.forEach((data: MatOption) => data.deselect());
  }
  openAction(event:any){
    this.clearMatSelectList();
  }
  selectAll() {
    this.ReplenishmentsIncludeAllUpdate(true);
  }

  unSelectAll() {
    this.ReplenishmentsIncludeAllUpdate(false);
  }

  viewAllItems() {
    if(this.newOrderListCreated){
      this.tablePayloadObj.searchColumn = "";
      this.tablePayloadObj.searchString = "";
      this.resetPagination();
      this.newReplenishmentOrders(true);
    }
  }

  viewSelectedItems() {
    if(this.newOrderListCreated){
      this.tablePayloadObj.searchColumn = "Replenish";
      this.tablePayloadObj.searchString = "True";
      this.resetPagination();
      this.newReplenishmentOrders(true);
    }
  }

  filterItemNo() {
    const dialogRef:any = this.global.OpenDialog(FilterItemNumbersComponent, {
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: this.filterItemNumbersText,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filterItemNumbersText = result.filterItemNumbersText;
        if (result.filterItemNumbersArray && result.filterItemNumbersArray.length > 0) {
          this.resetPagination();
          this.newReplenishmentOrders();
        }
        else {
          this.resetPagination();
          this.createNewReplenishments(this.kanban);
        }
      }
    });
  }

  changeReplenish(element: any, $event: any) {
    this.ReplenishmentsIncludeUpdate($event.checked, element.rP_ID);
  }

  processReplenishments() {

    let paylaod = {
      "kanban": this.kanban, 
    }
    this.iAdminApiService.ProcessReplenishments(paylaod).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        if(res.responseMessage == "Update Successful"){
          this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
        }
        if(res.responseMessage == "Reprocess"){
          let dialogRef2:any = this.global.OpenDialog(ConfirmationDialogComponent, {
            height: 'auto',
            width: Style.w560px,
            autoFocus: DialogConstants.autoFocus,
      disableClose:true,
            data: {
              message: `Replenishments finished. There are reprocess transactions due to the replenishment process. Click Ok to print a process report now.`,
            },
          });
          dialogRef2.afterClosed().subscribe((result) => {
            if (result == ResponseStrings.Yes) {
              this.global.Print(`FileName:printReprocessTransactions|History:0|ID:|OrderNumber:|ItemNumber:|Reason:|Message:|Date:`);
            }
          });
        }
        this.newReplenishmentOrders();
        this.replenishmentsProcessed.emit();
      } else {
        this.global.ShowToastr(ToasterType.Success,res.responseMessage, ToasterTitle.Success);
        console.log("ProcessReplenishments",res.responseMessage);
      }
    });
  }

  search() {
    if (this.tablePayloadObj.searchColumn != "" && this.tablePayloadObj.searchString != "") {
      this.resetPagination();
      this.newReplenishmentOrders();
    }
  }

  announceSortChange(e: any) {
    this.tablePayloadObj.sortColumn = this.searchColumnOptions.filter((item: any) => item.value == e.active)[0].sortValue;
    this.tablePayloadObj.sortDir = e.direction;
    this.newReplenishmentOrders();
  }

  ReplenishmentsIncludeUpdate(replenish: boolean, rfid: number) {
    let paylaod = {
      "rfid": rfid,
      "replenish": replenish, 
    }
    this.iAdminApiService.ReplenishmentsIncludeUpdate(paylaod).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.newReplenishmentOrders();
      } else {
        this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
        console.log("ReplenishmentsIncludeUpdate",res.responseMessage);
      }
    });
  }

  ReplenishmentsIncludeAllUpdate(replenish: boolean) {
    let paylaod = {
      "replenish": replenish,
      "reorder": this.tablePayloadObj.reOrder,
      "searchString": this.tablePayloadObj.searchString,
      "searchColumn": this.tablePayloadObj.searchColumn,
      "filter": "1=1", 
    }
    this.iAdminApiService.ReplenishmentsIncludeAllUpdate(paylaod).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.newReplenishmentOrders();
      } 
        else if (replenish){
          this.global.ShowToastr(ToasterType.Error,"No items available to replenish.", ToasterTitle.Error);
        }else{
          this.global.ShowToastr(ToasterType.Error ,res.responseMessage, ToasterTitle.Error);
          console.log("ReplenishmentsIncludeAllUpdate",res.responseMessage);
        }
      
    });
  }

  getSearchOptionsSubscribe: any;
  getSearchOptions(loader:boolean=false){
    let payload = {
      "searchString": this.tablePayloadObj.searchString,
      "searchColumn": this.tablePayloadObj.searchColumn 
    }
    this.getSearchOptionsSubscribe = this.iAdminApiService.SystemReplenishNewTA(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.searchAutocompleteList = res.data.sort();
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("SystemReplenishNewTA",res.responseMessage);

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
