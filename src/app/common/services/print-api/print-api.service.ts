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
}
