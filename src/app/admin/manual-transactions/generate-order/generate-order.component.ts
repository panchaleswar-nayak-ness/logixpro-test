import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuthService } from 'src/app/init/auth.service';
import { AddNewTransactionToOrderComponent } from '../../dialogs/add-new-transaction-to-order/add-new-transaction-to-order.component';
import { DeleteConfirmationManualTransactionComponent } from '../../dialogs/delete-confirmation-manual-transaction/delete-confirmation-manual-transaction.component';
import { ManualTransPostConfirmComponent } from '../../dialogs/manual-trans-post-confirm/manual-trans-post-confirm.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
 

@Component({
  selector: 'app-generate-order',
  templateUrl: './generate-order.component.html',
  styleUrls: ['./generate-order.component.scss'],
})
export class GenerateOrderComponent implements OnInit {
  @ViewChild('matRef') matRef: MatSelect;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  transType: any = 'Pick';
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  userData: any;
  orderNumber = '';
  orderToPost:any;
  itemNumberForInsertion:'';
  searchByInput: any = new Subject<string>();
  searchAutocompleteList: any;
  selectedOrder:any='';
  toteID:any='';
  public sortCol: any = 0;
  public sortOrder: any = 'asc';
  customPagination: any;
  public searchString: any = '';
  public columnValues: any = [];
  selectedOption: any;
  isPost=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pageEvent: PageEvent;

  @Input() set tab(event : any) {
    if (event) { 
      setTimeout(()=>{
        this.searchBoxField.nativeElement.focus();
      }, 500);
    }
  }

  constructor(
    private authService: AuthService,
    private Api: ApiFuntions,
    private dialog: MatDialog
  ) {
    this.userData = this.authService.userData();
  }

