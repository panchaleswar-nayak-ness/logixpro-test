import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FunctionAllocationComponent } from '../function-allocation/function-allocation.component';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: []
})
export class ConfirmationDialogComponent implements OnInit {
  dialog_msg: string = '';
  dialog_heading: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialog: MatDialog, 
  private toastr: ToastrService, 
  public dialogRef: MatDialogRef<FunctionAllocationComponent>) { }

  ngOnInit(): void {
    this.dialog_msg = this.data?.message;
    this.dialog_heading = this.data?.heading;
  }

  confirmOK()
  {
    this.dialogRef.close('Yes');
  }

}
export { FunctionAllocationComponent };

