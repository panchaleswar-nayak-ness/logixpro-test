import { Component, OnInit , Inject } from '@angular/core';
import { MatDialog , MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectionTransactionForToteExtendComponent } from '../selection-transaction-for-tote-extend/selection-transaction-for-tote-extend.component';
import { ToastrService } from 'ngx-toastr'; 
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

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



  constructor(private dialog: MatDialog,public dialogRef: MatDialogRef<SelectionTransactionForToteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private Api:ApiFuntions,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.inputType  =  this.data.inputType;
    this.inputValue =  this.data.inputValue; 
    this.userName   =  this.data.userName;
    this.wsid       =  this.data.wsid;
    this.zone       =  this.data.zones;
    this.batchID    =  this.data.batchID,
    this.fieldNames    =  this.data.propFields
    this.getTransactions();
  }

  refresh()
  {
    this.getTransactions();
  }

  selectOrder(id:any,itemNumber:any, val : any = [])
  {

    if (val.zone) {

      let payload = {
        zone: val.zone,      
        username: this.userName,
        wsid: this.wsid
      };
      
      this.Api
        .BatchByZone(payload)
        .subscribe(
          (res: any) => {
            if (res.isExecuted) {
              if (!res.data) {
                let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  height: 'auto',
                  width: '560px',
                  autoFocus: '__non_existing_element__',
      disableClose:true,
                  data: {
                    message: 'There are no batches with this zone (' + val.zone + ') assigned.  Click OK to start a new batch or cancel to choose a different location/transaction.',
                  },
                });
  
                dialogRef.afterClosed().subscribe((res) => {
                  if (res == 'Yes') {
                    this.dialogRef.close("New Batch"); 
                  }      
                });
  
  
              } else {
                const dialogRef = this.dialog.open(SelectionTransactionForToteExtendComponent, {
                  height: 'auto',
                  width: '100vw',
                  autoFocus: '__non_existing_element__',
      disableClose:true,
                  data: {
                    otid        : id,
                    itemNumber  : itemNumber,
                    zones       : this.data.zones,
                    batchID     : this.data.batchID,
                    totes       : this.data.totes,
                    defaultPutAwayQuantity: this.data.defaultPutAwayQuantity,
                    transactionQuantity: val.transactionQuantity,
                    autoForwardReplenish: this.data.autoForwardReplenish
                  }
                });
            
                dialogRef.afterClosed().subscribe((res) => {
                  if (res) {
                    this.dialogRef.close(res); 
                  }      
                });
              }
            } else {
              this.toastr.error('Something went wrong', 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            }
          },
          (error) => {}
        );    
      
    } else {
      const dialogRef = this.dialog.open(SelectionTransactionForToteExtendComponent, {
        height: 'auto',
        width: '100vw',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          otid        : id,
          itemNumber  : itemNumber,
          zones       : this.data.zones,
          batchID     : this.data.batchID,
          totes       : this.data.totes,
          defaultPutAwayQuantity: this.data.defaultPutAwayQuantity,
          transactionQuantity: val.transactionQuantity,
          autoForwardReplenish: this.data.autoForwardReplenish
        }
      });
  
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.dialogRef.close(res); 
        }      
      });
    }
    
  }

  rightClick()
  { 
    this.lowerBound = this.upperBound+1;
    this.upperBound = (this.lowerBound+4)<=this.apiResponse.numberOfRecords?(this.lowerBound+4):this.apiResponse.numberOfRecords;
    

    this.getTransactions();
  }

  leftClick()
  {
    this.lowerBound = (this.lowerBound-5)<=0?1:this.lowerBound-5;
    this.upperBound =  this.upperBound-5;
    if(this.upperBound<5){this.upperBound=5;}
    this.getTransactions();
  }

  getTransactions()
  {
    let getTransaction = {
      lowerBound: this.lowerBound,
      upperBound: this.upperBound,
      input: [
        this.inputValue,
        this.inputType,
        "1=1"
      ],
    };
    //console.log(getTransaction);
    this.Api
      .TransactionForTote(getTransaction)
      .subscribe(
        (res: any) => {
          // console.log(res,'getTransaction')
          if (res.data && res.isExecuted) {
            if(res.data.subCategory == 'Reel Tracking'&&res.data.inputType != 'Serial Number' ){
               this.dialogRef.close({category:'isReel',item:res.data});
                return;
                }

             
            this.transactionTable = res.data.transactionTable;
            
            // !res.data.transactionTable || res.data.transactionTable.length == 0
            if (res.data.success == "0") {
              this.dialogRef.close("NO");
              return;
            }

            if (this.data.selectIfOne && res.data.transactionTable.length == 1) {
              this.selectOrder(this.transactionTable[0].id, res.data.itemNumber, this.transactionTable[0]);
            }

            this.apiResponse = res.data;
            this.itemNumber = this.apiResponse.itemNumber;
            this.description = this.apiResponse.description;
          } else {
            this.toastr.error('Something went wrong', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        },
        (error) => {}
      );
  }

  openSelectionExtendDialogue() {
    const dialogRef = this.dialog.open(SelectionTransactionForToteExtendComponent, {
      height: 'auto',
      width: '100vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        otid        : 0,
        itemNumber  : this.itemNumber,
        zones       : this.data.zones,
        batchID     : this.data.batchID,
        totes       : this.data.totes,
        defaultPutAwayQuantity: this.data.defaultPutAwayQuantity,
        autoForwardReplenish: this.data.autoForwardReplenish
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.dialogRef.close(res);  
      }
      
    });
  }

}
