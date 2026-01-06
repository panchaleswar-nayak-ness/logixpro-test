import {Component, Inject, Input, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, NgZone} from '@angular/core';
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
import {AssignToteToOrderDto, RemoveOrderLinesRequest, RemoveOrderLinesResponse, SelectedOrderItem} from "../../../common/Model/bulk-transactions";
import { PrintApiService } from 'src/app/common/services/print-api/print-api.service';
import { ApiResult } from 'src/app/common/types/CommonTypes';
import { PartialToteIdResponse } from 'src/app/common/Model/bulk-transactions';

@Component({
  selector: 'app-bm-toteid-entry',
  templateUrl: './bm-toeid-entry.component.html',
  styleUrls: ['./bm-toeid-entry.component.scss'],
})
export class BmToteidEntryComponent implements OnInit, AfterViewInit {
  selectedList: SelectedOrderItem[];
  nextToteID: any;
  preferences: any;
  userData: any;
  BulkProcess: any = false;
  view: string;
  autoPrintPickToteLabels: boolean;
  batchid: any;
  assignToteToOrderCalled: boolean = false;
  public iAdminApiService: IAdminApiService;
  public iBulkProcessApiService: IBulkProcessApiService;
  @ViewChildren('toteIdInput') toteIdInputs!: QueryList<ElementRef>;
  constructor(
    public dialogRef: MatDialogRef<any>,
    public bulkProcessApiService: BulkProcessApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global: GlobalService,
    public adminApiService: AdminApiService,
    private authService: AuthService,
    private printApiService: PrintApiService,
    private ngZone: NgZone
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
      this.selectedList.forEach((x: SelectedOrderItem) => { x.toteId = x.toteId });
    }
    
    // Assign sequential tote numbers (1, 2, 3, etc.) to each item
    this.selectedList.forEach((item: SelectedOrderItem, index: number) => {
      item.toteNumber = index + 1;
    });
    
    this.companyInfo();
  }

  ngAfterViewInit(): void {
    // Auto-focus on the first empty Tote ID field
    this.focusFirstEmptyToteId();
  }

  private isToteIdEmpty(toteId: undefined | null | string | number): boolean {
    return toteId === undefined || toteId === null || toteId.toString().trim() === '';
  }

  private focusFirstEmptyToteId(): void {
    // Find the first empty tote ID field
    const firstEmptyIndex = this.selectedList.findIndex(
      item => this.isToteIdEmpty(item.toteId)
    );

    if (firstEmptyIndex !== -1) {
      // Focus on the first empty field
      const inputs = this.toteIdInputs.toArray();
      if (inputs[firstEmptyIndex]) {
        this.ngZone.run(() => {
          inputs[firstEmptyIndex].nativeElement.focus();
        });
      }
    }
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
      this.selectedList.forEach((element: SelectedOrderItem, i) => {
        this.selectedList[i].toteId = undefined;
      });
    }
  }
  printAllToteLabels() {
    let orderNumbers = this.selectedList.map(o => o.orderNumber);
    let toteIds = this.selectedList.map(o => String(o.toteId!));
    let positions = this.selectedList.map(o => o.toteNumber!);

    if (this.view == 'batchmanager') {
      this.printApiService.PrintBatchManagerToteLabel(positions, toteIds, orderNumbers, this.batchid);
    } else {
      this.iAdminApiService.PrintTotes(orderNumbers, toteIds, this.data.type);
    }

  }
  printTote(index: number) {
    let orderNumber = [this.selectedList[index].orderNumber];
    let toteId = [String(this.selectedList[index].toteId!)];
    let position = [this.selectedList[index].toteNumber!];

    if (this.view == 'batchmanager') {
      this.printApiService.PrintBatchManagerToteLabel(position, toteId, orderNumber, this.batchid);
    } else {
      this.iAdminApiService.PrintTotes(orderNumber, toteId, this.data.type, index);
    }

  }
  removeToteID(index: number) {
    if(this.view != 'batch' && this.view != 'tote'){
      this.selectedList[index].toteId = undefined;
    }
  }

  createNextTote() {
    if (this.view == 'batch' || this.view == 'tote') {
      return;
    }

    this.bulkProcessApiService.BatchNextTote(this.selectedList.length).then((res) => {
      this.nextToteID = res.body?.nextId;
      this.selectedList.forEach((element: SelectedOrderItem, i) => {
        this.selectedList[i].IsTote = false;
        this.selectedList[i].IsError = false;
        this.selectedList[i].toteId = i == 0 ? parseInt(this.nextToteID) : parseInt(this.nextToteID) + i;
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
      this.dialogRef.close({ selectedList: this.selectedList, assignToteToOrderCalled: false });
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
    this.selectedList.forEach((element: SelectedOrderItem, i) => {
      let order: AssignToteToOrderDto = {
        orderNumber: element.orderNumber,
        toteId: String(element.toteId),
        type: this.data.type
      };
      orders.push(order);
    });

    this.iBulkProcessApiService.AssignToteToOrder(orders)
      .then((res: any) => {
        if (res.status == HttpStatusCode.NoContent) {
          this.assignToteToOrderCalled = true;
          if (this.autoPrintPickToteLabels) {
            this.printAllToteLabels();
          }
          this.global.ShowToastr(ToasterType.Success, ToasterMessages.RecordUpdatedSuccessful, ToasterTitle.Success);
          this.dialogRef.close({ selectedList: this.selectedList, assignToteToOrderCalled: this.assignToteToOrderCalled });
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

  onToteIdEnter(currentIndex: number) {
    // Find the next empty tote ID field
    for (let i = currentIndex + 1; i < this.selectedList.length; i++) {
      if (this.isToteIdEmpty(this.selectedList[i].toteId)) {
        // Focus on the next empty field
        const inputs = this.toteIdInputs.toArray();
        if (inputs[i]) {
          this.ngZone.run(() => {
            inputs[i].nativeElement.focus();
          });
        }
        break;
      }
    }
  }
}
