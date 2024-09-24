import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AlertConfirmationComponent} from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import {AuthService} from 'src/app/common/init/auth.service';
import {IAdminApiService} from 'src/app/common/services/admin-api/admin-api-interface';
import {AdminApiService} from 'src/app/common/services/admin-api/admin-api.service';
import {GlobalService} from 'src/app/common/services/global.service';
import {DialogConstants, Style, ToasterMessages, ToasterTitle, ToasterType} from 'src/app/common/constants/strings.constants';
import {IBulkProcessApiService} from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import {BulkProcessApiService} from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import {HttpStatusCode} from '@angular/common/http';
import {AssignToteToOrderDto} from "../../../common/Model/bulk-transactions";

@Component({
  selector: 'app-bm-toteid-entry',
  templateUrl: './bm-toeid-entry.component.html',
  styleUrls: ['./bm-toeid-entry.component.scss'],
})
export class BmToteidEntryComponent implements OnInit {
  selectedList: any;
  nextToteID: any;
  preferences: any;
  userData: any;
  BulkProcess: any = false;
  view: string;
  autoPrintPickToteLabels: boolean;
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
    this.view = data.view;
    this.autoPrintPickToteLabels = data.autoPrintPickToteLabels;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    if (this.view == 'tote') {
      this.selectedList.forEach((x: any) => { x.toteId = x.toteId });
    }
    this.companyInfo();
  }

  // TODO: No need to get workstation preferences again.  We can pass them from the parent component.
  companyInfo() {
    this.iAdminApiService.WorkstationSetupInfo().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.preferences = res.data;
      }
    })
  }

  clearAll() {
    if(this.view != 'batch' && this.view != 'tote'){
      this.selectedList.forEach((element, i) => {
        this.selectedList[i]['toteId'] = undefined;
      });
    }
  }
  printAllToteLabels() {
    let orderNumbers = this.selectedList.map(o =>o['orderNumber']);
    let toteIds = this.selectedList.map(o => o['toteId']);
    this.iAdminApiService.PrintTotes(orderNumbers, toteIds,this.data.type);
  }
  printTote(index) {
    let orderNumber = [this.selectedList[index]['orderNumber']];
    let toteId = [this.selectedList[index]['toteId']];
    this.iAdminApiService.PrintTotes(orderNumber, toteId, this.data.type, index);
  }
  removeToteID(index) {
    if(this.view != 'batch' && this.view != 'tote'){
      this.selectedList[index]['toteId'] = undefined;
    }
  }

  createNextTote() {
    if (this.view == 'batch' || this.view == 'tote') {
      return;
    }

    this.bulkProcessApiService.BatchNextTote(this.selectedList.length + 1).then((res) => {
      this.nextToteID = res.body?.nextId;
      this.selectedList.forEach((element, i) => {
        this.selectedList[i].IsTote = false;
        this.selectedList[i].IsError = false;
        this.selectedList[i]['toteId'] =
          parseInt(this.nextToteID) + i + 1;
      });
    });
  }

  submitOrder() {
    if (this.selectedList.find(x => x.IsTote == true)) {
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
        this.selectedList.filter(x => x.IsTote == true).forEach(obj => {
          obj.IsError = true;
        });
      });
    } else if (this.selectedList.find((o) => o.toteId === undefined)) {
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
      // TODO: No need to subscribe to afterClosed if we are not doing anything with the result.
      dialogRef.afterClosed().subscribe((result) => {
      });
    } else if (this.view == 'batch' || this.view == 'tote') {
      this.dialogRef.close(this.selectedList);
    } else {
      this.updateToteID();
    }
  }

  ClosePopup() {
    this.dialogRef.close(false);
  }

  updateToteID() {
    let orders: AssignToteToOrderDto[] = [];
    this.selectedList.forEach((element, i) => {
      let order: AssignToteToOrderDto = {
        orderNumber: element.orderNumber,
        toteId: element.toteId,
        type: this.data.type
      };
      orders.push(order);
    });

    this.iBulkProcessApiService.AssignToteToOrder(orders)
      .then((res: any) => {
        if (res.status == HttpStatusCode.NoContent) {
          if (this.autoPrintPickToteLabels) {
            this.printAllToteLabels();
          }
          this.global.ShowToastr(ToasterType.Success, ToasterMessages.RecordUpdatedSuccessful, ToasterTitle.Success);
          this.dialogRef.close(this.selectedList);
        } else {
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
        }
      });
  }

  async validtote($event: any, i: any = null) {
    if ($event.target.value) {
      var obj = {
        toteid: $event.target.value
      }
      let res: any = await this.iBulkProcessApiService.validtote(obj);
      if (res?.status == HttpStatusCode.NoContent) {
        this.selectedList[i].IsTote = false;
        this.selectedList[i].IsError = false;
      } else {
        this.selectedList[i].IsTote = true;
      }
    }
  }
}
