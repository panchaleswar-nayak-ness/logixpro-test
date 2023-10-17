import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

 

import {ApiFuntions } from 'src/app/services/ApiFuntions';
import { ICommonApi } from 'src/app/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/services/common-api/common-api.service';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';


export interface  AdjustQuantityDataStructure   {
  itemNumber :  string ,
  description :  string ,
  location :  string ,
  quantityAllocatedPick:  string ,
  quantityAllocatedPutAway :  string ,
  itemQuantity :  string ,

  zone:   any ;  //notExist
  currentMaxQty:  any;  //notExist
  currentMinQty:  any; //notExist
  currentLocationQty:  any; //notExist
  locationZone:  any; //notExist
 
}

@Component({
  selector: 'app-adjust-quantity',
  templateUrl: './adjust-quantity.component.html',
  styleUrls: ['./adjust-quantity.component.scss']
})
export class AdjustQuantityComponent implements OnInit {
  @ViewChild('newQty') newQty: ElementRef;
  fieldName="";
 adjustInventoryMapForm: FormGroup;
 public iAdminApiService: IAdminApiService;
 getAdjustQuantityData  :    AdjustQuantityDataStructure = {

  itemNumber : '',
  description :  '',
  location : '',
  zone: '', //notExist
  quantityAllocatedPick:  '',
  quantityAllocatedPutAway : '',
  locationZone : '',
  currentMaxQty: '', //notExistdi
  currentMinQty: '', //notExist
  currentLocationQty: '' , //notExist
  itemQuantity: '' , //notExist

} ;

 getAdjustReasonsList: any ;

 

 public iCommonAPI : ICommonApi;

 constructor(
    public commonAPI : CommonApiService,
    private global:GlobalService,
    public fb: FormBuilder,
    private Api: ApiFuntions,
    private adminApiService: AdminApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
    public dialogRef: MatDialogRef<any>
  ) {
   this.fieldName=data.fieldNames;
   this.iCommonAPI = commonAPI;
   this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void { 
    this.getItemQuantity(this.data.id);
    this.getAdjustmentReasons();
    this.initializeDataSet();
  }
  
  ngAfterViewInit() {
 

      this.newQty.nativeElement.focus();

   
  }


  initializeDataSet(){
    this.adjustInventoryMapForm = this.fb.group({
      mapID: [ this.data.id, [Validators.required]],
      quantity: [  0, [Validators.required]],
      description: [  '', [Validators.required]],
    });
  }

  getItemQuantity(id: any){
    this.iCommonAPI.getItemQuantityDetail(id).subscribe((res) => {
      if(res.data && res.isExecuted){
        this.getAdjustQuantityData = res.data;
        this.newQty.nativeElement.focus();
      }
      else {
        
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("getItemQuantityDetail",res.responseMessage);

      }
    });
  }

  getAdjustmentReasons(){
    this.iCommonAPI.getAdjustmentReasonsList().subscribe((res) => {
      if(res.data && res.isExecuted){
        this.getAdjustReasonsList = res.data;
      }
      else {
        
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("getAdjustmentReasonsList",res.responseMessage);

      }
    });
  }
  onSubmit(form: FormGroup) { 

    if(form.valid){
      this.iAdminApiService.updateItemQuantity(form.value).subscribe((res) => {
        if(res.isExecuted){
          this.global.ShowToastr('success',res.responseMessage, 'Success!'); 
          this.dialogRef.close(form.value.quantity);   
        }
        else {
          
          this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
          console.log("updateItemQuantity",res.responseMessage);
          
        }
      });
    }
  }

  get f() {
    return this.adjustInventoryMapForm.controls;
  }
  hasError(fieldName: string, errorName: string) {
    return this.adjustInventoryMapForm.get(fieldName)?.touched && this.adjustInventoryMapForm.get(fieldName)?.hasError(errorName);
  }
  isValid() {
    return this.adjustInventoryMapForm.valid;
  }

 






}
