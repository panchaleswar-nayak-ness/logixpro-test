import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { CmShipSplitLineComponent } from '../cm-ship-split-line/cm-ship-split-line.component';
import { CmShipEditConIdComponent } from '../cm-ship-edit-con-id/cm-ship-edit-con-id.component';
import { CmShipEditQtyComponent } from '../cm-ship-edit-qty/cm-ship-edit-qty.component';
import { CmToteIdUpdateModalComponent } from '../cm-tote-id-update-modal/cm-tote-id-update-modal.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-cm-shipping-transaction',
  templateUrl: './cm-shipping-transaction.component.html',
  styleUrls: ['./cm-shipping-transaction.component.scss']
})
export class CmShippingTransactionComponent implements OnInit {
  @ViewChild('toteId_update') toteId_update: ElementRef;
  public userData: any;

  toteID: string = '';
  STIndex : any;

  displayedColumns: string[] = ['itemNumber', 'lineNumber', 'toteID', 'transactionQuantity', 'completedQuantity', 'containerID', 'shipQuantity', 'action'];
  OldTableData : any;
  tableData : any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private dialog          : MatDialog,
              public dialogRef        : MatDialogRef<CmShippingTransactionComponent>,
              private toast           : ToastrService,
              private Api: ApiFuntions,
              private authService     : AuthService,
              private _liveAnnouncer  : LiveAnnouncer,
              private global:GlobalService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private route: Router
              ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getShippingTransactionIndex();
  }
  ngAfterViewInit(): void {
    this.toteId_update.nativeElement.focus();
  }
  // Call the GET API for the Shipping Transaction Index
  getShippingTransactionIndex() {
    try {
      // Set the parameters for the API call
      var payLoad = {
        orderNumber : this.data && this.data.orderNum ? this.data.orderNum : '2909782A',
        username: this.userData.userName,
        wsid: this.userData.wsid
      };

      // Call the GET API
      this.Api.ShippingTransactionIndex(payLoad).subscribe(
        (res: any) => {
          if (res.isExecuted) {
            this.STIndex = res.data;
            this.tableData = new MatTableDataSource(this.STIndex.tableData);
            this.tableData.paginator = this.paginator;
          } else {
            this.toast.error('Something went wrong', 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
          }
        },
        (error) => { }
      );
    } catch (error) { 
    }
  }

  async onKey(event : any, type : string) {    
    if (event.key === 'Enter') { // Check if the user pressed the 'Enter' key
      if (type == 'toteIDtoUpdate' && this.toteID != "") { // Check if the user entered a tote ID
        this.checkToteID(); // If the user entered a tote ID, call the checkToteID() function
      }    
    }
  }

  checkToteID() {
    var noExists = false; // this is a flag that will let us know if the toteID exists in the data
    for (var x = 0; x < this.tableData.data.length; x++) { // this is a loop that will go through each row in the data
        var tabTote = this.tableData.data[x].toteID; // this will get the toteID value from the current row of the data
        if (this.toteID == tabTote) { // this is a conditional statement that will check if the toteID entered by the user matches the toteID in the current row of the data
            this.openToteIDUpdate(); // if the toteID does match, then we will open the modal
            noExists = false; // we will set the flag to false since the toteID does exist
            break; // we will break out of the loop since we found the toteID
        } else { // if the toteID does not match, then we will continue going through the loop
            noExists = true; // we will set the flag to true since the toteID does not exist
        }
    };
    if (noExists) { // this is a conditional statement that will check the flag to see if the toteID does not exist in the data
      this.toast.error('The given Tote ID is not contained within this order number', 'Error!', { // we will display a toast message to the user to let them know the toteID does not exist
        positionClass: 'toast-bottom-right', // this is the position of where the toast message will be displayed
        timeOut: 2000 // this is the amount of time the toast message will be displayed on the screen
      });
    };
  }

  // openToteIDUpdate() is called when the user clicks the Tote ID Update button
  openToteIDUpdate() {    
    // open the dialog
    let dialogRef = this.dialog.open(CmToteIdUpdateModalComponent, {
      height: 'auto',
      width: '40vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        toteID : this.toteID,
        orderNumber : this.data && this.data.orderNum ? this.data.orderNum : '2909782A'
      }
    });

    // subscribe to the dialog closing
    dialogRef.afterClosed().subscribe(res => {
      // update the container ID for the selected tote ID
      if (res && res.isExecuted) {
        // loop through the table data
        for (var x = 0; x < this.tableData.data.length; x++) {
          // if the tote ID matches the one that was updated
          if (res.toteID == this.tableData.data[x].toteID) {
              // set the container ID
              this.tableData.data[x].containerID = res.containerID;
          }
        } 
      }      
    });
  }

  completePacking() {
    try {

      var payLoad = {
        orderNumber: this.data && this.data.orderNum ? this.data.orderNum : '2909782A',
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };

      this.Api.SelCountOfOpenTransactionsTemp(payLoad).subscribe(
        (res: any) => {
          if (res.isExecuted) {

            if (res.data == -1) 
            {
              this.toast.error('An error has occurred', 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
            } 
            else if (res.data == 0) 
            {
              let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                height: 'auto',
                width: '560px',
                autoFocus: '__non_existing_element__',
      disableClose:true,
                data: {
                  message: 'Are you sure you want to update this order number as complete for packing?',
                },
              });
      
              dialogRef.afterClosed().subscribe((result) => {
                if (result == 'Yes') {
                  this.Api.CompletePackingUpdate(payLoad).subscribe(
                    (res: any) => {
                      if (res.isExecuted) {
                        this.toast.success('Packing Completed Successfully', 'Success!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
                        this.dialogRef.close({
                          isExecuted: true,
                        });
                      } else {
                        this.toast.error('Something went wrong', 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
                      }
                    },
                    (error) => { }
                  );
                }
              });
            } 
            else 
            {
              let dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
                height: 'auto',
                width: '560px',
                autoFocus: '__non_existing_element__',
      disableClose:true,
                data: {
                  message: 'Are you sure you want to update this order number as complete for packing?',
                },
              });
      
              dialogRef1.afterClosed().subscribe((result) => {
                if (result == 'Yes') {
                  let dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
                    height: 'auto',
                    width: '560px',
                    autoFocus: '__non_existing_element__',
      disableClose:true,
                    data: {
                      message: 'Back orders exist for this order number. Still continue pack complete?',
                    },
                  });

                  dialogRef2.afterClosed().subscribe((result) => {
                    if (result == 'Yes') {
                      this.Api.CompletePackingUpdate(payLoad).subscribe(
                        (res: any) => {
                          if (res.isExecuted) {
                            this.toast.success('Packing Completed Successfully', 'Success!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
                            this.dialogRef.close({
                              isExecuted: true,
                            });
                          } else {
                            this.toast.error('Something went wrong', 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
                          }
                        },
                        (error) => { }
                      );
                    }
                  });                  
                }
              });
            }
          } else {
            this.toast.error('Something went wrong', 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
          }
        },
        (error) => { }
      );
    } catch (error) { 
    }
  }

  // Open the ship split line dialog
  openShipSplitLine(order : any, i : any) {
    let dialogRef = this.dialog.open(CmShipSplitLineComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        order,
        page: 'ShipTrans'
      }
    });

    // Wait for the ship split line dialog to close
    dialogRef.afterClosed().subscribe(res => {
      // If the dialog was closed with 'OK' then update the ship quantity
      if (res && res.isExecuted) {
        this.tableData.data[i].transactionQuantity = res.orderQty;
        this.tableData.data[i].completedQuantity = res.pickQty;
        this.tableData.data[i].shipQuantity = res.shipQty;

        this.getShippingTransactionIndex();
      }

    });
  }

  openShipPrintItemLabel(order : any, i : any) {
    this.global.Print(`FileName:PrintShipTransLabel|ST_ID:${order.sT_ID}`,'lbl');
  }

  // Open the dialog component, pass in the data to be modified
  openShipEditQuantity(order : any, i : any) {
    let dialogRef = this.dialog.open(CmShipEditQtyComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        reasons: this.STIndex.reasons,
        order
      }
    });

    // After the dialog is closed, get the modified data and update the table data
    dialogRef.afterClosed().subscribe(res => {
      if (res && res.isExecuted) {
        this.tableData.data[i].shipQuantity = res.shipQuantity;
      } 
    });
  }

  openShipEditContainerID(order : any, i : any) {
    // Open the dialog
    let dialogRef = this.dialog.open(CmShipEditConIdComponent, {
      height: 'auto',
      width: '40vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        order
      }
    });

    // Handle the dialog closing
    dialogRef.afterClosed().subscribe(res => {
      if (res && res.isExecuted) {
        this.tableData.data[i].containerID = res.containerID;
      }  
    });
  }

  // Announce the new sort state, if any.
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      // Announce the sort direction, and the fact that sorting is cleared.
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }

    // Set the data source's sort property to the new sort.
    this.tableData.sort = this.sort;
  }

  filterByItem(value : any) {
    if(this.OldTableData && this.OldTableData.data.length > 0) {
      this.tableData = new MatTableDataSource(this.OldTableData.data.filter((x : any) =>  x.itemNumber.includes(value)));
      this.tableData.paginator = this.paginator;
    } else {
      this.OldTableData = new MatTableDataSource(this.tableData.data);
      this.tableData = new MatTableDataSource(this.tableData.data.filter((x : any) =>  x.itemNumber.includes(value)));
      this.tableData.paginator = this.paginator;
    }
  }


  printList(){
    this.global.Print(`FileName:PrintShipOrderPL|OrderNum:${this.data.orderNum}`);
  }

  selectRow(row: any) {
    this.tableData.data.forEach(element => {
      if(row != element){
        element.selected = false;
      }
    });
    const selectedRow = this.tableData.data.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }


}
