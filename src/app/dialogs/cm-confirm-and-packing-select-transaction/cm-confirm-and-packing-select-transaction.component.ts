import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CmConfirmAndPackingProcessTransactionComponent } from '../cm-confirm-and-packing-process-transaction/cm-confirm-and-packing-process-transaction.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import {  StringConditions ,ToasterTitle,ToasterType,DialogConstants,TableConstant,ColumnDef, Placeholders} from 'src/app/common/constants/strings.constants';
import { ConfPackSelectTransaction, ConfPackTransaction } from 'src/app/common/interface/cm-confirm-and-packaging/conf-pack-select-transaction.interface';

@Component({
  selector: 'app-cm-confirm-and-packing-select-transaction',
  templateUrl: './cm-confirm-and-packing-select-transaction.component.html',
  styleUrls: ['./cm-confirm-and-packing-select-transaction.component.scss']
})
export class CmConfirmAndPackingSelectTransactionComponent implements OnInit { 
  placeholders = Placeholders;
  itemNumber: any;
  orderNumber: any;
  confPackSelectTable: ConfPackSelectTransaction[] = [];
  preferencesData: any; 
  displayedColumns: string[] = ['sT_ID', 'itemNumber', TableConstant.LineNumber, TableConstant.completedQuantity, ColumnDef.TransactionQuantity];
  dataSourceList: any
  confPackTransTable: any;
  contID: any;
  id: any;
  selectedRow: ConfPackSelectTransaction | null = null;
  public iConsolidationAPI: IConsolidationApi;

  constructor(
    public consolidationAPI: ConsolidationApiService,
    private global: GlobalService, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CmConfirmAndPackingSelectTransactionComponent>,) {
    this.confPackTransTable = this.data.confPackTransTable;
    this.orderNumber = this.data.orderNumber;
    this.contID = this.data.contID;
    this.id = this.data.id;
    this.itemNumber = this.data.ItemNumber;
    this.iConsolidationAPI = consolidationAPI;
  }

  ngOnInit(): void {
    this.ConfPackProc();
  }

  async ConfPackProc() {
    let obj: any = {
      "orderNumber": this.orderNumber,
      "itemNumber": this.itemNumber
    };
    this.iConsolidationAPI.ConfPackSelectDT(obj).subscribe((response: any) => {
      if (response.isExecuted && response.data) {
        this.confPackSelectTable = response.data;

      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error); 

      }

    });
  }

  selectRow(row: ConfPackSelectTransaction) {
    this.selectedRow = row;
  }

  isRowSelected(row: ConfPackSelectTransaction): boolean {
    return this.selectedRow !== null && this.selectedRow.sT_ID === row.sT_ID;
  }

  openScanItem(ItemNumber: any, id: any) {
    let index = this.confPackTransTable.findIndex(x => x.sT_ID == id);
    this.confPackTransTable[index].active = true;
    let dialogRef: any = this.global.OpenDialog(CmConfirmAndPackingProcessTransactionComponent, {
      height: 'auto',
      width: '96vw',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: { ItemNumber: ItemNumber, orderNumber: this.orderNumber, contID: this.contID, confPackTransTable: this.confPackTransTable, id: id }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'ConfirmedPacked') {
        this.ConfPackProc();
      }
    })
  }
  async ConfPackSelectTableClick(id) {
    if (!this.selectedRow) {
      return;
    }
    let obj: any = {
      id: this.selectedRow.sT_ID,
      orderNumber: this.orderNumber,
      containerID: this.contID,
      modal: ""
    };
    this.iConsolidationAPI.ConfPackProcModalUpdate(obj).subscribe((res: any) => {
      if (res) {
        if (res.data == "Fail") {
          this.global.ShowToastr(ToasterType.Error, 'An error has occurred', ToasterTitle.Error);
          console.log("ConfPackProcModalUpdate", res.responseMessage);
        } else if (res.data == "Modal") {
          if (this.selectedRow) {
            this.openScanItem(this.itemNumber, this.selectedRow.sT_ID);
          }


        } else {

          if (this.preferencesData?.autoPrintContLabel) {
            this.global.Print(`FileName:PrintConfPackLabel|OrderNum:${this.orderNumber}|contID:${this.contID}`);

          }
          if (this.preferencesData?.autoPrintContPL) {
            this.global.Print(`FileName:PrintConfPackPrintCont|OrderNum:${this.orderNumber}|contID:${this.contID}`);

          }
          if (this.preferencesData?.autoPrintOrderPL) {
            this.global.Print(`FileName:PrintConfPackPackList|OrderNum:${this.orderNumber}`);

          }
          if (this.selectedRow) {
            // Get containerID with clear priority: selectedRow > contID
            let containerID = this.selectedRow.containerID ?? this.contID;
            
            // If you need to verify against transTable, do it explicitly
            if (this.confPackTransTable) {
              const transData = this.confPackTransTable.filteredData || this.confPackTransTable.data || this.confPackTransTable;
              if (Array.isArray(transData)) {
                const found = transData.find((x: ConfPackTransaction) => x.sT_ID === this.selectedRow?.sT_ID);
                if (found?.containerID) {
                  containerID = found.containerID;
                }
              }
            }
            
            this.dialogRef.close({ 
              isExecuted: true, 
              containerID: containerID,
              selectedId: this.selectedRow.sT_ID
            });
          }
        }

      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ConfPackProcModalUpdate", res.responseMessage);

      };
    });

  }

}
