import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs'; 
import labels from '../../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { ICommonApi } from 'src/app/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/services/common-api/common-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-temporary-manual-order-number-add',
  templateUrl: './temporary-manual-order-number-add.component.html',
  styleUrls: [],
})
export class TemporaryManualOrderNumberAddComponent implements OnInit {
  @ViewChild('ord_nmb') ord_nmb: ElementRef;
  floatLabelControl: any = new FormControl('auto' as FloatLabelType);
  floatLabelControlItem: any = new FormControl('item' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  hideRequiredControlItem = new FormControl(false);
  searchAutocompleteOrderNum: any;
  searchAutocompleteItemNum: any = [];
  setLocationByItemList: any = [];
  orderNumber;
  inventoryMapID;
  searchByOrder: any = new Subject<string>();
  searchByItem: any = new Subject<string>();
  transType = 'Pick';
  itemNumber;
  orderRequired:boolean=false;
  public iAdminApiService: IAdminApiService;
  itemInvalid=false;
  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
    private global: GlobalService,
    private Api: ApiFuntions,
    private adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<any>

  ) {
    this.iAdminApiService = adminApiService;
    this.iCommonAPI = commonAPI;
    this.orderNumber = data.orderNumber;
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }
  getFloatLabelValueItem(): FloatLabelType {
    return this.floatLabelControlItem.value || 'item';
  }
  ngAfterViewInit() {
    this.ord_nmb.nativeElement.focus();
  }
  searchData(event) {
    let payLoad = {
      itemNumber: this.itemNumber
      };
  
     
        this.iCommonAPI
        .ItemExists(payLoad)
        .subscribe(
          (res: any) => {
            if(res?.isExecuted){
              if(res.data===''){
                this.itemInvalid=true
                this.setLocationByItemList.length=0;
              }else{
                this.itemInvalid=false
                this.setItem()
              }
       
            }
            else{
              this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
              console.log("ItemExists",res.responseMessage);

            }
          },
          (error) => {}
        );
    
  }

  setItem(event?) {
  
    let payLoad = {
      itemNumber: this.itemNumber, 
    };
    this.iAdminApiService.GetLocations(payLoad).subscribe(
      (res: any) => {
        if (res?.data) {
          this.setLocationByItemList = res.data.map((item) => {
            return {
              invMapID: item.invMapID,
              select: `${item.itemQty} @ ${item.locationNumber}`,
            };
          });
 
        }
        else{
          this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
          console.log("GetLocations:", res.responseMessage);
        }

      },
      (error) => {}
    );
  }


  saveTransaction() {

    let payLoadItem = {
      itemNumber: this.itemNumber
      };
  
     
        this.iCommonAPI
        .ItemExists(payLoadItem)
        .subscribe(
          (res: any) => {
            if(res?.isExecuted){
              if(res.data===''){
                this.itemInvalid=true
                this.setLocationByItemList.length=0;

              }else{
                this.itemInvalid=false
                if(this.orderRequired || this.itemInvalid ||   this.itemNumber==='' || this.itemNumber===undefined)return
    let payLoad = {
      orderNumber: this.orderNumber,
      itemNumber: this.itemNumber,
      transactionType: this.transType,
      invMapID: this.inventoryMapID 
    };

    this.iAdminApiService
      .NewTransactionSave(payLoad)
      .subscribe(
        (res: any) => {
          if (res.isExecuted) {
            this.global.ShowToastr('success',labels.alert.success, 'Success!');
            this.dialogRef.close({ isExecuted: true,id:res.data,orderNumber:this.orderNumber,itemNumber:this.itemNumber,location:this.inventoryMapID});
          } else {
            this.global.ShowToastr('error',res.responseMessage, 'Error!');
            this.dialogRef.close({ isExecuted: true,id:res.data,orderNumber:this.orderNumber,itemNumber:this.itemNumber  });
            console.log("NewTransactionSave",res.responseMessage);
          }
        },
        (error) => {}
      );
              }
       
            }
            else{
              this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
              console.log("ItemExists:", res.responseMessage);
            }
          },
          (error) => {}
        );

    
  }



  onFocusOutEvent(event,type){ 
    if(this.searchAutocompleteItemNum.length>0)return
   
if(type==='order'){
if(event.target.value===''){
this.orderRequired=true
}else{
  this.orderRequired=false;
}
}else if(type==='item'){
  if(this.itemNumber){
    let payLoad = {
     itemNumber: this.itemNumber
     };
 
   
       this.iCommonAPI
       .ItemExists(payLoad)
       .subscribe(
         (res: any) => {
           if(res?.isExecuted){
             if(res.data===''){
               this.itemInvalid=true
             }else{
               this.itemInvalid=false
 
             }
      
           }
           else{
            this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
            console.log("ItemExists",res.responseMessage);
           }
         },
         (error) => {}
       );
  }


}
  } 

  async autocompleteSearchColumn() {
    let searchPayload = {
      transaction: this.orderNumber
    };
    this.iAdminApiService
      .ManualTransactionTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          if(res.isExecuted && res.data)
          {
            this.searchAutocompleteOrderNum = res.data;
          }
          else {
            this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
            console.log("ManualTransactionTypeAhead",res.responseMessage);
          }
          
        },
        (error) => {}
      );
  }

  async autocompleteSearchColumnItem() {

   
    let searchPayload = {
      itemNumber: this.itemNumber,
      beginItem:'---',
      isEqual:false
    };
    this.iCommonAPI
      .SearchItem(searchPayload)
      .subscribe(
        (res: any) => {
          
          if (res.data.length>0) {
            this.searchAutocompleteItemNum=res.data
            this.setItem()
          }else{
            
            this.searchAutocompleteItemNum.length=0;
            this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
            console.log("SearchItem",res.responseMessage);

          }
        
        },
        (error) => {}
      );
  }
  ngOnInit(): void {
    this.searchByOrder
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if(this.orderNumber != ""){
          this.orderRequired = false;
        }
        this.autocompleteSearchColumn();
      });

    this.searchByItem
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteSearchColumnItem();
      });
  }

  ngOnDestroy() {
    this.searchByOrder.unsubscribe();
    this.searchByItem.unsubscribe();
  }
}
