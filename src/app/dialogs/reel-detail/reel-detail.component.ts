import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WarehouseComponent } from 'src/app/admin/dialogs/warehouse/warehouse.component';
import { AlertConfirmationComponent } from '../alert-confirmation/alert-confirmation.component';
import { GlobalService } from 'src/app/common/services/global.service';
import {  DialogConstants } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-reel-detail',
  templateUrl: './reel-detail.component.html',
  styleUrls: ['./reel-detail.component.scss']
})
export class ReelDetailComponent implements OnInit { 
  reelOrder:any;
  reelLot:any;
  reelExpDate:any;
  reelUF1:any;
  reelUF2:any;
  reelWarehouse:any;
  reelQty:any;
  reelNotes:any;
  wareHouseSensitivity:any;
  fieldNames:any;

  @ViewChild('field_focus') field_focus: ElementRef;
  @ViewChild('reelQuantitytemp') reelQuantitytemp: ElementRef;

  constructor(
    private global: GlobalService,
    public dialogRef: MatDialogRef<ReelDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.fieldNames=this.data.propFields
    if(!this.data.fromtrans) {
      this.reelOrder = this.data.hvObj.order
      this.reelLot = this.data.hvObj.lot
      this.reelExpDate = this.data.hvObj.expdate
      this.reelUF1 = this.data.hvObj.uf1
      this.reelUF2 = this.data.hvObj.uf2
      this.reelWarehouse = this.data.hvObj.warehouse
      this.reelQty = this.data.gReelQty
      this.reelNotes = this.data.hvObj.notes
      this.wareHouseSensitivity = this.data.itemObj.whseRequired
    }
    else {
      this.reelOrder = this.data.fromtrans.reelOrder
      this.reelLot = this.data.fromtrans.reelLot
      this.reelExpDate = this.data.fromtrans.reelExpDate
      this.reelUF1 = this.data.fromtrans.reelUF1
      this.reelUF2 = this.data.fromtrans.reelUF2
      this.reelWarehouse = this.data.fromtrans.reelWarehouse
      this.reelQty = this.data.gReelQty
      this.reelNotes = this.data.fromtrans.reelNotes
      this.wareHouseSensitivity = this.data.itemObj.whseRequired
    }
  }

  ngAfterViewInit() {
    this.checkWareHouse()
    this.field_focus.nativeElement.focus();
  }

  checkWareHouse(){
    this.reelQuantitytemp.nativeElement.focus()
    if(this.wareHouseSensitivity) {
      this.wareHouseSensitivity = true;
      if(!this.reelWarehouse) setTimeout(() => { this.openWareHouse() }, 300);
    }
    else {
      this.reelWarehouse = '';
      this.wareHouseSensitivity = false;
    }
  }

  reelDetailSubmit(){
    if(this.reelQty == undefined || this.reelQty == ""){
      const dialogRef:any = this.global.OpenDialog(AlertConfirmationComponent, {
        height: 'auto',
        width: '560px',
        data: {
          message: 'You must provide a quantity for this reel.',
        },
        autoFocus: DialogConstants.autoFocus,
        disableClose:true,
      });

      dialogRef.afterClosed().subscribe((result) => { if(result) return; });
    }
    
    if(this.reelLot == '') this.reelLot = 0;

    if(this.wareHouseSensitivity && (this.reelWarehouse == '') && this.reelQty != undefined) {
      const dialogRef:any = this.global.OpenDialog(AlertConfirmationComponent, {
        height: 'auto',
        width: '560px',
        data: {
          message: 'This item is warehouse sensitive.  Assign a warehouse to the reel in order to create the transaction.',
        },
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => { if(result) this.openWareHouse(); });
    } else if(this.wareHouseSensitivity && (this.reelWarehouse != '') && this.reelQty != undefined && this.reelQty != "") {
      let reelDetail = [
        { reelQty:this.reelQty },
        {
          reelOrder: this.reelOrder,
          reelLot: this.reelLot,
          reelUF1: this.reelUF1,
          reelUF2: this.reelUF2,
          reelWarehouse: this.reelWarehouse,
          reelExpDate: this.reelExpDate,
          reelNotes: this.reelNotes,
          reelQty: this.reelQty,
        }
      ];
      this.dialogRef.close(reelDetail);
    }

    if(!this.wareHouseSensitivity && this.reelQty != undefined && this.reelQty != "") {
      let reelDetail = [
        { reelQty:this.reelQty },
        {
          reelOrder: this.reelOrder,
          reelLot: this.reelLot,
          reelUF1: this.reelUF1,
          reelUF2: this.reelUF2,
          reelWarehouse: this.reelWarehouse,
          reelExpDate: this.reelExpDate,
          reelNotes: this.reelNotes,
          reelQty: this.reelQty,
        }
      ];
      this.dialogRef.close(reelDetail);
    }
  }

  openWareHouse(){
    let dialogRef:any = this.global.OpenDialog(WarehouseComponent, {
      height: 'auto',
      width: '640px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        mode: 'addlocation',
        check:'fromReelDetail'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== true && result !== false) {
        this.reelWarehouse = result;
        this.reelQuantitytemp.nativeElement.focus()
      }
      if (result == 'clear') this.reelWarehouse = '';
    });
  }

  fetchReelQty(event){
    if(event.keyCode=='13') this.reelDetailSubmit();
  }
}
