import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/common/init/auth.service';
import { AddNewTransactionToOrderComponent } from '../../dialogs/add-new-transaction-to-order/add-new-transaction-to-order.component';
import { DeleteConfirmationManualTransactionComponent } from '../../dialogs/delete-confirmation-manual-transaction/delete-confirmation-manual-transaction.component';
import { ManualTransPostConfirmComponent } from '../../dialogs/manual-trans-post-confirm/manual-trans-post-confirm.component';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { SelectOrderComponentComponent } from './select-order-component/select-order-component.component';
import { DialogConstants, ToasterTitle, ToasterType, TransactionType ,Style,ColumnDef,UniqueConstants, Placeholders} from 'src/app/common/constants/strings.constants';
 

@Component({
  selector: 'app-generate-order',
  templateUrl: './generate-order.component.html',
  styleUrls: ['./generate-order.component.scss'],
})
export class GenerateOrderComponent implements OnInit {

  placeholders = Placeholders;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;
  @ViewChild('SelectOrderComponentComponent') SelectOrderComponentComponent: SelectOrderComponentComponent;
  transType: any = TransactionType.Pick;
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
  public sortOrder: any = UniqueConstants.Asc;
  customPagination: any;
  public searchString: any = '';
  public columnValues: any = [];
  isPost=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pageEvent: PageEvent;
  selectedOption: any;

  @Input() set tab(event : any) {
    if (event) { 
      setTimeout(()=>{
        this.searchBoxField?.nativeElement.focus();
      }, 500);
    }
  }
  public iAdminApiService: IAdminApiService;

  constructor(
    private authService: AuthService,
    public adminApiService: AdminApiService,
    private global:GlobalService
  ) {
    this.userData = this.authService.userData();
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.customPagination = {
      total: '',
      recordsPerPage: 10,
      startIndex: 0,
      endIndex: 10,
    };
  

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
    ColumnDef.Warehouse,
    'BatchPickID',
    'Notes',
    'ToteNumber',
    'HostTransactionID',
    ColumnDef.Emergency,
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
    ColumnDef.Actions,
  ];
  public generateOrderDataSource: any = new MatTableDataSource();


  async autocompleteSearchColumn() {
    let searchPayload = {
      orderNumber: this.orderNumber,
      transType: this.transType,
    };
    this.iAdminApiService
      .ManualOrderTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          if(res.isExecuted && res.data)
          {
            this.searchAutocompleteList = res.data;
          }
          else {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.log("ManualOrderTypeAhead",res.responseMessage);
          }
        }
      );
  }

  actionDialog(opened: boolean, selectedOption: any) {
    if (
      !opened &&
      selectedOption &&
      selectedOption === 'add_new_transaction'
    ) {
      const dialogRef:any = this.global.OpenDialog(AddNewTransactionToOrderComponent, {
        height: DialogConstants.auto,
        width: Style.w100vw,
        autoFocus: DialogConstants.autoFocus,
      disableClose:true,
        data: {
          mode: 'add-trans',
          itemNumber:this.itemNumberForInsertion,
          orderNumber: this.orderNumber,
          transactionType: this.transType,
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
      this.SelectOrderComponentComponent.clearMatSelectList()
        if (res.isExecuted) {
          this.selectedOrder=this.orderNumber
          this.getOrderTableData(this.orderNumber);
        }
      });
    } else if (
      !opened &&
      selectedOption &&
      selectedOption === 'delete_order'
    ) {
      const dialogRef:any = this.global.OpenDialog(
        DeleteConfirmationManualTransactionComponent,
        {
          height: DialogConstants.auto,
          width: Style.w560px,
          autoFocus: DialogConstants.autoFocus,
      disableClose:true,
          data: {
            mode: 'delete-order',
            heading: 'Delete Order',
            message: `Are you sure you want to remove order: ${this.orderNumber} ? This will  remove all manual transaction for this order`,
            orderNumber:this.orderNumber
          },
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        this.clearFields()
        this.SelectOrderComponentComponent?.clearMatSelectList()
        this.getOrderTableData();

        if (res.isExecuted) {
          this.getOrderTableData();
          
        }
      });
    }else if (
      !opened &&
      selectedOption &&
      selectedOption === 'post_order'
    ) {
      const dialogRef:any = this.global.OpenDialog(ManualTransPostConfirmComponent, {
        height: DialogConstants.auto,
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
      disableClose:true,
        data: {
          userName:this.userData.userName,
          wsid:this.userData.wsid,
          orderNumber:this.orderNumber,
          toteId:this.toteID?this.toteID:''
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.SelectOrderComponentComponent?.clearMatSelectList()
        if (res.isExecuted) {
          this.clearFields();
          this.getOrderTableData();
        }
      });
    }
  }
  clearFields(){
    this.orderNumber='';
    this.selectedOrder='';
    this.searchAutocompleteList=[];
  }

  editTransaction(element){

  const dialogRef:any = this.global.OpenDialog(AddNewTransactionToOrderComponent, {
        height: DialogConstants.auto,
        width: Style.w100vw,
        autoFocus: DialogConstants.autoFocus,
      disableClose:true,
        data: {
          mode:'edit-transaction',
          item:element,
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.SelectOrderComponentComponent?.clearMatSelectList()
        if (res.isExecuted) {
          this.getOrderTableData();
        }
      });
  }

  sortChange(event) {
    if (!this.generateOrderDataSource || event.direction == '') return;

    let index;
    this.displayedColumns.forEach((x, i) => {
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
    this.customPagination.startIndex = e.pageSize * e.pageIndex;

    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;

    this.getOrderTableData();
  }
  deleteTransaction(element?) {
    const dialogRef:any = this.global.OpenDialog(
      DeleteConfirmationManualTransactionComponent,
      {
        height: DialogConstants.auto,
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
      disableClose:true,
        data: {
          mode: 'delete-trans',
          heading: 'Delete Selected Transaction',
          message: 'Delete this transaction',
          element: element,
        },
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      this.SelectOrderComponentComponent?.clearMatSelectList()
        this.getOrderTableData();
    });
  }
  getOrderTableData(ordernumber:any =null) {
    if(ordernumber) this.orderNumber = ordernumber;
    let payload = {
      orderNumber: this.orderNumber,
      transactionType: this.transType,
      draw: 0,
      start: this.customPagination.startIndex,
      length: this.customPagination.recordsPerPage,
      orderColumn: this.sortCol,
      sortOrder: this.sortOrder,
    };
    this.iAdminApiService
      .GernerateOrderTable(payload)
      .subscribe(
        (res: any) => {
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
            this.generateOrderDataSource = new MatTableDataSource(res?.data?.orderTable);
            this.itemNumberForInsertion= res?.data?.orderTable[0]?.itemNumber
          }
          else{
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.log("GernerateOrderTable",res.responseMessage);
          }
        }
      );
  }
  ngOnDestroy() {
    this.searchByInput.unsubscribe();
  }
  clear(){
    this.orderNumber ='';
    this.selectedOrder='';
    this.autocompleteSearchColumn();
    this.getOrderTableData();
  }

  selectRow(row: any) {
    this.generateOrderDataSource.filteredData.forEach(element => {
      if(row != element){
        element.selected = false;
      }
    });
    const selectedRow = this.generateOrderDataSource.filteredData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }
  onTransTypeChange(transType: any){
    this.transType=transType;
  }
  onOrderNoChange(orderNumber: any){
    this.orderNumber=orderNumber;
  }
  searchData() {
    this.selectedOrder = this.orderNumber;
  }

  hideRequiredMarker() {
    return false;
  }

}
