import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-cm-add-new-item-to-shipment',
  templateUrl: './cm-add-new-item-to-shipment.component.html',
  styleUrls: []
})
export class CmAddNewItemToShipmentComponent{
  @ViewChild('cont_id') cont_id: ElementRef;
  OrderNumber:any;
  containerID:any;
  userData:any = {};

  constructor(private Api:ApiFuntions,private authService: AuthService,private toast:ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CmAddNewItemToShipmentComponent>) {
      this.OrderNumber = this.data.orderNumber;
      this.userData = this.authService.userData(); 
    }
  ngAfterViewInit(): void {
    this.cont_id.nativeElement.focus();
  }
  async ShippingItemAdd(){
    let obj:any = {
      orderNumber: this.OrderNumber,
      containerID: this.containerID,
      userName: this.userData.userName
    }
    this.Api.ShippingItemAdd(obj).subscribe((res:any) => {
      if (res?.isExecuted) {
        this.dialogRef.close(true);
      }
  })
}
}
