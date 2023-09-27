import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog'; 
import { BatchDeleteConfirmationComponent } from '../batch-delete-confirmation/batch-delete-confirmation.component';

@Component({
  selector: 'app-batch-delete',
  templateUrl: './batch-delete.component.html',
  styleUrls: [],
})
export class BatchDeleteComponent implements OnInit {
  @ViewChild('batchId_focus') batchId_focus: ElementRef;
  toteID = '';
  batchID = '';
  transType = 'Put Away';
  clearBatchTote: string = '';
  deleteAllDisable:any;
  enableClear=false;
  deleteBtnHide = false
  constructor(
    public dialogRef: MatDialogRef<BatchDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
   
    this.toteID = this.data.toteId;
    this.batchID = this.data.batchId;
    this.deleteAllDisable=this.data.deleteAllDisable;
    this.clearBatchTote=this.data.deleteAllDisable?'clearTote':'clearBatch';
    this.enableClear=this.data?.enableClear
    this.deleteBtnHide = this.data?.delButtonHide ? this.data.delButtonHide : false
  }
  ngAfterViewChecked(): void {
    this.batchId_focus.nativeElement.focus();
  }
  batchTotesDelete(deAllocate?) {
    let payLoad = {
      batch: this.clearBatchTote === 'clearBatch',
      toteID: this.toteID,
      batchID: this.batchID,
      transType: this.transType,
      deAllocate: deAllocate,
      pageFrom: 'Process',
      wsid: this.data.wsid,
      username: this.data.userName,
    };

    let clearBatchTote = this.clearBatchTote === 'clearBatch';
    const dialogRef = this.dialog.open(BatchDeleteConfirmationComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'deallocate_clear_batch',
        
        heading: deAllocate 
          ? `Clear & Deallocate ${clearBatchTote ? 'Batch' : 'Tote'}` 
          : `Clear ${clearBatchTote ? 'Batch' : 'Tote'}`,
        
          message: deAllocate
          ? `Are you sure you want to Clear & Deallocate ${clearBatchTote ? `Batch: ${this.batchID} ?` : `Tote: ${this.toteID}`}`
          : `Are you sure you want to Clear ${clearBatchTote ? `Batch: ${this.batchID} ?` : `Tote: ${this.toteID}`}`,
        payload: payLoad,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if(res.isExecuted){
        this.dialogRef.close({isExecuted : true, isDeleted : this.clearBatchTote === 'clearBatch'})
      }else{
        return
      }
    });
  }

  allBatchDelete() {
    let payLoad = {

      wsid: this.data.wsid,
      username: this.data.userName,
    };
    const dialogRef = this.dialog.open(BatchDeleteConfirmationComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete_all_batch',
        heading:'Delete All Batches',
        message: 'Are you sure you want to Clear & Deallocate All Batches',
        payload: payLoad,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
       if(res.isExecuted) this.dialogRef.close({isDeleted:true})
    });
  }
}
