import { Injectable } from '@angular/core';
import { NavigationEnd,Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteHistoryService {
  private previousUrl: string = '';
  private currentUrl: string = '';
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }
  getPreviousUrl(): string {
    return this.previousUrl;
  }
}
