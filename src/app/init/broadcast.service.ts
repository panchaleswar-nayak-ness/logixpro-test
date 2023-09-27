import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  private broadcastChannel: BroadcastChannel;

  constructor() {
    this.broadcastChannel = new BroadcastChannel('tab_manager_channel');
   }
   sendTabClosedMessage() {
    this.broadcastChannel.postMessage('tabClosed');
  }

  checkLastTab(callback: () => void) {
    this.broadcastChannel.postMessage('checkLastTab');
    this.broadcastChannel.addEventListener('message', event => {
      if (event.data === 'checkLastTab') {
        callback();
      }
    });
  }
}
