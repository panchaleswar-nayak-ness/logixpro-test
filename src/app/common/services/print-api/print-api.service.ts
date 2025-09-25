import {Injectable} from '@angular/core';
import {ApiFuntions} from "../ApiFuntions";
import {AuthService} from "../../init/auth.service";
import {IPrintApiService} from "./print-api-interface";
import { PrintOrdersPayload } from '../../interface/bulk-transactions/bulk-pick';
import { PrintToteLabelsPayload } from '../../interface/induction-manager/print-lable/print-lable.interface';

@Injectable({
  providedIn: 'root'
})
export class PrintApiService implements IPrintApiService {
  private userData: any;

  constructor(
    private Api: ApiFuntions,
    private authService: AuthService) {
    this.userData = this.authService.userData();
  }

  public async TestPrint(message: string, printerAddress: string) {
    const payload = {
      Message: message,
      PrintAddress: printerAddress
    }
    return await this.Api.TestPrint(payload);
  }

  public async PrintManualTrans(Id: number) {
    const payload = {
      Wsid: this.userData.wsid,
      User: this.userData.userName,
      Id: Id,
    }
    return await this.Api.PrintManualTrans(payload);
  }

  public async PrintMoToteManifest(toteID: string) {
    const payload = {
      Wsid: this.userData.wsid,
      User: this.userData.userName,
      ToteID: toteID
    }
    return await this.Api.PrintMoToteManifest(payload);
  }

  public async PrintMoToteManifest2(toteID: string) {
    const payload = {
      Wsid: this.userData.wsid,
      User: this.userData.userName,
      ToteID: toteID
    }
    return await this.Api.PrintMoToteManifest2(payload);
  }

  public async PrintMarkoutReport(toteID: string) {
    const payload = {
      Wsid: this.userData.wsid,
      User: this.userData.userName,
      ToteID: toteID
    }
    return await this.Api.PrintMarkoutReport(payload);
  }

  public async PrintCrossDockTote(reprocessId, zone: string, toteId: string) {
    const payload = {
      wsid: this.userData.wsid,
      reprocessId: reprocessId,
      zone: zone,
      toteId: toteId,
    };
    return await this.Api.PrintCrossDockTote(payload);
  }

  public async PrintCrossDockItem(reprocessId: number, zone: string) {
    const payload = {
      wsid: this.userData.wsid,
      reprocessId: reprocessId,
      zone: zone,
    };
    return await this.Api.PrintCrossDockItem(payload);
  }

  public async PrintCrossDockToteAuto(OTRecID: bigint, zone: any) {
    const payload = {
      wsid: this.userData.wsid,
      otId: OTRecID,
      zone: zone,
    };
    return await this.Api.PrintCrossDockToteAuto(payload);
  }

  public async PrintCrossDockItemAuto(OTRecID: bigint, zone: any) {
    const payload = {
      wsid: this.userData.wsid,
      otId: OTRecID,
      zone: zone,
    };
    return await this.Api.PrintCrossDockItemAuto(payload);
  }

  public async PrintPutAwayItem(otid: number) {
    const payload = {
      wsid: this.userData.wsid,
      otid: otid,
    };
    return await this.Api.PrintPutAwayItem(payload);
  }

  public async PrintOrderStatusReport(orderNumber: string, toteID: string, OrderIDs :any) {

    /*
      Ident meaning:
      0: Where Order Number = @OrderNumber
      1: where ToteID = @ToteID
      2: where OrderNumber = @OrderNumber and ToteID = @ToteID
    */
    // var ident = 0;
    // if (toteID != "") {
    //   if (orderNumber != "") {
    //     ident = 2;
    //   } else {
    //     ident=1;
    //   };
    // };

    const payload = {
      wsid: this.userData.wsid,
      orderNumber: orderNumber,
      toteID: toteID,
      ident: 3,
      orderIDs:OrderIDs
    };

    return await this.Api.PrintOrderStatusReport(payload);
  }

