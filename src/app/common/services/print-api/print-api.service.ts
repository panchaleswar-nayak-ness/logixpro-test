import {Injectable} from '@angular/core';
import {ApiFuntions} from "../ApiFuntions";
import {AuthService} from "../../init/auth.service";
import {IPrintApiService} from "./print-api-interface";

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

  public async PrintOrderStatusReport(orderNumber: string, toteID: string) {

    /*
      Ident meaning:
      0: Where Order Number = @OrderNumber
      1: where ToteID = @ToteID
      2: where OrderNumber = @OrderNumber and ToteID = @ToteID
    */
    var ident = 0;
    if (toteID != "") {
      if (orderNumber != "") {
        ident = 2;
      } else {
        ident=1;
      };
    };

    const payload = {
      wsid: this.userData.wsid,
      orderNumber: orderNumber,
      toteID: toteID,
      ident: ident
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

}
