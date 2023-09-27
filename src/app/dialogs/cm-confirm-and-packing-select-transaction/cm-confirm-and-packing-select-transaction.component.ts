import { Component, Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from 'src/app/init/auth.service';
import { CmConfirmAndPackingProcessTransactionComponent } from '../cm-confirm-and-packing-process-transaction/cm-confirm-and-packing-process-transaction.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';

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
 userData:any = {}; 
 confPackTransTable:any;
 contID:any;
 id:any;
 constructor(private Api:ApiFuntions,private authService: AuthService,private global:GlobalService,
  private toast:ToastrService,private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<CmConfirmAndPackingSelectTransactionComponent>,) {
  this.userData = this.authService.userData();
  this.confPackTransTable = this.data.confPackTransTable;
  this.orderNumber = this.data.orderNumber;
  this.contID = this.data.contID;
  this.id = this.data.id;
  this.itemNumber = this.data.ItemNumber;
 } 

  ngOnInit(): void {
    this.ConfPackProc();
  }

  async ConfPackProc(){
    let Obj:any = { 
        "orderNumber": this.orderNumber,
        "itemNumber":this.itemNumber 
    };
    this.Api.ConfPackSelectDT(Obj).subscribe((response:any) => { 
      this.confPackSelectTable = response.data;  
    });
  } 
  
openScanItem(ItemNumber:any,id: any) {
  let index= this.confPackTransTable.findIndex(x=>x.sT_ID == id);
  this.confPackTransTable[index].active = true;
  let dialogRef = this.dialog.open(CmConfirmAndPackingProcessTransactionComponent, {
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
      modal: "",
      userName: this.userData.userName,
      wsid: this.userData.wsid
    };
    this.Api.ConfPackProcModalUpdate(obj).subscribe((res:any) => {
  
      if (res.data == "Fail") {
        this.toast.error('An error has occurred', 'Error!', { positionClass: 'toast-bottom-right',timeOut: 2000});  
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
