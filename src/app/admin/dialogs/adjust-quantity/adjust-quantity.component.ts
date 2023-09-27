import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

 
import { ToastrService } from 'ngx-toastr';
import {ApiFuntions } from 'src/app/services/ApiFuntions';


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

 

  constructor(
    private dialog: MatDialog,
    public fb: FormBuilder,
    private Api: ApiFuntions,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<any>
  ) {
   this.fieldName=data.fieldNames;
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
    this.Api.getItemQuantityDetail(id).subscribe((res) => {
      if(res.data && res.isExecuted){
        this.getAdjustQuantityData = res.data;
        this.newQty.nativeElement.focus();
      }
    });
  }

  getAdjustmentReasons(){
    this.Api.getAdjustmentReasonsList().subscribe((res) => {
      if(res.data && res.isExecuted){
        this.getAdjustReasonsList = res.data;
      }
    });
  }
  onSubmit(form: FormGroup) { 

    if(form.valid){
      this.Api.updateItemQuantity(form.value).subscribe((res) => {
        if(res.isExecuted){
          this.toastr.success(res.responseMessage, 'Success!',{
            positionClass: 'toast-bottom-right',
            timeOut:2000
         }); 
          this.dialogRef.close(form.value.quantity);   
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
