import { PrintReports } from "../../constants/strings.constants";

export interface PrintOrdersPayload {
  ReportName: string;
  wsid: string;
  OrderNumbers: string[];
}
export interface PrintTransactionPayload {
  wsid: string;
  transIDs: number[];
}