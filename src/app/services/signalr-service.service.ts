import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { ConnectedUsers } from '../../app/Model/connected-users';
import { Subject } from 'rxjs'
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrServiceService {
  private hubConnection: signalR.HubConnection
  connectionEstablished = new Subject<boolean>();
  ConnectedUsers = new Subject<ConnectedUsers>();
  connect() {
    if (!this.hubConnection) {
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl(environment.apiUrl +
                                '/GlobalConfig/ConnectedUser')
                              .build();

        this.hubConnection
        .start()
        .then(() => {
          console.log('Hub connection started');
          this.connectionEstablished.next(true);
        })
        .catch(err => console.log(err));

        this.hubConnection.on('GetLoginData', (data) => {
          this.ConnectedUsers.next(data); 
         });
      }

    }
    disconnect() {
      if (this.hubConnection) {
        this.hubConnection.stop();
      }
    }

}
