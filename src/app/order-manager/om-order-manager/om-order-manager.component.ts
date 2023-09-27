import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OmCreateOrdersComponent } from 'src/app/dialogs/om-create-orders/om-create-orders.component';
import { OmUpdateRecordComponent } from 'src/app/dialogs/om-update-record/om-update-record.component'; 
import { AuthService } from 'src/app/init/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ContextMenuFiltersService } from 'src/app/init/context-menu-filters.service';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { ColumnSequenceDialogComponent } from 'src/app/admin/dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { MatButton } from '@angular/material/button';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';

@Component({
  selector: 'app-om-order-manager',
  templateUrl: './om-order-manager.component.html',
  styleUrls: ['./om-order-manager.component.scss']
})
export class OmOrderManagerComponent implements OnInit {
  omPreferences:any;
  
  public userData: any;
  OMIndex: any;

  column    : string = "Order Number";
  case      : string = "Equals";
  
  value1    : string = "";
  v1Show    : boolean = true;
  value1D   : Date = new Date();
  v1DShow    : boolean = false;
  
  value2    : string = "";
  v2Show    : boolean = true;
  value2D   : Date = new Date();
  v2DShow    : boolean = false;  
  
  maxOrders : number = 0;
  transType : string = "Pick";
  viewType  : string = "Headers";
  orderType : string = "Open";

  colList   : any = [];
  searchCol : string = "";
  searchTxt : string = "";
  totalRecords:any;
  
