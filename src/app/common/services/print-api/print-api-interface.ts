import { PrintOrdersPayload } from "../../interface/bulk-transactions/bulk-pick";

export interface IPrintApiService {

  PrintManualTrans(Id: number);
  printSelectedOrdersReport(payload:PrintOrdersPayload,showLoader:boolean);

}
