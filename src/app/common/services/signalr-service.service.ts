import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { ConnectedUsers } from '../Model/connected-users';
import { Subject } from 'rxjs'
import {environment} from '../../../environments/environment';
import { BaseService } from './base-service.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrServiceService {
  private hubConnection: signalR.HubConnection
  connectionEstablished = new Subject<boolean>();
  ConnectedUsers = new Subject<ConnectedUsers>();

  constructor(private baseService: BaseService) { }

  connect() {
    if (!this.hubConnection) {

      let urlObservable = this.baseService.GetUrlOfEndpoint('GlobalConfig/connection');
      urlObservable.subscribe((url: string) => {
        this.hubConnection = new signalR.HubConnectionBuilder().withUrl(url).build();
        this.hubConnection.start().then(() => this.connectionEstablished.next(true)).catch(err => console.log(err));
        this.hubConnection.on('GetLoginData', (data) => this.ConnectedUsers.next(data));
      });
      
    }
  }

  disconnect() {
    if (this.hubConnection) this.hubConnection.stop();
  }
}
