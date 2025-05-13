export interface IConHeaderResource {
  consolidationProgress: string;
  consolidationStatus: string;
  consolidationZoneID: string;
  routeID: string;
  routeIdStatus: string;
  statusDate: string;
}

export interface IConHeaderResponse {
  resource: IConHeaderResource;
  _links: any[]; // Optional: Define link structure if needed
}
