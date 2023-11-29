import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { CpbBlossomToteComponent } from 'src/app/dialogs/cpb-blossom-tote/cpb-blossom-tote.component';
import { ShortTransactionComponent } from 'src/app/dialogs/short-transaction/short-transaction.component';
import labels from 'src/app/common/labels/labels.json';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { StringConditions, ToasterMessages, ToasterTitle, ToasterType ,Column,zoneType,DialogConstants,Style,TableConstant,UniqueConstants,ColumnDef} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-complete-pick-batch',
  templateUrl: './complete-pick-batch.component.html',
  styleUrls: ['./complete-pick-batch.component.scss']
})
export class CompletePickBatchComponent{

  displayedColumns: string[] = ['order_no', 'tote_id', 'item_number', UniqueConstants.Description, 'transaction_qty', 'location', TableConstant.zone,zoneType.carousel,Column.Row,TableConstant.shelf,'bin', ColumnDef.Action];
  tableData: any = [];
  dataSourceList: any;
  batchId: string = "";
  public iInductionManagerApi: IInductionManagerApiService;
  toteId: string = "";
  showToteCol: boolean = false;
  completeBatchEnable: boolean = false;
  blossomToteEnable: boolean = false;
  @ViewChild('BatchId') BatchIdField: ElementRef;
  @ViewChild('ToteId') ToteIdField: ElementRef;
  sortColumn: number = 1;
  sortOrder: string = UniqueConstants.Asc;
  startRow:number = 0;
  endRow:number = 10;
  totalTransactions: number = 0;

  constructor(
    private global:GlobalService,
    public inductionManagerApi: InductionManagerApiService,
  ) { 
    this.iInductionManagerApi = inductionManagerApi;
  }

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
      SortOrder: this.sortOrder
    };
    if(this.batchId != ""){
      payload.BatchID = this.batchId;
    }
    this.iInductionManagerApi.getPickBatchTransactionTable(payload).subscribe((res: any) => {
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
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.NoOpenTransactionsBatch,ToasterTitle.NoRows);
          }
          else if (this.batchId != "" && this.toteId != "") {
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.NoOpenTranscationTote, ToasterTitle.NoRows);
            this.toteId = "";
            this.BatchPickIDKeyup({ keyCode: 13 });
          }
          this.completeBatchEnable = false;
        }
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("getPickBatchTransactionTable",res.responseMessage);

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
    const dialogRef:any = this.global.OpenDialog(ShortTransactionComponent, {
      height: 'auto',
      width: '932px',
      autoFocus: DialogConstants.autoFocus,
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
    const dialogRef:any = this.global.OpenDialog(CpbBlossomToteComponent, {
      height: '640px',
      width: '932px',
      autoFocus: DialogConstants.autoFocus,
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
    let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        heading: 'Complete Transaction',
        message: 'Complete this transaction?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == StringConditions.Yes) {
        this.iInductionManagerApi.completeTransaction({Id:element.id}).subscribe((res: any) => {
          if(res.isExecuted){
            this.pickBatchTransactionTable();
            this.global.ShowToastr(ToasterType.Success,labels.alert.update, ToasterTitle.Success);
          }
          else{
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorOccuredTranscation, ToasterTitle.Error);
            console.log("completeTransaction",res.responseMessage);
          }
        });
      }
    });
  }

  CompleteBatch(){
    let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        heading: 'Complete Batch',
        message: 'Complete all remaining in this batch?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == StringConditions.Yes) {
        this.iInductionManagerApi.completePickBatch({batchId:this.batchId}).subscribe((res: any) => {
          if(res.isExecuted){
            this.clearScreen();
            this.global.ShowToastr(ToasterType.Success,labels.alert.update, ToasterTitle.Success);
          }
          else{
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorOccuredTranscation, ToasterTitle.Error);
            console.log("completePickBatch",res.responseMessage);
          }
        });
      }
    });
  }

  sortColumns:any = [
    {dbColName:Column.OrderNumber,tabelColName:"order_no",sortColumnNumber:1},
    {dbColName:Column.ToteID,tabelColName:"tote_id",sortColumnNumber:2},
    {dbColName:Column.ItemNumber,tabelColName:"item_number",sortColumnNumber:3},
    {dbColName:Column.Description,tabelColName:UniqueConstants.Description,sortColumnNumber:4},
    {dbColName:TableConstant.TransactionQuantity,tabelColName:"transaction_qty",sortColumnNumber:5},
    {dbColName:Column.Location,tabelColName:"location",sortColumnNumber:6},
    {dbColName:ColumnDef.Zone,tabelColName:TableConstant.zone,sortColumnNumber:7},
    {dbColName:TableConstant.Carousel,tabelColName:zoneType.carousel,sortColumnNumber:8},
    {dbColName:TableConstant.Row,tabelColName:Column.Row,sortColumnNumber:9},
    {dbColName:TableConstant.shelf,tabelColName:TableConstant.shelf,sortColumnNumber:10},
    {dbColName:TableConstant.Bin,tabelColName:"bin",sortColumnNumber:11},
  ];

  announceSortChange(e: any) {
    console.log(e);
    this.sortColumn = this.sortColumns.filter((item: any) => item.tabelColName == e.active)[0].sortColumnNumber;
    this.sortOrder = e.direction;
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
