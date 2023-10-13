import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
 
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IConsolidationApi } from 'src/app/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/services/consolidation-api/consolidation-api.service';

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

  public IconsolidationAPI : IConsolidationApi;

  constructor(
    public consolidationAPI : ConsolidationApiService,
    // private Api:ApiFuntions,
    private authService: AuthService,
    
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CmAddNewItemToShipmentComponent>) {
      this.OrderNumber = this.data.orderNumber;
      this.userData = this.authService.userData(); 
      this.IconsolidationAPI = consolidationAPI;
    }
  ngAfterViewInit(): void {
    this.cont_id.nativeElement.focus();
  }
  async ShippingItemAdd(){
    let obj:any = {
      orderNumber: this.OrderNumber,
      containerID: this.containerID
    }
    this.IconsolidationAPI.ShippingItemAdd(obj).subscribe((res:any) => {
      if (res?.isExecuted) {
        this.dialogRef.close(true);
      }
  })
}
}
