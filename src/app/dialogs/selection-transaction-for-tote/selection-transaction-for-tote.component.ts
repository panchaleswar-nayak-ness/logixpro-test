import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionTransactionForToteExtendComponent } from '../selection-transaction-for-tote-extend/selection-transaction-for-tote-extend.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import {  ResponseStrings ,ToasterMessages,ToasterTitle,ToasterType,DialogConstants,Style,ColumnDef} from 'src/app/common/constants/strings.constants';
import { ApiResponse, ColumnAlias, OpenTransactions } from 'src/app/common/types/CommonTypes';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { DialogCommunicationService } from 'src/app/common/services/dialog-communication.service';
import { Subscription } from 'rxjs';
import { BatchTotesTableResponse } from 'src/app/induction-manager/process-put-aways/process-put-aways.component';

interface TransactionForToteResponse {
  inputType: string;
  success: string;
  failureReason: string;
  itemNumber: string;
  subCategory: string;
  description: string;
  warehouseSensitive: boolean;
  transactionTable: OpenTransactions[];
  numberOfRecords: number;
  recordsFiltered: number;
}

@Component({
  selector: 'app-selection-transaction-for-tote',
  templateUrl: './selection-transaction-for-tote.component.html',
  styleUrls: ['./selection-transaction-for-tote.component.scss']
})
export class SelectionTransactionForToteComponent implements OnInit, OnDestroy {

  apiResponse : TransactionForToteResponse;
  transactionTable :  OpenTransactions[];
  inputType : string;
  inputValue : string;
  userName : string;
  wsid : string;
  zone : string;
  batchID : string;
  itemNumber : string;
  description : string;
  fieldNames : ColumnAlias; 
  lowerBound : number = 1;
  upperBound : number = 5; 
  blindInductionReason:boolean = false
  openFrom: string = '';
  toteQuantity: any;
  expirationDate: any;
  transactionQuantity: any;

  showBtnNewPutAwayForSameSKU : boolean = true;
  
  public iInductionManagerApi: IInductionManagerApiService;
  public iAdminApiService : IAdminApiService;
  formControlName: any;
  processForm: any;
  val: any;
  private readonly subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog ,
    private global: GlobalService,
    public inductionManagerApi: InductionManagerApiService,
    public dialogRef: MatDialogRef<SelectionTransactionForToteComponent>,
    public adminApiService: AdminApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogCommunicationService: DialogCommunicationService
  ) { 
    this.iInductionManagerApi = inductionManagerApi;
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.setData();
    this.getTransactions();
    this.blindInduction();    
    this.subscribeToUpdates();
  }

  subscribeToUpdates() {
    // Subscribe to batch and zone updates from dialog communication service
    this.subscriptions.push(
      this.dialogCommunicationService.batchUpdate$.subscribe((newBatchId: string) => {
        if (newBatchId) {
          this.batchID = newBatchId;
          this.data.batchID = newBatchId;
        }
      }),
      this.dialogCommunicationService.zoneUpdate$.subscribe((newZones: string) => {
        if (newZones) {
          this.zone = newZones;
          this.data.zones = newZones;
        }
      }),
      this.dialogCommunicationService.totesUpdate$.subscribe((newTotes: BatchTotesTableResponse[]) => {
        if (newTotes) {
          this.data.totes = newTotes;
        }
      })
    );
  }

  setData(){
    this.inputType = this.data.inputType;
    this.inputValue = this.data.inputValue; 
    this.userName = this.data.userName;
    this.wsid = this.data.wsid;
    this.zone = this.data.zones;
    this.batchID = this.data.batchID;
    this.fieldNames = this.data.propFields;
    this.openFrom = this.data.openFrom;
  }

  closeAllDialogue() {
  this.dialogRef.close(false);
  }

  selectedData(id, itemNumber, lotNumber, transactionQuantity, expirationDate) {
  // this.dialogRef.close(true);
 
  this.dialogRef.close({
    refreshdata: true,
    id: id,               // Replace `someId` with the actual variable or value for `id`
    itemNumber: itemNumber,  // Replace `someItemNumber` with the actual variable or value for `itemNumber`
    lotNumber: lotNumber,
    quantity: transactionQuantity,
    expirationDate: expirationDate,

  });
  }

  refresh() {
    this.getTransactions();
  }

  selectOrder(id:number, itemNumber : string, val : OpenTransactions) {
    if (val.zone) {
      let payload = { zone: val.zone };
      this.iInductionManagerApi.BatchByZone(payload).subscribe(
        (res: ApiResponse<string>) => {
          if (res.isExecuted) {
            const zoneBatchId = res.data;
            if (!zoneBatchId) {
              let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
                height: DialogConstants.auto,
                width: Style.w560px,
                autoFocus: DialogConstants.autoFocus,
                disableClose:true,
                data: {
                  message: 'There are no batches with this zone (' + val.zone + ') assigned.  Click OK to start a new batch or cancel to choose a different location/transaction.',
                },
              });

              dialogRef.afterClosed().subscribe((res) => { if (res == ResponseStrings.Yes) this.dialogRef.close("New Batch"); });
            } else {

              // Zone belongs to different batch - broadcast update
              this.dialogCommunicationService.updateBatch(zoneBatchId);

              const dialogRef:any = this.global.OpenDialog(SelectionTransactionForToteExtendComponent, {
                height: DialogConstants.auto,
                width: Style.w100vw,
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
        height: DialogConstants.auto,
        width: Style.w100vw,
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
    this.upperBound =  this.upperBound == this.apiResponse.numberOfRecords ? this.upperBound - (this.upperBound % 10) : this.upperBound - 5;
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
      (res: ApiResponse<TransactionForToteResponse>) => {
        if (res.data && res.isExecuted) {
          if(res.data.subCategory == 'Reel Tracking' && res.data.inputType != ColumnDef.SerialNumber){
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
            this.dialogRef.close();
          }

          if (this.data.selectIfOne && res.data.transactionTable.length == 1) this.selectOrder(this.transactionTable[0].id, res.data.itemNumber, this.transactionTable[0]);

          this.apiResponse = res.data;
          this.itemNumber = this.apiResponse.itemNumber;
          this.description = this.apiResponse.description;
        } else {
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("TransactionForTote", res.responseMessage);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  public blindInduction() {
    // Call the AdminCompanyInfo API to get the blindInductionReason
    this.iAdminApiService.AdminCompanyInfo().subscribe((res: any) => {
      if (res.data && res.isExecuted) {
        this.blindInductionReason = res.data.requireHotReasons;
      } else {
        // Handle error if the API response is not executed successfully
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      }
    });
  }

  openSelectionExtendDialogue() {

  
    const dialogRef : any = this.global.OpenDialog(SelectionTransactionForToteExtendComponent, {
      height: DialogConstants.auto,
      width: Style.w100vw,
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
        imPreference: this.data.imPreference,
        blindInductionReason: this.blindInductionReason
      }
    });

    dialogRef.afterClosed().subscribe((res) => { if (res) this.dialogRef.close(res); });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
