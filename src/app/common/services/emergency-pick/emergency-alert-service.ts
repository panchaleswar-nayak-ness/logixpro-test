import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { MatDialog } from '@angular/material/dialog';
import { EmergencyPickComponent } from 'src/app/dialogs/emergency-pick/emergency-pick.component';
import { BaseService } from '../base-service.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../init/auth.service';
import { GlobalService } from '../global.service';
import { Style } from '../../constants/strings.constants';
import { EmergencyOrdersInfo } from '../../Model/bulk-transactions';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
@Injectable({ providedIn: 'root' })
export class EmergencyAlertService {
  private hub?: signalR.HubConnection;
  private snoozedUntil = 0;
  private maxReconnectAttempts = 5;

  constructor(
    private dialog: MatDialog,
    private zone: NgZone,
    private baseService: BaseService,
    private authService: AuthService,
    private globalService: GlobalService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  async start(token?: string) {
    const url = await this.getHubUrl();
    const userData = this.authService.userData();

    this.hub = new signalR.HubConnectionBuilder()
      .withUrl(`${url}?wsid=${encodeURIComponent(userData.wsid ?? '')}`, {
        accessTokenFactory: () => this.globalService.getAuthToken(),
        withCredentials: true,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
            return Math.min(
              1000 * Math.pow(2, retryContext.previousRetryCount),
              30000
            );
          } else {
            return null;
          }
        },
      })
      .build();

    this.hub.on('EmergencyAlert', (info: EmergencyOrdersInfo) => {
      if (!info.hasPendingForWorkstation || !this.authService.IsloggedIn()) return;
      const now = Date.now();
      if (now < this.snoozedUntil) return;

      this.zone.run(() => {

        const alreadyOpen = this.dialog.openDialogs.some(
          (d) => d.componentInstance instanceof EmergencyPickComponent
        );

        if (alreadyOpen) {
          return;
        }

        const ref = this.dialog.open(EmergencyPickComponent, {
          width: Style.w560px,
          disableClose: true,
          data: info.allEmergencyZones.join(", "),
        });

        ref.afterClosed().subscribe((action) => {
          if (action === 'proceed') {
            this.router.navigate(['/BulkTransactions/BulkPick']);
            this.sharedService.updateBulkProcessMenu({menu:'BulkPick',route:'/BulkTransactions/BulkPick'});
          } else if (action === 'snooze') {
            this.snooze30s();
          }
        });
      });
    });

    this.hub
      .start()
      .then(() => console.log('✅ Connected to EmergencyHub'))
      .catch((err) => console.error('❌ Failed to connect:', err));

    this.hub.onclose((err) => console.warn('⚠️ Hub closed:', err));
    this.hub.onreconnecting((err) => console.warn('🔄 Reconnecting:', err));
    this.hub.onreconnected((connId) => console.log('🔗 Reconnected:', connId));
  }

  public snooze30s() {
    this.snoozedUntil = Date.now() + 30_000;
    this.hub?.invoke('Snooze').catch(console.error);
  }

  private async getHubUrl(): Promise<string> {
    try {
      const baseUrl = await firstValueFrom(
        this.baseService.GetUrlOfEndpoint('/EmergencyHub')
      );
      return baseUrl || `${environment.apiUrl}/api/EmergencyHub`;
    } catch (error) {
      return `${environment.apiUrl}/api/EmergencyHub`;
    }
  }

  public async stop(): Promise<void> {
    if (this.hub) {
      try {
        await this.hub.stop();
      } catch (err) {
        console.error('❌ Failed to stop emergency hub:', err);
      } finally {
        this.hub = undefined;
      }
    }
  }

}
