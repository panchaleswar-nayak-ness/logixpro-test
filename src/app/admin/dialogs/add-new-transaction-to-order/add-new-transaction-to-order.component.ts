import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { FormControl, FormGroup } from '@angular/forms';
import labels from '../../../labels/labels.json';
import { FloatLabelType } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ItemExistGenerateOrderComponent } from '../item-exist-generate-order/item-exist-generate-order.component';
import { EmptyFieldsComponent } from '../empty-fields/empty-fields.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-add-new-transaction-to-order',
  templateUrl: './add-new-transaction-to-order.component.html',
  styleUrls: ['./add-new-transaction-to-order.component.scss'],
})
export class AddNewTransactionToOrderComponent implements OnInit {
  @ViewChild('item_num') item_num: ElementRef;
  orderNumber;
  quantity=0;
  itemNumber:any='';
  expirationDate: any;
  requiredDate: any;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  searchByInput: any = new Subject<string>();
  searchAutocompleteList: any=[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private Api: ApiFuntions,
    public dialogRef: MatDialogRef<any>
  ) {}
  transactionInfo = new FormGroup({
    lineNumber: new FormControl(''),
    lineSequence: new FormControl(''),
    priority: new FormControl(''),
    toteNumber: new FormControl(''),
    batchPickID: new FormControl(''),
    warehouse: new FormControl(''),
    lotNumber: new FormControl(''),
    serialNumber: new FormControl(''),
    hostTranID: new FormControl(''),
    emergency: new FormControl(''),
    notes: new FormControl(''),
    userField1: new FormControl(''),
    userField2: new FormControl(''),
    userField3: new FormControl(''),
    userField4: new FormControl(''),
    userField5: new FormControl(''),
    userField6: new FormControl(''),
    userField7: new FormControl(''),
    userField8: new FormControl(''),
    userField9: new FormControl(''),
    userField10: new FormControl(''),
  });
  ngOnInit(): void { 
    this.autocompleteSearchColumn();
    // if(this.itemNumber==='')return
    // this.searchByInput
    // .pipe(debounceTime(400), distinctUntilChanged())
    // .subscribe((value) => {
   
    //   this.autocompleteSearchColumn();
    // });
    if (this.data.mode === 'edit-transaction') {
      this.itemNumber = this.data.item.itemNumber;
      this.requiredDate =this.data.item.requiredDate? new Date(this.data.item.requiredDate):'' ;
      this.quantity = this.data.item.transactionQuantity;
      this.expirationDate = this.data.item.expirationDate? new Date(this.data.item.expirationDate):'' ;
      this.transactionInfo.controls.lineNumber.setValue(
        this.data.item.lineNumber
      );
      this.transactionInfo.controls.lineSequence.setValue(
        this.data.item.lineSequence
      );
      this.transactionInfo.controls.priority.setValue(this.data.item.priority);
      this.transactionInfo.controls.toteNumber.setValue(
        this.data.item.toteNumber
      );
      this.transactionInfo.controls.batchPickID.setValue(
        this.data.item.batchPickID
      );
      this.transactionInfo.controls.warehouse.setValue(
        this.data.item.warehouse
      );
      this.transactionInfo.controls.lotNumber.setValue(
        this.data.item.lotNumber
      );
      this.transactionInfo.controls.serialNumber.setValue(
        this.data.item.serialNumber
      );
      this.transactionInfo.controls.hostTranID.setValue(
        this.data.item.hostTransactionID
      );
      this.transactionInfo.controls.emergency.setValue(
        this.data.item.emergency
      );
      this.transactionInfo.controls.notes.setValue(this.data.item.notes);
      this.transactionInfo.controls.userField1.setValue(
        this.data.item.userField1
      );
      this.transactionInfo.controls.userField2.setValue(
        this.data.item.userField2
      );
      this.transactionInfo.controls.userField3.setValue(
        this.data.item.userField3
      );
      this.transactionInfo.controls.userField4.setValue(
        this.data.item.userField4
      );
      this.transactionInfo.controls.userField5.setValue(
        this.data.item.userField5
      );
      this.transactionInfo.controls.userField6.setValue(
        this.data.item.userField6
      );
      this.transactionInfo.controls.userField7.setValue(
        this.data.item.userField7
      );
      this.transactionInfo.controls.userField8.setValue(
        this.data.item.userField8
      );
      this.transactionInfo.controls.userField9.setValue(
        this.data.item.userField9
      );
      this.transactionInfo.controls.userField10.setValue(
        this.data.item.userField10
      );
    }


  }

