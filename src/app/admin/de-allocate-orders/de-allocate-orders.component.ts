import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/init/auth.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from '../dialogs/delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { ContextMenuFiltersService } from 'src/app/init/context-menu-filters.service';
import { SharedService } from 'src/app/services/shared.service';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-de-allocate-orders',
  templateUrl: './de-allocate-orders.component.html',
  styleUrls: ['./de-allocate-orders.component.scss']
})
export class DeAllocateOrdersComponent implements OnInit {
  pageLength=0;
  ELEMENT_DATA_1: any[] =[
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'},
  ]
    isOrderSelected=true;
    displayedColumns_1: string[] = ['select','order_no'];
    tableData_1 =[]
    isChecked: boolean = false;
    orderNumbersList:any=[];
    
    ELEMENT_DATA: any[] =[
      {trans_type: 'Count', order_no: '1202122', priority: '36', required_date: '11/02/2022 11:58 AM', user_field_1: 'Treat with care'},
      {trans_type: 'Count', order_no: '1202122', priority: '36', required_date: '11/02/2022 11:58 AM', user_field_1: 'Treat with care'},
      {trans_type: 'Count', order_no: '1202122', priority: '36', required_date: '11/02/2022 11:58 AM', user_field_1: 'Treat with care'},
    ];
    
    displayedColumns: string[] = ['deallocate','order_no','item_no','description','priority', 'transactionQuantity','unitOfMeasure','batchPickID','trans_type'];
    tableData = this.ELEMENT_DATA
    orderItemTransactions:MatTableDataSource<any> = new MatTableDataSource<any>([]);  
  orderNameList:MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('matSort1') sort1: MatSort;
  @ViewChild('matRefAction') matRefAction: MatSelect;

  public userData: any;
  public itemNumber:any = '';
  public orderNumber = '';
  public chooseSearchType:any;
  public TypeValue:any;
  transactionType:any = 'All'
  step
  isOrder = true;
  order;
  deallocateSelectedBtn = true
  onViewOrder=true;

// pagination and sorting for orderView
  pageEventOrder: PageEvent;
  startRowOrder = 0;
  endRowOrder = 10;
  recordsPerPageOrder = 10;
  sortColOrder = 0
  sortOrder ='asc'


// pagination and sorting for transaction View
  pageEventTransaction: PageEvent;
  startRowTransaction = 0;
  endRowTransaction = 10;
  recordsPerPageTransaction = 10;
  sortColTransaction = 0
  sortTransaction ='asc'
  dublicateTransaction 
  dublicateRecords 
  actions=''


  searchByItem: any = new Subject<string>();
  public searchedItemOrder: any = [];

  constructor(public authService: AuthService,
    private Api:ApiFuntions,
    private _liveAnnouncer: LiveAnnouncer,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private sharedService:SharedService,
    private filterService: ContextMenuFiltersService) { }

  ngOnInit(): void {
    this.userData = this.authService.userData()
    this.searchByItem
    .pipe(debounceTime(400), distinctUntilChanged())
    .subscribe((value) => {
      this.getAllOrder()
      this.autocompleteSearchColumnItem()
    });
    this.getAllOrder()
  } 
  clearMatSelectList(){
    this.matRefAction.options.forEach((data: MatOption) => data.deselect());
  }
  async autocompleteSearchColumnItem() {
    if(this.chooseSearchType == 'Order Number'){
      let payload = {
        "orderNumber": this.TypeValue,
        "userName": this.userData.userName,
        "wsid": this.userData.wsid
      }
  
      this.Api.AllocatedOrders(payload).subscribe((res: any) => {
        this.searchedItemOrder = res.data
      });
    }
    else if(this.chooseSearchType == 'Item Number'){
      let payload = {
        "itemNumber": this.TypeValue,
        "userName": this.userData.userName,
        "wsid": this.userData.wsid
      }
      this.Api.AllocatedItems(payload).subscribe((res: any) => {
        this.searchedItemOrder = res.data
      });
    }

  } 
  deAllocAction(event:any){
    this.clearMatSelectList();

  }
  getAllOrder(e?){
    this.orderItemTransactions.data = []
    this.dublicateTransaction = []
      let payload = {
        "orderNumber": this.chooseSearchType == 'Order Number'?this.TypeValue:'',
        "itemNumber": this.chooseSearchType == 'Item Number'?this.TypeValue:'',
        "transType": this.transactionType, 
        "userName": this.userData.userName,
        "wsid": this.userData.wsid
      }
      this.Api.AllAllocatedOrders(payload).subscribe((res=>{

        const orderNamesResponseObj = res.data.map((value, index) => {
     if(this.orderNumbersList.includes(value)){
      return {  name: value,isChecked:true ,isRowSelected:false};
          }else{
            return {  name: value,isChecked:false ,isRowSelected:false};
          }
         
        });
        this.orderNameList.data= orderNamesResponseObj
      }))
      
  }
  

