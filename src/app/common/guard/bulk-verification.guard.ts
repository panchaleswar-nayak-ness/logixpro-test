import { Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BulkVerificationGuard implements CanDeactivate<any> {
  constructor( 
    private router: Router,
    private sharedService: SharedService,
  ) { }
  async  canDeactivate():Promise<boolean> { 
    if((this.router.url == "/BulkTransactions/BulkPick" || this.router.url == "/BulkTransactions/BulkPutAway" || this.router.url == "/BulkTransactions/BulkCount") && localStorage.getItem("verifyBulks") == "true"){
        this.sharedService.verifyBulkTransBack();
        return false;
    }
    return true;
  }
}
