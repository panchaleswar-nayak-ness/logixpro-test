import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service'; 
import labels from '../../labels/labels.json';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-om-add-record',
  templateUrl: './om-add-record.component.html',
  styleUrls: ['./om-add-record.component.scss']
})
export class OmAddRecordComponent implements OnInit {
  @ViewChild('ord_focus') ord_focus: ElementRef;
  userData: any;
  userFieldData: any = {};
  oTTempUpdatePayload: any = {
    "id": 0,
    "orderNumber": "",
    "transType": "",
    "warehouse": "",
    "itemNumber": "",
    "description": "",
    "unitofMeasure": "",
    "transQty": 1,
    "lineNumber": 0,
    "priority": 0,
    "requiredDate": "",
    "hostTransID": "",
    "emergency": false,
    "label": false,
    "lotNumber": "",
    "expirationDate": "",
    "serialNumber": "",
    "revision": "",
    "batchPickID": "",
    "toteID": "",
    "cell": "",
    "notes": "",
    "userField1": "",
    "userField2": "",
    "userField3": "",
    "userField4": "",
    "userField5": "",
    "userField6": "",
    "userField7": "",
    "userField8": "",
    "userField9": "",
    "userField10": "",
    "inProcess": false,
    "processBy": "",
    "importBy": "",
    "importDate": "",
    "importFileName": "",
    "wsid": ""
  };
  transactionTypes: any = [
    { value: 'Pick', title: 'Pick' },
    { value: 'Count', title: 'Count' },
    { value: 'Put Away', title: 'Put Away' },
  ];
  wharehouses: any = [];
  isEdit: boolean = false;
  itemNumberSearchList: any;
  @ViewChild("searchauto", { static: false }) autocompleteOpened: MatAutocomplete;
  wharehouseRequired: any = false;
  heading: string = "";
  orderNumberDisabled: boolean = false;
  itemNumberScroll:any = "all";

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private Api: ApiFuntions,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<OmAddRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getWarehouses();
    this.initializaAutoComplete();
  }
  ngAfterViewInit(): void {
    this.ord_focus.nativeElement.focus();
  }
  initializaAutoComplete() {
    this.heading = this.data.heading;
    if (this.data.from == 'edit-transaction') {
      this.isEdit = true;
      this.orderNumberDisabled = true;
      this.getWarehouses();
      this.autofillModal();
    }
    else if (this.data.from == 'add-transaction') {
      this.orderNumberDisabled = true;
      this.getWarehouses();
      this.autofillModal();
    }
    else {
      this.oTTempUpdatePayload.processBy = this.userData.userName;
      this.oTTempUpdatePayload.importBy = this.userData.userName;
      this.oTTempUpdatePayload.importDate = new Date().toISOString();
      this.oTTempUpdatePayload.importFileName = "Create Pending Transaction";
      this.getUserFieldData();
    }
    this.oTTempUpdatePayload.wsid = this.userData.wsid;
  }

  autofillModal() { 
    this.oTTempUpdatePayload.id = this.data.transaction.id ? this.data.transaction.id : 0;
    this.oTTempUpdatePayload.orderNumber = this.data.transaction.orderNumber ? this.data.transaction.orderNumber : "";
    this.oTTempUpdatePayload.transType = this.data.transaction.transactionType ? this.data.transaction.transactionType : "";
    this.oTTempUpdatePayload.warehouse = this.data.transaction.warehouse ? this.data.transaction.warehouse : "";
    this.oTTempUpdatePayload.itemNumber = this.data.transaction.itemNumber ? this.data.transaction.itemNumber : "";
    this.oTTempUpdatePayload.description = this.data.transaction.description ? this.data.transaction.description : "";
    this.oTTempUpdatePayload.unitofMeasure = this.data.transaction.unitOfMeasure ? this.data.transaction.unitOfMeasure : "";
    this.oTTempUpdatePayload.transQty = this.data.transaction.transactionQuantity ? this.data.transaction.transactionQuantity : 1;
    this.oTTempUpdatePayload.lineNumber = this.data.transaction.lineNumber ? this.data.transaction.lineNumber : 0;
    this.oTTempUpdatePayload.priority = this.data.transaction.priority ? this.data.transaction.priority : 0;
    this.oTTempUpdatePayload.hostTransID = this.data.transaction.hostTransactionID ? this.data.transaction.hostTransactionID : "";
    this.oTTempUpdatePayload.emergency = this.data.transaction.emergency ? this.data.transaction.emergency : false;
    this.oTTempUpdatePayload.label = this.data.transaction.label ? this.data.transaction.label : false;
    this.oTTempUpdatePayload.lotNumber = this.data.transaction.lotNumber ? this.data.transaction.lotNumber : "";
    this.oTTempUpdatePayload.requiredDate = (this.data.transaction.requiredDate == undefined || this.data.transaction.requiredDate == "1/1/1900 12:00:00 AM" || this.data.transaction.requiredDate == "") ? "" : new Date(this.data.transaction.requiredDate);
    this.oTTempUpdatePayload.expirationDate = (this.data.transaction.expirationDate == undefined || this.data.transaction.expirationDate == "1/1/1900 12:00:00 AM" || this.data.transaction.expirationDate == "") ? "" : new Date(this.data.transaction.expirationDate);
    this.oTTempUpdatePayload.serialNumber = this.data.transaction.serialNumber ? this.data.transaction.serialNumber : "";
    this.oTTempUpdatePayload.revision = this.data.transaction.revision ? this.data.transaction.revision : "";
    this.oTTempUpdatePayload.batchPickID = this.data.transaction.batchPickID ? this.data.transaction.batchPickID : "";
    this.oTTempUpdatePayload.toteID = this.data.transaction.toteID ? this.data.transaction.toteID : "";
    this.oTTempUpdatePayload.cell = this.data.transaction.cell ? this.data.transaction.cell : "";
    this.oTTempUpdatePayload.notes = this.data.transaction.notes ? this.data.transaction.notes : "";
    this.oTTempUpdatePayload.userField1 = this.data.transaction.userField1 ? this.data.transaction.userField1 : "";
    this.oTTempUpdatePayload.userField2 = this.data.transaction.userField2 ? this.data.transaction.userField2 : "";
    this.oTTempUpdatePayload.userField3 = this.data.transaction.userField3 ? this.data.transaction.userField3 : "";
    this.oTTempUpdatePayload.userField4 = this.data.transaction.userField4 ? this.data.transaction.userField4 : "";
    this.oTTempUpdatePayload.userField5 = this.data.transaction.userField5 ? this.data.transaction.userField5 : "";
    this.oTTempUpdatePayload.userField6 = this.data.transaction.userField6 ? this.data.transaction.userField6 : "";
    this.oTTempUpdatePayload.userField7 = this.data.transaction.userField7 ? this.data.transaction.userField7 : "";
    this.oTTempUpdatePayload.userField8 = this.data.transaction.userField8 ? this.data.transaction.userField8 : "";
    this.oTTempUpdatePayload.userField9 = this.data.transaction.userField9 ? this.data.transaction.userField9 : "";
    this.oTTempUpdatePayload.userField10 = this.data.transaction.userField10 ? this.data.transaction.userField10 : "";
    if (this.data.transaction.inProcess == "False") {
      this.oTTempUpdatePayload.inProcess = false;
    }
    else if (this.data.transaction.inProcess == "True") {
      this.oTTempUpdatePayload.inProcess = true;
    }
    this.oTTempUpdatePayload.processBy = this.data.transaction.processingBy;
    this.oTTempUpdatePayload.importBy = this.data.transaction.importBy;
    this.oTTempUpdatePayload.importDate = this.data.transaction.importDate ? new Date(this.data.transaction.importDate) : new Date();
    this.oTTempUpdatePayload.importFileName = this.data.transaction.importFilename;

    if (this.oTTempUpdatePayload.processBy == "" || this.oTTempUpdatePayload.processBy == null || this.oTTempUpdatePayload.processBy == undefined) {
      this.oTTempUpdatePayload.processBy = this.userData.userName;
    }
    if (this.oTTempUpdatePayload.importBy == "" || this.oTTempUpdatePayload.importBy == null || this.oTTempUpdatePayload.importBy == undefined) {
      this.oTTempUpdatePayload.importBy = this.userData.userName;
    }
    if (this.oTTempUpdatePayload.importFileName == "" || this.oTTempUpdatePayload.importFileName == null || this.oTTempUpdatePayload.importFileName == undefined) {
      this.oTTempUpdatePayload.importFileName = "Create Pending Transaction";
    }
    if (this.oTTempUpdatePayload.orderNumber == "" || this.oTTempUpdatePayload.orderNumber == null || this.oTTempUpdatePayload.orderNumber == undefined) {
      this.oTTempUpdatePayload.orderNumber = this.data.orderNumber;
    }
  }

  mapDefaultValues() {
    this.oTTempUpdatePayload.userField1 = this.userFieldData.userField1;
    this.oTTempUpdatePayload.userField2 = this.userFieldData.userField2;
    this.oTTempUpdatePayload.userField3 = this.userFieldData.userField3;
    this.oTTempUpdatePayload.userField4 = this.userFieldData.userField4;
    this.oTTempUpdatePayload.userField5 = this.userFieldData.userField5;
    this.oTTempUpdatePayload.userField6 = this.userFieldData.userField6;
    this.oTTempUpdatePayload.userField7 = this.userFieldData.userField7;
    this.oTTempUpdatePayload.userField8 = this.userFieldData.userField8;
    this.oTTempUpdatePayload.userField9 = this.userFieldData.userField9;
    this.oTTempUpdatePayload.userField10 = this.userFieldData.userField10;
  }

  getUserFieldData(loader: boolean = false) {
    let payload = {
      "userName": this.userData.userName,
      "wsid": this.userData.wsid,
      "appName": ""
    }
    this.Api.UserFieldData().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.userFieldData = res.data[0];
        this.mapDefaultValues();
        this.getWarehouses();
      } else {
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    });
  }

  async save(loader: boolean = false) { 
    if (this.oTTempUpdatePayload.orderNumber.trim() == '' || this.oTTempUpdatePayload.itemNumber.trim() == '' || this.oTTempUpdatePayload.transType.trim() == '') {
      this.toastr.error("Order Number, Item Number and Transaction Type must be completed in order to continue.", 'Warning!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
    else if (this.wharehouseRequired && this.oTTempUpdatePayload.warehouse == '') {
      this.toastr.error("The selected item is warehouse sensitive.  Please set a warehouse to continue.", 'Warning!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
    else if (this.oTTempUpdatePayload.transQty <= 0) {
      this.toastr.error("The transaction quantity for this transaction must be greater than 0.", 'Warning!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
    else {
      let check: any = await this.checkItemNumberBeforeSave();
      if (!check) {
        return;
      }
      this.oTTempUpdatePayload.importDate = this.oTTempUpdatePayload.importDate ? new Date(this.oTTempUpdatePayload.importDate).getMonth()+1 + '/' +  new Date(this.oTTempUpdatePayload.importDate).getDate() + '/' + new Date(this.oTTempUpdatePayload.importDate).getFullYear() : "";
      this.oTTempUpdatePayload.requiredDate = this.oTTempUpdatePayload.requiredDate ? new Date(this.oTTempUpdatePayload.requiredDate).getMonth()+1 + '/' +  new Date(this.oTTempUpdatePayload.requiredDate).getDate() + '/' + new Date(this.oTTempUpdatePayload.requiredDate).getFullYear() : "";
      this.oTTempUpdatePayload.expirationDate = this.oTTempUpdatePayload.expirationDate ? new Date(this.oTTempUpdatePayload.expirationDate).getMonth()+1 + '/' +  new Date(this.oTTempUpdatePayload.expirationDate).getDate() + '/' + new Date(this.oTTempUpdatePayload.expirationDate).getFullYear() : "";
      if (!this.isEdit) {
        this.Api.OTTempInsert(this.oTTempUpdatePayload).subscribe((res: any) => {
          if (res.isExecuted && res.data) {
            this.toastr.success(labels.alert.success, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
            this.dialogRef.close(res.data);
          } else {
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
        })
      }
      else {
        this.Api.OTTempUpdate(this.oTTempUpdatePayload).subscribe((res: any) => {
          if (res.isExecuted && res.data) {
            this.toastr.success(labels.alert.update, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
            this.dialogRef.close(res.data);
          } else {
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
        })
      }
    }
  }

  searchItem(loader: boolean = false) {
    if (this.oTTempUpdatePayload.itemNumber.trim() != '') {
      let payload = {
        "appName": "",
        "itemNumber": this.oTTempUpdatePayload.itemNumber,
        "beginItem": "---",
        "isEqual": false,
        "userName": this.userData.userName,
        "wsid": this.userData.wsid
      }
      this.Api.SearchItem(payload).subscribe((res: any) => {
        if (res.isExecuted && res.data) {
          this.itemNumberSearchList = res.data;
        } 
      });
    }
    else {
      this.itemNumberSearchList = [];
    }
  }

  onSearchSelect(e: any) {
    this.oTTempUpdatePayload.itemNumber = e.option.value;
  }

  selectItemNumber(option: any,event:any) {
    this.oTTempUpdatePayload.description = option.description;
    this.oTTempUpdatePayload.unitofMeasure = option.unitOfMeasure;
    this.wharehouseRequired = option.warehouseSensitive;
  }

  getWarehouses() {
    let payload = {
      "userName": this.userData.userName,
      "wsid": this.userData.wsid
    }
    this.Api.GetWarehouses().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.wharehouses = res.data;
        this.wharehouses = res.data.sort();
        this.wharehouses.unshift("")
      } 
    });
  }

  onDateChange(event, key: any): void {
    this.oTTempUpdatePayload[key] = event;
  }

  resetDefaultValues(key: any, value: any) {
    if (this.oTTempUpdatePayload[key] == null) {
      this.oTTempUpdatePayload[key] = value;
    }
    if(this.oTTempUpdatePayload[key] < 0){
      this.oTTempUpdatePayload[key] = 0;
    }
  }

  itemNumberFocusOut(event: any) {
    if (this.oTTempUpdatePayload.itemNumber != "") {
      let payload = {
        "appName": "",
        "itemNumber": this.oTTempUpdatePayload.itemNumber,
        "beginItem": "---",
        "isEqual": false,
        "userName": this.userData.userName,
        "wsid": this.userData.wsid
      }
      setTimeout(() => {
        this.Api.SearchItem(payload).subscribe((res: any) => {
          if (res.isExecuted && res.data && res.data.length > 0) {
            if(res.data[0].itemNumber == this.oTTempUpdatePayload.itemNumber){
              this.oTTempUpdatePayload.description = res.data[0].description;
              this.oTTempUpdatePayload.unitofMeasure = res.data[0].unitOfMeasure;
              this.wharehouseRequired = res.data[0].warehouseSensitive;
            }
            else{
              this.toastr.error(`Item ${this.oTTempUpdatePayload.itemNumber} Does not exist!`, 'Inventory', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              this.oTTempUpdatePayload.itemNumber = "";
              this.oTTempUpdatePayload.description = "";
              this.oTTempUpdatePayload.unitofMeasure = ""; 
              this.wharehouseRequired = false;
            }
          }
          else {
            this.toastr.error(`Item ${this.oTTempUpdatePayload.itemNumber} Does not exist!`, 'Inventory', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
            this.oTTempUpdatePayload.itemNumber = "";
            this.oTTempUpdatePayload.description = "";
            this.oTTempUpdatePayload.unitofMeasure = ""; 
            this.wharehouseRequired = false;
          }
        });
      }, 500);

    }
  }

  async checkItemNumberBeforeSave(): Promise<boolean> {
    if (this.oTTempUpdatePayload.itemNumber != "") {
      let payload = {
        "appName": "",
        "itemNumber": this.oTTempUpdatePayload.itemNumber,
        "beginItem": "---",
        "isEqual": false,
        "userName": this.userData.userName,
        "wsid": this.userData.wsid
      }
      let res: any = await this.Api.SearchItem(payload).toPromise();
      if (res.isExecuted && res.data && res.data.length > 0) {
        let filtered = res.data.filter((item: any) => (item.itemNumber == this.oTTempUpdatePayload.itemNumber));
        if (filtered.length > 0) {
          this.oTTempUpdatePayload.description = filtered[0].description;
          this.oTTempUpdatePayload.unitofMeasure = filtered[0].unitOfMeasure;
          this.wharehouseRequired = filtered[0].warehouseSensitive;
          if(this.wharehouseRequired == true && this.oTTempUpdatePayload.warehouse == ""){
            this.toastr.error("The selected item is warehouse sensitive.  Please set a warehouse to continue.", 'Warning!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
            return false;
          }
          else{
            return true;
          }
        }
        else {
          this.oTTempUpdatePayload.itemNumber = "";
          return false;
        }
      }
      else {
        this.oTTempUpdatePayload.itemNumber = "";
        return false;
      }
    }
    return false;
  }

  focusinmethod(){
    this.itemNumberScroll = "horizontal";
  }
  focusoutmethod(){
    this.itemNumberScroll = "all";
  }
}
