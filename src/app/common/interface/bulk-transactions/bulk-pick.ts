import { PrintReports } from "../../constants/strings.constants";

export interface PrintOrdersPayload {
  clientCustomData: PrintReports;
  repositoryIdOfProject: string;
  printerReportName: string | null;
  printerLabelName: string | null;
  orderNumbers: string[];
}

export interface PrintTransactionPayload {
  wsid: string;
  transIDs: number[];
}