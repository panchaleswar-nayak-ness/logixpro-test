import { Component, Inject, OnInit } from '@angular/core';
import { DialogConstants, Style } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { BpNumberSelectionComponent } from '../bp-number-selection/bp-number-selection.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';

@Component({
  selector: 'app-bp-full-tote',
  templateUrl: './bp-full-tote.component.html',
  styleUrls: ['./bp-full-tote.component.scss']
})
export class BpFullToteComponent implements OnInit {

  NextToteID: any;
 
  public iBulkProcessApiService: IBulkProcessApiService;
  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    private global:GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
   }

  ngOnInit(): void {
    this.data.PutNewToteQty = 0;
    this.data.PutFullToteQty = this.data.transactionQuantity;
    this.BatchNextTote();
  }

  BatchNextTote() {
    this.iBulkProcessApiService.BatchNextTote().subscribe((res: any) => {
      this.NextToteID = res;
    })
  }

  openNumberSelection(){
    const dialogRef1: any = this.global.OpenDialog(BpNumberSelectionComponent, {
      height: 'auto',
      width: Style.w402px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        completedQuantity: this.data.PutNewToteQty,
        from: "qunatity put in new tote"
      }
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if(resp){
        this.data.PutNewToteQty = resp;
        this.data.PutFullToteQty = this.data.PutFullToteQty - resp; 
      }
    });
  }

  CreateNextToteID(){
    this.data.NewToteID = this.NextToteID;
  }
}
