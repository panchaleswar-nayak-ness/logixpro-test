import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuthService } from 'src/app/init/auth.service';
import { SetItemLocationComponent } from '../../dialogs/set-item-location/set-item-location.component';
import { SupplierItemIdComponent } from '../../dialogs/supplier-item-id/supplier-item-id.component';
import { TemporaryManualOrderNumberAddComponent } from '../../dialogs/temporary-manual-order-number-add/temporary-manual-order-number-add.component';
import { UnitMeasureComponent } from '../../dialogs/unit-measure/unit-measure.component';
import { UserFieldsEditComponent } from '../../dialogs/user-fields-edit/user-fields-edit.component'; 
import labels from '../../../labels/labels.json';
import { PostManualTransactionComponent } from '../../dialogs/post-manual-transaction/post-manual-transaction.component';
import { DeleteConfirmationTransactionComponent } from '../../dialogs/delete-confirmation-transaction/delete-confirmation-transaction.component';
import { DeleteConfirmationManualTransactionComponent } from '../../dialogs/delete-confirmation-manual-transaction/delete-confirmation-manual-transaction.component';
import { WarehouseComponent } from '../../dialogs/warehouse/warehouse.component';
import { InvalidQuantityComponent } from '../../dialogs/invalid-quantity/invalid-quantity.component';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { AddNotesComponent } from '../../dialogs/add-notes/add-notes.component';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-generate-transaction',
  templateUrl: './generate-transaction.component.html',
  styleUrls: ['./generate-transaction.component.scss'],
})
export class GenerateTransactionComponent implements OnInit {
  @ViewChild('openAction') openAction: MatSelect;
  @ViewChild('publicSearchBox') searchBoxField: ElementRef;

  selectedAction='';
  columns:any = {};
  invMapIDget;
  transactionID;
  selectedOrder;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  searchByInput: any = new Subject<string>();
  orderNumber: any;
  searchAutocompleteList: any;
  userData;
  item;
  itemNumber;
  supplierID;
  expDate:any='';
  revision;
  description;
  lotNumber;
  uom;
  notes;
  serialNumber;
  transType;
  reqDate: any='';
  lineNumber;
  transQuantity;
  priority;
  lineSeq;
  hostTransID;
  batchPickID;
  wareHouse;
  toteID;
  transactionQtyInvalid = false;
  warehouseSensitivity;

  totalQuantity: '';
  zone: '';
  row: '';
  shelf: '';
  carousel: '';
  quantityAllocatedPick: '';
  quantityAllocatedPutAway: '';
  invMapID: '';
  bin:'';
  message = '';
  isLocation=false;
  emergency = false;
  constructor(
    private authService: AuthService,
    private Api:ApiFuntions,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private global:GlobalService
  ) {
    this.userData = this.authService.userData();
    
  }

