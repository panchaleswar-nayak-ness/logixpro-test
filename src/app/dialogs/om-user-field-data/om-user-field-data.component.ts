import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog';

import { AuthService } from 'src/app/common/init/auth.service'; 
import labels from 'src/app/common/labels/labels.json'; 
import { OrderManagerApiService } from 'src/app/common/services/orderManager-api/order-manager-api.service';
import { IOrderManagerAPIService } from 'src/app/common/services/orderManager-api/order-manager-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import {  Placeholders, ToasterTitle ,ToasterType} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-om-user-field-data',
  templateUrl: './om-user-field-data.component.html',
  styleUrls: ['./om-user-field-data.component.scss']
})
export class OmUserFieldDataComponent implements OnInit {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  UserField1:string = this.fieldMappings.userField1;
  UserField2:string = this.fieldMappings.userField2;
  UserField3:string = this.fieldMappings.userField3;
  UserField4:string = this.fieldMappings.userField4;
  UserField5:string = this.fieldMappings.userField5;
  UserField6:string = this.fieldMappings.userField6;
  UserField7:string = this.fieldMappings.userField7;
  UserField8:string = this.fieldMappings.userField8;
  UserField9:string = this.fieldMappings.userField9;
  UserField10:string = this.fieldMappings.userField10;
  @ViewChild('userFocus') userFocus: ElementRef;
  userData: any;
  userFieldData: any;
  public iOrderManagerApi :  IOrderManagerAPIService;
  placeholders = Placeholders;

  constructor(
    
    private authService: AuthService, 
    public orderManagerApi  : OrderManagerApiService,
    private global:GlobalService,
    public dialogRef: MatDialogRef<OmUserFieldDataComponent>,
  ) {
    this.iOrderManagerApi = orderManagerApi;
   }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getUserFieldData();
  }

  getUserFieldData() {
    
    this.iOrderManagerApi.UserFieldData().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.userFieldData = res.data[0];
      } else {
        this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
        console.log("UserFieldData",res.responseMessage);
      }
    });
  }

  updateUserFieldData( ) {
    let payload: any = {
      userField1: this.userFieldData.userField1,
      userField2: this.userFieldData.userField2,
      userField3: this.userFieldData.userField3,
      userField4: this.userFieldData.userField4,
      userField5: this.userFieldData.userField5,
      userField6: this.userFieldData.userField6,
      userField7: this.userFieldData.userField7,
      userField8: this.userFieldData.userField8,
      userField9: this.userFieldData.userField9,
      userField10: this.userFieldData.userField10,
    };
    this.iOrderManagerApi.UserFieldDataUpdate(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
        this.dialogRef.close(res.data);
      } else {
        this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
        console.log("UserFieldDataUpdate",res.responseMessage);
      }
    });
  }

   
  ngAfterViewInit(): void {
    this.userFocus.nativeElement.focus();
  }
}
