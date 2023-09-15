import { Component, OnInit, Inject } from '@angular/core';
import { CreateBatchConfirmationComponent } from '../create-batch-confirmation/create-batch-confirmation.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BmToteidEntryComponent } from '../bm-toteid-entry/bm-toteid-entry.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.scss'],
})
export class CreateBatchComponent implements OnInit {
  pickToTotes: any;
  transType: any;
  selectedList:any;
  nextToteID:any;
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateBatchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.pickToTotes = this.data.pickToTotes;
    this.transType = this.data.transType;
    this.selectedList=this.data.selectedOrderList;
    this.nextToteID=this.data.nextToteID;
  }

  /*
  Open modal for confirmation of creating a batch .
  result returns true to send back data to first dialog to create a batch and
  false to just close the dialog.
  */
  openBatchConfirmationDialog() {
    if (this.pickToTotes && this.transType.toLowerCase() === 'pick') {
      this.sharedService.updateBatchManagerObject({isCreate:true})
this.dialogRef.close();
      let dialogRefTote;
      dialogRefTote = this.dialog.open(BmToteidEntryComponent, {
        height: 'auto',
        width: '990px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data:{
          selectedOrderList:this.selectedList,
          nextToteID:this.nextToteID
        }
      });
      dialogRefTote.afterClosed().subscribe((result) => {
        this.dialogRef.close();
      });
      
    } else {
      let dialogRef;
      dialogRef = this.dialog.open(CreateBatchConfirmationComponent, {
        height: 'auto',
        width: '550px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dialogRef.close(true);
        } else {
          this.dialog.closeAll();
        }
      });
    }
  }
}
