import { Component, Inject, OnInit } from '@angular/core';
import { DialogConstants } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { BpNumberSelectionComponent } from '../bp-number-selection/bp-number-selection.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bp-full-tote',
  templateUrl: './bp-full-tote.component.html',
  styleUrls: ['./bp-full-tote.component.scss']
})
export class BpFullToteComponent implements OnInit {
 
  constructor(
    private global:GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.data.oldtransactionQuantity = data.transactionQuantity;
    this.data.NewToteID = null;
   }

  ngOnInit(): void {
  }
  openNumberSelection(){
    this.global.OpenDialog(BpNumberSelectionComponent, {
      height: 'auto',
      width: '402px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
  }
  CreateNextToteID(){
    if(!this.data.NewToteID) this.data.NewToteID = this.data.NextToteID;
    else this.data.NewToteID = this.data.NewToteID+1; 
  }
}
