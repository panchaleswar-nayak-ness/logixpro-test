export interface DevicePreferenceRequest {
  deviceId: number;
  zone: string;
  type: string;
  number: string;
  model: string;
  controllerType: string;
  controllerPort: string;
  arrowDirection: string;
  lightDirection: string;
  laserPointer: boolean;
  lightTreeNumber: number;
  beginAddress: number;
  displayPositions: number;
  displayCharacters: number;
  pairKey: string;
  com?: string;
  baud?: string;
  parity?: string;
  word?: string;
  stop?: string;
  jmif?: string;
  hostIP?: string;
  hostPort?: number;
  workstationName?: string;
  shownType: string;
}

export interface DevicePreferencesTableRequest {
  startRow: number;
  endRow: number;
  sortColumn: string;
  sortOrder: string;
  zone: string;
}


export interface DevicePreferenceResponse {
  zone: string;
  deviceType: string;
  deviceNumber: string;
  deviceModel: string;
  controllerType: string;
  controllerTermPort: string;
  arrowDirection: string;
  lightDirection: string;
  laserPointer: string;
  lightTreeNumber: string;
  beginAddress: string;
  displayPositions: string;
  displayCharacters: string;
  hostIPAddress: string;
  hostPort: string;
  workstationName: string;
  baudRate: string;
  hostPCComPort: string;
  parity: string;
  wordLength: string;
  stopBit: string;
  pairKey: string;
  zoneList: string[];
  controllerTypeList: string[];
  deviceModelList: string[];
  displayNumbers: DisplayNumberInfo[];
}

export interface DisplayNumberInfo {
  displayNumber: string;
  bayNumber: string;
  bayDisplayNumber: string;
  commPort: string;
}