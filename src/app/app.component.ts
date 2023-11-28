import { Component, HostListener, OnInit } from '@angular/core';
import { BrowserCloseService } from './common/services/browser-close.service';
import { BroadcastService } from './common/init/broadcast.service';
import {  UniqueConstants } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/design-system/d-main.scss'],
})
export class AppComponent implements OnInit {
  userData;

  constructor(
    private browserCloseService: BrowserCloseService,
    private broadCast:BroadcastService
  ) {}

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
  }
}
