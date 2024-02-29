import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import { AuthService } from 'src/app/common/init/auth.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType, ResponseStrings, DialogConstants, Style } from 'src/app/common/constants/strings.constants';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';

@Component({
  selector: 'app-bm-toteid-entry',
  templateUrl: './bm-toeid-entry.component.html',
  styleUrls: ['./bm-toeid-entry.component.scss'],
})
export class BmToteidEntryComponent implements OnInit {
  selectedList: any;
  nextToteID: any;
  ValidateToteIDs: boolean = false;
  userData: any;
  BulkProcess: any = false;
  public iAdminApiService: IAdminApiService;
  public iBulkProcessApiService: IBulkProcessApiService;
  constructor(
    public dialogRef: MatDialogRef<any>,
    public bulkProcessApiService: BulkProcessApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global: GlobalService,
    public adminApiService: AdminApiService,
    private authService: AuthService,
  ) {
    this.selectedList = data.selectedOrderList;
    this.iAdminApiService = adminApiService;
    this.iBulkProcessApiService = bulkProcessApiService;
    this.nextToteID = data.nextToteID;
    this.BulkProcess = data.BulkProcess;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.companyInfo();
  }

  companyInfo() {
    this.iAdminApiService.WorkstationSetupInfo().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.ValidateToteIDs = res.data.validateToteIDs;
      }
    })
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
    const dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w600px,
      data: {
        message: !this.BulkProcess ? 'Click OK to auto generate tote IDs for this batch of orders.' : 'Touch ‘Yes’ to automatically Create Tote ID’s for this batch of orders.',
        heading: !this.BulkProcess ? 'Batch Manager' : 'Auto Generate Tote ID’s?',
        buttonFields: true
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        this.selectedList.forEach((element, i) => {
          this.selectedList[i]['createNextToteID'] =
            parseInt(this.nextToteID) + i + 1;
        });
      }
    });
  }

  submitOrder() {
    if (this.selectedList.find((o) => o.createNextToteID === undefined)) {
      const dialogRef: any = this.global.OpenDialog(AlertConfirmationComponent, {
        height: 'auto',
        width: Style.w786px,
        data: {
          message: 'All Tote IDs must be specified before submitting.',
          heading: !this.BulkProcess ? 'Batch Manager' : 'Verify Bulk Pick'
        },
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => { });
    } else {
      this.updateToteID();
    }
  }

  ClosePopup() {
    this.dialogRef.close(false);
  }

  updateToteID() {
    let orders: any = [];
    this.selectedList.forEach((element, i) => {
      orders[i] = [element.orderNumber, element.createNextToteID.toString()];
    });

    let paylaod = {
      orders: orders
    };

    this.iAdminApiService
      .PickToteIDUpdate(paylaod)
      .subscribe((res: any) => {
        if (res.isExecuted) {
          this.global.ShowToastr(ToasterType.Success, res.responseMessage, ToasterTitle.Success);
          this.dialogRef.close(true);
        } else {

          this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);

          console.log("PickToteIDUpdate", res.responseMessage);
        }
      });
  }

  validtote($event: any) {
    if (this.ValidateToteIDs && $event.target.value) {
      var obj = {
        toteid: $event.target.value
      }
      this.iBulkProcessApiService.validtote(obj).subscribe((res: any) => {
        if (!res) {
          const dialogRef: any = this.global.OpenDialog(AlertConfirmationComponent, {
            height: 'auto',
            width: Style.w786px,
            data: {
              message: 'The Tote ID you have entered is not valid. please re-enter the Tote ID or see your supervisor for assistance.',
              heading: 'Invalid Tote ID!'
            },
            autoFocus: DialogConstants.autoFocus,
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe((result) => {
            $event.target.value = null;
          });
        }
      })
    }
  }
}
