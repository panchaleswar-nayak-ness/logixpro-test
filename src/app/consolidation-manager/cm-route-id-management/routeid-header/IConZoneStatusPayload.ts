/**
 * Interface for ConZone Status Key
 */
export interface IConZoneStatusKey {
  Key: 'Active' | 'Paused';
}

/**
 * Interface for ConZone Status Update Payload
 * Used when updating the auto-release toggle status
 */
export interface IConZoneStatusPayload {
  ConZone: string;
  Status: IConZoneStatusKey;
}

