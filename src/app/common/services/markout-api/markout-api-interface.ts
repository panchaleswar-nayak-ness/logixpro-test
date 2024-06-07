export interface IMarkoutApiService {
  GetMarkoutData(toteid);
  UpdateMarkoutQuantity(request);
  MarkoutCompleteTransaction(request);
  GetParamByName(paramName);
  MarkoutValidTote(toteid);
  MarkoutBlossomTote(request);
}
