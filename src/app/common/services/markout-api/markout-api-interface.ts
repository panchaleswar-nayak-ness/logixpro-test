export interface IMarkoutApiService {
  GetMarkoutData(request);
  UpdateMarkoutQuantity(request);
  MarkoutCompleteTransaction(request);
  GetParamByName(paramName);
  MarkoutValidTote(toteid);
  MarkoutBlossomTote(request);
  GetMarkoutPreferences();
  UpdateMarkoutPreferences(request)
}
