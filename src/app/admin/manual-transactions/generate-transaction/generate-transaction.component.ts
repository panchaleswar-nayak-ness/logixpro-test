import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FloatLabelType} from '@angular/material/form-field';

import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {AuthService} from 'src/app/common/init/auth.service';
import {SetItemLocationComponent} from '../../dialogs/set-item-location/set-item-location.component';
import {
  TemporaryManualOrderNumberAddComponent
} from '../../dialogs/temporary-manual-order-number-add/temporary-manual-order-number-add.component';
import labels from 'src/app/common/labels/labels.json';
import {PostManualTransactionComponent} from '../../dialogs/post-manual-transaction/post-manual-transaction.component';
import {
  DeleteConfirmationManualTransactionComponent
} from '../../dialogs/delete-confirmation-manual-transaction/delete-confirmation-manual-transaction.component';
import {ErrorDialogComponent} from '../../../dialogs/error-dialog/error-dialog.component';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {ApiFuntions} from 'src/app/common/services/ApiFuntions';
import {GlobalService} from 'src/app/common/services/global.service';
import {IAdminApiService} from 'src/app/common/services/admin-api/admin-api-interface';
import {AdminApiService} from 'src/app/common/services/admin-api/admin-api.service';
import {CommonApiService} from 'src/app/common/services/common-api/common-api.service';
import {ICommonApi} from 'src/app/common/services/common-api/common-api-interface';
import {PrintApiService} from "../../../common/services/print-api/print-api.service";
import {
  DialogConstants,
  Placeholders,
  showNotificationHeading,
  showNotificationMessage,
  StringConditions,
  Style,
  ToasterTitle,
  ToasterType,
  TransactionType
} from 'src/app/common/constants/strings.constants';
import { TransactionNotificationMessage } from 'src/app/common/constants/admin/transaction-constants';
import { GtItemDetailsComponent } from './gt-item-details/gt-item-details.component';
import { format, parse } from 'date-fns';
@Component({
  selector: 'app-generate-transaction',
  templateUrl: './generate-transaction.component.html',
  styleUrls: ['./generate-transaction.component.scss'],
})
export class GenerateTransactionComponent implements OnInit {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  LabelItemNumber: string = this.fieldMappings.itemNumber;
  @ViewChild('openAction') openAction: MatSelect;
  @ViewChild('publicSearchBox') searchBoxField: ElementRef;
  @ViewChild(GtItemDetailsComponent) gtitemcomponent!: GtItemDetailsComponent;

  isInvalidQuantityPopUp: boolean = false;
  isPost: boolean = true;
  selectedAction = '';
  columns: any = {};
  invMapIDget;
  transactionID;
  selectedOrder;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  searchByInput: any = new Subject<string>();
  orderNumber: string = '';
  searchAutocompleteList: any;
  userData;
  item;
  itemNumber: string = '';
  supplierID;
  expDate: any = '';
  revision;
  description;
  lotNumber;
  uom;
  notes;
  serialNumber;
  transType: string = TransactionType.Pick;
  reqDate: any = '';
  lineNumber;
  transQuantity: number = 0;
  priority;
  lineSeq;
  hostTransID: string = '';
  batchPickID: string = '';
  wareHouse: string = '';
  toteID;
  transactionQtyInvalid : boolean = false;
  warehouseSensitivity;
  totalQuantity: '';
  zone: string = '';
  row: string = '';
  shelf: string = '';
  carousel: string = '';
  quantityAllocatedPick: '';
  quantityAllocatedPutAway: '';
  invMapID: '';
  bin: '';
  message = '';
  isLocation = false;
  emergency = false;
  isQuantityConfirmation: boolean;
  placeholders = Placeholders;
  public iAdminApiService: IAdminApiService;
  public iCommonAPI: ICommonApi;

  constructor(
    public commonAPI: CommonApiService,
    public authService: AuthService,
    public Api: ApiFuntions,
    public global: GlobalService,
    public printApiService: PrintApiService,
    public adminApiService: AdminApiService
  ) {
    this.iAdminApiService = this.adminApiService;	
    this.userData = this.authService.userData();
    this.iCommonAPI = this.commonAPI;
  }

