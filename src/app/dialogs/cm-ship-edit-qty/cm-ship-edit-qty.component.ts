import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/common/services/global.service'; 
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-cm-ship-edit-qty',
  templateUrl: './cm-ship-edit-qty.component.html',
  styleUrls: []
})
export class CmShipEditQtyComponent implements OnInit {
  @ViewChild('matInput') matInput: ElementRef;
  public userData: any;

  adjustShipQty : string = '';
  adjustReason : string = '';

  clearContainerIDBtn : boolean = true;
  saveAdjustShipQtyBtn : boolean = false;

  @ViewChild('adjReason') adjReason : ElementRef;

  constructor(private dialog: MatDialog,
              public dialogRef: MatDialogRef<CmShipEditQtyComponent>,
              private toast: ToastrService,
              private Api: ApiFuntions,
              private authService: AuthService,
              public globalService: GlobalService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

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
        reason: this.adjustReason,
        username: this.userData.userName,
      }
      this.Api.ShipQTYShipTransUpdate(payLoad).subscribe((res:any)=>{
        if (res.isExecuted) {

          let Exists = false;
          for (let i = 0; i < this.data.reasons.length; i++) {
            if (this.data.reasons[i] == this.adjustReason) {
              Exists = true;
              break;
            };
          };

          if (!Exists) this.data.reasons.push(this.adjustReason)
          
          this.dialogRef.close({
            isExecuted: true,
            shipQuantity: this.adjustShipQty
          });

          this.adjustShipQty = '';
          this.adjustReason = '';

        } else {
          this.toast.error('Something went wrong', 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
        }
      });
    } catch (error) { 
    }
  }

}
