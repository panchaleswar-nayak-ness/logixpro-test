import { Component, HostListener, OnInit } from '@angular/core';
import { BrowserCloseService } from './services/browser-close.service';
import { BroadcastService } from './init/broadcast.service';

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

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(): void {
    this.browserCloseService.handleBrowserClose();
  }

  @HostListener('window:load',['$event'])
  onPageLoad() {
    this.userData = JSON.parse(localStorage.getItem('user') ?? '{}');
  }

  ngOnInit() {
    this.broadCast.checkLastTab(() => {});
    window.addEventListener('beforeunload', () => this.broadCast.sendTabClosedMessage());
  }
}
