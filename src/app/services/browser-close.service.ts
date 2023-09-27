import { Injectable } from '@angular/core';
import { ApiFuntions } from './ApiFuntions';
import { BeaconService } from './beacon.service';

@Injectable({
  providedIn: 'root'
})
export class BrowserCloseService {
  userData
  constructor(private api:ApiFuntions,private beaconService: BeaconService) { }
  handleBrowserClose(): void {
    this.userData = JSON.parse(localStorage.getItem('user') ?? '{}');
    localStorage.setItem('unloadTime',JSON.stringify(new Date()))

    // let paylaod = {
    //   "username": this.userData.userName,
    //   "wsid": this.userData.wsid,
    // }
    // const url = 'https://staging-e64.com:9010/api/users/Logout';
    // localStorage.setItem('1',JSON.stringify(url))
    // localStorage.setItem('2',JSON.stringify(paylaod))
    // this.beaconService.sendRequest(url, paylaod);
    // Call your service or perform any other actions
  }


  logout(url: string, payload: any): void {


    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(payload));
  }
}
