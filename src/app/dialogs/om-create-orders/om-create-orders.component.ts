import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OmAddRecordComponent } from '../om-add-record/om-add-record.component';
import {  } from '../om-add-transaction/om-add-transaction.component';
import {  } from '../om-edit-transaction/om-edit-transaction.component';
import { OmUserFieldDataComponent } from '../om-user-field-data/om-user-field-data.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service';
import { Router } from '@angular/router'; 
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import labels from '../../labels/labels.json';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContextMenuFiltersService } from 'src/app/init/context-menu-filters.service';
import { InputFilterComponent } from '../input-filter/input-filter.component';
import { ColumnSequenceDialogComponent } from 'src/app/admin/dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-om-create-orders',
  templateUrl: './om-create-orders.component.html',
  styleUrls: ['./om-create-orders.component.scss']
})
export class OmCreateOrdersComponent implements OnInit {
  omPreferences:any;
  @ViewChild('ord_focus') ord_focus: ElementRef;
  displayedColumns: any[] = [];

  sequenceKeyMapping:any = [
    {sequence: 'Transaction Type',key:'transactionType'},
    {sequence: 'Order Number',key:'orderNumber'},
    {sequence: 'Priority',key:'priority'},
    {sequence: 'Required Date',key:'requiredDate'},
    {sequence: 'User Field1',key:'userField1'},
    {sequence: 'User Field2',key:'userField2'},
    {sequence: 'User Field3',key:'userField3'},
    {sequence: 'User Field4',key:'userField4'},
    {sequence: 'User Field5',key:'userField5'},
    {sequence: 'User Field6',key:'userField6'},
    {sequence: 'User Field7',key:'userField7'},
    {sequence: 'User Field8',key:'userField8'},
    {sequence: 'User Field9',key:'userField9'},
    {sequence: 'User Field10',key:'userField10'},
    {sequence: 'Item Number',key:'itemNumber'},
    {sequence: 'Description',key:'description'},
    {sequence: 'Line Number',key:'lineNumber'},
    {sequence: 'Transaction Quantity',key:'transactionQuantity'},
    {sequence: 'Warehouse',key:'warehouse'},
    {sequence: 'Line Sequence',key:'lineSequence'},
    {sequence: 'In Process',key:'inProcess'},
    {sequence: 'Processing By',key:'processingBy'},
    {sequence: 'Unit of Measure',key:'unitOfMeasure'},
    {sequence: 'Import By',key:'importBy'},
    {sequence: 'Import Date',key:'importDate'},
    {sequence: 'Import Filename',key:'importFilename'},
    {sequence: 'Expiration Date',key:'expirationDate'},
    {sequence: 'Lot Number',key:'lotNumber'},
    {sequence: 'Serial Number',key:'serialNumber'},
    {sequence: 'Notes',key:'notes'},
    {sequence: 'Revision',key:'revision'},
    {sequence: 'ID',key:'id'},
    {sequence: 'Host Transaction ID',key:'hostTransactionID'},
    {sequence: 'Emergency',key:'emergency'},
    {sequence: 'Label',key:'label'},
    {sequence: 'Batch Pick ID',key:'batchPickID'},
    {sequence: 'Tote ID',key:'toteID'},
    {sequence: 'Cell',key:'cell'},
    {sequence: 'Label',key:'label'},
    {sequence: 'Label',key:'label'},
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
  AllowInProc: any = 'False';
  otcreatecount: any = 0;
  orderNumberSearchList: any;
  @ViewChild("searchauto", { static: false }) autocompleteOpened: MatAutocomplete;
  @ViewChild('trigger') trigger: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  FilterString: string = "";
  selectedTransaction: any = {};
  selectedFilterColumn: string = "";
  selectedFilterString: string;
  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild('paginator1') paginator1: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<OmCreateOrdersComponent>,
    private Api: ApiFuntions,
    private global:GlobalService,
    private filterService: ContextMenuFiltersService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getColumnSequence();
    this.omPreferences=this.global.getOmPreferences();
  }