  orderItemTable(e?,isPagination=false){

    if(!this.isOrderSelected){
      if(isPagination){
        this.resetpaginationTransaction()
      }
       
  
     
      let payload =  {
        "draw": 1,
        "start": this.startRowTransaction ,
        "length":this.recordsPerPageTransaction,
        "sortColumn": this.sortColTransaction,
        "sortOrder": this.sortTransaction,
        "transType": this.transactionType, 
        "displayFilter": "All",
        "orderNum": "",
        "warehouse": "",
        "filter": this.FilterString,
        "username": "1234",
        "wsid": "TESTWSID"
      }
      this.Api.OrderItemsTable(payload).subscribe((res=>{
        res.data.openTransactions.forEach((item,i)=>{
          if(this.orderNumbersList.includes(item.orderNumber)){
            res.data.openTransactions[i].isDeallocate=true
          }else{
            res.data.openTransactions[i].isDeallocate=false
          }
        })
        this.orderItemTransactions.data = res.data.openTransactions
        this.pageLength= res.data.recordsTotal
      }))
    }
    else{
      if(isPagination){
        this.resetpaginationOrder()
      }
      
     
      let payload =  {
        "draw": 1,
        "start": this.startRowOrder ,
        "length": this.recordsPerPageOrder,
        "sortColumn": this.sortColOrder,
        "sortOrder":  this.sortOrder,
        "transType": this.transactionType, 
        "displayFilter": "spec",
        "orderNum":  this.order.name,
        "warehouse": "",
        "filter":  this.FilterString,
        "username": "1234",
        "wsid": "TESTWSID"
      }
      this.Api.OrderItemsTable(payload).subscribe((res=>{
        res.data.openTransactions.forEach((item,i)=>{
          if(this.orderNumbersList.includes(item.orderNumber)){
            res.data.openTransactions[i].isDeallocate=true
          }else{
            res.data.openTransactions[i].isDeallocate=false
          }
        })

        
        this.orderItemTransactions.data = res.data.openTransactions
        this.pageLength= res.data.recordsTotal
        this.dublicateTransaction =  res.data.openTransactions
        this.dublicateRecords = res.data.recordsTotal

        
      }))
    }

  }

  check(e){
    this.chooseSearchType = e
    this.searchedItemOrder.length = 0
    this.resetpaginationOrder()
    this.orderItemTransactions.data = []
  }

  optionSelect(event: MatAutocompleteSelectedEvent): void {
    this.getAllOrder()
  }


  ordertransaction(row,index){
   this.resetpaginationOrder()
    this.orderNameList.data[index].isRowSelected=!this.orderNameList.data[index].isRowSelected;
    this.orderNameList.data.forEach((item,i)=>{
      if(index===i)return
      item.isRowSelected=false;
    })
    if(this.orderNameList.data[index].isRowSelected){
      this.order = row
      this.orderItemTable();
    }
    else{
      this.orderItemTransactions.data = []
      this.pageLength= 0
      this.dublicateTransaction = []
      this.paginator.pageIndex=0;
    }

  }


