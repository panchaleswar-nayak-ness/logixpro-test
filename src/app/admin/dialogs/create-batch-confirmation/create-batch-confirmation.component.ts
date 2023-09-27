import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { BmToteidEntryComponent } from '../bm-toteid-entry/bm-toteid-entry.component';

@Component({
  selector: 'app-create-batch-confirmation',
  templateUrl: './create-batch-confirmation.component.html',
  styleUrls: [],
})
export class CreateBatchConfirmationComponent implements OnInit {
  isChecked = true;
  pickToTotes: any;
  transType: any;
  selectedList:any;
  nextToteID:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateBatchConfirmationComponent>,
    private dialog: MatDialog,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.pickToTotes = this.data.pickToTotes;
    this.transType = this.data.transType;
    this.selectedList=this.data.selectedOrderList;
    this.nextToteID=this.data.nextToteID;
  }
  createBatch() {
    this.dialogRef.close(true);
  }
  checkOptions(event: MatCheckboxChange): void {
    if (event.checked) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
  }

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
