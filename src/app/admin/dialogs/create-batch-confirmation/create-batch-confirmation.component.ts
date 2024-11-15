import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { GlobalService } from 'src/app/common/services/global.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { BmToteidEntryComponent } from '../bm-toteid-entry/bm-toteid-entry.component';
import { DialogConstants } from 'src/app/common/constants/strings.constants';


@Component({
  selector: 'app-create-batch-confirmation',
  templateUrl: './create-batch-confirmation.component.html',
  styleUrls: [],
})
export class CreateBatchConfirmationComponent implements OnInit {
  isChecked = true;
  pickToTotes: any;
  transType: any;
  selectedList: any;
  nextToteID: any;
  batchid: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateBatchConfirmationComponent>,
    private global: GlobalService,
  ) { }

  ngOnInit(): void {
    this.pickToTotes = this.data.pickToTotes;
    this.transType = this.data.transType;
    this.selectedList = this.data.selectedOrderList;
    this.nextToteID = this.data.nextToteID;
    this.batchid = this.data.batchid;
  }
  createBatch() {
    if (this.pickToTotes) {
      this.openBatchConfirmationDialog();
    }
    else {
      this.dialogRef.close(true);
    }
  }
  checkOptions(event: MatCheckboxChange): void {
    if (event.checked) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
  }

  openBatchConfirmationDialog() {
    let dialogRefTote;
    dialogRefTote = this.global.OpenDialog(BmToteidEntryComponent, {
      height: 'auto',
      width: '990px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        selectedOrderList: this.selectedList,
        nextToteID: this.nextToteID,
        type: this.transType,
        view: 'batchmanager',
        batchid: this.batchid
      }
    });
    dialogRefTote.afterClosed().subscribe((result) => {
      this.dialogRef.close(true);
    });
  }
}