  openOmAddRecord() {
    let dialogRef = this.dialog.open(OmAddRecordComponent, {
      height: 'auto',
      width: '75vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
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
    let dialogRef = this.dialog.open(OmAddRecordComponent, {
      height: 'auto',
      width: '75vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
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
    sortState.active = this.sequenceKeyMapping.filter((x:any) => x.sequence == sortState.active)[0]?.key;
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.tableData.sort = this.sort1;
  }

  openOmAddTransaction(element: any = {}) {
    if(this.tableData.filteredData.length == 0){
      return;
    }
    if(!element.orderNumber && this.tableData.filteredData.length == 1){
      element = this.tableData.filteredData[0];
    }
    let dialogRef = this.dialog.open(OmAddRecordComponent, {
      height: 'auto',
      width: '75vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
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
    let dialogRef = this.dialog.open(OmUserFieldDataComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe(result => {


    })
  }

  createOrdersDT(loader: boolean = false) {
    if (this.createOrdersDTPayload.orderNumber.trim() != '') {
      this.Api.CreateOrdersDT(this.createOrdersDTPayload).subscribe((res: any) => {
        if (res.isExecuted && res.data) {
          this.tableData = new MatTableDataSource(res.data);  
          this.tableData.paginator = this.paginator1;
        } else { 
          this.tableData = new MatTableDataSource(); 
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
    if (this.AllowInProc == "False" && this.otcreatecount > 0) {
      this.toastr.error('"You may not release an Order that is already in progress', 'Release Transactions', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      return;
    }
    
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        heading: 'Release Transaction',
        message: 'Release all orders for this order number?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Yes') {
        let payload = {
          "val": this.createOrdersDTPayload.orderNumber,
          "page": "Create Orders",
          "wsid": this.userData.wsid
        };
        this.Api.ReleaseOrders(payload).subscribe((res: any) => {
          if (res.isExecuted && res.data) {
            this.toastr.success("Order Released Successfully!", 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          } 
          this.createOrdersDTPayload.orderNumber = '';
          this.createOrdersDT();
          dialogRef.close();
        });
      }
    });
  }

  printViewed() {
    this.omPreferences=this.global.getOmPreferences();
    let tabIDs = this.tableData.filteredData?.length > 0 ? this.tableData.filteredData.map((x:any) => x.id).toString() : '';

    if(this.omPreferences.printDirectly){
      this.global.Print(`FileName:PrintReleaseOrders|tabIDs:${tabIDs}|View:|Table:|Page:${'Create Orders'}|WSID:${this.userData.wsid}`);

    }else{
      window.open(`/#/report-view?file=FileName:PrintReleaseOrders|tabIDs:${tabIDs}|View:|Table:|Page:${'Create Orders'}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

    }

  }

  deleteViewed() {
    if (this.tableData.length == 0) {
      this.toastr.error('There are currently no records within the table', 'Warning', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
    else {
      let ids = [];
      ids = this.tableData.filteredData.map(x => x.id.toString());
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'release-all-orders',
          ErrorMessage: 'Are you sure you want to delete these records?',
          action: 'delete'
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'Yes') {
          let payload = {
            "ids": ids,
            "user": this.userData.userName,
            "wsid": this.userData.wsid
          };
          this.Api.OTPendDelete(payload).subscribe((res: any) => {
            if (res.isExecuted && res.data) {
              this.toastr.success(labels.alert.delete, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              this.createOrdersDTPayload.filter = "1 = 1";
              this.selectedFilterColumn = '';
              this.selectedFilterString = '';
              this.createOrdersDT();
              dialogRef.close();
            } else {
              this.toastr.error("An error has occurred while deleting the viewed records", 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
            }
          });
        }
      });
    }
  }

  selectColumnSequence() {
    let dialogRef = this.dialog.open(ColumnSequenceDialogComponent, {
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

  searchItem(loader: boolean = false,searchData:boolean = false) {
    if (this.createOrdersDTPayload.orderNumber.trim() != '') {
      let payload = {
        "orderNumber": this.createOrdersDTPayload.orderNumber,
        "userName": this.userData.userName,
        "wsid": this.userData.wsid
      }
      this.Api.CreateOrderTypeahead(payload).subscribe((res: any) => {
        if (res.isExecuted && res.data) {
          this.orderNumberSearchList = res.data.sort();
        }
      });
      if(searchData){
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
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.trigger.menuData = { item: { SelectedItem: SelectedItem, FilterColumnName: FilterColumnName, FilterConditon: FilterConditon, FilterItemType: FilterItemType } };
    this.trigger.menu?.focusFirstItem('mouse');
    this.trigger.openMenu();
  }

  onContextMenuCommand(SelectedItem: any, FilterColumnName: any, Condition: any, Type: any) {
    if (SelectedItem != undefined) {
      this.FilterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, "clear", Type);
      this.FilterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, Condition, Type);
    }
    this.createOrdersDTPayload.filter = this.FilterString != "" ? this.FilterString : "1 = 1";
    this.paginator1.pageIndex = 0;
    this.createOrdersDT(true);
  }

  getType(val): string {
    return this.filterService.getType(val);
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
      this.onContextMenuCommand(result.SelectedItem, result.SelectedColumn, result.Condition, result.Type)
    }
    );
  }

  getColumnSequence(refresh: boolean = false) {
    let payload = {
      username: this.userData.userName,
      wsid: this.userData.wsid,
      tableName: 'Order Manager Create'
    };
    this.Api.GetColumnSequence(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.filterColumnNames = JSON.parse(JSON.stringify(res.data));
        this.sortedFilterColumnNames = [...this.filterColumnNames.sort()];
        this.displayedColumns = [];
        res.data.forEach((x:any) => {
        if(this.sequenceKeyMapping.filter((y:any)=> x == y.sequence)[0]?.key){
          this.displayedColumns.push(this.sequenceKeyMapping.filter((y:any)=> x == y.sequence)[0]?.key)
        }});
        this.displayedColumns.push('actions');
        if(refresh) this.createOrdersDT();
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

  focusinmethod(){
    document.getElementById("scrr")?.setAttribute("style", "overflow: hidden;");
  }
  
  focusoutmethod(){
    document.getElementById("scrr")?.setAttribute("style", "overflow: auto;");
  }

  actionDialog(matEvent: MatSelectChange) {
    const matSelect: MatSelect = matEvent.source;
    matSelect.writeValue(null);
  }
  ngAfterViewInit(): void {
    this.ord_focus.nativeElement.focus();
  }

  selectRow(row: any) {
    this.tableData.filteredData.forEach(element => {
      if(row != element){
        element.selected = false;
      }
    });
    const selectedRow = this.tableData.filteredData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }

}
