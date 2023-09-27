import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component'; 
import { AuthService } from 'src/app/init/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-bm-toteid-entry',
  templateUrl: './bm-toteid-entry.component.html',
  styleUrls: [],
})
export class BmToteidEntryComponent implements OnInit {
  selectedList: any;
  nextToteID: any;
  userData: any;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private api: ApiFuntions,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.selectedList = data.selectedOrderList;

    this.nextToteID = data.nextToteID; 
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }
  clearAll() {
    this.selectedList.forEach((element, i) => {
      this.selectedList[i]['createNextToteID'] = undefined;
    });
  }
  removeToteID(index) {
    this.selectedList[index]['createNextToteID'] = undefined;
  }
  createNextTote() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: 'auto',
      width: '786px',
      data: {
        message: 'Click OK to auto generate tote IDs for this batch of orders.',
        heading: 'Batch Manager',
      },
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result==='Yes') {
        this.selectedList.forEach((element, i) => {
          this.selectedList[i]['createNextToteID'] =
            parseInt(this.nextToteID) + i + 1;
        });
      }
    });
  }

  submitOrder() {
    if (this.selectedList.find((o) => o.createNextToteID === undefined)) {
      const dialogRef = this.dialog.open(AlertConfirmationComponent, {
        height: 'auto',
        width: '786px',
        data: {
          message: 'All Tote IDs must be specified before submitting.',
          heading: 'Batch Manager',
        },
        autoFocus: '__non_existing_element__',
      disableClose:true,
      });
      dialogRef.afterClosed().subscribe((result) => {});
    } else {
      this.updateToteID();
    }
  }

  updateToteID() {
    let orders: any = [];
    this.selectedList.forEach((element, i) => {
      orders[i] = [element.orderNumber, element.createNextToteID.toString()];
    });

    let paylaod = {
      orders: orders,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };

    this.api
      .PickToteIDUpdate(paylaod)
      .subscribe((res: any) => {
        if (res.isExecuted) {
          this.toastr.success(res.responseMessage, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.error(res.responseMessage, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      });
  }
}
