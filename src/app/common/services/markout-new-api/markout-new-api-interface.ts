import { IQueryParams } from "src/app/consolidation-manager/cm-route-id-management/routeid-list/routeid-IQueryParams";
import { Observable } from "rxjs";
import { PickLineSuggestionResponse, PickTotesSuggestionResponse } from "src/app/consolidation-manager/cm-markout-new/models/cm-markout-new-models";

export interface IMarkoutNewApiService {
  GetMarkoutNewData(request: IQueryParams );
  GetToteAudit(payload: IQueryParams, toteId :number);
  GetTotePickLines(payload: IQueryParams, toteId :number);
  ResolveMarkoutTote(toteId: number);
  
}
