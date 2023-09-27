import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import labels from '../../../labels/labels.json';
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-user-fields-edit',
  templateUrl: './user-fields-edit.component.html',
  styleUrls: [],
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
  searchAutocompleteShipVia: any = [];
  searchAutocompleteShipName: any = [];
  fieldNames:any;
  userField10 = '';
  userField9 = '';
  shipToLine1 = '';
  shipToCountry = '';
  isCancel = '';
  promisedDate = '';
  shipToZip = '';
  shipToState = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private Api: ApiFuntions,
    public dialogRef: MatDialogRef<any>
  ) {
    this.fieldNames=data.fieldNames
  }

  ngOnInit(): void {
    this.getUserFields();
    this.searchByShipVia
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteSearchColumn();
      });

    this.searchByShipName
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteSearchColumnShipName();
      });
  }
  ngAfterViewInit() {
    this.ship_via.nativeElement.focus();
  }
  saveUserFields() {

    let userFields:any=[];
    userFields[0]=this.shipVia;
    userFields[1]=this.shipToName;
    userFields[2]= this.shipToLine1;
    userFields[3]= this.userField9;
    userFields[4]=this.shipToCountry;
    userFields[5]= this.shipToState ;
    userFields[6]=this.shipToZip;
    userFields[7]= this.promisedDate;
    userFields[8]= this.isCancel;
    userFields[9]= this.userField10;

    let payload = {
      transaction: this.data.transID,
      userFields: userFields,
      username: this.data.userName,
      wsid: this.data.wsid,
    };

    this.Api.UserFieldMTSave(payload).subscribe((res:any)=>{
      if(res.isExecuted){
             this.toastr.success(labels.alert.success, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
            this.dialogRef.close({isExecuted:true})
      }else{
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
        this.dialogRef.close({isExecuted:false})
      }
    })
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }
  getFloatLabelValueItem(): FloatLabelType {
    return this.floatLabelControlShipName.value || 'shipName';
  }


  async autocompleteSearchColumn() {
    let searchPayload = {
      value: this.shipVia,
      uFs: 1,

      username: this.data.userName,
      wsid: this.data.wsid,
    };
    this.Api
      .UserFieldTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          this.searchAutocompleteShipVia = res.data;
        },
        (error) => {}
      );
  }

  getUserFields() {
    let payload = {
      transactionID: this.data.transID,
      username: this.data.userName,
      wsid: this.data.wsid,
    };
    this.Api
      .UserFieldGetByID(payload)
      .subscribe((res: any) => {
        if (res?.data) {
          let item = res.data;

          this.shipVia = item.userField1 ?? "";
          this.shipToName = item.userField2 ?? "";
          this.shipToLine1 = item.userField3 ?? "";
          this.userField9 = item.userField4 ?? "";
          this.shipToCountry = item.userField5 ?? "";
          this.shipToState = item.userField6 ?? "";
          this.shipToZip = item.userField7 ?? "";
          this.promisedDate = item.userField8 ?? "";
          this.isCancel = item.userField9 ?? "";
          this.userField10 = item.userField10 ?? "";
        }
      });
  }
  async autocompleteSearchColumnShipName() {
    let searchPayload = {
      value: this.shipToName,
      uFs: 2,
      username: this.data.userName,
      wsid: this.data.wsid,
    };
    this.Api
      .UserFieldTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          this.searchAutocompleteShipName = res.data;
        },
        (error) => {}
      );
  }
  ngOnDestroy() {
    this.searchByShipVia.unsubscribe();
    this.searchByShipName.unsubscribe();
  }
}