  ngOnInit(): void {
   
    this.searchByInput
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteSearchColumn();
      });
      this.OSFieldFilterNames();
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }
  searchData(event?) {
    // this.selectedOrder = event.target.value;
  }
  printLabelMT(){
    this.global.Print(`FileName:printMTLabel|ID:${this.transactionID}|User:${this.userData.userName}`,'lbl')
  
  }
  clearMatSelectList(){
    this.openAction.options.forEach((data: MatOption) => data.deselect());
  }

  generateTranscAction(event:any){
    this.clearMatSelectList();
  }
  public OSFieldFilterNames() { 
    this.Api.ColumnAlias().subscribe((res: any) => {
      this.columns = res.data;
    })
  }
  getRow(row?,type?) { 
    if( type != 'save'){
      this.clear();
    }
  
    this.transactionID = row.id;
    
    let payLoad = {
      id: row.id,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .TransactionInfo(payLoad)
      .subscribe(
        (res: any) => {
          if (res && res.data && res.data.getTransaction) {
            this.item = res.data.getTransaction;

            this.itemNumber = this.item.itemNumber;
            this.supplierID = this.item.supplierItemID;
            this.expDate = new Date(this.item.expirationDate);
            this.revision = this.item.revision;
            this.description = this.item.description;
            this.lotNumber = this.item.lotNumber;
            this.uom = this.item.unitOfMeasure;
            this.notes = this.item.notes;
            this.serialNumber = this.item.serialNumber;
            this.transType = this.item.transactionType;
            this.reqDate = new Date(this.item.requiredDate);
            this.lineNumber = this.item.lineNumber;
            this.transQuantity = this.item.transactionQuantity;
            this.priority = this.item.priority;
            this.lineSeq = this.item.lineSequence;
            this.hostTransID = this.item.hostTransactionID;
            this.batchPickID = this.item.batchPickID;
            this.wareHouse = this.item.warehouse;
            this.toteID = this.item.toteID;
            this.emergency =
              this.item.emergency === 'False' || this.item.emergency === 'false'
                ? false
                : true;
            this.warehouseSensitivity = this.item.wareHouseSensitive;
            this.totalQuantity = res.data.totalQuantity;
            this.zone = this.item.zone;
            this.row = this.item.row;
            this.shelf = this.item.shelf;
            this.carousel = this.item.carousel;
            this.invMapID = this.item.invMapID;
            this.bin=this.item.bin;
            this.quantityAllocatedPick =
              res.data &&
              res.data.quantityAllocated.length &&
              res.data.quantityAllocated[0].quantityAllocatedPick;

            this.quantityAllocatedPutAway =
              res.data &&
              res.data.quantityAllocated.length &&
              res.data.quantityAllocated[0].quantityAllocatedPutAway;
          } else {
            this.item = '';
          }
        },
        (error) => {}
      );
  }
  clear() {
    this.itemNumber = '';
    this.supplierID = '';
    this.expDate = '';
    this.revision = '';
    this.description = '';
    this.lotNumber = '';
    this.uom = '';
    this.notes = '';
    this.serialNumber = '';
    this.transType = '';
    this.reqDate = '';
    this.lineNumber = '';
    this.transQuantity = '';
    this.priority = '';
    this.lineSeq = '';
    this.hostTransID = '';
    this.batchPickID = '';
    this.wareHouse = '';
    this.toteID = '';
    this.transactionQtyInvalid = false;
  }
  async autocompleteSearchColumn() {
    let searchPayload = {
      transaction: this.orderNumber,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .ManualTransactionTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          this.searchAutocompleteList = res.data;
        },
        (error) => {}
      );
  }
  openSetItemLocationDialogue() {
    if (this.orderNumber == '' || !this.item) return;
    const dialogRef = this.dialog.open(SetItemLocationComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        userName: this.userData.userName,
        wsid: this.userData.wsid,
        itemNumber: this.itemNumber,
      },
    });
    dialogRef.afterClosed().subscribe((res) => { 
      if (res && res.invMapID) {
        this.invMapIDget = res.invMapID;
        this.itemNumber = res.itemNumber;
        this.getLocationData();
      }
    });
  }

  clearFields() {
    this.clear();
    this.zone = '';
    this.carousel = '';
    this.row = '';
    this.bin='';
    this.shelf = '';
    this.totalQuantity = '';
    this.quantityAllocatedPick = '';
    this.quantityAllocatedPutAway = '';
    this.orderNumber = '';
    this.emergency = false;
    this.searchAutocompleteList? this.searchAutocompleteList.length=0:[];
    this.item=null;
    this.selectedAction='';
    this.clearMatSelectList();
    
  }

  postTransaction(type) {


    if (
      this.item === '' ||
      this.item === undefined ||
      this.orderNumber === '' ||
      this.orderNumber === undefined
    ){
      return;
    }
    else if (this.warehouseSensitivity === 'True' && this.wareHouse == '') {
       this.transactionQtyInvalid = true;
       this.message = 'Specified Item Number must have a Warehouse';
       return
      }

      else{
        this.transactionQtyInvalid = false;
        const dialogRef = this.dialog.open(PostManualTransactionComponent, {
          height: 'auto',
          width: '560px',
          autoFocus: '__non_existing_element__',
      disableClose:true,
          data: {
            message:
              type === 'save'
                ? 'Click OK To Post And Save The Temporary Transaction.'
                : 'Click OK To Post And Delete the Temporary Transaction',
          },
        });
        dialogRef.afterClosed().subscribe((res) => {
    
          if (res) {
            let payload = {
              deleteTransaction: type === 'save' ? false : true,
              transactionID: this.transactionID,
              username: this.userData.userName,
              wsid: this.userData.wsid,
            };
    
            this.Api
              .PostTransaction(payload)
              .subscribe(
                (res: any) => {
                  if (res && res.isExecuted) {
                    this.toastr.success(labels.alert.success, 'Success!', {
                      positionClass: 'toast-bottom-right',
                      timeOut: 2000,
                    });
                    this.updateTrans();
                    if( type != 'save'){
                      this.clearFields();
                    }
                
                    this.invMapID = '';
                    this.getRow({id:this.transactionID},type);

                  } else {
                    this.toastr.error(res.responseMessage, 'Error!', {
                      positionClass: 'toast-bottom-right',
                      timeOut: 2000,
                    });
                    if( type != 'save'){
                      this.clearFields();
                    }
                    this.invMapID = '';
                    this.getRow({id:this.transactionID},type);
                  }
                },
                (error) => {}
              );
          }
        });
      }
      


  }


  updateTrans(){
    let updateValsequence: any = [];
      updateValsequence[0] = this.itemNumber; //itemNumber
      updateValsequence[1] = this.transType; //TransType
      updateValsequence[2] = this.expDate ?this.expDate:''; //expDate
      updateValsequence[3] = this.revision; //revision
      updateValsequence[4] = this.description; //description
      updateValsequence[5] = this.lotNumber; //lotNumber
      updateValsequence[6] = this.uom; //UoM
      updateValsequence[7] = this.notes; //notes
      updateValsequence[8] = this.serialNumber; //serialNumber
      updateValsequence[9] = this.reqDate ? this.reqDate  :''; //RequiredDate
      updateValsequence[10] = this.lineNumber; //lineNumber
      updateValsequence[11] = this.transQuantity.toString(); //transQuantity
      updateValsequence[12] = this.priority.toString(); //priority
      updateValsequence[13] = this.lineSeq.toString(); //lineSeq
      updateValsequence[14] = this.hostTransID.toString(); //hostTransID
      updateValsequence[15] = this.batchPickID.toString(); //batchPickID
      updateValsequence[16] = this.emergency.toString(); //emergency
      updateValsequence[17] = this.wareHouse; //wareHouse
      updateValsequence[18] = this.toteID==0?"": this.toteID.toString(); //toteID
      updateValsequence[19] = this.zone; //Zone
      updateValsequence[20] = this.shelf; //shelf
      updateValsequence[21] = this.carousel; //carousel
      updateValsequence[22] = this.row; //row
      updateValsequence[23] = this.bin; //Bin
      updateValsequence[24] = this.invMapID.toString(); //InvMapID

      let payload = {
        newValues: updateValsequence,
        transID: this.transactionID,
        userName: this.userData.userName,
        wsid: this.userData.wsid,
      };

      this.Api
        .UpdateTransaction(payload)
        .subscribe((res: any) => {
          // if (res && res.isExecuted) {
          //   this.toastr.success(labels.alert.success, 'Success!', {
          //     positionClass: 'toast-bottom-right',
          //     timeOut: 2000,
          //   });
          //   this.clearMatSelectList();
          // } else {
          //   this.toastr.error(res.responseMessage, 'Error!', {
          //     positionClass: 'toast-bottom-right',
          //     timeOut: 2000,
          //   });
          // }
        });
  }
  deleteTransaction() {
    const dialogRef = this.dialog.open(
      DeleteConfirmationManualTransactionComponent,
      {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'delete-manual-transaction',
          heading: 'Delete Transaction',
          message: `Click OK to delete the current manual transaction.`,
          userName: this.userData.userName,
          wsid: this.userData.wsid,
          orderNumber: this.orderNumber,
          transID: this.transactionID,
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res.isExecuted) {
        this.clearFields();

      }
      this.clearFields();
    });
  }
  getLocationData() {
    let payload = {
      invMapID: this.invMapIDget,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api.LocationData(payload).subscribe(
      (res: any) => {
        if (res && res.isExecuted) {
          let items = res.data.locationTables[0];
          this.zone = items.zone;
          this.carousel = items.carousel;
          this.row = items.row;
          this.shelf = items.shelf;
          this.bin=items.bin;
          this.totalQuantity = res.data.totalQuantity;
          this.quantityAllocatedPick = res.data.pickQuantity;
          this.quantityAllocatedPutAway = res.data.putQuantity;
        }
      },
      (error) => {}
    );
  }
  openWareHouse() {
    if (this.orderNumber == '' || !this.item) return;
    const dialogRef = this.dialog.open(WarehouseComponent, {
      height: 'auto',
      width: '640px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        userName: this.userData.userName,
        wsid: this.userData.wsid,
        supplierID: this.supplierID,
     
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res && res!='clear') {
        
        this.wareHouse = res;
        this.warehouseSensitivity = 'False';
      }else if(res && res==='clear'){
          this.wareHouse='';
      }
    });
  }
  openNotes(){
    const dialogRef = this.dialog.open(AddNotesComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data:{
        notes:this.notes
      }
    
    });
    dialogRef.afterClosed().subscribe((res) => {
      if(res){
        this.notes=res
      }
    });
  }
  updateTransaction() { 
    
    if(this.isLocation && this.transQuantity>this.totalQuantity){
      const dialogRef = this.dialog.open(InvalidQuantityComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
      
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.clearMatSelectList();
        return 
      });
     
    }
    if (  this.transQuantity === '0' || this.transQuantity === 0 || this.transQuantity<0) {
      this.transactionQtyInvalid = true;
      this.message = `Transaction Quantity must be a positive integer for transaction type ${this.transType} `;
    } else if (this.warehouseSensitivity === 'True' && this.wareHouse == '') {
      this.transactionQtyInvalid = true;
      this.message = 'Specified Item Number must have a Warehouse';
    }else if(this.isLocation && this.transQuantity>this.totalQuantity || this.transQuantity<0 ) {
      return
    }
    else {
      this.transactionQtyInvalid = false;
      //following sequence must follow to update
      let updateValsequence: any = [];
      updateValsequence[0] = this.itemNumber; //itemNumber
      updateValsequence[1] = this.transType; //TransType
      updateValsequence[2] = this.expDate ?this.expDate:''; //expDate
      updateValsequence[3] = this.revision; //revision
      updateValsequence[4] = this.description; //description
      updateValsequence[5] = this.lotNumber; //lotNumber
      updateValsequence[6] = this.uom; //UoM
      updateValsequence[7] = this.notes; //notes
      updateValsequence[8] = this.serialNumber; //serialNumber
      updateValsequence[9] = this.reqDate ? this.reqDate  :''; //RequiredDate
      updateValsequence[10] = this.lineNumber; //lineNumber
      updateValsequence[11] = this.transQuantity.toString(); //transQuantity
      updateValsequence[12] = this.priority.toString(); //priority
      updateValsequence[13] = this.lineSeq.toString(); //lineSeq
      updateValsequence[14] = this.hostTransID.toString(); //hostTransID
      updateValsequence[15] = this.batchPickID.toString(); //batchPickID
      updateValsequence[16] = this.emergency.toString(); //emergency
      updateValsequence[17] = this.wareHouse; //wareHouse
      updateValsequence[18] = this.toteID==0?"": this.toteID.toString(); //toteID
      updateValsequence[19] = this.zone; //Zone
      updateValsequence[20] = this.shelf; //shelf
      updateValsequence[21] = this.carousel; //carousel
      updateValsequence[22] = this.row; //row
      updateValsequence[23] = this.bin; //Bin
      updateValsequence[24] = this.invMapID.toString(); //InvMapID

      let payload = {
        newValues: updateValsequence,
        transID: this.transactionID,
        userName: this.userData.userName,
        wsid: this.userData.wsid,
      };

      this.Api
        .UpdateTransaction(payload)
        .subscribe((res: any) => {
          if (res && res.isExecuted) {
            this.toastr.success(labels.alert.success, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
            this.clearMatSelectList();
          } else {
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        });
    }
  }
  openSupplierItemDialogue() {
    if (this.orderNumber == '' || !this.item) return;
    const dialogRef = this.dialog.open(SupplierItemIdComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        userName: this.userData.userName,
        wsid: this.userData.wsid,
        supplierID: this.supplierID,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if(!res)return
      this.supplierID = res.supplierID;
      // this.itemNumber=res.itemNumber;
      // this.description=res.description;
      this.getSupplierItemInfo();
      this.clearMatSelectList();
    });
  }


  getSupplierItemInfo(){
    let payload={
      ID:  this.supplierID,
      username: this.userData.userName,
      wsid: this.userData.wsid
    }
    this.Api
    .SupplierItemIDInfo(payload)
    .subscribe(
      (res: any) => {
      if(res && res.isExecuted){
        this.itemNumber=res.data[0].itemNumber
        this.description=res.data[0].description

        if(res.data[0].unitofMeasure != this.uom){
          if(this.uom==''){
            this.uom=res.data[0].unitofMeasure
            this.transactionQtyInvalid = false;
          }else{
            this.transactionQtyInvalid = true;
            this.message = 'Unit of Measure does not match Inventory Master. (Expecting)';
            return
          }
        }else{
          this.transactionQtyInvalid = false;
        }
      }
        
      })


  }
  openUnitOfMeasureDialogue() {
    if (this.orderNumber == '' || !this.item) return;
    const dialogRef = this.dialog.open(UnitMeasureComponent, {
      height: 'auto',
      width: '800px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.uom = res;
      this.clearMatSelectList();
    });
  }
  openTemporaryManualOrderDialogue() {
    const dialogRef = this.dialog.open(TemporaryManualOrderNumberAddComponent, {
      height: 'auto',
      width: '1000px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        userName: this.userData.userName,
        wsid: this.userData.wsid,
        orderNumber: this.orderNumber ? this.orderNumber : '',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {


      if (res.isExecuted) {
        this.isLocation=res.location!=undefined?true:false;
        this.orderNumber = res.orderNumber;
        this.itemNumber = res.itemNumber;
        this.getRow(res);
        this.clearMatSelectList();
        
      }

      ;
    });
  }

  ngAfterViewInit() {
    this.autocompleteSearchColumn();
    this.searchBoxField.nativeElement.focus();
  

  }

  // limit number to 9 digits
  limitNumber(event){
    if(event.code!='Backspace'){
      if(this.transQuantity?.toString().length>=9){
        let val= this.transQuantity.toString().slice(0, -1);
        this.transQuantity=parseInt(val)    
        }
  
    }
  
    
  }
  openUserFieldsEditDialogue() {
    const dialogRef = this.dialog.open(UserFieldsEditComponent, {
      height: 'auto',
      width: '800px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        transID: this.transactionID,
        userName: this.userData.userName,
        wsid: this.userData.wsid,
        fieldNames:this.columns
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.clearMatSelectList();
      if (res.isExecuted) {
      }
      ;
    });
  }

  isInvalid = false;

  onFormFieldFocusOut() {
    // Implement your custom validation logic here
    // For example, check if the input is valid, and if not, set isInvalid to true
    this.isInvalid = !this.isValidInput(); // Change isValidInput() to your validation logic
  }

  isValidInput(): boolean {
    // Implement your validation logic here
    return true; // Return true if the input is valid, false otherwise
  }
}
