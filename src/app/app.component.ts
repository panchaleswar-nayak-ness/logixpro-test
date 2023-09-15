import { Component, HostListener, OnInit, VERSION } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { BrowserCloseService } from './services/browser-close.service';
import { ApiFuntions } from './services/ApiFuntions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  userData;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private browserCloseService: BrowserCloseService,
    private api:ApiFuntions,
  ) {}
  // @HostListener('window:beforeunload')
  // onBrowserClose(): void {
  //   this.browserCloseService.handleBrowserClose();
  // }


  @HostListener('window:beforeunload', ['$event'])
beforeunloadHandler(event): void {
  // this.userData = JSON.parse(localStorage.getItem('user') || '{}');
  // const url = 'https://staging-e64.com:9010/api/users/Logout';
  // const payload = {
  //   "username": this.userData.userName,
  //   "wsid": this.userData.wsid
  // };
  this.browserCloseService.handleBrowserClose();
  // this.browserCloseService.logout(url, payload);
}
@HostListener('window:load',['$event'])
onPageLoad(event: Event) {
   let loadTime = new Date();
  let unloadTime:any = localStorage.getItem('unloadTime');
  this.userData = JSON.parse(localStorage.getItem('user') || '{}');
  if (unloadTime) {
    unloadTime = new Date(JSON.parse(unloadTime));
    let refreshTime = loadTime.getTime() - unloadTime.getTime();

    if (refreshTime > 3000) {
      // const url = 'https://staging-e64.com:9010/api/users/Logout';
      // const payload = {
      //   username: 'fuzail',
      //   wsid: 'TESTWSID',
      // };
      // this.browserCloseService.logout(url, payload);


      // let paylaod = {
      //   "username": this.userData.userName,
      //   "wsid": this.userData.wsid,
      // }
      // this.api.Logout(paylaod).subscribe((res:any) => {
      //   if (res.isExecuted) {}
      // })

//       // navigator.sendBeacon('https://staging-e64.com:9010/api/users/Logout', JSON.stringify({username:'fuzail',wsid:'TESTWSID'}));
//       // localStorage.clear();
      
//       // location.reload();
    }
  }
}
  ngOnInit() {
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     var rt = this.getChild(this.activatedRoute);

    //     rt.data.subscribe((data) => {
    //       this.titleService.setTitle(data.title);
    //     });
    //   });
  }
  // getChild(activatedRoute: ActivatedRoute) {
  //   if (activatedRoute.firstChild) {
  //     return this.getChild(activatedRoute.firstChild);
  //   } else {
  //     return activatedRoute;
  //   }
  // }
}
