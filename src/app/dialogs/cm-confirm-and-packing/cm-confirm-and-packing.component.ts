import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
 
import { AuthService } from 'src/app/common/init/auth.service';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { CmConfirmAndPackingProcessTransactionComponent } from '../cm-confirm-and-packing-process-transaction/cm-confirm-and-packing-process-transaction.component';
import { CmConfirmAndPackingSelectTransactionComponent } from '../cm-confirm-and-packing-select-transaction/cm-confirm-and-packing-select-transaction.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import {  LiveAnnouncerMessage ,ResponseStrings,KeyboardKeys,StringConditions,ToasterTitle,ToasterType,DialogConstants,Style,TableConstant,ColumnDef,UniqueConstants, Placeholders, ToasterMessages} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-cm-confirm-and-packing',
  templateUrl: './cm-confirm-and-packing.component.html',
  styleUrls: ['./cm-confirm-and-packing.component.scss']
})
export class CmConfirmAndPackingComponent implements OnInit {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  itemNumber: string = this.fieldMappings.itemNumber;
  scannedItemNumber: string = '';
  placeholders = Placeholders;
  @ViewChild('orderFocus') orderFocus: ElementRef;
  orderNumber:any ;
  preferencesData:any;
  toteTable:any;
  // itemNumber:any;
  transTable:any;
  oldtransTable:any;
  contIDDrop:any[]=[];
  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild('MatSort2') sort2: MatSort;
  confPackEnable:any; 
  isLoading:boolean = false;
  contID:any; 
  reasons:any[]=[];
  shipComp:any;
  printPrefs:any={}; 
  isDisabled:boolean  = false;
 displayedColumns: string[] = [ColumnDef.ToteID, 'stagingLocation']; 
userData:any={}; 
@ViewChild('paginator1') paginator1: MatPaginator;
@ViewChild('paginator2') paginator2: MatPaginator;
displayedColumnsForItems: string[] = ['sT_ID','itemNumber', TableConstant.LineNumber,   ColumnDef.TransactionQuantity, TableConstant.completedQuantity, 'containerID',
 'shipQuantity', 'complete']; 

 public iConsolidationAPI : IConsolidationApi;
 
