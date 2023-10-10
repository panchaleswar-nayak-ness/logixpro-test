import { FlowRackReplenishApiService } from "./flowrackreplenish-api.service"

export interface IFlowRackReplenishApi extends FlowRackReplenishApiService
{
	itemquantity(payload: any)
	verifyitemquantity(payload: any)
	verifyitemlocation(payload: any)
	ItemLocation(payload: any)
	openlocation(payload: any)
	CFData(payload: any)
	wslocation(payload: any)
}