  ngOnInit(): void {
    this.searchByInput
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.autocompleteSearchColumn();
      });
    this.OSFieldFilterNames();
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }
  printLabelMT() {
    return this.printApiService.PrintManualTrans(this.transactionID);

  }
  clearMatSelectList() {
    this.openAction?.options.forEach((data: MatOption) => data.deselect());
  }

  private setTransactionError(message: string): void {
    this.message = message;
    this.transactionQtyInvalid = true;
    this.clearMatSelectList();
  }

  generateTranscAction(event: any) {
    this.clearMatSelectList();
  }
  public OSFieldFilterNames() {
    this.iAdminApiService.ColumnAlias().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.columns = res.data;
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          this.global.globalErrorMsg(),
          ToasterTitle.Error
        );
      }
    });
  }

  clearAfterPost(){
    this.clear();
    this.supplierID = '';
    this.expDate = '';
    this.revision = '';
    this.description = '';
    this.lotNumber = '';
    this.uom = '';
    this.notes = '';
    this.serialNumber ='';;
    this.transType = 'Pick';;
    this.reqDate = '';
    this.lineNumber = '0';
    this.transQuantity = 0;
    this.priority ='0';
    this.lineSeq ='0';
    this.hostTransID = '';
    this.batchPickID = '';
    this.wareHouse ='';
    this.toteID = '';
    this.emergency = false;
    this.totalQuantity = '';
    this.isLocation =false
    this.zone = '';
    this.row = '';
    this.shelf ='';
    this.carousel = '';
    this.invMapID = '';
    this.bin = ''
    this.quantityAllocatedPick = '';
    this.quantityAllocatedPutAway = '';
    this.gtitemcomponent.triggerSaveEmptyUserFields()

  }
  getRow(row?, type?) {
    if (type != 'save') {
      this.clear();
    }

    this.transactionID = row.id;

    let payLoad = {
      id: row.id,
    };
    this.iAdminApiService.TransactionInfo(payLoad).subscribe(
      (res: any) => {
        if (res?.data && res.data.getTransaction) {
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
          this.emergency = !(
            this.item.emergency === StringConditions.False || this.item.emergency === 'false'
          );
          this.warehouseSensitivity = this.item.wareHouseSensitive;
          this.totalQuantity = res.data.totalQuantity;
          this.isLocation = this.item.location;
          this.zone = this.item.zone;
          this.row = this.item.row;
          this.shelf = this.item.shelf;
          this.carousel = this.item.carousel;
          this.invMapID = this.item.invMapID;
          this.bin = this.item.bin;
          this.quantityAllocatedPick =
            res?.data.quantityAllocated.length &&
            res.data.quantityAllocated[0].quantityAllocatedPick;

          this.quantityAllocatedPutAway =
            res?.data.quantityAllocated.length &&
            res.data.quantityAllocated[0].quantityAllocatedPutAway;
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
          this.item = '';
        }
      }
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
    this.transQuantity = 0;  
    this.priority = '';
    this.lineSeq = '';
    this.hostTransID = '';
    this.batchPickID = '';
    this.wareHouse = '';
    this.toteID = '';
    this.transactionQtyInvalid = false;
    this.emergency = false;
  }
  async autocompleteSearchColumn() {
    let searchPayload = {
      transaction: this.orderNumber,
    };
    this.iAdminApiService
      .ManualTransactionTypeAhead(searchPayload)
      .subscribe((res: any) => {
        if (res.isExecuted && res.data) {
          this.searchAutocompleteList = res.data;
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
        }
      });
  }
  openSetItemLocationDialogue() {
    if (this.orderNumber == '' || !this.item) return;
    const dialogRef: any = this.global.OpenDialog(SetItemLocationComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        userName: this.userData.userName,
        wsid: this.userData.wsid,
        itemNumber: this.itemNumber,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      // If dialog was cancelled (X button or Escape), preserve existing data
      if (!res) return;

      if(res?.isExecuted){
        this.itemNumber = res.itemNumber;
        this.getItemnumberInfo()
      }
      if (res?.invMapID) {
        this.invMapIDget = res.invMapID;
        this.isLocation = res.LocationNumber
        this.getLocationData();
       
      }
      else{
        this.clearLocationData()
        
      }
    });
  }

  clearLocationData(){
    this.zone = '';
    this.carousel = '';
    this.row = '';
    this.bin = '';
    this.shelf = '';
    this.wareHouse = '';
    this.totalQuantity = '';
    this.quantityAllocatedPick = '';
    this.quantityAllocatedPutAway = '';
    this.invMapID = '';
  }

  clearFields() {
    this.clear();
    this.zone = '';
    this.carousel = '';
    this.row = '';
    this.bin = '';
    this.shelf = '';
    this.wareHouse = '';
    this.totalQuantity = '';
    this.quantityAllocatedPick = '';
    this.quantityAllocatedPutAway = '';
    this.orderNumber = '';
    this.searchAutocompleteList = [];
    this.item = null;
    this.selectedAction = '';
    this.invMapID = '';
    this.clearMatSelectList();
    this.emergency = false;
  }

  postTransactionFunction(type: string) {
    if (
      this.item === '' ||
      this.item === undefined ||
      this.orderNumber === '' ||
      this.orderNumber === undefined
    ) {
      return;
    } else if (this.warehouseSensitivity === 'True' && this.wareHouse == '') {
      this.transactionQtyInvalid = true;
      this.message = TransactionNotificationMessage.SpecifiedItemNumberMustHaveAWarehouse;
      return;
    } else {
      this.transactionQtyInvalid = false;
      const dialogRef: any = this.global.OpenDialog(
        PostManualTransactionComponent,
        {
          height: DialogConstants.auto,
          width: Style.w560px,
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
          data: {
            message:
              type === 'save'
                ? 'Click OK To Save And Post The Temporary Transaction.'
                : 'Click OK To Post And Delete the Temporary Transaction',
          },
        }
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.updateTrans(() => {
            let payload = {
              deleteTransaction: type !== 'save',
              transactionID: this.transactionID,
            };
  
            this.iAdminApiService
              .PostTransaction(payload)
              .subscribe((res: any) => {
                if (res?.isExecuted) {
                  this.global.ShowToastr(
                    ToasterType.Success,
                    labels.alert.success,
                    ToasterTitle.Success
                  );
                  //this.updateTrans();
                  // this.clearFields();
                  if (type != 'save') {
                    this.clearFields();
                  }
                  this.invMapID = '';
                  this.clearAfterPost()
                } else {
                  this.global.ShowToastr(
                    ToasterType.Error,
                    res.responseMessage,
                    ToasterTitle.Error
                  );
                  if (type != 'save') {
                    // this.clearFields();
                  }
                  this.invMapID = '';
                  this.clearAfterPost()
                }
              });
          })
        }
      });
    }
  }

  validateTransactionQuantity() {
    // Validate transaction quantity for Pick and Put Away transaction types
    if (this.transQuantity < 0) {
      this.setTransactionError(TransactionNotificationMessage.TransactionQuantityMustBePositive(this.transType));
      return false;
    } else if (
      (this.transQuantity === 0) &&
      this.transType !== TransactionType.Count
    ) {
      this.setTransactionError(TransactionNotificationMessage.TransactionQuantityMustBeGreaterThanZero(this.transType));
      return false;
    }
    return true;
  }

  postTransaction(type: string) {
    if (!this.validateTransactionQuantity()) {
      return;
    }

    const totalQuantity = Number(this.totalQuantity) || 0;
    const quantityAllocatedPick = Number(this.quantityAllocatedPick) || 0;
    const actualQuantity = totalQuantity - quantityAllocatedPick;
    if (this.isLocation && this.transQuantity > actualQuantity && this.transType === TransactionType.Pick) {
      const dialogRef = this.global.OpenDialog(ErrorDialogComponent, {
        height: DialogConstants.auto,
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          heading: showNotificationHeading.TransactionQuantityExceedsAvailable,
          message: showNotificationMessage.TransactionQuantityExceedsAvailable
        }
      });
      dialogRef.afterClosed().subscribe(() => {
        this.clearMatSelectList();
      });
    } else {
      this.transactionQtyInvalid = false;
      this.clearMatSelectList();
      this.updateTransactionFunction();
      this.postTransactionFunction(type);
    }
  }

  updateTrans(afterSub : () => void) {

    let finalExpiryDate = new Date(this.expDate);
      if (this.isValidDate(finalExpiryDate)) {
        this.expDate = this.expDate !== '' ? format(new Date(this.expDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : '';
      }

    let updateValsequence: any = [];
    updateValsequence[0] = this.itemNumber; //itemNumber
    updateValsequence[1] = this.transType; //TransType
    updateValsequence[2] = this.expDate;
    updateValsequence[3] = this.revision; //revision
    updateValsequence[4] = this.description; //description
    updateValsequence[5] = this.lotNumber; //lotNumber
    updateValsequence[6] = this.uom; //UoM
    updateValsequence[7] = this.notes; //notes
    updateValsequence[8] = this.serialNumber; //serialNumber
    updateValsequence[9] = new Date(this.reqDate).toLocaleString(); //RequiredDate
    updateValsequence[10] = this.lineNumber; //lineNumber
    updateValsequence[11] = this.transQuantity.toString(); //transQuantitys
    updateValsequence[12] = this.priority.toString(); //priority
    updateValsequence[13] = this.lineSeq.toString(); //lineSeq
    updateValsequence[14] = this.hostTransID.toString(); //hostTransID
    updateValsequence[15] = this.batchPickID.toString(); //batchPickID
    updateValsequence[16] = this.emergency.toString(); //emergency
    updateValsequence[17] = this.wareHouse; //wareHouse
    updateValsequence[18] = this.toteID == 0 ? '' : this.toteID.toString(); //toteID
    updateValsequence[19] = this.zone; //Zone
    updateValsequence[20] = this.shelf; //shelf
    updateValsequence[21] = this.carousel; //carousel
    updateValsequence[22] = this.row; //row
    updateValsequence[23] = this.bin; //Bin
    updateValsequence[24] = this.invMapID.toString(); //InvMapID

    let payload = {
      newValues: updateValsequence,
      transID: this.transactionID,
    };

    this.iAdminApiService
      .UpdateTransaction(payload)
      .subscribe(() => {
        if (afterSub != null)
          afterSub();
      });
  }
  deleteTransaction() {
    const dialogRef: any = this.global.OpenDialog(
      DeleteConfirmationManualTransactionComponent,
      {
        height: DialogConstants.auto,
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
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
    };
    this.iAdminApiService.LocationData(payload).subscribe((res: any) => {
      if (res?.isExecuted) {
        let items = res.data.locationTables[0];
        this.zone = items.zone;
        this.carousel = items.carousel;
        this.row = items.row;
        this.shelf = items.shelf;
        this.wareHouse = items.warehouse;
        this.bin = items.bin;
        this.invMapID = this.invMapIDget;
        this.totalQuantity = res.data.totalQuantity;
        this.quantityAllocatedPick = res.data.pickQuantity;
        this.quantityAllocatedPutAway = res.data.putQuantity;
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          this.global.globalErrorMsg(),
          ToasterTitle.Error
        );
      }
    });
  }

  updateTransactionFunction() {
    if(this.transQuantity < 0){
      this.setTransactionError(TransactionNotificationMessage.TransactionQuantityMustBePositive(this.transType));
    }else if (
      (this.transQuantity === 0 ) &&
      this.transType !== TransactionType.Count
    ) {
      this.setTransactionError(TransactionNotificationMessage.TransactionQuantityMustBeGreaterThanZero(this.transType));
    } else if (this.warehouseSensitivity === 'True' && this.wareHouse == '') {
      this.setTransactionError(TransactionNotificationMessage.SpecifiedItemNumberMustHaveAWarehouse);
    } else {
      this.transactionQtyInvalid = false;
      //following sequence must follow to update
      let updateValsequence: any = [];

      let finalExpiryDate = new Date(this.expDate);
      if (this.isValidDate(finalExpiryDate)) {
        this.expDate = this.expDate !== '' ? format(new Date(this.expDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : '';
      }

      updateValsequence[0] = this.itemNumber; //itemNumber
      updateValsequence[1] = this.transType; //TransType
      updateValsequence[2] = this.expDate; //expDate
      updateValsequence[3] = this.revision; //revision
      updateValsequence[4] = this.description; //description
      updateValsequence[5] = this.lotNumber; //lotNumber
      updateValsequence[6] = this.uom; //UoM
      updateValsequence[7] = this.notes; //notes
      updateValsequence[8] = this.serialNumber; //serialNumber
      updateValsequence[9] = new Date(this.reqDate).toLocaleString(); //RequiredDate
      updateValsequence[10] = this.lineNumber; //lineNumber
      updateValsequence[11] = this.transQuantity.toString(); //transQuantity
      updateValsequence[12] = this.priority.toString(); //priority
      updateValsequence[13] = this.lineSeq.toString(); //lineSeq
      updateValsequence[14] = this.hostTransID.toString(); //hostTransID
      updateValsequence[15] = this.batchPickID.toString(); //batchPickID
      updateValsequence[16] = this.emergency.toString(); //emergency
      updateValsequence[17] = this.wareHouse; //wareHouse
      updateValsequence[18] = this.toteID == 0 ? '' : this.toteID.toString(); //toteID
      updateValsequence[19] = this.zone; //Zone
      updateValsequence[20] = this.shelf; //shelf
      updateValsequence[21] = this.carousel; //carousel
      updateValsequence[22] = this.row; //row
      updateValsequence[23] = this.bin; //Bin
      updateValsequence[24] = this.invMapID.toString(); //InvMapID

      let payload = {
        newValues: updateValsequence,
        transID: this.transactionID,
      };
      this.iAdminApiService.UpdateTransaction(payload).subscribe((res: any) => {
        if (res?.isExecuted) {
          this.global.ShowToastr(ToasterType.Success, labels.alert.success, ToasterTitle.Success);
          this.clearMatSelectList();
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            res.responseMessage,
            ToasterTitle.Error
          );
        }
      });
    }
  }

  updateTransaction() {
    const totalQuantity = Number(this.totalQuantity) || 0;
    const quantityAllocatedPick = Number(this.quantityAllocatedPick) || 0;
    const actualQuantity = totalQuantity - quantityAllocatedPick;
    if (
      this.isPost &&
      this.isLocation && 
      this.transQuantity > actualQuantity && 
      this.transType === TransactionType.Pick
    ) {
      this.isInvalidQuantityPopUp = true;
      const dialogRef = this.global.OpenDialog(ErrorDialogComponent, {
        height: DialogConstants.auto,
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          heading: showNotificationHeading.TransactionQuantityExceedsAvailable,
          message: showNotificationMessage.TransactionQuantityExceedsAvailable
        }
      });
      dialogRef.afterClosed().subscribe(() => {
        this.clearMatSelectList();
      });
    } else {
      this.updateTransactionFunction();
    }
  }


  getItemnumberInfo(){
    let payload = {
      ID:  this.itemNumber,
    };
    this.iCommonAPI.ItemnumberInfo(payload).subscribe((res: any) => {
      if (res?.isExecuted) {
        this.supplierID = res.data[0].supplierItemID;
        this.description = res.data[0].description;
        this.uom  = res.data[0].unitofMeasure;
      }
      else {
        this.global.ShowToastr(
          ToasterType.Error,
          this.global.globalErrorMsg(),
          ToasterTitle.Error
        );
      }
    })
  }

  getSupplierItemInfo() {
    // Clear location and unit of measure when supplier item changes
    this.clearLocationData();
    this.uom = '';
    
    let payload = {
      ID: this.supplierID,
    };
    this.iCommonAPI.SupplierItemIDInfo(payload).subscribe((res: any) => {
      if (res?.isExecuted) {
        this.itemNumber = res.data[0].itemNumber;
        this.description = res.data[0].description;
        // Keep UOM blank when supplier item changes - don't auto-populate it
        // this.uom  = res.data[0].unitofMeasure;
        this.transactionQtyInvalid = false;
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          this.global.globalErrorMsg(),
          ToasterTitle.Error
        );
      }
    });
  }

  openTemporaryManualOrderDialogue() {
    const dialogRef: any = this.global.OpenDialog(
      TemporaryManualOrderNumberAddComponent,
      {
        height: DialogConstants.auto,
        width: '1000px',
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          userName: this.userData.userName,
          wsid: this.userData.wsid,
          orderNumber: this.orderNumber ? this.orderNumber : '',
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res.isExecuted) {
        this.isLocation = res.location != undefined;
        this.orderNumber = res.orderNumber;
        this.itemNumber = res.itemNumber;
        this.getRow(res);
        this.clearMatSelectList();
      }
    });
  }

  ngAfterViewInit() {
    this.autocompleteSearchColumn();
    this.searchBoxField?.nativeElement.focus();
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

  onFieldValuesChanged(fieldValues: any) {
    this.itemNumber = fieldValues.itemNumber;    
    this.supplierID = fieldValues.supplierID;
    this.expDate = fieldValues.expDate;
    this.revision = fieldValues.revision;
    this.description = fieldValues.description;
    this.lotNumber = fieldValues.lotNumber;
    this.uom = fieldValues.uom;
    this.notes = fieldValues.notes;
    this.serialNumber = fieldValues.serialNumber;
  }

  onFieldValuesChangedOfTrans(fieldValues: any) {
    this.emergency = fieldValues.emergency;
    this.transType = fieldValues.transType;
    this.reqDate = fieldValues.reqDate;
    this.wareHouse = fieldValues.wareHouse;
    this.toteID = fieldValues.toteID;
    this.priority = fieldValues.priority;
    this.lineSeq = fieldValues.lineSeq;
    this.hostTransID = fieldValues.hostTransID;
    this.batchPickID = fieldValues.batchPickID;
    this.lineNumber = fieldValues.lineNumber;
    this.transQuantity = fieldValues.transQuantity;
  }

  
  isValidDate(date: any) {
    // Check for falsy values like '', null, undefined
    if (!date) return false;
  
    // Convert to a Date object if it's not already one
    const parsedDate = new Date(date);
  
    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) return false;
  
    // Check if the date is not 01-01-1970
    const epochDate = new Date('1970-01-01T00:00:00Z');
    return parsedDate.getTime() !== epochDate.getTime();
  }
}
