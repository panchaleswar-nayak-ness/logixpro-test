import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 

import { AuthService } from 'src/app/common/init/auth.service'; 
import { FormControl, FormGroup, Validators } from '@angular/forms'; 
import labels from 'src/app/common/labels/labels.json';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType ,ToasterMessages,TableConstant,ColumnDef,UniqueConstants,StringConditions, Placeholders} from 'src/app/common/constants/strings.constants';
import { format, parse } from 'date-fns';

@Component({
  selector: 'app-reprocess-transaction-detail',
  templateUrl: './reprocess-transaction-detail.component.html',
  styleUrls: ['./reprocess-transaction-detail.component.scss']
})
export class ReprocessTransactionDetailComponent implements OnInit {
  placeholders = Placeholders;
  @ViewChild('trans_qty') trans_qty: ElementRef;
  isHistory: any;

  transactionID: any;
  public userData: any;
  searchValue: any = '';
  searchList: any;
  public warehouse_list: any;
  public unitOfMeasure_list: any;
  label: boolean;
  emergency: boolean;
  expDate: any;
  reqDate: any;
  fieldNames:any;

  public iAdminApiService: IAdminApiService;
  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private global: GlobalService,
    public dialogRef: MatDialogRef<any>, 
    private authService: AuthService,public adminApiService: AdminApiService) { this.iCommonAPI = commonAPI; 
    this.iAdminApiService = adminApiService;
  }

  editTransactionForm = new FormGroup({
    transactionQuantity: new FormControl('', [Validators.required]),
    unitOfMeasure: new FormControl(''),
    serialNumber: new FormControl(''),
    lotNumber: new FormControl(''),
    expirationDate: new FormControl(' '),
    revision: new FormControl(''),
    notes: new FormControl(''),
    userField1: new FormControl(''),
    userField2: new FormControl(''),
    hostTransactionID: new FormControl(''),
    requiredDate: new FormControl(' '),
    batchPickID: new FormControl(''),
    lineNumber: new FormControl('', [Validators.required]),
    lineSequence: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    label: new FormControl(''),
    emergency: new FormControl(''),
    wareHouse: new FormControl(''),
    orderNumber: new FormControl({ value: '', disabled: true }),
    itemNumber: new FormControl({ value: '', disabled: true }),
    transactionType: new FormControl({ value: '', disabled: true }),
    importDate: new FormControl({ value: '', disabled: true }),

    importBy: new FormControl({ value: '', disabled: true }),
    zone: new FormControl({ value: '', disabled: true }),
    carousel: new FormControl({ value: '', disabled: true }),
    row: new FormControl({ value: '', disabled: true }),
    shelf: new FormControl({ value: '', disabled: true }),
    bin: new FormControl({ value: '', disabled: true }),
    reason: new FormControl({ value: '', disabled: true }),
    reasonMessage: new FormControl({ value: '', disabled: true }),
    description: new FormControl({ value: '', disabled: true }),

  });

  closeWindow() {
    this.dialogRef.close('close');
  }
  ngAfterViewInit() {
    this.trans_qty.nativeElement.focus();
  }
  public OSFieldFilterNames() { 
    this.iAdminApiService.ColumnAlias().subscribe((res: any) => {
      if(res.isExecuted && res.data)
      {
        this.fieldNames = res.data;
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ColumnAlias",res.responseMessage);
      }

    })
  }
  onNumberValueChange() {

    let currentLotNumber = this.editTransactionForm.get(TableConstant.LotNumber)?.value?.toString() == "" ? "0" : this.editTransactionForm.get(TableConstant.LotNumber)?.value?.toString();
    let currentSerialNumber = this.editTransactionForm.get(TableConstant.SerialNumber)?.value?.toString() == "" ? "0" : this.editTransactionForm.get(TableConstant.SerialNumber)?.value?.toString();
    this.editTransactionForm.get(TableConstant.LotNumber)?.setValue(parseInt(currentLotNumber ?? '').toString());
    this.editTransactionForm.get(TableConstant.SerialNumber)?.setValue(parseInt(currentSerialNumber ?? '').toString());
  }

  editTransaction() { 

    // this.expDate = this.expDate !== '' ? format(new Date(this.expDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : '';
    // this.reqDate = this.reqDate !== '' ? format(new Date(this.reqDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : '';

    let finalExpiryDate = new Date(this.expDate);
    let finalReqDate = new Date(this.reqDate);

    if (this.isValidDate(finalExpiryDate)) {
      // this.expDate = this.isValidDate(finalExpiryDate) ? finalExpiryDate.toISOString() : '';
      this.expDate = this.expDate !== '' ? format(new Date(this.expDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : '';
    }

    if (this.isValidDate(finalReqDate)) {
      // this.reqDate = this.isValidDate(finalReqDate) ? finalReqDate.toISOString() : '';
      this.reqDate = this.reqDate !== '' ? format(new Date(this.reqDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : '';
    }

    let payload = {
      "id": this.transactionID,
      "oldValues": [
      ],
      "newValues": [
        this.editTransactionForm.get(ColumnDef.TransactionQuantity)?.value,
        this.editTransactionForm.get(ColumnDef.UnitOfMeasure)?.value,
        this.editTransactionForm.get(TableConstant.SerialNumber)?.value,
        this.editTransactionForm.get(TableConstant.LotNumber)?.value?.toString(),
        this.expDate,
        this.editTransactionForm.get(ColumnDef.Revision)?.value,
        this.editTransactionForm.get(TableConstant.Notes)?.value,
        this.editTransactionForm.get("userField1")?.value,
        this.editTransactionForm.get(ColumnDef.userField2)?.value,
        this.editTransactionForm.get(ColumnDef.HostTransactionId)?.value,
        this.reqDate,
        this.editTransactionForm.get(TableConstant.BatchPickID)?.value,
        this.editTransactionForm.get(TableConstant.LineNumber)?.value?.toString(),
        this.editTransactionForm.get(TableConstant.LineSequence)?.value?.toString(),
        this.editTransactionForm.get(UniqueConstants.Priority)?.value?.toString(),
        this.editTransactionForm.get(TableConstant.label)?.value?.toString(),
        this.editTransactionForm.get(UniqueConstants.emergency)?.value?.toString(),
        this.editTransactionForm.get("wareHouse")?.value
      ]
    }

    this.iAdminApiService.SaveTransaction(payload).subscribe((res: any) => {
      if (res.isExecuted){
        this.dialogRef.close('add');
        this.global.ShowToastr(ToasterType.Success,labels.alert.update, ToasterTitle.Success);
      }
      else{
        this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
        console.log("SaveTransaction",res.responseMessage);
      }
    });
  }

  ngOnInit(): void {
    this.isHistory = this.data.history;
    this.transactionID = this.data.transactionID;
    this.userData = this.authService.userData();
    this.OSFieldFilterNames();
    this.getTransactionDetail();
    this.getWarehouse();
    this.getUOM();

    if (this.isHistory) {
      this.clearAllFields();
    }


  }

  clearAllFields() {
    this.editTransactionForm.disable();
  }

  getUOM() {
    this.iCommonAPI.getUnitOfMeasure().subscribe((res) => {
      if (res.isExecuted) {
        this.unitOfMeasure_list = res.data;
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("getUnitOfMeasure:", res.responseMessage);

      }
    });
  }

  getWarehouse() {
    this.iCommonAPI.GetWarehouses().subscribe((res) => {
      this.warehouse_list = res.data;
    });
  }

  onDateChange(event: any, fromExpDate = ""): void {
    if ((fromExpDate !== "")) {
      this.expDate = format(new Date(event), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    }
    else {
      this.reqDate = format(new Date(event), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    }

  }

  getTransactionDetail() {
    let payload = {
      id: '' + this.transactionID + '',
      history: false,
    }
    this.iAdminApiService.TransactionByID(payload).subscribe(
      {
        next: (res: any) => {
          if (res.data && res.isExecuted) {
            try {

              const reqDate = res.data[0].requiredDate;
              const expDate = res.data[0].expirationDate;

              // finalExpiryDate = parse(expDate, 'dd/MM/yyyy hh:mm:ss a', new Date());
              let finalExpiryDate = new Date(expDate);
              // finalReqDate = parse(reqDate, 'dd/MM/yyyy hh:mm:ss a', new Date());
              let finalReqDate = new Date(reqDate);

              if (this.isValidDate(finalExpiryDate)) {
                this.expDate = this.isValidDate(finalExpiryDate) ? finalExpiryDate.toISOString() : '';
              }

              if (this.isValidDate(finalReqDate)) {
                this.reqDate = this.isValidDate(finalReqDate) ? finalReqDate.toISOString() : '';
              }

            }
            catch (e) { }

            if (!res.data[0].label) { this.label = false; } else { this.label = true; }
            if (res.data[0].emergency == StringConditions.False) { this.emergency = false; } else { this.emergency = true; }
            
            this.editTransactionForm.patchValue({
              'transactionQuantity': res.data[0].transactionQuantity,
              'unitOfMeasure': res.data[0].unitOfMeasure,
              "serialNumber": res.data[0].serialNumber,
              "lotNumber": res.data[0].lotNumber,
              'expirationDate': this.expDate != "1900-01-01T19:31:48.000Z" ? this.expDate : " ",
              "revision": res.data[0].revision,
              'notes': res.data[0].notes,
              "userField1": res.data[0].userField1,
              "userField2": res.data[0].userField2,
              "hostTransactionID": res.data[0].hostTransactionID,
              "requiredDate": this.reqDate != "1900-01-01T19:31:48.000Z" ? this.reqDate : " ",
              'batchPickID': res.data[0].batchPickID,
              "lineNumber": res.data[0].lineNumber,
              'lineSequence': res.data[0].lineSequence,
              'priority': res.data[0].priority,
              'label': this.label.toString(),
              "emergency": this.emergency.toString(),
              "wareHouse": res.data[0].wareHouse,
              "orderNumber": res.data[0].orderNumber,
              "itemNumber": res.data[0].itemNumber,
              "transactionType": res.data[0].transactionType,
              'importDate': res.data[0].importDate,
              "importBy": res.data[0].importBy,
              "zone": res.data[0].zone,
              'carousel': res.data[0].carousel,
              'row': res.data[0].row,
              "shelf": res.data[0].shelf,
              "bin": res.data[0].bin,
              "reason": res.data[0].reason,
              "reasonMessage": res.data[0].reasonMessage,
              "description": res.data[0].description
            });


          } else {
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
            console.log("TransactionByID",res.responseMessage);
          }
        },
      }
    );
  }

  dayIncrement(date: any) {

    if (date != null && date != "1900-01-01T19:31:48.000Z" && date!='') {
      let newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    } else {
      return '';
    }
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
