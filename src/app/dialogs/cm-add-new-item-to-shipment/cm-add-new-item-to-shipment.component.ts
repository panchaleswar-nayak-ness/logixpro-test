import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import {  ToasterTitle ,ToasterType} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-cm-add-new-item-to-shipment',
  templateUrl: './cm-add-new-item-to-shipment.component.html',
  styleUrls: ['./cm-add-new-item-to-shipment.component.scss']
})
export class CmAddNewItemToShipmentComponent{
  @ViewChild('contId') contId: ElementRef;
  orderNumber:any;
  containerID:any;
  userData:any = {};

  public iConsolidationAPI : IConsolidationApi;

  constructor(
    public consolidationAPI : ConsolidationApiService,
    private authService: AuthService,
    private global : GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CmAddNewItemToShipmentComponent>) {
      this.orderNumber = this.data.orderNumber;
      this.userData = this.authService.userData(); 
      this.iConsolidationAPI = consolidationAPI;
    }
  ngAfterViewInit(): void {
    this.contId.nativeElement.focus();
  }
  async ShippingItemAdd(){
    let obj:any = {
      orderNumber: this.orderNumber,
      containerID: this.containerID
    }
    this.iConsolidationAPI.ShippingItemAdd(obj).subscribe((res:any) => {
      if (res?.isExecuted) {
        this.dialogRef.close(true);
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);  
      }
  })
}
}
