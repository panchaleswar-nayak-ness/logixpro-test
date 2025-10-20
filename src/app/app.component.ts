import { Component, HostListener, OnInit } from '@angular/core';
import { BrowserCloseService } from './common/services/browser-close.service';
import { BroadcastService } from './common/init/broadcast.service';
import {  UniqueConstants } from 'src/app/common/constants/strings.constants';
import { LocalStorageService } from './common/services/LocalStorage.service';
import { Router } from '@angular/router';
import { EmergencyAlertService } from './common/services/emergency-pick/emergency-alert-service';
import { AuthService } from './common/init/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/design-system/d-main.scss'],
})
export class AppComponent implements OnInit {
  userData;

  constructor(
    private readonly browserCloseService: BrowserCloseService,
    private readonly broadCast:BroadcastService,
    private readonly localstorageService:LocalStorageService,
    private readonly router: Router,
    private alerts: EmergencyAlertService,
    private authService: AuthService
  ) {}

  @HostListener('window:storage', [UniqueConstants.event])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'logout') {
      this.localstorageService.clearLocalStorage();
      this.router.navigate(["/login"]);
    }
  }

  @HostListener('window:beforeunload', [UniqueConstants.event])
  beforeunloadHandler(): void {
    this.browserCloseService.handleBrowserClose();
  }

  @HostListener('window:load',[UniqueConstants.event])
  onPageLoad() {
    this.userData = JSON.parse(localStorage.getItem('user') ?? '{}');
  }

  ngOnInit() {
    this.broadCast.checkLastTab(() => {});
    window.addEventListener('beforeunload', () => this.broadCast.sendTabClosedMessage());
    if(this.authService.IsloggedIn()){
      this.alerts.start();
    }
  }
}