 constructor(
    public consolidationAPI : ConsolidationApiService,
    public authService: AuthService,
    
    private global:GlobalService, 
    public route: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _liveAnnouncer: LiveAnnouncer,
    public dialogRef: MatDialogRef<any>) { 

    this.userData = this.authService.userData();
    this.orderNumber = this.data.orderNumber;
    this.iConsolidationAPI = consolidationAPI;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.toteTable = []; 
    this.transTable = [];
    this.contIDDrop = [];
    this.confPackEnable = null;
    this.contID = null;
    this.reasons = [];
    this.shipComp = null;
    this.printPrefs = {};  
      this.ConfirmAndPackingIndex(); 
   
  }
  ngAfterViewInit(): void {
    this.orderFocus.nativeElement.focus();
  }
  async NextContID(){ 
    let obj : any = {
      orderNumber: this.orderNumber
    };
   this.iConsolidationAPI.SelContIDConfirmPack(obj).subscribe((res:any) => {
    if(res.isExecuted)
    {
      if(res.data == ''){
        this.global.ShowToastr(ToasterType.Error,"An error has occurred",ToasterTitle.Error);
        console.log("SelContIDConfirmPack",res.responseMessage);
      }else{
        this.getPreferences();
        if(this.preferencesData?.autoPrintContPL){
          this.global.Print(`FileName:PrintConfPackPrintCont|OrderNum:${this.orderNumber}|contID:${this.contID}`);
        }
        this.contID = res.data;
  
      }
    }
    else {
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      console.log("SelContIDConfirmPack",res.responseMessage);
    }

    
   });
}


async UnPack(id:any){  
  this.iConsolidationAPI.ShipTransUnPackUpdate({id:id}).subscribe((res:any) => {
    if(res)
    {
      if (res.data == "Fail") {
        this.global.ShowToastr(ToasterType.Error,"An error has occurred", ToasterTitle.Error);
        console.log("ShipTransUnPackUpdate",res.responseMessage);  
    } else {  
       let index =  this.transTable.filteredData.findIndex(x=>x.sT_ID == id);
       this.transTable.filteredData[index].containerID = '';
       this.transTable.filteredData[index].complete = false; 
    }
    }
    else {
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      console.log("ShipTransUnPackUpdate",res.responseMessage);
    }
  
  ;
  });
 
}
getPreferences() {
  let payload = {
    type: '',
    value: ''
  };

  this.iConsolidationAPI
    .ConsoleDataSB(payload)
    .subscribe((res) => {
      if (res.isExecuted && res.data) {
        this.preferencesData = res.data.cmPreferences;
 
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ConsoleDataSB",res.responseMessage);

      }
      
    });
}
 
ConfirmAndPackingIndex(){ 


if(this.orderNumber != ""){
  let obj : any = {
    orderNumber: this.orderNumber
  };
 this.iConsolidationAPI.ConfirmAndPackingIndex(obj).subscribe((res:any) => {
  if (res.isExecuted && res.data)
  {
    this.orderNumber = res.data.orderNumber;

    this.contIDDrop = res.data.confPackContIDDrop;
    this.confPackEnable = res.data.confPackEnable;
    this.contID = res.data.contIDConfirmPack;
   
    this.reasons = res.data.adjustmentReason;
    this.shipComp = res.data.confPackShipComp;
    this.printPrefs = res.data.confPackPrintPrefs; 
    this.isLoading = false; 
    this.toteTable =  new MatTableDataSource(res.data.confPackToteTable);
    this.transTable =  new MatTableDataSource(res.data.confPackShipTransTable);
    this.toteTable.paginator = this.paginator1;
    this.transTable.paginator = this.paginator2;
  }
  else {
    this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
    console.log("ConfirmAndPackingIndex",res.responseMessage);
  } 
  

});
}
}
async ClickConfirmAll(){
  this.getPreferences();
  let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
    height: 'auto',
    width: Style.w560px,
    autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    data: {
      message: "Confirm All transactions? This will mark this entire order as confirmed and packed.",
    },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result == ResponseStrings.Yes) { 
    let obj : any = {
      orderNumber:this.orderNumber,
      containerID: this.contID
    };
   this.iConsolidationAPI.ConfirmAllConfPack(obj).subscribe((res:any) => {
    if(res)
    {
      if (res.data == "Fail") {
        this.global.ShowToastr(ToasterType.Error,'An error has occurred', ToasterTitle.Error);
        console.log("ConfirmAllConfPack",res.responseMessage); 
    } else { 
      if(this.preferencesData?.autoPrintContLabel){
        this.global.Print(`FileName:PrintConfPackPrintCont|OrderNum:${this.orderNumber}|contID:${this.contID}`);
      }
      if(this.preferencesData?.autoPrintContPL){
        setTimeout(() => {
          this.global.Print(`FileName:PrintConfPackPrintCont|OrderNum:${this.orderNumber}|contID:${this.contID}`);
        }, 2000); 
        
      }
      if(this.preferencesData?.autoPrintOrderPL){
        setTimeout(() => {
          this.global.Print(`FileName:PrintConfPackPackList|OrderNum:${this.orderNumber}`);
        }, 3500); 
        
      }
  
      this.ConfirmAndPackingIndex(); 
      }
    }
    else {
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      console.log("ConfirmAllConfPack",res.responseMessage);
    }
   
  });
}
});
  
} 
openScanItem(ItemNumber:any,id: any) {
  let index= this.transTable.filteredData.findIndex(x=>x.sT_ID == id);
  this.transTable.filteredData[index].active = true; 
  this.global.OpenDialog(CmConfirmAndPackingProcessTransactionComponent, {
    height: 'auto',
    width: '96vw',
    autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    data: {ItemNumber:ItemNumber,orderNumber:this.orderNumber,contID:this.contID,confPackTransTable:this.transTable,id:id,reasons:this.reasons}
  })
 }
 
announceSortChange1(sortState: Sort) {  
  if (sortState.direction) {
    // Announce the sort direction, and the fact that sorting is cleared.
    this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  } else {
    this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
  }

  // Set the data source's sort property to the new sort.
  this.toteTable.sort = this.sort1;

}
announceSortChange2(sortState: Sort) {    
  if (sortState.direction) {
    // Announce the sort direction, and the fact that sorting is cleared.
    this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  } else {
    this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
  }

  // Set the data source's sort property to the new sort.
  this.transTable.sort = this.sort2; 
}

 openSelectTransaction(ItemNumber:any,id: any) {
  let index= this.transTable.filteredData.findIndex(x=>x.sT_ID == id);
  this.transTable.filteredData[index].active = true;
  let dialogRef:any = this.global.OpenDialog(CmConfirmAndPackingSelectTransactionComponent, {
    height: 'auto',
    width: '96vw',
    autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    data: {ItemNumber:ItemNumber,orderNumber:this.orderNumber,contID:this.contID,confPackTransTable:this.transTable,id:id}
  })
  dialogRef.afterClosed().subscribe(result => {
    if(result && result.isExecuted){
      if (!result.selectedId) {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.DialogClosedWithoutSelectedId, ToasterTitle.Error);
        return;
      }
      const selectedTransaction = this.transTable.filteredData.find(x => x.sT_ID == result.selectedId);
      if (!selectedTransaction) {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.TransactionNotFound(result.selectedId), ToasterTitle.Error);
        return;
      }
      selectedTransaction.containerID = result.containerID ?? this.contID;
      selectedTransaction.complete = true;
      if (result.containerID) {
        this.contID = result.containerID;
      }
    } else if(result == StringConditions.True){
      this.transTable.filteredData[index].containerID = this.contID;
      this.transTable.filteredData[index].complete = true; 
    }  
  })
 }
 ItemKeyUp(){
  setTimeout(() => {
    if(this.oldtransTable?.filteredData && this.oldtransTable?.filteredData?.length > 0){
      this.transTable = new MatTableDataSource(this.oldtransTable.filteredData.filter(x=>  x.itemNumber.indexOf(this.scannedItemNumber) > -1));  
    }else{
      this.oldtransTable = this.transTable;
      this.transTable = new MatTableDataSource(this.transTable.filteredData.filter(x=>  x.itemNumber.indexOf(this.scannedItemNumber) > -1));  
    }
  }, 10);
 }
