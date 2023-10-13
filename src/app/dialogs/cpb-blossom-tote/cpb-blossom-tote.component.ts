import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import labels from '../../labels/labels.json';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api.service';

@Component({
  selector: 'app-cpb-blossom-tote',
  templateUrl: './cpb-blossom-tote.component.html',
  styleUrls: ['./cpb-blossom-tote.component.scss']
})
export class CpbBlossomToteComponent implements OnInit {
  public iinductionManagerApi:IInductionManagerApiService;
  displayedColumns: string[] = ['item_number', 'transaction_qty', 'qty_in_old_date'];
  toteId: any;
  transactions: any = [];
  newToteID: any = "";
  submitBlossomEnable = false;
  @ViewChild('NewToteID') NewToteIDField: ElementRef;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    
    private global:GlobalService,
    private Api: ApiFuntions,
    private inductionManagerApi: InductionManagerApiService,
    public dialogRef: MatDialogRef<CpbBlossomToteComponent>,
    private globalService: GlobalService
  ) { 
    this.iinductionManagerApi = inductionManagerApi;

  }

  restrictKeyboard(event: KeyboardEvent) {
    const isNumericInput = event.key.match(/^[0-9]+$/);
    if (!isNumericInput && event.key !== "Backspace") {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.toteId = this.data.toteId;
    this.data.transactions.forEach((x: any) => {
      this.transactions.push(
        {
          id: x.id,
          itemNumber: x.itemNumber,
          transactionQuantity: x.transactionQuantity,
          oldToteQuantity: null
        }
      );
    });
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      this.NewToteIDField.nativeElement.focus();  
    }, 500);
  }

  newToteIdFocusOut() {
    if (this.newToteID != "") {
      this.iinductionManagerApi.ValidateTote({ toteID: this.newToteID }).subscribe((res: any) => {
        if (res.isExecuted && res.data != "") {
          this.submitBlossomEnable = true;
        }
        else {
          this.newToteID = "";
          this.submitBlossomEnable = false;
          this.global.ShowToastr('error',"This tote is currently assigned to another open order", 'Invalid Tote');
        }
      });
    }
    else {
      this.submitBlossomEnable = false;
    }
  }

  qtyInOldToteFoucusOut(element:any){
    if(element.oldToteQuantity < 0 || element.oldToteQuantity > element.transactionQuantity){
      this.global.ShowToastr('error',"Invalid Quantity Entered", 'Invalid Quantity Entered');
      element.oldToteQuantity = null;
    }
  }

  submitBlossom() {
    let payload:any = {
      blossomTotes: [],
      newTote: this.newToteID
    }
    let isDecimalExist:boolean = false;
    this.transactions.forEach((x:any) => {
      payload.blossomTotes.push({
        id:x.id,
        transactionQuantity: x.transactionQuantity,
        oldToteQuantity: x.oldToteQuantity ? x.oldToteQuantity : 0
      });
      if(!this.globalService.checkDecimal(x.oldToteQuantity ? x.oldToteQuantity : 0)){
        isDecimalExist = true
      }
    });
    if(isDecimalExist){
      this.global.ShowToastr('error',"Tote Quantity can not be in decimal", 'Error');
      return;
    }
    let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        heading: 'Perform Blossom?',
        message: 'Perform a blossom wiht the current setup? This will complete the original tote with the quantities entered, and assign any remaining quantities to the new tote.',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.iinductionManagerApi.blossomTote(payload).subscribe((res: any) => {
          if(res.isExecuted){
            this.dialogRef.close({newToteID:this.newToteID});
            this.global.ShowToastr('success',labels.alert.update, 'Success!');
          }
          else{
            this.global.ShowToastr('error',"An error occured when blossoming this tote", 'Error');
          }
        });
      }
    });
  }
}
