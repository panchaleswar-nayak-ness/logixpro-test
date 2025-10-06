import { PrintOrdersPayload } from "../../interface/bulk-transactions/bulk-pick";
import { PrintToteLabelsPayload } from "../../interface/induction-manager/print-lable/print-lable.interface";

export interface IPrintApiService {

  PrintManualTrans(Id: number);
  printSelectedOrdersReport(payload:PrintOrdersPayload,showLoader:boolean);
  PrintBulkTransactionsTravelerOrder(transIDs: Array<number>);
  PrintOCPItem(transIDs: Array<number>);
  printToteLabels(payload: string[]);

}
