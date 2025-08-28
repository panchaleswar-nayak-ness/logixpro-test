import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AlertConfirmationComponent} from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import {AuthService} from 'src/app/common/init/auth.service';
import {IAdminApiService} from 'src/app/common/services/admin-api/admin-api-interface';
import {AdminApiService} from 'src/app/common/services/admin-api/admin-api.service';
import {GlobalService} from 'src/app/common/services/global.service';
import {DialogConstants, Style, ToasterMessages, ToasterTitle, ToasterType, ApiErrorMessages} from 'src/app/common/constants/strings.constants';
import {IBulkProcessApiService} from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import {BulkProcessApiService} from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import {HttpStatusCode} from '@angular/common/http';
import {AssignToteToOrderDto, RemoveOrderLinesRequest, RemoveOrderLinesResponse} from "../../../common/Model/bulk-transactions";
import { PrintApiService } from 'src/app/common/services/print-api/print-api.service';
import { ApiResult } from 'src/app/common/types/CommonTypes';
import { PartialToteIdResponse } from 'src/app/common/Model/bulk-transactions';

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
  batchid: any;
  public iAdminApiService: IAdminApiService;
  public iBulkProcessApiService: IBulkProcessApiService;
  constructor(
    public dialogRef: MatDialogRef<any>,
    public bulkProcessApiService: BulkProcessApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global: GlobalService,
    public adminApiService: AdminApiService,
    private authService: AuthService,
    private printApiService: PrintApiService
  ) {
    this.selectedList = data.selectedOrderList;
    this.iAdminApiService = adminApiService;
    this.iBulkProcessApiService = bulkProcessApiService;
    this.nextToteID = data.nextToteID;
    this.BulkProcess = data.BulkProcess;
    this.view = data.view;
    this.autoPrintPickToteLabels = data.autoPrintPickToteLabels;
    this.batchid = data.batchid;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    if (this.view == 'tote') {
      this.selectedList.forEach((x: any) => { x.toteId = x.toteId });
    }
    
    // Assign sequential tote numbers (1, 2, 3, etc.) to each item
    this.selectedList.forEach((item: any, index: number) => {
      item.toteNumber = index + 1;
    });
    
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
    let positions = this.selectedList.map(o => o['toteNumber']);

    if (this.view == 'batchmanager') {
      this.printApiService.PrintBatchManagerToteLabel(positions, toteIds, orderNumbers, this.batchid);
    } else {
      this.iAdminApiService.PrintTotes(orderNumbers, toteIds, this.data.type);
    }

  }
  printTote(index) {
    let orderNumber = [this.selectedList[index]['orderNumber']];
    let toteId = [this.selectedList[index]['toteId']];
    let position = [this.selectedList[index]['toteNumber']];

    if (this.view == 'batchmanager') {
      this.printApiService.PrintBatchManagerToteLabel(position, toteId, orderNumber, this.batchid);
    } else {
      this.iAdminApiService.PrintTotes(orderNumber, toteId, this.data.type, index);
    }

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

    this.bulkProcessApiService.BatchNextTote(this.selectedList.length).then((res) => {
      this.nextToteID = res.body?.nextId;
      this.selectedList.forEach((element, i) => {
        this.selectedList[i].IsTote = false;
        this.selectedList[i].IsError = false;
        this.selectedList[i]['toteId'] = i == 0 ? parseInt(this.nextToteID) : parseInt(this.nextToteID) + i;
      });
    });
  }

  submitOrder() {
    if(this.data.rawOrderList != null){
      this.submitCaseWiseOrders().catch(error => {
        this.global.ShowToastr(ToasterType.Error, ApiErrorMessages.ErrorSubmittingCaseWiseOrders, ToasterTitle.Error);
      });
      return;
    }
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

  async removeOrderLinesFromTote(): Promise<boolean> {
    try {
      const uniqueOrderNumbers = [...new Set(this.data.rawOrderList.map((item: any) => item.orderNumber))].filter((orderNumber): orderNumber is string => typeof orderNumber === 'string');
      const request: RemoveOrderLinesRequest = {
        orderNumbers: uniqueOrderNumbers
      };
      const result: RemoveOrderLinesResponse = await this.iBulkProcessApiService.RemoveOrderLinesFromTote(request);
      if (result.isSuccess) {
        return true;
      } else {
        // Display all error messages or fallback to default message
        const errorMessage = result.errorMessages && result.errorMessages.length > 0 
          ? result.errorMessages.join(', ') 
          : ApiErrorMessages.FailedToRemoveOrderLinesFromTote;
        this.global.ShowToastr(ToasterType.Error, errorMessage, ToasterTitle.Error);
        return false;
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ApiErrorMessages.ErrorRemovingOrderLinesFromTote, ToasterTitle.Error);
      return false;
    }
  }

  async submitCaseWiseOrders() {
    // Ensure rawOrderList is valid before proceeding
    if (!this.data.rawOrderList || !Array.isArray(this.data.rawOrderList) || this.data.rawOrderList.length === 0) {
      this.global.ShowToastr(ToasterType.Error, 'No valid order data to submit', ToasterTitle.Error);
      return;
    }

    
    this.iBulkProcessApiService.SubmitCaseWiseOrders(this.data.rawOrderList)
      .then((result: ApiResult<PartialToteIdResponse[]>) => {
        if (result.isSuccess) {
          this.global.ShowToastr(ToasterType.Success, ToasterMessages.RecordUpdatedSuccessful, ToasterTitle.Success);
          const apiResponseData = result.value || [];
          const orderGroups = new Map();
          apiResponseData.forEach(item => {
            const orderNumber = item.orderNumber;
            if (!orderGroups.has(orderNumber)) {
              orderGroups.set(orderNumber, {
                orderNumber: orderNumber,
                toteId: item.toteID, // Use toteID from API response
                toteNumber: 1, // Default tote number
                orderLines: []
              });
            }
            orderGroups.get(orderNumber).orderLines.push({
              ...item // This should include the correct id from API response
            });
          });
          const transformedData = Array.from(orderGroups.values());
          this.dialogRef.close(transformedData);
          // Now, remove order lines from tote
          const removeSuccess = this.removeOrderLinesFromTote();
          if (!removeSuccess) {
            return; // Stop execution if removal failed
          }
        } else {
          this.global.ShowToastr(ToasterType.Error, result.errorMessage || ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
        }
      })
      .catch((error) => {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
    });
    
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
