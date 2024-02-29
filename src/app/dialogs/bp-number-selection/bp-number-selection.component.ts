import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogConstants, ResponseStrings, Style } from 'src/app/common/constants/strings.constants';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-bp-number-selection',
  templateUrl: './bp-number-selection.component.html',
  styleUrls: ['./bp-number-selection.component.scss']
})
export class BpNumberSelectionComponent implements OnInit {

  newQuantity: string = '';
  Prefernces: any;
  public iBulkProcessApiService: IBulkProcessApiService;
  from:string = "completed quantity";

  constructor(
    public dialogRef: MatDialogRef<BpNumberSelectionComponent>,
    public bulkProcessApiService: BulkProcessApiService,
    private global: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
    this.from = this.data.from;
  }

  ngOnInit(): void {
    this.getworkstationbulkzone();
  }

  getworkstationbulkzone() {
    this.iBulkProcessApiService.bulkPreferences().subscribe((res: any) => {
      this.Prefernces = res;
    })
  }

  add(string: string) {
    this.newQuantity = this.newQuantity + string;
  }

  done() {
    if(this.from == "completed quantity"){
      if (this.Prefernces.systempreferences.zeroLocationQuantityCheck) {
        const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
          height: 'auto',
          width: Style.w560px,
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
          data: {
            message: `Is this location empty after this Pick?`,
            message2: `Touch ‘Yes’ to update the location quantity to zero.
            Touch ‘No’ to type in the actual location quantity after this Pick.
            Touch ‘Cancel’ to re-enter quantity picked.`,
            heading: 'Location Empty?',
            buttonFields: true,
            threeButtons: true
          },
        });
        dialogRef1.afterClosed().subscribe(async (resp: any) => {
          if (resp == ResponseStrings.Yes) {
            this.dialogRef.close({newQuantity:this.newQuantity,type:ResponseStrings.Yes});
          }
          else if (resp == ResponseStrings.No) {
            this.dialogRef.close({newQuantity:this.newQuantity,type:ResponseStrings.No});
          }
          else if (resp == ResponseStrings.Cancel) {
            this.dialogRef.close({newQuantity:this.newQuantity,type:ResponseStrings.Cancel});
          }
        });
      }
    }
    else if(this.from == "qunatity put in new tote"){
      this.dialogRef.close(this.newQuantity);
    }
  }
}
