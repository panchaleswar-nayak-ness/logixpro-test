import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogConstants, Style } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { BpFullToteComponent } from 'src/app/dialogs/bp-full-tote/bp-full-tote.component';

@Component({
  selector: 'app-bp-verify-bulk-pick',
  templateUrl: './bp-verify-bulk-pick.component.html',
  styleUrls: ['./bp-verify-bulk-pick.component.scss']
})
export class BpVerifyBulkPickComponent implements OnInit {
  @Output() back = new EventEmitter<any>();
 @Input() SelectedList:any = [];
 @Input() NextToteID:any;
//  
 @Input() ordersDisplayedColumns: string[]=["OrderNo","ItemNo","Description","LineNo","Location","LotNo","SerialNo","Whse","OrderQty","CompletedQty","ToteID","Action"];
  constructor(
    private global:GlobalService
  ) { }

  ngOnInit(): void {
    // this.CopyAllOrder();
  }
ViewByLocation(){
  debugger
  this.SelectedList = this.SelectedList.sort((a, b) => a.location - b.location);
}
ViewByOrderItem(){
  debugger
  this.SelectedList = this.SelectedList.sort((a, b) => (a.orderNumber - b.orderNumber) && (a.itemNumber - b.itemNumber));
}
  backButton(){
    this.back.emit();
  }
  openDialog(element){
    element.NextToteID = this.NextToteID;
    this.global.OpenDialog(BpFullToteComponent, {
      height: 'auto',
      width: '800px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data:element
    });
  }
  ResetAllCompletedQty(){
    this.SelectedList.forEach(element => {
      element.completedQuantity=0;  
    });
  }
  CopyAllOrder(){
    this.SelectedList.forEach(element => {
      element.completedQuantity=element.transactionQuantity;  
    });
  }
}
