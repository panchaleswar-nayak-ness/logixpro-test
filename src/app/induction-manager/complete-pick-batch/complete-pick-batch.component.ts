import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { CpbBlossomToteComponent } from 'src/app/dialogs/cpb-blossom-tote/cpb-blossom-tote.component';
import { ShortTransactionComponent } from 'src/app/dialogs/short-transaction/short-transaction.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import labels from '../../labels/labels.json';

@Component({
  selector: 'app-complete-pick-batch',
  templateUrl: './complete-pick-batch.component.html',
  styleUrls: ['./complete-pick-batch.component.scss']
})
export class CompletePickBatchComponent{

  displayedColumns: string[] = ['order_no', 'tote_id', 'item_number', 'description', 'transaction_qty', 'location', 'zone','carousel','row','shelf','bin', 'action'];
  tableData: any = [];
  dataSourceList: any;
  batchId: string = "";
  toteId: string = "";
  showToteCol: boolean = false;
  completeBatchEnable: boolean = false;
  blossomToteEnable: boolean = false;
  @ViewChild('BatchId') BatchIdField: ElementRef;
  @ViewChild('ToteId') ToteIdField: ElementRef;
  sortColumn: number = 1;
  SortOrder: string = "asc";
  startRow:number = 0;
  endRow:number = 10;
  totalTransactions: number = 0;

  constructor(
    private dialog: MatDialog,
    private Api: ApiFuntions,
    private toastr: ToastrService,
  ) { }

  ngAfterViewInit() {
    setTimeout(()=>{
      this.BatchIdField.nativeElement.focus();  
    }, 500);
  }

  BatchPickIDKeyup(event: any) {
    this.showToteCol = false;
    this.toteId = "";
    if (event.keyCode === 13 && this.batchId != "") {
      this.resetPagination();
      this.pickBatchTransactionTable();
    }
  }

  ToteIDKeyup(event: any) {
    if (event.keyCode === 13 && this.toteId != "") {
      this.resetPagination();
      this.pickBatchTransactionTable();
    }
  }

  pickBatchTransactionTable() {
    let payload: any = {
      ToteID: this.toteId,
      StartRow: this.startRow == 0 ? this.startRow : this.startRow + 1,
      EndRow: this.endRow,
      SortColumn: this.sortColumn,
      SortOrder: this.SortOrder
    };
    if(this.batchId != ""){
      payload.BatchID = this.batchId;
    }
    this.Api.getPickBatchTransactionTable(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.tableData = res.data;
        this.blossomToteEnable = false;
        this.showToteCol = false;
        if (res.data.length > 0) {
          this.totalTransactions = res.data[0].totalCount;
          this.showToteCol = true;
          this.completeBatchEnable = true;
          if (this.toteId != "") {
            this.blossomToteEnable = true;
          }
          else{
            setTimeout(()=>{
              this.ToteIdField.nativeElement.focus();  
            }, 500);
          }
        }
        else {
          if (this.batchId != "" && this.toteId == "") {
            this.toastr.error("No open transactions for the entered batch", 'No Rows', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
          else if (this.batchId != "" && this.toteId != "") {
            this.toastr.error("No open transaction for that tote in the batch", 'No Rows', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
            this.toteId = "";
            this.BatchPickIDKeyup({ keyCode: 13 });
          }
          this.completeBatchEnable = false;
        }
      }
    });
  }

  clearScreen() {
    if(this.batchId == ""){
      return;
    }
    this.batchId = "";
    this.toteId = "";
    this.showToteCol = false;
    this.blossomToteEnable = false;
    this.completeBatchEnable = false;
    this.pickBatchTransactionTable();
  }

  ShortTransactionDialogue(element:any) {
    const dialogRef = this.dialog.open(ShortTransactionComponent, {
      height: 'auto',
      width: '932px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        selectedTransaction: element,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result === 'object' && result !== null) {
        this.pickBatchTransactionTable();
      }
    });
  }

  CpbBlossomToteDialogue() {
    const dialogRef = this.dialog.open(CpbBlossomToteComponent, {
      height: '640px',
      width: '932px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        transactions: this.tableData,
        toteId : this.toteId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result === 'object' && result !== null) {
        this.toteId = result.newToteID;
        this.pickBatchTransactionTable();
      }
    });
  }

  CompleteTransaction(element:any){
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        heading: 'Complete Transaction',
        message: 'Complete this transaction?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.Api.completeTransaction({Id:element.id}).subscribe((res: any) => {
          if(res.isExecuted){
            this.pickBatchTransactionTable();
            this.toastr.success(labels.alert.update, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
          else{
            this.toastr.error("An error occured completing this transaction", 'Error', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
        });
      }
    });
  }

  CompleteBatch(){
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        heading: 'Complete Batch',
        message: 'Complete all remaining in this batch?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.Api.completePickBatch({batchId:this.batchId}).subscribe((res: any) => {
          if(res.isExecuted){
            this.clearScreen();
            this.toastr.success(labels.alert.update, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
          else{
            this.toastr.error("An error occured completing this transaction", 'Error', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
        });
      }
    });
  }

  sortColumns:any = [
    {dbColName:"Order Number",tabelColName:"order_no",sortColumnNumber:1},
    {dbColName:"Tote ID",tabelColName:"tote_id",sortColumnNumber:2},
    {dbColName:"Item Number",tabelColName:"item_number",sortColumnNumber:3},
    {dbColName:"Description",tabelColName:"description",sortColumnNumber:4},
    {dbColName:"Transaction Quantity",tabelColName:"transaction_qty",sortColumnNumber:5},
    {dbColName:"Location",tabelColName:"location",sortColumnNumber:6},
    {dbColName:"Zone",tabelColName:"zone",sortColumnNumber:7},
    {dbColName:"Carousel",tabelColName:"carousel",sortColumnNumber:8},
    {dbColName:"Row",tabelColName:"row",sortColumnNumber:9},
    {dbColName:"Shelf",tabelColName:"shelf",sortColumnNumber:10},
    {dbColName:"Bin",tabelColName:"bin",sortColumnNumber:11},
  ];

  announceSortChange(e: any) {
    console.log(e);
    this.sortColumn = this.sortColumns.filter((item: any) => item.tabelColName == e.active)[0].sortColumnNumber;
    this.SortOrder = e.direction;
    this.startRow = 0;
    this.endRow = 10;
    this.paginator.pageIndex = 0;
    this.pickBatchTransactionTable();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  handlePageEvent(e: PageEvent) { 
    this.startRow =  e.pageSize*e.pageIndex
    this.endRow =  (e.pageSize*e.pageIndex + e.pageSize)
    this.pickBatchTransactionTable();
  }

  resetPagination(){
    this.startRow = 0;
    this.endRow = 10;
    this.paginator.pageIndex = 0;
  }

  selectRow(row: any) {
    this.tableData.forEach(element => {
      if(row != element){
        element.selected = false;
      }
    });
    const selectedRow = this.tableData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }

}
