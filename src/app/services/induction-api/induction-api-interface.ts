import { InductionApiService } from "./induction-api.service"

export interface IInductionServiceApi extends InductionApiService
{
	BatchTotesDelete(payload: any)
	AllBatchDelete()
}