  ngOnInit(): void {
    this.customPagination = {
      total: '',
      recordsPerPage: 10,
      startIndex: 0,
      endIndex: 10,
    };

    this.searchByInput
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        // if (this.orderNumber === '') return;
        this.autocompleteSearchColumn();
        this.getOrderTableData();
      });      

  }

  public displayedColumns: string[] = [
    'ItemNumber',
    'TransactionQuantity',
    'LineNumber',
    'LineSequence',
    'Priority',
    'RequiredDate',
    'LotNumber',
    'ExpirationDate',
    'SerialNumber',
    'Warehouse',
    'BatchPickID',
    'Notes',
    'ToteNumber',
    'HostTransactionID',
    'Emergency',
    'UserField1',
    'UserField2',
    'UserField3',
    'UserField4',
    'UserField5',
    'UserField6',
    'UserField7',
    'UserField8',
    'UserField9',
    'UserField10',
    'actions',
  ];
  public dataSource: any = new MatTableDataSource();

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }
  async autocompleteSearchColumn() {
    let searchPayload = {
      orderNumber: this.orderNumber,
      transType: this.transType,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .ManualOrderTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          this.searchAutocompleteList = res.data;
        },
        (error) => {}
      );
  }

  actionDialog(opened: boolean) {
    if (
      !opened &&
      this.selectedOption &&
      this.selectedOption === 'add_new_transaction'
    ) {
      const dialogRef = this.dialog.open(AddNewTransactionToOrderComponent, {
        height: 'auto',
        width: '100vw',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'add-trans',
          itemNumber:this.itemNumberForInsertion,
          orderNumber: this.orderNumber,
          transactionType: this.transType,
          userName: this.userData.userName,
          wsid: this.userData.wsid,
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
      this.clearMatSelectList()
        if (res.isExecuted) {
          this.selectedOrder=this.orderNumber
          this.getOrderTableData();
          // this.clearFields()
        }
      });
    } else if (
      !opened &&
      this.selectedOption &&
      this.selectedOption === 'delete_order'
    ) {
      const dialogRef = this.dialog.open(
        DeleteConfirmationManualTransactionComponent,
        {
          height: 'auto',
          width: '560px',
          autoFocus: '__non_existing_element__',
      disableClose:true,
          data: {
            mode: 'delete-order',
            heading: 'Delete Order',
            message: `Are you sure you want to remove order: ${this.orderNumber} ? This will  remove all manual transaction for this order`,
            userName: this.userData.userName,
            wsid: this.userData.wsid,
            orderNumber:this.orderNumber
          },
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        this.clearFields()
        this.clearMatSelectList()
        this.getOrderTableData();

        if (res.isExecuted) {
          this.getOrderTableData();
          
        }
      });
    }else   if (
      !opened &&
      this.selectedOption &&
      this.selectedOption === 'post_order'
    ) {
      const dialogRef = this.dialog.open(ManualTransPostConfirmComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          userName:this.userData.userName,
          wsid:this.userData.wsid,
          orderNumber:this.orderNumber,
          toteId:this.toteID?this.toteID:''
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        // this.clearFields()
        this.clearMatSelectList()
        if (res.isExecuted) {
          this.clearFields();
          this.getOrderTableData();
        }
      });
    }
  }
  searchData() {
  this.selectedOrder=this.orderNumber
  }
  clearFields(){
    this.orderNumber='';
    this.selectedOrder='';
    this.searchAutocompleteList=[];
  }
  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  editTransaction(element){


// JSON.stringify(element.batchPickID)
// JSON.stringify(element.hostTransactionID)
// JSON.stringify(element.lineNumber)
// JSON.stringify(element.lineSequence)
// JSON.stringify(element.priority)
// JSON.stringify(element.toteID)
  const dialogRef = this.dialog.open(AddNewTransactionToOrderComponent, {
        height: 'auto',
        width: '100vw',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode:'edit-transaction',
          item:element,
          userName: this.userData.userName,
          wsid: this.userData.wsid,
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.clearMatSelectList()
        if (res.isExecuted) {
          this.getOrderTableData();
          this.clearFields();
        }
      });
  }

  sortChange(event) {
    if (!this.dataSource || event.direction == '') return;

    let index;
    this.displayedColumns.find((x, i) => {
      if (x === event.active) {
        index = i;
      }
    });

    this.sortCol = index;
    this.sortOrder = event.direction;
    this.getOrderTableData();
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    // this.customPagination.startIndex =  e.pageIndex
    this.customPagination.startIndex = e.pageSize * e.pageIndex;

    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    // this.length = e.length;
    this.customPagination.recordsPerPage = e.pageSize;

    this.getOrderTableData();
  }
  deleteTransaction(element?) {
    const dialogRef = this.dialog.open(
      DeleteConfirmationManualTransactionComponent,
      {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'delete-trans',
          heading: 'Delete Selected Transaction',
          message: 'Delete this transaction',
          userName: this.userData.userName,
          wsid: this.userData.wsid,
          element: element,
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      this.clearMatSelectList()
      // if (res.isExecuted) {
        this.getOrderTableData();
      // }
    });
  }
  getOrderTableData() {
    let payload = {
      orderNumber: this.orderNumber,
      transactionType: this.transType,
      draw: 0,
      start: this.customPagination.startIndex,
      length: this.customPagination.recordsPerPage,
      orderColumn: this.sortCol,
      sortOrder: this.sortOrder,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .GernerateOrderTable(payload)
      .subscribe(
        (res: any) => {
          // let dummy_data = [
          //   {

          //     itemNumber: 2,
          //     TransactionQuantity: '2',
          //     LineNumber: '2',
          //     LineSequence: '2',
          //     Priority: '2',
          //     RequiredDate: '2/2/222',
          //     LotNumber: '1',
          //     ExpirationDate: '2/2/222',
          //     SerialNumber: '',
          //     Warehouse: '',
          //     BatchPickID: '',
          //     Notes: '',
          //     ToteNumber: '',
          //     HostTransactionID: '',
          //     Emergency: '',
          //     UserField1: '',
          //     UserField2: '',
          //     UserField3: '',
          //     UserField4: '',
          //     UserField5: '',
          //     UserField6: '',
          //     UserField7: '',
          //     UserField8: '',
          //     UserField9: '',
          //     UserField10: '',
          //     actions:''
          //   },
          // ];
          if (res.isExecuted) {
            if(res.data.orderTable && res.data.orderTable.length>0){
              this.isPost=true;
              res.data.orderTable.filter((item,i)=>{
                if(item.expirationDate==='1/1/1900 12:00:00 AM' || item.expirationDate==='2/2/1753 12:00:00 AM'){
                  res.data.orderTable[i].expirationDate='';
                  
                }
                 if(item.requiredDate==='1/1/1900 12:00:00 AM'|| item.requiredDate==='2/2/1753 12:00:00 AM'){
                  res.data.orderTable[i].requiredDate='';
                }
              })
            }else{
              this.isPost=false;
            }
            this.dataSource = new MatTableDataSource(res.data && res.data.orderTable);
            this.itemNumberForInsertion=res.data && res.data.orderTable && res.data.orderTable[0] &&res.data.orderTable[0].itemNumber
          }
        },
        (error) => {}
      );
  }
onSelectionChange(event){
  // this.clearFields();
}
  ngOnDestroy() {
    this.searchByInput.unsubscribe();
  }
  clear(){
    this.orderNumber = ''
    this.autocompleteSearchColumn();
    this.getOrderTableData();
  }

  selectRow(row: any) {
    this.dataSource.filteredData.forEach(element => {
      if(row != element){
        element.selected = false;
      }
    });
    const selectedRow = this.dataSource.filteredData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }

}
