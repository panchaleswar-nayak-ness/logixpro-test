import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';
import { IConsolidationApi } from 'src/app/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/services/consolidation-api/consolidation-api.service';

@Component({
  selector: 'app-cm-ship-split-line',
  templateUrl: './cm-ship-split-line.component.html',
  styleUrls: ['./cm-ship-split-line.component.scss'],
})
export class CmShipSplitLineComponent implements OnInit {
  public userData: any;

  splitScreenQty: string = '';
  splitScreenQtyBtn: boolean = false;

  @ViewChild('ssQty') ssQty: ElementRef;

  public iConsolidationAPI: IConsolidationApi;

  constructor(
    public consolidationAPI: ConsolidationApiService,
    private global: GlobalService,
    public dialogRef: MatDialogRef<CmShipSplitLineComponent>, 
    private authService: AuthService,
    public globalService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.iConsolidationAPI = consolidationAPI;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.focusSplitScreenQty();
  }

  validateSplitScreenQty() {
    if (parseInt(this.splitScreenQty) > this.data.order.transactionQuantity) {
      this.splitScreenQtyBtn = false;
    } else if (this.splitScreenQty == '') {
      this.splitScreenQtyBtn = false;
    } else {
      this.splitScreenQtyBtn = true;
    }
  }

  focusSplitScreenQty() {
    setTimeout(() => {
      this.ssQty.nativeElement.focus();
    }, 500);
  }

  saveSplitScreenQty() {
    try {
      let payLoad = {
        id: this.data.order.sT_ID,
        quantity: this.splitScreenQty,
        page: this.data.page,
      };

      this.iConsolidationAPI.SplitLineTrans(payLoad).subscribe(
        (res: any) => {
          if (res.isExecuted && res.data) {
            let orderQty =
              parseInt(this.data.order.transactionQuantity) -
              parseInt(this.splitScreenQty);
            let pickQty =
              parseInt(this.data.order.completedQuantity) -
              parseInt(this.splitScreenQty);
            let shipQty =
              parseInt(this.data.order.shipQuantity) -
              parseInt(this.splitScreenQty);

            this.dialogRef.close({
              isExecuted: true,
              orderQty,
              pickQty,
              shipQty,
            });
          } else {
            this.global.ShowToastr('error', 'Something went wrong', 'Error!');
            console.log('SplitLineTrans', res.responseMessage);
          }
        },
        (error) => {
          
        }
      );
    } catch (error) {
      
    }
  }
}
