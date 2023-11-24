import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GlobalService } from 'src/app/common/services/global.service'; 
import { AuthService } from 'src/app/common/init/auth.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import {  ToasterMessages } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-cm-ship-edit-qty',
  templateUrl: './cm-ship-edit-qty.component.html',
  styleUrls: ['./cm-ship-edit-qty.component.scss']
})
export class CmShipEditQtyComponent implements OnInit {
  @ViewChild('matInput') matInput: ElementRef;
  public userData: any;

  adjustShipQty : string = '';
  adjustReason : string = '';

  clearContainerIDBtn : boolean = true;
  saveAdjustShipQtyBtn : boolean = false;

  @ViewChild('adjReason') adjReason : ElementRef;

  public iConsolidationAPI : IConsolidationApi;

  constructor(
    public consolidationAPI : ConsolidationApiService,
    private global:GlobalService,
    public dialogRef: MatDialogRef<CmShipEditQtyComponent>,
    private authService: AuthService,
    public globalService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any) { this.iConsolidationAPI = consolidationAPI; }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }
  ngAfterViewInit(): void {
    this.matInput.nativeElement.focus();
  }
  validate() {
    if (this.adjustShipQty == '' || this.adjustReason == '') {
      this.saveAdjustShipQtyBtn = false;
    } else {
      this.saveAdjustShipQtyBtn = true;
    }
  }

  clearReason() {
    this.adjustReason = '';
    this.saveAdjustShipQtyBtn = false;
    this.focusReason();
  }

  focusReason() {
    setTimeout(()=>{
      this.adjReason.nativeElement.focus();
    }, 500);
  }

  selectionChanged() {
    this.validate();
  }

  saveAdjustShipQty() {
    try {
      let payLoad = {
        stid : this.data.order.sT_ID,
        shipQTY: this.adjustShipQty,
        reason: this.adjustReason
      }
      this.iConsolidationAPI.ShipQTYShipTransUpdate(payLoad).subscribe((res:any)=>{
        if (res.isExecuted) {

          let exists = false;
          for (let i of this.data.reasons) {
            if (i == this.adjustReason) {
              exists = true;
              break;
            };
          };

          if (!exists) this.data.reasons.push(this.adjustReason)
          
          this.dialogRef.close({
            isExecuted: true,
            shipQuantity: this.adjustShipQty
          });

          this.adjustShipQty = '';
          this.adjustReason = '';

        } else {
          this.global.ShowToastr('error',ToasterMessages.SomethingWentWrong, 'Error!');
          console.log("ShipQTYShipTransUpdate",res.responseMessage);
        }
      });
    } catch (error) { 
      console.log(error);
    }
  }

}
