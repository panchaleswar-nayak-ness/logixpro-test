import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BeaconService {

  sendRequest(url: string, payload: any): void {
    navigator.sendBeacon(url, payload);
  }
}