  onKeydownEvent(event){
    this.autocompleteSearchColumn()
  }
  searchData(){
    let payload = {
      itemNumber: this.itemNumber,
      username: this.data.userName,
      wsid: this.data.wsid,
    }

  
      this.Api.ItemExists(payload)
      .subscribe(
        (res: any) => {
          if(res.isExecuted){
              if(res.data==''){
                const dialogRef = this.dialog.open(ItemExistGenerateOrderComponent, {
                  height: 'auto',
                  width: '560px',
                  autoFocus: '__non_existing_element__',
      disableClose:true,
                  data: {
                    itemNumber:this.itemNumber,
                  },
                });
                dialogRef.afterClosed().subscribe((res) => {
                 this.itemNumber=''
                });
              }
            
          }
        },
        (error) => {
    
        }
      );
  
  }
  async autocompleteSearchColumn() {
    let searchPayload = {
      // itemNumber: this.itemNumber,
      // username: this.data.userName,
      // wsid: this.data.wsid,

      itemNumber: this.itemNumber,
      beginItem:'---',
      isEqual:false,
      username: this.data.userName,
      wsid: this.data.wsid,
    };
    this.Api
      .SearchItem(searchPayload)
      .subscribe(
        (res: any) => {
          if(res.data){
            this.searchAutocompleteList=res.data
            // if( this.searchAutocompleteList.includes(res.data))return 
            // this.searchAutocompleteList.push(res.data)
          }
     
        },
        (error) => {}
      );
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }

