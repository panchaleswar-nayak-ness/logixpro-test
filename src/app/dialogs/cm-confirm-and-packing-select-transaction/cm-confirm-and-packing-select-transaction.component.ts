import { Component, Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
 
import { CmConfirmAndPackingProcessTransactionComponent } from '../cm-confirm-and-packing-process-transaction/cm-confirm-and-packing-process-transaction.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { IConsolidationApi } from 'src/app/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/services/consolidation-api/consolidation-api.service';

@Component({
  selector: 'app-cm-confirm-and-packing-select-transaction',
  templateUrl: './cm-confirm-and-packing-select-transaction.component.html',
  styleUrls: []
})
export class CmConfirmAndPackingSelectTransactionComponent implements OnInit {
 
 itemNumber: any;
 orderNumber: any;
  confPackSelectTable:any[] = [];
  preferencesData:any;

 displayedColumns: string[] = ['sT_ID','itemNumber', 'lineNumber','completedQuantity',   'transactionQuantity']; 
 dataSourceList:any
 confPackTransTable:any;
 contID:any;
 id:any;
 public IconsolidationAPI : IConsolidationApi;

 constructor(
    public consolidationAPI : ConsolidationApiService, 
    private global:GlobalService, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CmConfirmAndPackingSelectTransactionComponent>,) {
    this.confPackTransTable = this.data.confPackTransTable;
    this.orderNumber = this.data.orderNumber;
    this.contID = this.data.contID;
    this.id = this.data.id;
    this.itemNumber = this.data.ItemNumber;
    this.IconsolidationAPI = consolidationAPI;
  } 

  ngOnInit(): void {
    this.ConfPackProc();
  }

  async ConfPackProc(){
    let Obj:any = { 
        "orderNumber": this.orderNumber,
        "itemNumber":this.itemNumber 
    };
    this.IconsolidationAPI.ConfPackSelectDT(Obj).subscribe((response:any) => { 
      this.confPackSelectTable = response.data;  
    });
  } 
  
openScanItem(ItemNumber:any,id: any) {
  let index= this.confPackTransTable.findIndex(x=>x.sT_ID == id);
  this.confPackTransTable[index].active = true;
  let dialogRef:any = this.global.OpenDialog(CmConfirmAndPackingProcessTransactionComponent, {
    height: 'auto',
    width: '96vw',
    autoFocus: '__non_existing_element__',
      disableClose:true,
    data: {ItemNumber:ItemNumber,orderNumber:this.orderNumber,contID:this.contID,confPackTransTable:this.confPackTransTable,id:id}
  })
  dialogRef.afterClosed().subscribe(result => {
    if(result == 'ConfirmedPacked'){
      this.ConfPackProc();
    }  
  })
 }
  async ConfPackSelectTableClick(id){
    let obj : any = {
      id: id,
      orderNumber: this.orderNumber,
      containerID: this.contID,
      modal: ""
    };
    this.IconsolidationAPI.ConfPackProcModalUpdate(obj).subscribe((res:any) => {
  
      if (res.data == "Fail") {
        this.global.ShowToastr('error','An error has occurred', 'Error!');  
    } else if (res.data == "Modal") {
       this.openScanItem(this.itemNumber,id);
       
     
    }else {
      //edit table
      for (let x = 0; x < this.confPackTransTable.length; x++) {
          let tabID = this.confPackTransTable[x].sT_ID;
          if (id == tabID) {
            // click active 
          };
      }; 



      if(this.preferencesData?.autoPrintContLabel){
        this.global.Print(`FileName:PrintConfPackLabel|OrderNum:${this.orderNumber}|contID:${this.contID}`);
      
      }
      if( this.preferencesData?.autoPrintContPL){
        this.global.Print(`FileName:PrintConfPackPrintCont|OrderNum:${this.orderNumber}|contID:${this.contID}`);
      
      }
      if(this.preferencesData?.autoPrintOrderPL){
        this.global.Print(`FileName:PrintConfPackPackList|OrderNum:${this.orderNumber}`);
      
      }
      //remove items from modal table here
      this.dialogRef.close('true');
  
   
  } ;
  });

}
 
}