async ScanItemNum($event:any){  
  if($event.key == KeyboardKeys.Enter){ 
let searchCount = 0;
let id;
let contID;
for (const item of this.transTable.filteredData) {
    let itemNum = item.itemNumber;
    let complete = item.complete;
    if (this.scannedItemNumber.toLowerCase() == itemNum.toLowerCase() && !complete) {
        searchCount += 1;
        id = item.sT_ID;
    };
};
 
if(searchCount == 0){ 
  this.global.ShowToastr(ToasterType.Error,"The desired item number was not found or is already confirmed and packed",'Item Number Issue'); 
} else if (searchCount == 1) {
  let obj : any = {
    id: id,
    orderNumber: this.orderNumber,
    containerID: this.contID,
    modal: ""
  };
 this.iConsolidationAPI.ConfPackProcModalUpdate(obj).subscribe((res:any) => {
   
  if (res.data == "Fail") {
    this.global.ShowToastr(ToasterType.Error,'An error has occurred', ToasterTitle.Error);
    console.log("ConfPackProcModalUpdate",res.responseMessage);  
} else if (res.data == "Modal") {
    //show modal here
  this.openScanItem($event.target.value,id);  
} else {  
  this.getPreferences();
  let index =  this.transTable.filteredData.findIndex(x=>x.sT_ID == id);
  this.transTable.filteredData[index].containerID = this.contID;
  this.transTable.filteredData[index].complete = true; 
    if(this.preferencesData?.autoPrintContLabel){
      this.global.Print(`FileName:PrintConfPackLabel|OrderNum:${this.orderNumber}|contID:${this.contID}`);
    
    }
    if(this.preferencesData?.autoPrintContPL){
      this.global.Print(`FileName:PrintConfPackPrintCont|OrderNum:${this.orderNumber}|contID:${this.contID}`);
    
    }
    if(this.preferencesData?.autoPrintOrderPL){
      this.global.Print(`FileName:PrintConfPackPackList|OrderNum:${this.orderNumber}`);
    
    }

}
 });
  }else {
   this.openSelectTransaction($event.target.value,id);
}
}
}
async ConfirmedPacked() {
  this.isDisabled = true; 
  this.contID = null;
};

printPackList(){
  this.global.Print(`FileName:PrintConfPackPackList|OrderNum:${this.orderNumber}`);
}

print(type:any){
  if(type == 'list'){
    this.global.Print(`FileName:PrintConfPackPrintCont|OrderNum:${this.orderNumber}|ContID:${this.contID}`);
  }
  else if (type == TableConstant.label){
    this.global.Print(`FileName:PrintConfPackLabel|OrderNum:${this.orderNumber}|ContID:${this.contID}`,UniqueConstants.Ibl);
  }
  else{
    this.global.Print(`FileName:PrintConfPackPrintCont|OrderNum:${this.orderNumber}|ContID:${this.contID}`);
    setTimeout(()=>{
      this.global.Print(`FileName:PrintConfPackLabel|OrderNum:${this.orderNumber}|ContID:${this.contID}`,UniqueConstants.Ibl);
    }, 2000);
  }
}

itemLabel(element:any){
  this.global.Print(`FileName:PrintConfPackItemLabel|OrderNum:${this.orderNumber}|ST_ID:${element.sT_ID}`);  
}

selectRow(row: any) {
  this.transTable.filteredData.forEach(element => {
    if(row != element){
      element.selected = false;
    }
  });
  const selectedRow = this.transTable.filteredData.find((x: any) => x === row);
  if (selectedRow) {
    selectedRow.selected = !selectedRow.selected;
  }
}

}

