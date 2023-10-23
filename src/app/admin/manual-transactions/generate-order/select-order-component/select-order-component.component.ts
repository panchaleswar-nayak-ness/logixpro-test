import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AddNewTransactionToOrderComponent } from 'src/app/admin/dialogs/add-new-transaction-to-order/add-new-transaction-to-order.component';
import { DeleteConfirmationManualTransactionComponent } from 'src/app/admin/dialogs/delete-confirmation-manual-transaction/delete-confirmation-manual-transaction.component';
import { ManualTransPostConfirmComponent } from 'src/app/admin/dialogs/manual-trans-post-confirm/manual-trans-post-confirm.component';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-select-order-component',
  templateUrl: './select-order-component.component.html',
  styleUrls: []
})
export class SelectOrderComponentComponent implements OnInit {

  orderNumber: string = '';
  
  @Output() OrderTableData: EventEmitter<any> = new EventEmitter();

  floatLabelType: FloatLabelType;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  transType: string = 'Pick';
  selectedOption: string = '';
  @Input() isPost: boolean = false;
  searchByInput: any = new Subject<string>();
  searchAutocompleteList: string[] = [];
  selectedOrder: string;
  toteID: any;
  userData: any;
  itemNumberForInsertion: any;

  public iAdminApiService: IAdminApiService;
  dataSource: MatTableDataSource<unknown>;
  matRef: any;

  constructor(
    private authService: AuthService,
    private Api: ApiFuntions,
    private adminApiService: AdminApiService,
    private global:GlobalService
  ) {
    this.userData = this.authService.userData();
    this.iAdminApiService = adminApiService;
  }
  ngOnInit(): void {
    this.searchByInput
    .pipe(debounceTime(400), distinctUntilChanged())
    .subscribe((value) => {
      this.autocompleteSearchColumn();
    });   
  }
  
  clear() {
    this.orderNumber = '';
    this.orderNumber='';
    this.selectedOrder='';
    this.searchAutocompleteList=[];
  }
  searchData() {
    this.selectedOrder=this.orderNumber
    }
  async autocompleteSearchColumn() {
    let searchPayload = {
      orderNumber: this.orderNumber,
      transType: this.transType,
    };
    this.iAdminApiService
      .ManualOrderTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          this.searchAutocompleteList = res.data;
          this.OrderTableData.emit(this.orderNumber);
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
      const dialogRef:any = this.global.OpenDialog(AddNewTransactionToOrderComponent, {
        height: 'auto',
        width: '100vw',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'add-trans',
          itemNumber:this.itemNumberForInsertion,
          orderNumber: this.orderNumber,
          transactionType: this.transType,
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
      this.clearMatSelectList()
        if (res.isExecuted) {
          this.selectedOrder=this.orderNumber
          // this.getOrderTableData();
        }
      });
    } else if (
      !opened &&
      this.selectedOption &&
      this.selectedOption === 'delete_order'
    ) {
      const dialogRef:any = this.global.OpenDialog(
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
            orderNumber:this.orderNumber
          },
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        this.clear()
        this.clearMatSelectList()
        // this.getOrderTableData();

        if (res.isExecuted) {
          // this.getOrderTableData();
          
        }
      });
    }else   if (
      !opened &&
      this.selectedOption &&
      this.selectedOption === 'post_order'
    ) {
      const dialogRef:any = this.global.OpenDialog(ManualTransPostConfirmComponent, {
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
        this.clearMatSelectList()
        if (res.isExecuted) {
          this.clear();
          // this.getOrderTableData();
        }
      });
    }
  }
  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }
  hideRequiredMarker() {
    return false; 
  }
}