  allColumns : any = [
    { colHeader: "transactionType", colDef: "Transaction Type" },
    { colHeader: "orderNumber", colDef: "Order Number" },
    { colHeader: "priority", colDef: "Priority" },
    { colHeader: "requiredDate", colDef: "Required Date" },
    { colHeader: "userField1", colDef: "User Field1" },
    { colHeader: "userField2", colDef: "User Field2" },
    { colHeader: "userField3", colDef: "User Field3" },
    { colHeader: "userField4", colDef: "User Field4" },
    { colHeader: "userField5", colDef: "User Field5" },
    { colHeader: "userField6", colDef: "User Field6" },
    { colHeader: "userField7", colDef: "User Field7" },
    { colHeader: "userField8", colDef: "User Field8" },
    { colHeader: "userField9", colDef: "User Field9" },
    { colHeader: "userField10", colDef: "User Field10" },
    { colHeader: "itemNumber", colDef: "Item Number" },
    { colHeader: "description", colDef: "Description" },
    { colHeader: "lineNumber", colDef: "Line Number" },
    { colHeader: "transactionQuantity", colDef: "Transaction Quantity" },
    { colHeader: "allocatedPicks", colDef: "Allocated Picks" },
    { colHeader: "allocatedPuts", colDef: "Allocated Puts" },
    { colHeader: "availableQuantity", colDef: "Available Quantity" },
    { colHeader: "stockQuantity", colDef: "Stock Quantity" },
    { colHeader: "warehouse", colDef: "Warehouse" },
    { colHeader: "zone", colDef: "Zone" },
    { colHeader: "lineSequence", colDef: "Line Sequence" },
    { colHeader: "toteID", colDef: "Tote ID" },
    { colHeader: "toteNumber", colDef: "Tote Number" },
    { colHeader: "unitOfMeasure", colDef: "Unit of Measure" },
    { colHeader: "batchPickID", colDef: "Batch Pick ID" },
    { colHeader: "category", colDef: "Category" },
    { colHeader: "subCategory", colDef: "Sub Category" },
    { colHeader: "importBy", colDef: "Import By" },
    { colHeader: "importDate", colDef: "Import Date" },
    { colHeader: "importFilename", colDef: "Import Filename" },
    { colHeader: "expirationDate", colDef: "Expiration Date" },
    { colHeader: "lotNumber", colDef: "Lot Number" },
    { colHeader: "serialNumber", colDef: "Serial Number" },
    { colHeader: "notes", colDef: "Notes" },
    { colHeader: "revision", colDef: "Revision" },
    { colHeader: "supplierItemID", colDef: "Supplier Item ID" },
    { colHeader: "id", colDef: "ID" },
    { colHeader: "hostTransactionID", colDef: "Host Transaction ID" },
    { colHeader: "emergency", colDef: "Emergency" },
    { colHeader: "location", colDef: "Location" },
    { colHeader: "label", colDef: "Label" },
    { colHeader: "cell", colDef: "Cell" },
  ];
  displayedColumns  : string[] = []; 
  orderTable        : any = new MatTableDataSource([]); 
  customPagination  : any = {
                              total : '',
                              recordsPerPage : 20,
                              startIndex: '',
                              endIndex: ''
                            }
  sortColumn        : any = {
                              columnName: 0,
                              sortOrder: 'asc'
                            }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog          : MatDialog,
              private _liveAnnouncer  : LiveAnnouncer,
              private toastr          : ToastrService,
              private Api       : ApiFuntions,
              public authService      : AuthService,
              public globalService    : GlobalService,
              private filterService   : ContextMenuFiltersService,
              private currentTabDataService: CurrentTabDataService,
              private global:GlobalService,
              private router: Router) { }

  @ViewChild('btnRef') buttonRef: MatButton;

  ngAfterViewInit() {
  this.getColumnSequence();
  this.ApplySavedItem();
  }

  async ngOnInit(): Promise<void> {
    this.customPagination = {
      total : '',
      recordsPerPage : 20,
      startIndex: 0,
      endIndex: 20
    }    
    this.userData = this.authService.userData();
  
    await this.deleteTemp();
    this.getOMIndex();
 
    this.fillTable();
    this.omPreferences=this.global.getOmPreferences();
  }  

  getOMIndex() { 
    this.Api.OrderManagerPreferenceIndex().subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          this.OMIndex = res.data;
          if ( res.data?.preferences) this.maxOrders = res.data.preferences[0].maxOrders;
        } else {
          this.toastr.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (error) => { }
    );
  }

  getColumnSequence() {
    let payload = {
      username: this.userData.userName,
      wsid: this.userData.wsid,
      tableName: 'Order Manager'
    };

    this.Api.GetColumnSequence(payload).subscribe((res: any) => {
      if (res.isExecuted) {
        this.displayedColumns = res.data;        
        this.displayedColumns.push( 'actions');
        
        this.colList = res.data.filter(x => x != 'actions');
        this.colList = this.colList.sort();
        this.searchCol = this.colList[0];
      }
    });
  }

  selectColumnSequence() {
    let dialogRef = this.dialog.open(ColumnSequenceDialogComponent, {
      height: 'auto',
      width: '960px',
      disableClose: true,
      data: {
        mode: event,
        tableName: 'Order Manager',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.isExecuted) this.getColumnSequence();
    });
  }

  getOrders() {
    
    try{
      let val1 : any, val2 : any;

      if (this.column.indexOf('Date') > -1) {
        val1 = this.value1D.toLocaleDateString();
        val2 = this.value2D.toLocaleDateString();
      } else {
        val1 = this.value1;
        val2 = this.value2;      
      }
  
  
      if(this.FilterString == "") this.FilterString = "1 = 1";
  
      let payload = {
        username: this.userData.userName,
        wsid: this.userData.wsid,
        col: this.column,
        whereClause: this.case,
        colVal1: val1 ,
        colVal2: val2,
        maxOrders: this.maxOrders.toString(),
        transType: this.transType,
        viewType: this.viewType,
        orderType: this.orderType,
        filter: this.FilterString
      };
      
  
      this.Api.FillOrderManTempData(payload).pipe(
        catchError((error) => {
          // Handle the error here
          
  this.toastr.error("Something went wrong" ,'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
          // Return a fallback value or trigger further error handling if needed
          return of({ isExecuted: false });
        })
      ).subscribe((res: any) => {
        if (res.isExecuted) this.fillTable();
        else this.toastr.error("An Error occured while retrieving data.", 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
      });
    }catch(ex){

      this.toastr.error("Something went wrong" ,'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
    }
    
  }

  fillTable(loader : boolean = false) {
    let payload2 = {
      username: this.userData.userName,
      user: this.userData.userName,
      wsid: this.userData.wsid,
      startRow: this.customPagination.startIndex == 0 ? this.customPagination.startIndex.toString() : (this.customPagination.startIndex + 1).toString(),
      endRow: this.customPagination.endIndex.toString(),
      sortCol: this.sortColumn.columnName,
      sortOrder: this.sortColumn.sortOrder,
      searchColumn: this.searchCol,
      searchString: this.searchTxt,
    }; 

    this.Api.SelectOrderManagerTempDTNew(payload2).subscribe((res: any) => {
      this.orderTable = new MatTableDataSource(res.data?.transactions);
      this.customPagination.total = res.data?.recordsFiltered;
      this.totalRecords = res.data?.recordsFiltered;
      
      this.RecordSavedItem();

      this.orderTable.sort = this.sort;
    });   
  }

  
  ApplySavedItem() {
    if (this.currentTabDataService.savedItem[this.currentTabDataService.ORDER_MANAGER])
    {
      let item= this.currentTabDataService.savedItem[this.currentTabDataService.ORDER_MANAGER];
      this.column = item.column;
      this.value1D = item.value1D;
      this.case = item.case;
      this.value1 = item.value1;
      this.value2D = item.value2D;
      this.value2 = item.value2;
      this.maxOrders = item.maxOrders;
      this.searchCol = item.searchCol;
      this.transType = item.transType;
      this.viewType = item.viewType;
      this.orderType = item.orderType;
      this.searchTxt = item.searchTxt;
      this.orderTable = item.orderTable;
      return true;
    }
    return false;
  }
  RecordSavedItem() {
    this.currentTabDataService.savedItem[this.currentTabDataService.ORDER_MANAGER]= {
      column : this.column,
      case : this.case,
      value1D : this.value1D,
      value1 : this.value1,
      value2D : this.value2D,
      value2 : this.value2,
      maxOrders : this.maxOrders, 
      searchTxt : this.searchTxt, 
      transType : this.transType,
      viewType : this.viewType,
      orderType : this.orderType,
      searchCol : this.searchCol,
      orderTable : this.orderTable
	  
    }
  }
  
  handlePageEvent(e: PageEvent) { 
    this.customPagination.startIndex =  e.pageSize*e.pageIndex
    this.customPagination.endIndex =  (e.pageSize*e.pageIndex + e.pageSize)
    this.customPagination.recordsPerPage = e.pageSize;
    this.orderTable.sort = this.sort;
    this.getOrders();
  }

  deleteViewed() {
    
    if (this.orderType == "Open") {
      this.toastr.error("You can only delete pending transactions.", 'Warning!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
    } else {
      let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          ErrorMessage: 'Are you sure you want to delete all viewed orders?',
          action: 'delete'
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'Yes') {
          let payload = {
            username: this.userData.userName,
            user: this.userData.userName,
            wsid: this.userData.wsid,
            viewType: this.viewType
          };
      
          this.Api.OMOTPendDelete(payload).subscribe((res: any) => {
            if (res.isExecuted) {
              this.getOrders();
            }
          });
        }
      });
    }

  }

  callDisplayRecords(e : KeyboardEvent) {
    if (e.key == "Enter") this.displayRecords();
  }

  displayRecords() {
    if ((this.column == "Import Date" || this.column == "Required Date" || this.column == "Priority") && this.case == "Like") 
      this.toastr.error("Cannot use the 'Like' option with Required Date, Import Date, or Priority column options", 'Warning!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
    else this.getOrders();
    this.RecordSavedItem();
  }

  updateRecord(ele : any) {
    let dialogRef = this.dialog.open(OmUpdateRecordComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: { 
        ...ele,
        viewType: this.viewType,
        orderType: this.orderType,
      }
    });

    dialogRef.afterClosed().subscribe(result => { 
      if(result.isExecuted && result.clickDisplayRecord) {
        this.displayRecords();
      }
    });
  }

  openOrderStatus(ele : any, fromTable : boolean) {
    if((this.value1 == "" || this.column != "Order Number") && !fromTable){
      this.toastr.error("You must select an Order Number to view the order status.", 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
    }
    else{
      if (!fromTable){
        this.router.navigateByUrl(`/OrderManager/OrderStatus?orderStatus=${this.value1 ? this.value1 : ''}`);
      } 
      else {
        
          this.router.navigateByUrl(`/OrderManager/OrderStatus?orderStatus=${ele.orderNumber ? ele.orderNumber : ''}`);
      } 
    }
  }

  releaseViewed() {
    if (this.orderTable.data.length == 0) {
      this.toastr.error("No Transactions match your current filters to release.", 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
      return
    }
    if (this.orderType == 'Open') {
      this.toastr.error("This orders you are viewing have already been released.", 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
      return
    }
    if (!this.OMIndex.preferences[0].allowInProc) {
      this.toastr.error("You may not release an Order that is already in progress.", 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
      return
    }

    if (!this.OMIndex.preferences[0].allowPartRel && this.totalRecords > -1 || this.FilterString != '1 = 1') {      

      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          message: 'Cannot Release Partial Orders. If you would like to release the entire order, click Ok. Otherwise click cancel',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'Yes') {

          let payload = {
            username: this.userData.userName,
            wsid: this.userData.wsid,
            val: this.viewType,
            page: 'Order Manager'
          };
      
          this.Api.ReleaseOrders(payload).subscribe((res: any) => {
            if (res.isExecuted) {
              this.getOrders();
              this.clearSearch();
            }
          });
          
        } else {
          this.clearSearch();
          this.FilterString = "";
          this.fillTable();
        }
      });

    } else {

      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          message: 'Press ok to release currently Viewed Orders.',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'Yes') {

          let payload = {
            username: this.userData.userName,
            wsid: this.userData.wsid,
            val: this.viewType,
            page: 'Order Manager'
          };
      
          this.Api.ReleaseOrders(payload).subscribe((res: any) => {
            if (res.isExecuted) {
              this.getOrders();
              this.clearSearch();
            }
          });
          
        }
      });

    }

  }

  clearSearch() {
    this.searchTxt = "";
    this.searchCol = "";
  }

  showHideValues(type : any) {
    if (type == 1) {
      if (this.column.indexOf('Date') > -1) {
        this.v1Show = false;
        this.v1DShow = true;
        if (this.case == "Between") {
          this.v2Show = false;
          this.v2DShow = true;
        }
      } else {
        this.v1Show = true;
        this.v1DShow = false;
        if (this.case == "Between") {
          this.v2Show = true;
          this.v2DShow = false;
        }
      }
    }
    else if (type == 2) {
      if (this.case == "Between") {
        if (this.column.indexOf('Date') > -1){
          this.v2DShow = true;
          this.v2Show = false;
        } 
        else{  
          this.v2Show = true;
          this.v2DShow = false;
        } 
      } 
      else {
        if (this.column.indexOf('Date') > -1){
          this.v2Show = false;
        }
        else{
          this.v2Show = true;
        }
          this.v2DShow = false;
      }
    }
    this.RecordSavedItem();
  }

  openOmCreateOrders() { 
    let dialogRef = this.dialog.open(OmCreateOrdersComponent, { 
      height: 'auto',
      width: '1424px',
      autoFocus: '__non_existing_element__',
      disableClose:true, 
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  // Announce the new sort state, if any.
  announceSortChange(e : any) {
    let index = this.displayedColumns.findIndex(x => x === e.active);
    this.sortColumn = {
      columnName: index,
      sortOrder: e.direction
    }
    this.fillTable();
  }

  @ViewChild('trigger') trigger: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.trigger.menuData = { item: {SelectedItem: SelectedItem, FilterColumnName : FilterColumnName, FilterConditon: FilterConditon, FilterItemType : FilterItemType }};
    this.trigger.menu?.focusFirstItem('mouse');
    this.trigger.openMenu();
  }

  InputFilterSearch(FilterColumnName: any, Condition: any, TypeOfElement: any) {
    const dialogRef =  this.dialog.open(InputFilterComponent, {
      height: 'auto',
      width: '480px',
      data:{
        FilterColumnName: FilterColumnName,
        Condition: Condition,
        TypeOfElement:TypeOfElement
      },
      autoFocus: '__non_existing_element__',
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe((result) => { 
      this.onContextMenuCommand(result.SelectedItem, result.SelectedColumn, result.Condition,result.Type)
    }
    );
  }

  getType(val) : string {
     return this.filterService.getType(val);
  }

  FilterString : string = "";

  onContextMenuCommand(SelectedItem: any, FilterColumnName: any, Condition: any, Type: any) {
    if (SelectedItem != undefined) {
      this.FilterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, "clear", Type);
      this.FilterString = this.filterService.onContextMenuCommand(SelectedItem,FilterColumnName,Condition,Type);
    }
    this.customPagination.startIndex = 0;
    this.paginator.pageIndex = 0;
    this.FilterString = this.FilterString != "" ? this.FilterString : "1 = 1";
    this.getOrders();
  }

  async deleteTemp(){
    let payload = {
      username: this.userData.userName,
      wsid: this.userData.wsid,
      appName: ""
    }
    await this.Api.OrderManagerTempDelete(payload).toPromise();
  }

  actionDialog(matEvent: MatSelectChange) {
    const matSelect: MatSelect = matEvent.source;
    matSelect.writeValue(null);
  }

  printViewed(){
    this.omPreferences=this.global.getOmPreferences();

    if(this.omPreferences.printDirectly){
      this.globalService.Print(`FileName:PrintReleaseOrders|tabIDs:|View:${this.viewType}|Table:${this.orderType}|Page:${'Order Manager'}|WSID:${this.userData.wsid}`);

    }else{
      window.open(`/#/report-view?file=FileName:PrintReleaseOrders|tabIDs:|View:${this.viewType}|Table:${this.orderType}|Page:${'Order Manager'}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

    }
  }


  selectRow(row: any) {
    this.orderTable.filteredData.forEach(element => {
      if(row != element){
        element.selected = false;
      }
    });
    const selectedRow = this.orderTable.filteredData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }

}
