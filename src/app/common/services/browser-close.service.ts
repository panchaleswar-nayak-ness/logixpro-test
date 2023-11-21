import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserCloseService {
  userData;

  handleBrowserClose(): void {
    this.userData = JSON.parse(localStorage.getItem('user') ?? '{}');
    localStorage.setItem('unloadTime',JSON.stringify(new Date()));
  }

  logout(url: string, payload: any): void {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(payload));
  }
}
