import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TransactionQtyEditComponent } from 'src/app/dialogs/transaction-qty-edit/transaction-qty-edit.component'; 
import { AuthService } from 'src/app/init/auth.service';
import labels from '../../../labels/labels.json'
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
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';


@Component({
  selector: 'app-sr-new-order',
  templateUrl: './sr-new-order.component.html',
  styleUrls: ['./sr-new-order.component.scss']
})
export class SrNewOrderComponent implements OnInit {
  @ViewChild('openActionDropDown') openActionDropDown: MatSelect;

  displayedColumns: string[] = ['Item Number', 'Description', 'Warehouse', 'Stock Qty', 'Replenishment Point', 'Replenishment Level', 'Available Qty', 'Replenishment Qty', 'Case Qty', 'Transaction Qty', 'Replenish', 'Replenish Exists', 'Alloc Pick', 'Alloc Put', 'action'];
  tableData: any = [];
  filteredTableData: any = [];
  public userData: any;
  kanban: boolean = false;
  numberSelectedRep: number = 0;
  tablePayloadObj: any = {
    draw: 0,
    start: 0,
    length: 10,
    searchString: "",
    sortColumn: 0,
    searchColumn: "",
    sortDir: "asc",
    reOrder: false,
    filter: "1=1",
    username: "",
    wsid: ""
  };
  tableDataTotalCount: number = 0;
  filterItemNumbersText: string = "";
  searchColumnOptions: any = [
    { value: 'Alloc Pick', viewValue: 'Alloc Pick', sortValue: '12', key: 'allocPick' },
    { value: 'Alloc Put', viewValue: 'Alloc Put', sortValue: '13', key: 'allocPut' },
    { value: 'Available Qty', viewValue: 'Available Qty', sortValue: '6', key: 'availableQuantity' },
    { value: 'Case Qty', viewValue: 'Case Qty', sortValue: '8', key: 'caseQuantity' },
    { value: 'Description', viewValue: 'Description', sortValue: '1', key: 'description' },
    { value: 'Item Number', viewValue: 'Item Number', sortValue: '0', key: 'itemNumber' },
    { value: 'Replenish', viewValue: 'Replenish', sortValue: '10', key: 'replenish' },
    { value: 'Replenish Exists', viewValue: 'Replenish Exists', sortValue: '11', key: 'replenishExists' },
    { value: 'Replenishment Level', viewValue: 'Replenishment Level', sortValue: '5', key: 'replenishmentLevel' },
    { value: 'Replenishment Point', viewValue: 'Replenishment Point', sortValue: '4', key: 'replenishmentPoint' },
    { value: 'Replenishment Qty', viewValue: 'Replenishment Qty', sortValue: '7', key: 'replenishmentQuantity' },
    { value: 'Stock Qty', viewValue: 'Stock Qty', sortValue: '3', key: 'stockQuantity' },
    { value: 'Transaction Qty', viewValue: 'Transaction Qty', sortValue: '9', key: 'transactionQuantity' },
    { value: 'Warehouse', viewValue: 'Warehouse', sortValue: '2', key: 'warehouse' },
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
    this.contextMenuService.updateContextMenuState(event, SelectedItem, FilterColumnName, FilterConditon, FilterItemType);
  }

  optionSelected(filter : string) {
    this.tablePayloadObj.filter = filter;
    this.resetPagination();
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

  editTransDialog(element: any): void {
    const dialogRef:any = this.global.OpenDialog(TransactionQtyEditComponent, {
      width: '560px',
      autoFocus: '__non_existing_element__',
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
          this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
          console.log("SystemReplenishmentNewTable",res.responseMessage);

        } 
      });
    }
    else {
      this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
      console.log("(Outer If) --> SystemReplenishmentNewTable");


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
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("ReplenishmentInsert",res.responseMessage);


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
    
    window.open(`/#/admin/inventoryMaster?itemNumber=${element.itemNumber}`, '_blank', "location=yes");
  }

  print() {

  
    let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        message: 'Click OK to print a replenishment report.',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
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
      width: '560px',
      autoFocus: '__non_existing_element__',
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
          this.global.ShowToastr('success',labels.alert.success, 'Success!');
        }
        if(res.responseMessage == "Reprocess"){
          let dialogRef2:any = this.global.OpenDialog(ConfirmationDialogComponent, {
            height: 'auto',
            width: '560px',
            autoFocus: '__non_existing_element__',
      disableClose:true,
            data: {
              message: `Replenishments finished. There are reprocess transactions due to the replenishment process. Click Ok to print a process report now.`,
            },
          });
          dialogRef2.afterClosed().subscribe((result) => {
            if (result == 'Yes') {
              alert('The print service is currently offline');
            }
          });
        }
        this.newReplenishmentOrders();
        this.replenishmentsProcessed.emit();
      } else {
        this.global.ShowToastr('error',res.responseMessage, 'Error!');
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
        this.global.ShowToastr('error',res.responseMessage, 'Error!');
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
          this.global.ShowToastr('error',"No items available to replenish.", 'Error!');
        }else{
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
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
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
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
