import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { AddNotesComponent } from 'src/app/admin/dialogs/add-notes/add-notes.component';
import { SetItemLocationComponent } from 'src/app/admin/dialogs/set-item-location/set-item-location.component';
import { SupplierItemIdComponent } from 'src/app/admin/dialogs/supplier-item-id/supplier-item-id.component';
import { UnitMeasureComponent } from 'src/app/admin/dialogs/unit-measure/unit-measure.component';
import { UserFieldsEditComponent } from 'src/app/admin/dialogs/user-fields-edit/user-fields-edit.component';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-gt-item-details',
  templateUrl: './gt-item-details.component.html',
  styleUrls: ['./gt-item-details.component.scss']
})
export class GtItemDetailsComponent {

constructor(private global:GlobalService){};
@Input() orderNumber: any ="";
@Input() item: any ="";
@Input() columns: any ="";
@Input() itemNumber: any ="";
@Input() supplierID: any ="";
@Input() expDate: any ="";
@Input() revision: any ="";
@Input() description: any ="";
@Input() lotNumber: any ="";
@Input() uom: any ="";
@Input() notes: any ="";
@Input() serialNumber: any ="";

invMapIDget: any ="";
isInvalid = false;

openAction: any;
@Input() userData :any ="";
transactionID: any ="";

@Output() getSupplierItemInfo: EventEmitter<any> = new EventEmitter();
@Output() getLocationData: EventEmitter<any> = new EventEmitter();
@Output() fieldValuesChanged = new EventEmitter<any>();
@Output() openSetItemLocationDialogue :EventEmitter<any> = new EventEmitter();
openNotes(){
  const dialogRef:any = this.global.OpenDialog(AddNotesComponent, {
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

openUnitOfMeasureDialogue() {
  if (this.orderNumber == '' || !this.item) return;
  const dialogRef:any = this.global.OpenDialog(UnitMeasureComponent, {
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

clearMatSelectList(){
  this.openAction.options.forEach((data: MatOption) => data.deselect());
}

onFormFieldFocusOut() {
  // Implement your custom validation logic here
  // For example, check if the input is valid, and if not, set isInvalid to true
  this.isInvalid = !this.isValidInput(); // Change isValidInput() to your validation logic
}

isValidInput(): boolean {
  // Implement your validation logic here
  return true; // Return true if the input is valid, false otherwise
}

openSupplierItemDialogue() {
  if (this.orderNumber == '' || !this.item) return;
  const dialogRef:any = this.global.OpenDialog(SupplierItemIdComponent, {
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
    this.getSupplierItemInfo.emit();
    this.clearMatSelectList();
  });
}


openUserFieldsEditDialogue() {
  const dialogRef:any = this.global.OpenDialog(UserFieldsEditComponent, {
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

onFieldChange(fieldName: string) {
  const fieldValues = {
    orderNumber: this.orderNumber,
    item: this.item,
    columns: this.columns,
    itemNumber: this.itemNumber,
    supplierID: this.supplierID,
    expDate: new Date(this.expDate),
    revision: this.revision,
    description: this.description,
    lotNumber: this.lotNumber,
    uom: this.uom,
    notes: this.notes,
    serialNumber: this.serialNumber,
    userData:this.userData
  };
  fieldValues[fieldName] = this[fieldName];
  this.fieldValuesChanged.emit(fieldValues);
  
}

}