  onFocusOutItemNum(event){
return
    if(event.target.value==='')return
    
    let payload = {
      itemNumber: this.itemNumber,
      username: this.data.userName,
      wsid: this.data.wsid,
    }

    setTimeout(() => {
      this.Api.ItemExists(payload)
      .subscribe(
        (res: any) => {
          if(res.isExecuted){
              if(res.data==''){
                const dialogRef = this.dialog.open(ItemExistGenerateOrderComponent, {
                  height: 'auto',
                  width: '560px',
                  autoFocus: '__non_existing_element__',
      disableClose:true,
                  data: {
                    itemNumber:this.itemNumber,
                  },
                });
                dialogRef.afterClosed().subscribe((res) => {
                 this.itemNumber=''
                });
              }
            
          }
        },
        (error) => {
    
        }
      );
    }, 500);
   
  }
  saveTransaction() {
    let payloadItem = {
      itemNumber: this.itemNumber,
      username: this.data.userName,
      wsid: this.data.wsid,
    }
    this.Api.ItemExists(payloadItem)
    .subscribe(
      (res: any) => {
        if(res.isExecuted){
            if(res.data==''){
              const dialogRef = this.dialog.open(ItemExistGenerateOrderComponent, {
                height: 'auto',
                width: '560px',
                autoFocus: '__non_existing_element__',
      disableClose:true,
                data: {
                  itemNumber:this.itemNumber,
                },
              });
              dialogRef.afterClosed().subscribe((res) => {
               this.itemNumber=''
              });
            }else{
              if(this.itemNumber===''  || this.quantity===0 || this.quantity<0){
                const dialogRef = this.dialog.open(EmptyFieldsComponent, {
                  height: 'auto',
                  width: '560px',
                  autoFocus: '__non_existing_element__',
      disableClose:true,
                  data: {
                    itemNumber:this.itemNumber,
                  },
                });
                dialogRef.afterClosed().subscribe((res) => {
                  
                });
                return
              }
              let payload = {
                // itemNum: this.data.itemNumber,
                transQty: this.quantity.toString(),
                reqDate: this.requiredDate ? this.requiredDate.toISOString() : '',
                expDate: this.expirationDate ? this.expirationDate.toISOString() : '',
                lineNum: this.transactionInfo.value.lineNumber?.toString(),
                lineSeq: this.transactionInfo.value.lineSequence?.toString(),
                priority: this.transactionInfo.value.priority?.toString(),
                toteNum: this.transactionInfo.value.toteNumber,
                batchPickID: this.transactionInfo.value.batchPickID?.toString(),
                warehouse: this.transactionInfo.value.warehouse,
                lotNum: this.transactionInfo.value.lotNumber,
                serialNum: this.transactionInfo.value.serialNumber,
                hostTransID: this.transactionInfo.value.hostTranID?.toString(),
                emergency: this.transactionInfo.value.emergency,
                notes: this.transactionInfo.value.notes,
                userField1: this.transactionInfo.value.userField1,
                userField2: this.transactionInfo.value.userField2,
                userField3: this.transactionInfo.value.userField3,
                userField4: this.transactionInfo.value.userField4,
                userField5: this.transactionInfo.value.userField5,
                userField6: this.transactionInfo.value.userField6,
                userField7: this.transactionInfo.value.userField7,
                userField8: this.transactionInfo.value.userField8,
                userField9: this.transactionInfo.value.userField9,
                userField10: this.transactionInfo.value.userField10,
                username: this.data.userName,
                wsid: this.data.wsid,
              };
          
             
              // TransactionForOrderInsert
              if (this.data.mode === 'add-trans') {
                (payload['orderNumber'] = this.data.orderNumber),
                  (payload['transType'] = this.data.transactionType),
                  (payload['itemNum'] = this.itemNumber);
              } else {
                payload['itemNum'] = this.data.item.itemNumber;
                payload['id'] = this.data.item.id;
              }
              if(this.data && this.data.mode === 'add-trans'){
                this.Api.TransactionForOrderInsert(payload).subscribe(
                  (res: any) => {
                    if (res.isExecuted) {
                      this.toastr.success(labels.alert.success, 'Success!', {
                        positionClass: 'toast-bottom-right',
                        timeOut: 2000,
                      });
                      this.dialogRef.close({ isExecuted: true,orderNumber:this.orderNumber });
                    } else {
                      this.toastr.error(res.responseMessage, 'Error!', {
                        positionClass: 'toast-bottom-right',
                        timeOut: 2000,
                      });
                      this.dialogRef.close({ isExecuted: false });
                    }
                  },
                  (error) => {
                    this.toastr.error('something went wrong!', 'Error!', {
                      positionClass: 'toast-bottom-right',
                      timeOut: 2000,
                    });
                    this.dialogRef.close({ isExecuted: false });
                  }
                );
              } else{
                this.Api.TransactionForOrderUpdate(payload).subscribe(
                  (res: any) => {
                    if (res.isExecuted) {
                      this.toastr.success(labels.alert.success, 'Success!', {
                        positionClass: 'toast-bottom-right',
                        timeOut: 2000,
                      });
                      this.dialogRef.close({ isExecuted: true,orderNumber:this.orderNumber });
                    } else {
                      this.toastr.error(res.responseMessage, 'Error!', {
                        positionClass: 'toast-bottom-right',
                        timeOut: 2000,
                      });
                      this.dialogRef.close({ isExecuted: false });
                    }
                  },
                  (error) => {
                    this.toastr.error('something went wrong!', 'Error!', {
                      positionClass: 'toast-bottom-right',
                      timeOut: 2000,
                    });
                    this.dialogRef.close({ isExecuted: false });
                  }
                );
              } 
              
            }
          
        }
      })
   
      
  }

  ngOnDestroy() {
    this.searchByInput.unsubscribe();
  }
  
  ngAfterViewInit() {
    this.item_num.nativeElement.focus();
  }
}
