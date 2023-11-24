import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectionTransactionForToteExtendComponent } from '../selection-transaction-for-tote-extend/selection-transaction-for-tote-extend.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import {  ResponseStrings ,ToasterMessages,ToasterTitle,ToasterType,DialogConstants} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-selection-transaction-for-tote',
  templateUrl: './selection-transaction-for-tote.component.html',
  styleUrls: ['./selection-transaction-for-tote.component.scss']
})
export class SelectionTransactionForToteComponent implements OnInit {
  public userData;
  public apiResponse;
  public transactionTable;
  public inputType;
  public inputValue;
  public userName;
  public wsid;
  public zone;
  public batchID;
  public itemNumber;
  public description;
  public fieldNames; 
  public lowerBound=1;
  public upperBound=2; 

  showBtnNewPutAwayForSameSKU : boolean = true;
  
  public iInductionManagerApi: IInductionManagerApiService;

  constructor(
    private global: GlobalService,
    public inductionManagerApi: InductionManagerApiService,
    public dialogRef: MatDialogRef<SelectionTransactionForToteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
      this.iInductionManagerApi = inductionManagerApi;
    }

  ngOnInit(): void {
    this.inputType  =  this.data.inputType;
    this.inputValue =  this.data.inputValue; 
    this.userName   =  this.data.userName;
    this.wsid       =  this.data.wsid;
    this.zone       =  this.data.zones;
    this.batchID    =  this.data.batchID;
    this.fieldNames    =  this.data.propFields;
    this.getTransactions();
  }

  refresh() {
    this.getTransactions();
  }

  selectOrder(id:any,itemNumber:any, val : any = []) {
    if (val.zone) {
      let payload = { zone: val.zone };
      this.iInductionManagerApi.BatchByZone(payload).subscribe(
        (res: any) => {
          if (res.isExecuted) {
            if (!res.data) {
              let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
                height: 'auto',
                width: '560px',
                autoFocus: DialogConstants.autoFocus,
                disableClose:true,
                data: {
                  message: 'There are no batches with this zone (' + val.zone + ') assigned.  Click OK to start a new batch or cancel to choose a different location/transaction.',
                },
              });

              dialogRef.afterClosed().subscribe((res) => { if (res == ResponseStrings.Yes) this.dialogRef.close("New Batch"); });
            } else {
              const dialogRef:any = this.global.OpenDialog(SelectionTransactionForToteExtendComponent, {
                height: 'auto',
                width: '100vw',
                autoFocus: DialogConstants.autoFocus,
                disableClose:true,
                data: {
                  otid        : id,
                  itemNumber  : itemNumber,
                  zones       : this.data.zones,
                  batchID     : this.data.batchID,
                  totes       : this.data.totes,
                  defaultPutAwayQuantity: this.data.defaultPutAwayQuantity,
                  transactionQuantity: val.transactionQuantity,
                  autoForwardReplenish: this.data.autoForwardReplenish,
                  imPreference: this.data.imPreference
                }
              });
          
              dialogRef.afterClosed().subscribe((res) => { if (res) this.dialogRef.close(res); });
            }
          } else {
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
            console.log("BatchByZone");
          }
        },
        (error) => {}
      );    
    } else {
      const dialogRef:any = this.global.OpenDialog(SelectionTransactionForToteExtendComponent, {
        height: 'auto',
        width: '100vw',
        autoFocus: DialogConstants.autoFocus,
        disableClose:true,
        data: {
          otid        : id,
          itemNumber  : itemNumber,
          zones       : this.data.zones,
          batchID     : this.data.batchID,
          totes       : this.data.totes,
          defaultPutAwayQuantity: this.data.defaultPutAwayQuantity,
          transactionQuantity: val.transactionQuantity,
          autoForwardReplenish: this.data.autoForwardReplenish,
          imPreference: this.data.imPreference
        }
      });
  
      dialogRef.afterClosed().subscribe((res) => { if (res) this.dialogRef.close(res); });
    }
  }

  rightClick() {
    this.lowerBound = this.upperBound + 1;
    this.upperBound = (this.lowerBound + 4) <= this.apiResponse.numberOfRecords ? (this.lowerBound + 4) : this.apiResponse.numberOfRecords;
    this.getTransactions();
  }

  leftClick() {
    this.lowerBound = (this.lowerBound - 5) <= 0 ? 1 : this.lowerBound - 5;
    this.upperBound =  this.upperBound - 5;
    if(this.upperBound < 5) this.upperBound = 5;
    this.getTransactions();
  }

  getTransactions() {
    let getTransaction = {
      lowerBound: this.lowerBound,
      upperBound: this.upperBound,
      input: [
        this.inputValue,
        this.inputType,
        "1=1"
      ],
    };
    this.iInductionManagerApi.TransactionForTote(getTransaction).subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          if(res.data.subCategory == 'Reel Tracking' && res.data.inputType != 'Serial Number'){
            this.dialogRef.close({category:'isReel',item:res.data});
            return;
          }
            
          this.transactionTable = res.data.transactionTable;

          if (res.data.success == "0") {
            this.dialogRef.close("NO");
            return;
          }

          if (this.data.imPreference.purchaseOrderRequired && this.transactionTable.length > 0) {
            this.showBtnNewPutAwayForSameSKU = false;
          } else if(this.data.imPreference.purchaseOrderRequired && this.transactionTable.length == 0) {
            this.global.ShowToastr(ToasterType.Error,`No open Put Aways available for this ${this.inputType != 'Any' ? this.inputType : ''}`, ToasterTitle.Error);
            this.dialogRef.close()
          }

          if (this.data.selectIfOne && res.data.transactionTable.length == 1) this.selectOrder(this.transactionTable[0].id, res.data.itemNumber, this.transactionTable[0]);

          this.apiResponse = res.data;
          this.itemNumber = this.apiResponse.itemNumber;
          this.description = this.apiResponse.description;
        } else {
          this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("TransactionForTote",res.ResponseMessage);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openSelectionExtendDialogue() {
    const dialogRef:any = this.global.OpenDialog(SelectionTransactionForToteExtendComponent, {
      height: 'auto',
      width: '100vw',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        otid        : 0,
        itemNumber  : this.itemNumber,
        zones       : this.data.zones,
        batchID     : this.data.batchID,
        totes       : this.data.totes,
        defaultPutAwayQuantity: this.data.defaultPutAwayQuantity,
        autoForwardReplenish: this.data.autoForwardReplenish,
        imPreference: this.data.imPreference
      }
    });

    dialogRef.afterClosed().subscribe((res) => { if (res) this.dialogRef.close(res); });
  }
}
