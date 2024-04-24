import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BulkPreferences } from 'src/app/common/Model/bulk-transactions';
import { SetTimeout } from 'src/app/common/constants/numbers.constants';
import { DialogConstants, ResponseStrings, Style, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { CustomValidatorService } from 'src/app/common/init/custom-validator.service';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-bp-number-selection',
  templateUrl: './bp-number-selection.component.html',
  styleUrls: ['./bp-number-selection.component.scss']
})
export class BpNumberSelectionComponent implements OnInit {
  toteQuantity:number;
  newQuantity: number;
  IsFullTote:boolean = false;
  Prefernces: BulkPreferences;
  public iBulkProcessApiService: IBulkProcessApiService;
  from: string = "completed quantity";
  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<BpNumberSelectionComponent>,
    public bulkProcessApiService: BulkProcessApiService,
    private global: GlobalService, 
    private cusValidator: CustomValidatorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
    this.from = this.data.from;
    this.toteQuantity = this.data?.toteQuantity;
    this.IsFullTote = this.data?.IsFullTote;
  }

  ngOnInit(): void {
    this.getworkstationbulkzone();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchBoxField?.nativeElement.focus();
    }, SetTimeout['500Milliseconds']);
  }

  getworkstationbulkzone() {
    this.iBulkProcessApiService.bulkPreferences().subscribe((res: any) => {
      this.Prefernces = res;
    })
  }
  

  add(string: string) {
    let newQuantity:number;
    if(this.newQuantity){
      newQuantity = parseFloat(this.newQuantity.toString() + string); 
      }
    else{
        newQuantity = parseFloat(string); 
    }
    if(!this.IsFullTote || newQuantity <= this.toteQuantity) this.newQuantity = newQuantity;
    else  this.global.ShowToastr(ToasterType.Error, "This tote only needs a quantity of " + this.toteQuantity, ToasterTitle.Error);
  }
  numberOnly(event): boolean { 
    if(this.IsFullTote && event.target.value > this.toteQuantity){
      this.global.ShowToastr(ToasterType.Error, "This tote only needs a quantity of " +this.toteQuantity, ToasterTitle.Error);
    }

    return this.cusValidator.numberOnly(event);
  }
  done() { 
    if (!this.IsFullTote || (this.newQuantity <= this.toteQuantity && this.newQuantity >= 0)){
    if (this.from == "completed quantity") {
      //if (this.Prefernces.systemPreferences.zeroLocationQuantityCheck) {
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
            this.dialogRef.close({ newQuantity: this.newQuantity.toString(), type: ResponseStrings.Yes });
          }
          else if (resp == ResponseStrings.No) {
            this.dialogRef.close({ newQuantity: this.newQuantity.toString(), type: ResponseStrings.No });
          }
          else if (resp == ResponseStrings.Cancel) {
            this.dialogRef.close({ newQuantity: this.newQuantity.toString(), type: ResponseStrings.Cancel });
          }
        });
    //  }
    }
    else if (this.from == "qunatity put in new tote") {
      this.dialogRef.close(this.newQuantity.toString());
    }
    
  }
  }
}
