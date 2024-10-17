import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import labels from 'src/app/common/labels/labels.json';
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-user-fields-edit',
  templateUrl: './user-fields-edit.component.html',
  styleUrls: ['./user-fields-edit.component.scss'],
})
export class UserFieldsEditComponent implements OnInit {
  @ViewChild('ship_via') ship_via: ElementRef;
  floatLabelControl: any = new FormControl('auto' as FloatLabelType);
  floatLabelControlShipName: any = new FormControl(
    'shipName' as FloatLabelType
  );
  hideRequiredControl = new FormControl(false);
  hideRequiredControlShipName = new FormControl(false);
  shipVia;
  shipToName;
  searchByShipVia: any = new Subject<string>();
  searchByShipName: any = new Subject<string>();
  searchAutoCompleteShipVia: any = [];
  searchAutoCompleteShipName: any = [];
  fieldNames:any;
  userField10 = '';
  userField9 = '';
  shipToLine1 = '';
  shipToCountry = '';
  isCancel = '';
  promisedDate = '';
  shipToZip = '';
  shipToState = '';

  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global:GlobalService,
    
    public dialogRef: MatDialogRef<any>
  ) {
    this.fieldNames=data.fieldNames
    this.iCommonAPI = commonAPI;
  }

  ngOnInit(): void {
    this.getUserFields();
    this.searchByShipVia
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.autoCompleteSearchColumn();
      });

    this.searchByShipName
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.autoCompleteSearchColumnShipName();
      });
  }
  
  ngAfterViewInit() {
    this.ship_via.nativeElement.focus();
  }

  saveUserFields() {
    let userFields:any=[];
    userFields[0] = this.shipVia;
    userFields[1] = this.shipToName;
    userFields[2] = this.shipToState;
    userFields[3] = this.shipToZip;
    userFields[4] = this.promisedDate;
    userFields[5] = this.isCancel;
    userFields[6] = this.shipToCountry;
    userFields[7] = this.shipToLine1;
    userFields[8] = this.userField9;
    userFields[9] = this.userField10;

    let payload = {
      transaction: this.data.transID,
      userFields: userFields
    };
    this.iCommonAPI.UserFieldMTSave(payload).subscribe((res:any)=>{
      if(res.isExecuted){
             this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
            this.dialogRef.close({isExecuted:true})
      }else{
        this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
        this.dialogRef.close({isExecuted:false})
        console.log("UserFieldMTSave",res.responseMessage);
      }
    })
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }
  getFloatLabelValueItem(): FloatLabelType {
    return this.floatLabelControlShipName.value || 'shipName';
  }


  async autoCompleteSearchColumn() {
    let searchPayload = {
      value: this.shipVia,
      uFs: 1
    };
    this.iCommonAPI
      .UserFieldTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          this.searchAutoCompleteShipVia = res.data;
        },
      );
  }

  getUserFields() {
    let payload = {
      transactionID: this.data.transID
    };
    this.iCommonAPI
      .UserFieldGetByID(payload)
      .subscribe((res: any) => {
        if (res?.data) {
          let item = res.data;
          this.shipVia = item.userField1 ?? "";
          this.shipToName = item.userField2 ?? "";
          this.shipToState = item.userField3 ?? "";
          this.shipToZip = item.userField4 ?? "";
          this.promisedDate = item.userField5 ?? "";
          this.isCancel = item.userField6 ?? "";
          this.shipToCountry = item.userField7 ?? "";
          this.shipToLine1 = item.userField8 ?? "";
          this.userField9 = item.userField9 ?? "";
          this.userField10 = item.userField10 ?? "";
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(),ToasterTitle.Error);
          console.log("UserFieldGetByID",res.responseMessage);
          
        }
      }
      );
  }
  async autoCompleteSearchColumnShipName() {
    let searchPayload = {
      value: this.shipToName,
      uFs: 2
    };
    this.iCommonAPI
      .UserFieldTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          this.searchAutoCompleteShipVia = res.data;
        },
      );
  }
  ngOnDestroy() {
    this.searchByShipVia.unsubscribe();
    this.searchByShipName.unsubscribe();
  }
}
