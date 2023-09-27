import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/common/services/global.service'; 
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-cm-ship-split-line',
  templateUrl: './cm-ship-split-line.component.html',
  styleUrls: []
})
export class CmShipSplitLineComponent implements OnInit {

  public userData: any;

  splitScreenQty : string = '';
  splitScreenQtyBtn : boolean = false;

  @ViewChild('ssQty') ssQty : ElementRef;

  constructor(private dialog: MatDialog,
              public dialogRef: MatDialogRef<CmShipSplitLineComponent>,
              private toast: ToastrService,
              private Api: ApiFuntions,
              private authService: AuthService,
              public globalService: GlobalService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

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
    setTimeout(()=>{
      this.ssQty.nativeElement.focus();
    }, 500);
  }

  saveSplitScreenQty() {
    try {
      let payLoad = {
        id : this.data.order.sT_ID,
        quantity : this.splitScreenQty,
        page: this.data.page,
        username: this.userData.userName,
        wsid: this.userData.wsid
      };

      this.Api.SplitLineTrans(payLoad).subscribe(
        (res: any) => {
          if (res.isExecuted) {            
            let orderQty = parseInt(this.data.order.transactionQuantity) - parseInt(this.splitScreenQty);
            let pickQty = parseInt(this.data.order.completedQuantity) - parseInt(this.splitScreenQty);
            let shipQty = parseInt(this.data.order.shipQuantity) - parseInt(this.splitScreenQty);

            this.dialogRef.close({
              isExecuted: true,
              orderQty,
              pickQty,
              shipQty
            });
          } else {
            this.toast.error('Something went wrong', 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
          }
        },
        (error) => { }
      );
    } catch (error) { 
    }
  }

}
