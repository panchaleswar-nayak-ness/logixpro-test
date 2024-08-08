import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { data } from 'jquery';
import { AddNotesComponent } from 'src/app/admin/dialogs/add-notes/add-notes.component';
import { SupplierItemIdComponent } from 'src/app/admin/dialogs/supplier-item-id/supplier-item-id.component';
import { UnitMeasureComponent } from 'src/app/admin/dialogs/unit-measure/unit-measure.component';
import { UserFieldsEditComponent } from 'src/app/admin/dialogs/user-fields-edit/user-fields-edit.component';
import { DialogConstants ,Style} from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-gt-item-details',
  templateUrl: './gt-item-details.component.html',
  styleUrls: ['./gt-item-details.component.scss',]
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
@Input() transactionID: any ;

@Output() getSupplierItemInfo: EventEmitter<any> = new EventEmitter();
@Output() getLocationData: EventEmitter<any> = new EventEmitter();
@Output() fieldValuesChanged = new EventEmitter<any>();
@Output() openSetItemLocationDialogue :EventEmitter<any> = new EventEmitter();
@Output()  onFormFieldFocusOut :EventEmitter<any> = new EventEmitter();
openNotes(){
  if (this.orderNumber == '' || !this.item) return;
  const dialogRef:any = this.global.OpenDialog(AddNotesComponent, {
    height: DialogConstants.auto,
    width: Style.w560px,
    autoFocus: DialogConstants.autoFocus,
    disableClose:true,
    data:{
      notes:this.notes
    }
  
  });
  dialogRef.afterClosed().subscribe((res) => {
    if(res){
      this.notes=res
      this.onFieldChange(this.notes);
    }
  });
}

openUnitOfMeasureDialogue() {
  if (this.orderNumber == '' || !this.item) return;
  const dialogRef:any = this.global.OpenDialog(UnitMeasureComponent, {
    height: DialogConstants.auto,
    width: '800px',
    autoFocus: DialogConstants.autoFocus,
    disableClose:true,
    data:{
      UOM:this.uom
    }
  });
  dialogRef.afterClosed().subscribe((res) => {
    
    if(res != DialogConstants.close){
      this.uom = res;
      this.clearMatSelectList();
      this.onFieldChange(this.uom);}
    
  });
}

clearMatSelectList(){
  this.openAction?.options.forEach((data: MatOption) => data.deselect());
}

openSupplierItemDialogue() {
  if (this.orderNumber == '' || !this.item) return;
  const dialogRef:any = this.global.OpenDialog(SupplierItemIdComponent, {
    height: DialogConstants.auto,
    width: Style.w560px,
    autoFocus: DialogConstants.autoFocus,
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
    this.onFieldChange(this.supplierID);
  });
}


openUserFieldsEditDialogue() {
  const dialogRef:any = this.global.OpenDialog(UserFieldsEditComponent, {
    height: DialogConstants.auto,
    width: '800px',
    autoFocus: DialogConstants.autoFocus,
    disableClose:true,
    data: {
      transID: this.transactionID,
      userName: this.userData.userName,
      wsid: this.userData.wsid,
      fieldNames:this.columns
    },
    
  });
  dialogRef.afterClosed().subscribe(() => {
    this.clearMatSelectList();
  });
}

onFieldChange(fieldName: string) {
  const fieldValues = {
    orderNumber: this.orderNumber,
    columns: this.columns,
    itemNumber: this.itemNumber,
    supplierID: this.supplierID,
    expDate: this.expDate,
    revision: this.revision,
    description: this.description,
    lotNumber: this.lotNumber,
    uom: this.uom,
    notes: this.notes,
    serialNumber: this.serialNumber,
    userData:this.userData
  };
  fieldValues[fieldName] = this[fieldName];
  this.fieldValuesChanged.emit(fieldValues)
}

}
