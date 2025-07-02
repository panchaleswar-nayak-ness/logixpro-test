import { IQueryParams } from "src/app/consolidation-manager/cm-route-id-management/routeid-list/routeid-IQueryParams";

export interface IMarkoutNewApiService {
  GetMarkoutNewData(request: IQueryParams );
  GetToteAudit(payload: IQueryParams, toteId :number);
  GetTotePickLines(payload: IQueryParams, toteId :number);
  ResolveMarkoutTote(toteId: number);
}
