import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/common/init/auth.service';

import { CmShipSplitLineComponent } from '../cm-ship-split-line/cm-ship-split-line.component';
import { CmShipEditQtyComponent } from '../cm-ship-edit-qty/cm-ship-edit-qty.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import {  ToasterTitle ,ToasterType} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-cm-confirm-and-packing-process-transaction',
  templateUrl: './cm-confirm-and-packing-process-transaction.component.html',
  styleUrls: ['./cm-confirm-and-packing-process-transaction.component.scss']
})
export class CmConfirmAndPackingProcessTransactionComponent implements OnInit {
  displayedColumns: string[] = ['itemNumber', 'lineNumber', 'transactionQuantity', 'completedQuantity', 'shipQuantity'];
  confPackProcTable: any = [];
  confPackTransTable: any = [];
  orderNumber: any;
  preferencesData: any;
  itemNumber: any;
  contID: any;
  id: any;
  userData: any = {};
  public iConsolidationAPI: IConsolidationApi;
  constructor(
    private global: GlobalService,
    public consolidationAPI: ConsolidationApiService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CmConfirmAndPackingProcessTransactionComponent>,) {
    this.userData = this.authService.userData();
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

  getPreferences() {
    let payload = {
      type: '',
      value: ''
    };

    this.iConsolidationAPI
      .ConsoleDataSB(payload)
      .subscribe((res) => {
        if (res.isExecuted && res.data) {
          this.preferencesData = res.data.cmPreferences;

        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        }
      });
  }
  async ConfPackProc() {
    this.iConsolidationAPI.ConfPackProcModal({ id: this.id }).subscribe((response: any) => {
      if (response.isExecuted && response.data) {
        this.confPackProcTable = response.data;
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ConfPackProcModal", response.responseMessage);
      }

    });
  }

  openShipSplitLine() {
    let index = this.confPackTransTable.findIndex(x => x.active);
    let dialogRef: any = this.global.OpenDialog(CmShipSplitLineComponent, {
      height: 'auto',
      width: '30vw',
      autoFocus: '__non_existing_element__',
      disableClose: true,
      data: {
        order: this.confPackTransTable[index],
        page: 'ConfPack'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.isExecuted) {
        this.ConfPackProc();
      }
    });
  }

  openShipEditQuantity() {
    let index = this.confPackTransTable.findIndex(x => x.active);
    let dialogRef: any = this.global.OpenDialog(CmShipEditQtyComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: '__non_existing_element__',
      disableClose: true,
      data: {
        reasons: this.data.reasons,
        order: this.confPackTransTable[index],
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.isExecuted) {
        this.ConfPackProc();
      }
    });
  }

  //will update the desired record(s) and go thorugh confirm proccess
  async DoneModal() {
    let id = this.confPackProcTable[0].sT_ID;
    let obj: any = {
      id: id,
      orderNumber: this.orderNumber,
      containerID: this.contID,
      modal: "From_Modal"
    };
    this.iConsolidationAPI.ConfPackProcModalUpdate(obj).subscribe((res: any) => {
      if (res) {
        if (res.data == "Fail") {
          this.global.ShowToastr(ToasterType.Error, "An error has occurred", ToasterTitle.Error);

        } else {
          //edit table 
          let index = this.confPackTransTable.findIndex(x => x.active);
          this.confPackTransTable[index].containerID = this.contID;
          this.confPackTransTable[index].complete = true;
          let emit = '';
          if (this.confPackTransTable.length == 1) {
            emit = 'ConfirmedPacked';
          };

          if (this.preferencesData?.autoPrintContLabel) {
            this.global.Print(`FileName:PrintConfPackLabel|OrderNum:${this.orderNumber}|contID:${this.contID}`);

          }
          if (this.preferencesData?.autoPrintContPL) {
            this.global.Print(`FileName:PrintConfPackPrintCont|OrderNum:${this.orderNumber}|contID:${this.contID}`);

          }
          if (this.preferencesData?.autoPrintOrderPL) {
            this.global.Print(`FileName:PrintConfPackPackList|OrderNum:${this.orderNumber}`);

          }
          this.dialogRef.close(emit);
        }
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error); 

      };
    });
  }

  ConfPackProcessModal() {
    this.dialogRef.close();
  }
}