  deAllocateOrder(){
    if(this.orderNumbersList.length != 0){
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        height: 'auto',
        width: '600px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          action: 'De-Allocate',
        },
      });
  
      dialogRef.afterClosed().subscribe((res) => {
        if (res === 'Yes') {
          let deallocate = this.orderNumbersList.toString()
          let payload = {
            "orderNumber": deallocate,
            "userName": this.userData.userName,
            "wsid": this.userData.wsid
          }
          this.Api.DeAllocateOrder(payload).subscribe((res=>{
            if(res.isExecuted){
              this.actions = ''
              this.toastr.success("De-Allocated successfully", 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              this.deallocateSelectedBtn = true
              this.orderNumbersList.length=0
                this.getAllOrder()
                this.orderItemTable()
            }
            else{
              this.toastr.error('Order De-Allocation Not Successfull', 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            }
          }))
        }
      });
    }

  }
  deAllocateAll(){
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        action: 'De-Allocate All',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Yes') {
        let payload = {
          "orderNumber": '',
          "userName": this.userData.userName,
          "wsid": this.userData.wsid
        }
        this.Api.DeAllocateOrder(payload).subscribe((res=>{
          if(res.isExecuted){
            this.toastr.success("De-Allocated successfully", 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
            this.deallocateSelectedBtn = true
              this.getAllOrder()
              this.orderItemTable()
              this.actions = ''
          }
          else{
            this.toastr.error('Order De-Allocation Not Successfull', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        }))
      }
    });
    
    
    
 
  }

  checked(event,order){
    if(event.checked){
      this.orderNumbersList.push(order);
    }else{
      const index = this.orderNumbersList.indexOf(order)
      this.orderNumbersList.splice(index, 1);
    }
    
    this.orderItemTransactions.data.forEach((item,i)=>{
      if(item.orderNumber===order){
        this.orderItemTransactions.data[i].isDeallocate=event.checked;
      }
    })

    this.orderNameList.data.forEach((item,i)=>{
      if(item.name===order){
        this.orderNameList.data[i].isChecked=event.checked;
      }
    })

    this.orderItemTransactions= new MatTableDataSource<any>(this.orderItemTransactions.data);
    this.orderNameList= new MatTableDataSource<any>(this.orderNameList.data);

// for disable seleted btn
    if(this.orderNumbersList.length !=0){
      this.deallocateSelectedBtn = false
    }
    else{
      this.deallocateSelectedBtn = true
    }
  }
  dataChange(event){
    if(event.value==='spec'){

      if(this.dublicateTransaction.length!=0){
        this.orderItemTransactions.data = this.dublicateTransaction
        this.pageLength = this.dublicateRecords
      }
      else{
        this.orderItemTransactions.data = []
        this.pageLength= 0
       
      }
    this.onViewOrder = true;
      this.isOrderSelected=true;
    }else{
      this.onViewOrder = false;
      this.isOrderSelected=false;
      this.orderItemTable(null,true);
    }
   }
 

  sortChange(event) {
    //  for order
    if(this.onViewOrder){
      
      if (
        
        event.direction == '' ||
        event.direction == this.sortOrder
      )
        return;
  
      let index;
      this.displayedColumns.forEach((x, i) => {
        if (x === event.active) {
          index = i;
        }
      });
  
      this.sortColOrder = index;
      this.sortOrder = event.direction;
      this.orderItemTable()
    }

    // for transaction
    else{
      if (
     
        event.direction == '' ||
        event.direction == this.sortColTransaction
      )
        return;
  
      let index;
      this.displayedColumns.forEach((x, i) => {
        if (x === event.active) {
          index = i;
        }
      });
  
      this.sortColTransaction = index;
      this.sortTransaction = event.direction;
      this.orderItemTable()

    }

  }

  handlePageEventTo(e: PageEvent) {
    this.pageEventOrder = e;
    this.startRowOrder = e.pageSize * e.pageIndex;
    this.endRowOrder = e.pageSize * e.pageIndex + e.pageSize;
    this.recordsPerPageOrder = e.pageSize;
    this.orderItemTable()
  }
  handlePageEventTansaction(e: PageEvent) {
    this.pageEventTransaction = e;
    this.startRowTransaction = e.pageSize * e.pageIndex;
    this.endRowTransaction = e.pageSize * e.pageIndex + e.pageSize;
    this.recordsPerPageTransaction = e.pageSize;
    this.orderItemTable()
  }


  resetpaginationOrder(){
    this.startRowOrder = 0;
    this.endRowOrder = 10;
    this.recordsPerPageOrder = 10;
    this.sortColOrder = 0
    this.sortOrder ='asc'
    this.paginator.pageIndex=0;
    this.pageLength=0
    
    
  }
  
  resetpaginationTransaction(){
    this.startRowTransaction = 0;
    this.endRowTransaction = 10;
    this.recordsPerPageTransaction = 10;
    this.sortColTransaction = 0
    this.sortTransaction ='asc'
    this.paginator.pageIndex=0;
    this.pageLength=0
  }


  @ViewChild('trigger') trigger: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  FilterString: string = "1 = 1";


  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.trigger.menuData = { item: { SelectedItem: SelectedItem, FilterColumnName: FilterColumnName, FilterConditon: FilterConditon, FilterItemType: FilterItemType } };
    this.trigger.menu?.focusFirstItem('mouse');
    this.trigger.openMenu();
  }

  onContextMenuCommand(SelectedItem: any, FilterColumnName: any, Condition: any, Type: any) {

    this.FilterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, "clear", Type);
    if(FilterColumnName != "" || Condition == "clear"){
      this.FilterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, Condition, Type);
      this.FilterString = this.FilterString != "" ? this.FilterString : "1=1";
      this.orderItemTable();
    }
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

  clear(){
    this.TypeValue = ''
    this.getAllOrder()
  }

}
