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

}
