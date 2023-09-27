import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; 
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-mark-empty-reels',
  templateUrl: './mark-empty-reels.component.html',
  styleUrls: ['./mark-empty-reels.component.scss'],
})
export class MarkEmptyReelsComponent implements OnInit {
  scanSerial;
  lastScanned;
  lastScannedList: any = [];
  notifyMessage = '';
  itemInvalid = false;
  itemEmpty = false;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  scannedSerialList: MatTableDataSource<any>;
  displayedColumns_1: string[] = ['scannedserialnumbers', 'actions'];
  userData;

  constructor(
    private dialog: MatDialog,
    public Api:ApiFuntions,
    public toastService: ToastrService,
    private authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
  ) {
    this.scannedSerialList = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }
  scanSerialEvent(event) {
    if (this.scanSerial == '') {
      this.itemEmpty = true;
      this.notifyMessage = 'Please enter a serial number';
      this.lastScanned = this.lastScannedList[this.lastScannedList.length - 1];
    } else if (this.lastScannedList.includes(this.scanSerial)) {
      this.itemInvalid = true;
      this.notifyMessage = 'Serial Number already scanned';
      this.lastScanned = this.scanSerial;
    } else {
      // validate serial
      let payload = {
        serialNumber: this.scanSerial,
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };
      this.Api
        .ValidateSerialNumber(payload) //validate tote
        .subscribe(
          (response: any) => {
            if (response.isExecuted) {
              switch (response.data) {
                case 'Error':
                  this.itemInvalid = true;
                  this.notifyMessage =
                    'There was an error validating serial number';
                  this.scanSerial = '';
                  break;

                case 'InValid':
                  this.itemInvalid = true;

                  this.notifyMessage = 'Serial Number Does Not Exist';
                  this.scanSerial = '';

                  break;

                case 'Valid':
                  this.itemInvalid = false;
                  this.itemEmpty = false;
                  // append in row
                  const newRow = { scannedserialnumbers: this.scanSerial };
                  this.scannedSerialList.data.push(newRow);
                  this.scannedSerialList._updateChangeSubscription();
                  this.scanSerial = '';
                  break;
                default:
                  break;
              }
            }
          },
          (error) => {
            console.error('An error occurred:', error);
          }
        );
      this.itemInvalid = false;
      this.lastScannedList.push(this.scanSerial);
      this.lastScanned = this.scanSerial;
    }
  }
  removeRow(index: number, el) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete-create-count',
        action: 'delete',
      },
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result === 'Yes') {
          // Remove item from last scanned list
          const indexToRemove = this.lastScannedList.findIndex(
            (item) => item === el.scannedserialnumbers
          ); 

          if (indexToRemove !== -1) {
            this.lastScannedList.splice(indexToRemove, 1);
          } 

          //  remove row from datasource
          this.scannedSerialList.data.splice(index, 1);
          this.scannedSerialList._updateChangeSubscription();
          this.itemInvalid = false;
          this.itemEmpty = false;
        }
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }
  markReelAsEmpty() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete-create-count',
        action: 'delete',
        ErrorMessage:
          'You are about to mark the scanned reels as empty. This will delete ALL current open transactions associated with the scanned reels.',
      },
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result === 'Yes') {
          let serialNumbersArr: any = [];
          this.scannedSerialList.data.forEach((item) => {
            serialNumbersArr.push(item.scannedserialnumbers);
          });

          //  Renmoves all serial numbers from list

          let payload = {
            serialNumbers: serialNumbersArr,
            username: this.userData.userName,
            wsid: this.userData.wsid,
          };
          this.Api
            .DeleteSerialNumber(payload) //validate tote
            .subscribe((response: any) => {
              if (response.isExecuted) {
                this.toastService.success(
                  response.responseMessage,
                  'Success!',
                  {
                    positionClass: 'toast-bottom-right',
                    timeOut: 2000,
                  }
                );
                this.itemInvalid = false;
                this.itemEmpty = false;
                this.scannedSerialList = new MatTableDataSource();
                this.lastScannedList.length = 0;
              } else {
                this.toastService.error(response.responseMessage, 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
              }
            });
        }
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  ngAfterViewInit() {
    this.searchBoxField.nativeElement.focus();
    this.scannedSerialList.sort = this.sort;
  }
}
