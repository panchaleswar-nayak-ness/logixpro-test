export interface IConZoneLink {
  rel: string;
  href: string;
  type: string;
}

export interface IConZoneResource {
  consolidationZoneID: string;
  description: string;
  autoReleaseUpperThreshold: number;
  autoReleaseLowerThreshold: number;
  status: string;
}

export interface IConZoneResponse {
  resource: IConZoneResource;
  _links: IConZoneLink[];
}