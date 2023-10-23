import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WarehouseComponent } from 'src/app/admin/dialogs/warehouse/warehouse.component';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-gt-transaction-details',
  templateUrl: './gt-transaction-details.component.html',
  styleUrls: ['./gt-transaction-details.component.scss']
})
export class GtTransactionDetailsComponent {

  constructor(
    private global: GlobalService,
  ) {

  }
  @Input() item: any ="";
  @Input() emergency: any ="";
  @Input() transType: any ="";
  isInvalid = false;
  @Input() reqDate: any ="";
  @Input() wareHouse: any ="";
  @Input() toteID: any ="";
  @Input() priority: any ="";
  @Input() lineSeq: any ="";
  @Input() hostTransID: any ="";
  @Input() batchPickID: any ="";
  @Input() lineNumber: any ="";
  @Input() transQuantity: any ="";
  @Input() orderNumber: string;
  @Input() warehouseSensitivity: string;
  @Input() userData: any ="";
  @Input() supplierID: any ="";
  @Output() onFormFieldFocusOut: EventEmitter<any> = new EventEmitter();
  @Output() fieldValuesChanged: EventEmitter<any> = new EventEmitter();

  openWareHouse() {
    if (this.orderNumber == '' || !this.item) return;
    const dialogRef: any = this.global.OpenDialog(WarehouseComponent, {
      height: 'auto',
      width: '640px',
      autoFocus: '__non_existing_element__',
      disableClose: true,
      data: {
        userName: this.userData.userName,
        wsid: this.userData.wsid,
        supplierID: this.supplierID,

      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res && res != 'clear') {

        this.wareHouse = res;
        this.warehouseSensitivity = 'False';
      } else if (res && res === 'clear') {
        this.wareHouse = '';
      }
    });
  }

  // limit number to 9 digits
  limitNumber(event) {
    if (event.code != 'Backspace') {
      if (this.transQuantity?.toString().length >= 9) {
        let val = this.transQuantity.toString().slice(0, -1);
        this.transQuantity = parseInt(val)
      }
    }
  }
onFieldChange(fieldName: string) {
  const fieldValues = {
    orderNumber: this.orderNumber,
    item: this.item,
    supplierID: this.supplierID,
    userData:this.userData,
    emergency: this.emergency,  
    transType: this.transType,
    reqDate: new Date(this.reqDate),
    wareHouse: this.wareHouse,
    toteID: this.toteID,
    priority: this.priority,
    lineSeq: this.lineSeq,
    hostTransID: this.hostTransID,
    batchPickID: this.batchPickID,
    lineNumber: this.lineNumber,
    transQuantity: this.transQuantity,
    warehouseSensitivity: this.warehouseSensitivity 
  };
  

  fieldValues[fieldName] = this[fieldName];
  this.fieldValuesChanged.emit(fieldValues);
}


}