  public async PrintOffCarList(batchID: string) {
    const payload = {
          wsid: this.userData.wsid,
          batchID: batchID,
        };
    return await this.Api.PrintOffCarList(payload);
  }

  public async PrintPrevToteTransViewCont(batchID: string, toteNum: number) {
    const payload = {
          wsid: this.userData.wsid,
          batchID: batchID,
          toteNum: toteNum
        };
    return await this.Api.PrintPrevToteTransViewCont(payload);
  }

  public async PrintPrevToteItemLabel(ID: number, batchID: string, toteNum: number) {
    const payload = {
          wsid: this.userData.wsid,
          ID: ID,
          batchID: batchID,
          toteNum: toteNum
        };
    return await this.Api.PrintPrevToteItemLabel(payload);
  }

  public async PrintPrevToteContentsLabel(toteID: string, zoneLabel: string, transType: string, ID: number, batchID: string) {
    const payload = {
          wsid: this.userData.wsid,
          toteID: toteID,
          zoneLabel: zoneLabel,
          transType: transType,
          ID: ID,
          batchID: batchID
        };
    return await this.Api.PrintPrevToteContentsLabel(payload);
  }

  public async PrintPrevToteManLabel(toteID: string, Ident: number, fromTote: string, toTote: string, batchID: string) {
    const payload = {
          wsid: this.userData.wsid,
          toteID: toteID,
          Ident: Ident,
          fromTote: fromTote,
          toTote: toTote,
          batchID: batchID
        };
    return await this.Api.PrintPrevToteManLabel(payload);
  }


  public async PrintBatchManagerReport(orderNumbers: Array<string>, batchID: string, transType: string) {
    const payload = {
      wsid: this.userData.wsid,
      orderNumbers: orderNumbers,
      batchID: batchID,
      transType: transType
    }

    return await this.Api.PrintBatchManagerReport(payload);
  }

  public async PrintBatchManagerItemLabel(orderNumbers: Array<string>, batchID: string, transType: string) {
    const payload = {
      wsid: this.userData.wsid,
      orderNumbers: orderNumbers,
      batchID: batchID,
      transType: transType
    }

    return await this.Api.PrintBatchManagerItemLabel(payload);
  }

  public async PrintBatchManagerToteLabel(positions: Array<number>, toteIDs: Array<string>, orderNumbers: Array<string>, batchID: string) {
    const payload = {
      wsid: this.userData.wsid,
      positions: positions,
      toteIDs: toteIDs,
      orderNumbers: orderNumbers,
      batchID: batchID,
    }

    return await this.Api.PrintBatchManagerToteLabel(payload);
  }

  public async PrintBulkTraveler(transIDs: Array<number>) {
    const payload = {
      wsid: this.userData.wsid,
      transIDs: transIDs
    }

    return await this.Api.PrintBulkTraveler(payload);
  }

  public async PrintBulkTransactionsTravelerOrder(transIDs: Array<number>) {
    const payload = {
      wsid: this.userData.wsid,
      transIDs: transIDs
    }

    return await this.Api.PrintBulkTransactionsTravelerOrder(payload);
  }

  public async PrintOCPItem(transIDs: Array<number>) {
    const payload = {
      wsid: this.userData.wsid,
      transIDs: transIDs
    }

    return await this.Api.PrintOCPItem(payload);
  }

  public async ProcessPickPrintPickTote(positions: Array<number>, toteIDs: Array<string>, orderNumbers: Array<string>, batchID: string) {
    const payload = {
      wsid: this.userData.wsid,
      positions: positions,
      toteIDs: toteIDs,
      orderNumbers: orderNumbers,
      batchID: batchID,
    }

    return await this.Api.ProcessPickPrintPickTote(payload);
  }


  public async ProcessPickPrintPickItemLabel(positions: Array<number>, toteIDs: Array<string>, orderNumbers: Array<string>, batchID: string) {
    const payload = {
      wsid: this.userData.wsid,
      positions: positions,
      toteIDs: toteIDs,
      orderNumbers: orderNumbers,
      batchID: batchID,
    }

    return await this.Api.ProcessPickPrintPickItemLabel(payload);
  }


