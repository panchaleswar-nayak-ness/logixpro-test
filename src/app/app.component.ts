import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserCloseService } from './services/browser-close.service';
import { ApiFuntions } from './services/ApiFuntions';
import { BroadcastService } from './init/broadcast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent implements OnInit {
  userData;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private browserCloseService: BrowserCloseService,
    private api:ApiFuntions,
    private broadCast:BroadcastService
  ) {}


  @HostListener('window:beforeunload', ['$event'])
beforeunloadHandler(event): void {
  this.browserCloseService.handleBrowserClose();
}
@HostListener('window:load',['$event'])
onPageLoad(event: Event) {

  this.userData = JSON.parse(localStorage.getItem('user') ?? '{}');

}
  ngOnInit() {

    this.broadCast.checkLastTab(() => {
      console.log('This is the last open tab');
    });

    window.addEventListener('beforeunload', () => {
      this.broadCast.sendTabClosedMessage();
    });
  }
}
