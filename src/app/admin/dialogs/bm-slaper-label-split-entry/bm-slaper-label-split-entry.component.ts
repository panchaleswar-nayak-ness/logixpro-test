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
import {HttpStatusCode, HttpResponse} from '@angular/common/http';
import {AssignToteToOrderDto, PartialToteIdRequest, PartialToteIdResponse, SlapperLabelResponse, ConsolidatedSlapperLabelResponse} from "../../../common/Model/bulk-transactions";
import { PrintApiService } from 'src/app/common/services/print-api/print-api.service';
import { BmToteidEntryComponent } from '../bm-toteid-entry/bm-toteid-entry.component';



@Component({
    selector: 'app-bm-slaper-label-split-entry',
    templateUrl: './bm-slaper-label-split-entry.component.html',
    styleUrls: ['./bm-slaper-label-split-entry.component.scss'],
})
export class BmSlaperLabelSplitEntryComponent implements OnInit {
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
          this.selectedList[i]['partialToteId'] = undefined;
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
        this.selectedList[index]['partialToteId'] = undefined;
      }
    }
  
    nextToteIdForRow(index: number) {
      if (this.view == 'batch' || this.view == 'tote') {
        return;
      }

      this.bulkProcessApiService.BatchNextTote(1).then((res) => {
        if (res.body?.nextId) {
          this.nextToteID = res.body.nextId;
          this.selectedList[index]['partialToteId'] = parseInt(this.nextToteID);
        }
      }).catch((error) => {
        this.global.ShowToastr(ToasterType.Error, 'Failed to get next tote ID', ToasterTitle.Error);
      });
    }

    submitOrder() {
      debugger;
      console.log('submitOrder', this.selectedList);
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
        .then((res: HttpResponse<AssignToteToOrderDto[]>) => {
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

    // Handle manual input changes for Partial Tote ID
    onPartialToteIdChange(value: any, index: number) {
      if (value !== undefined && value !== null && value !== '') {
        this.selectedList[index].partialToteId = value;
        console.log(`Partial Tote ID changed for index ${index}:`, value);
        console.log('Updated selectedList:', this.selectedList);
      }
    }

    async createNextTote() {
      try {
        // Log the current state of selectedList to debug
        console.log('Current selectedList:', this.selectedList);
        
        // Prepare the request data
        const requestData: PartialToteIdRequest[] = this.selectedList.map((item) => ({
          orderNumber: item.orderNumber,
          toteNumber: item.toteNumber?.toString(),
          toteID: item.toteId,
          partialToteID: item.partialToteId?.toString()
        }));
        
        // Validate that Partial Tote Id values are present
        const itemsWithPartialToteId = requestData.filter(item => item.partialToteID);
        
        if (itemsWithPartialToteId.length === 0) {
          this.global.ShowToastr(ToasterType.Info, 'No Partial Tote IDs found. Please generate Partial Tote IDs first using the Next Tote ID buttons or enter them manually.', ToasterTitle.Warning);
          return;
        }

        // Call the API
        const response: PartialToteIdResponse[] = await this.iBulkProcessApiService.GetNextToteIdForSlapperLabelAsync(requestData);
        
        if (response && response.length > 0) {
          // Process the response to group records by order number
          const processedResponse = this.processApiResponse(response as unknown as SlapperLabelResponse[]);
          
          // Close the current dialog before opening the new one
          this.dialogRef.close();
          
          // Open the BmToteidEntryComponent modal with the processed response data
          const dialogRef = this.global.OpenDialog(BmToteidEntryComponent, {
            height: DialogConstants.auto,
            width: Style.w990px,
            data: {
              selectedOrderList: processedResponse,
              rawOrderList: response,
              nextToteID: this.nextToteID,
              BulkProcess: this.BulkProcess,
              view: this.view,
              autoPrintPickToteLabels: this.autoPrintPickToteLabels,
              batchid: this.batchid,
              type: this.data.type
            },
            autoFocus: DialogConstants.autoFocus,
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              // Handle the result if needed
              this.global.ShowToastr(ToasterType.Success, 'Tote IDs created successfully', ToasterTitle.Success);
            }
          });
        } else {
          this.global.ShowToastr(ToasterType.Info, 'No tote IDs were generated', ToasterTitle.Warning);
        }
      } catch (error) {
        console.error('Error creating next tote:', error);
        this.global.ShowToastr(ToasterType.Error, 'Failed to create tote IDs', ToasterTitle.Error);
      }
    }

    /**
     * Process the API response to group records by order number
     * Shows one row for all records with isPartialCase: true for each order number
     * Shows individual rows for records with isPartialCase: false
     */
    private processApiResponse(response: SlapperLabelResponse[]): SlapperLabelResponse[] {
      const processedList: SlapperLabelResponse[] = [];
      
      // Group records by order number
      const groupedByOrder = this.groupByOrderNumber(response);
      
      // Process each order number group
      Object.keys(groupedByOrder).forEach(orderNumber => {
        const orderRecords = groupedByOrder[orderNumber];
        
        // Separate partial case and non-partial case records
        const partialCaseRecords = orderRecords.filter(record => record.isPartialCase === true);
        const nonPartialCaseRecords = orderRecords.filter(record => record.isPartialCase === false);
        
        // Add individual rows for non-partial case records
        nonPartialCaseRecords.forEach(record => {
          processedList.push(record);
        });
        
        // Add one consolidated row for all partial case records of this order
        if (partialCaseRecords.length > 0) {
          const consolidatedPartialRecord = this.createConsolidatedPartialRecord(partialCaseRecords, orderNumber);
          processedList.push(consolidatedPartialRecord);
          console.log(`Created consolidated record for order ${orderNumber}:`, consolidatedPartialRecord);
        }
      });
      
      console.log('Final processed list:', processedList);
      return processedList;
    }

    /**
     * Group records by order number
     */
    private groupByOrderNumber(response: SlapperLabelResponse[]): { [orderNumber: string]: SlapperLabelResponse[] } {
      const grouped: { [orderNumber: string]: SlapperLabelResponse[] } = {};
      
      response.forEach(record => {
        if (!grouped[record.orderNumber]) {
          grouped[record.orderNumber] = [];
        }
        grouped[record.orderNumber].push(record);
      });
      
      return grouped;
    }

    /**
     * Create a consolidated record for all partial case records of the same order
     */
    private createConsolidatedPartialRecord(partialRecords: SlapperLabelResponse[], orderNumber: string): ConsolidatedSlapperLabelResponse {
      // Use the first record as base and modify it to represent all partial records
      const baseRecord = { ...partialRecords[0] } as ConsolidatedSlapperLabelResponse;
      
      // Use only the first tote ID instead of concatenating all of them
      // This ensures we show one single tote ID instead of comma-separated values
      baseRecord.toteId = partialRecords[0].toteId;
      
      // Sum up the transaction quantities
      const totalQuantity = partialRecords.reduce((sum, record) => sum + record.transactionQuantity, 0);
      baseRecord.transactionQuantity = totalQuantity;
      
      // Mark as consolidated partial case
      baseRecord.isPartialCase = true;
      
      // Add metadata to indicate this is a consolidated record
      (baseRecord as ConsolidatedSlapperLabelResponse).isConsolidated = true;
      (baseRecord as ConsolidatedSlapperLabelResponse).originalPartialRecords = partialRecords;
      (baseRecord as ConsolidatedSlapperLabelResponse).consolidatedToteCount = partialRecords.length;
      
      return baseRecord;
    }
}
