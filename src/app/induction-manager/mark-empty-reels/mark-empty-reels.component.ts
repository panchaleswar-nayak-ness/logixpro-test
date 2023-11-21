import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/common/init/auth.service';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { LiveAnnouncerMessage, StringConditions, ToasterTitle, ToasterType, alertMessage } from 'src/app/common/constants/strings.constants';

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
  public iinductionManagerApi: IInductionManagerApiService;
  itemInvalid = false;
  itemEmpty = false;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  scannedSerialList: MatTableDataSource<any>;
  displayedColumns_1: string[] = ['scannedserialnumbers', 'actions'];
  userData;

  constructor(
    private global: GlobalService,

    public inductionManagerApi: InductionManagerApiService,
    private authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
  ) {
    this.scannedSerialList = new MatTableDataSource();
    this.iinductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }
  scanSerialEvent() {
    if (this.scanSerial == '') {
      this.itemEmpty = true;
      this.notifyMessage = alertMessage.EnterSerialNo;
      this.lastScanned = this.lastScannedList[this.lastScannedList.length - 1];
    } else if (this.lastScannedList.includes(this.scanSerial)) {
      this.itemInvalid = true;
      this.notifyMessage = alertMessage.SerialNoAlreadyScan;
      this.lastScanned = this.scanSerial;
    } else {
      // validate serial
      let payload = {
        serialNumber: this.scanSerial,
      };
      this.iinductionManagerApi
        .ValidateSerialNumber(payload) //validate tote
        .subscribe(
          (response: any) => {
            if (response.isExecuted) {
              switch (response.data) {
                case 'Error':
                  this.itemInvalid = true;
                  this.notifyMessage = alertMessage.ErrorValidatingSerialNoMsg;
                  this.scanSerial = '';
                  break;

                case 'InValid':
                  this.itemInvalid = true;
                  this.notifyMessage = alertMessage.SerialNoNotExistsMsg;
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
            else {
              this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
              console.log("ValidateSerialNumber");
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
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: '__non_existing_element__',
      disableClose: true,
      data: {
        mode: 'delete-create-count',
        action: 'delete',
      },
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result === StringConditions.Yes) {
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
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: '__non_existing_element__',
      disableClose: true,
      data: {
        mode: 'delete-create-count',
        action: 'delete',
        ErrorMessage: alertMessage.DeleteMessage,
      },
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result === StringConditions.Yes) {
          let serialNumbersArr: any = [];
          this.scannedSerialList.data.forEach((item) => {
            serialNumbersArr.push(item.scannedserialnumbers);
          });

          //  Renmoves all serial numbers from list

          let payload = {
            serialNumbers: serialNumbersArr,
          };
          this.iinductionManagerApi
            .DeleteSerialNumber(payload) //validate tote
            .subscribe((response: any) => {
              if (response.isExecuted) {
                this.global.ShowToastr(ToasterType.Success,
                  response.responseMessage,
                  ToasterTitle.Success
                );
                this.itemInvalid = false;
                this.itemEmpty = false;
                this.scannedSerialList = new MatTableDataSource();
                this.lastScannedList.length = 0;
              } else {
                this.global.ShowToastr(ToasterType.Error, response.responseMessage, ToasterTitle.Error);
                console.log("DeleteSerialNumber");
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
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
  }
  ngAfterViewInit() {
    this.searchBoxField?.nativeElement.focus();
    this.scannedSerialList.sort = this.sort;
  }
}