  public async ProcessPickPrintPickList(positions: Array<number>, toteIDs: Array<string>, orderNumbers: Array<string>, batchID: string) {
    const payload = {
      wsid: this.userData.wsid,
      positions: positions,
      toteIDs: toteIDs,
      orderNumbers: orderNumbers,
      batchID: batchID,
    }

    return await this.Api.ProcessPickPrintPickList(payload);
  }

  public async ProcessPickPrintPickToteAuto(positions: Array<number>, toteIDs: Array<string>, orderNumbers: Array<string>, batchID: string) {
    const payload = {
      wsid: this.userData.wsid,
      positions: positions,
      toteIDs: toteIDs,
      orderNumbers: orderNumbers,
      batchID: batchID,
    }

    return await this.Api.ProcessPickPrintPickToteAuto(payload);
  }

  public async ProcessPickPrintPickListAuto(positions: Array<number>, toteIDs: Array<string>, orderNumbers: Array<string>, batchID: string) {
    const payload = {
      wsid: this.userData.wsid,
      positions: positions,
      toteIDs: toteIDs,
      orderNumbers: orderNumbers,
      batchID: batchID,
    }

    return await this.Api.ProcessPickPrintPickListAuto(payload);
  }


  public async ProcessPickPrintBatchToteLabel(batchID: string) {
    const payload = {
      wsid: this.userData.wsid,
      batchID: batchID
    }

    return await this.Api.ProcessPickPrintBatchToteLabel(payload);
  }

  public async ProcessPickPrintBatchItemLabel(batchID: string) {
    const payload = {
      wsid: this.userData.wsid,
      batchID: batchID
    }

    return await this.Api.ProcessPickPrintBatchItemLabel(payload);
  }

  public async ProcessPickPrintBatchPickList(batchID: string) {
    const payload = {
      wsid: this.userData.wsid,
      batchID: batchID
    }

    return await this.Api.ProcessPickPrintBatchPickList(payload);
  }

  public async ProcessPickPrintCaseLabel(batchID: string) {
    const payload = {
      wsid: this.userData.wsid,
      batchID: batchID
    }

    return await this.Api.ProcessPickPrintCaseLabel(payload);
  }

  public async ProcessPickPrintBatchList(batchID: string) {
    const payload = {
      wsid: this.userData.wsid,
      batchID: batchID
    }

    return await this.Api.ProcessPickPrintBatchList(payload);
  }
  public async ProcessOffCarListTote(toteID: string, transType: string) {
    const payload = {
      wsid: this.userData.wsid,
      toteID: toteID,
      transType: transType
    }

    return await this.Api.PrintPrevOffCarListTote(payload);
  }
  public async ProcessToteContent(toteID: string, zoneLabel: string, transType: string) {
    const payload = {
      wsid: this.userData.wsid,
      toteID: toteID,
      zoneLabel: zoneLabel,
      transType: transType
    }

    return await this.Api.PrintPrevToteContent(payload);
  }

  public async ProcessCycleCountDetailsPrint(orderNumber: string) {
    const payload = {
      wsid: this.userData.wsid,
      orderNumber: orderNumber
    }

    return await this.Api.CycleCountPrintCycleCountDetails(payload);
  }

  public async ProcessCycleCountPrint(searchString: string, searchColumn: string, filter: string) {
    const payload = {
      wsid: this.userData.wsid,
      searchString: searchString,
      searchColumn: searchColumn,
      filter: filter
    }

    return await this.Api.OpenTransactionsPrintCycleCount(payload);
  }

  public async printSelectedOrdersReport(payload:PrintOrdersPayload,showLoader:boolean) {
    return await this.Api.printSelectedOrdersReport(payload,showLoader);
  }

  public async printToteLabels(payloadParams: string[]) {
    const payload = {
      wsid: this.userData.wsid,
      toteIds: payloadParams,
    };
    return await this.Api.printToteLabels(payload);
  }
}
