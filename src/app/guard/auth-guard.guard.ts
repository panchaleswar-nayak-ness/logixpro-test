 

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthService } from '../init/auth.service';
import { HttpClient } from '@angular/common/http'
import { Location } from '@angular/common';
import { CurrentTabDataService } from '../admin/inventory-master/current-tab-data-service';
import { SharedService } from '../services/shared.service';


@Injectable({ providedIn: 'root' })
export class AuthGuardGuard implements CanActivate {
  ConfigJson: any[] = [];
  constructor(
    private router: Router,
    private activatedRoute:ActivatedRoute,
    public authService: AuthService, private http: HttpClient, private location: Location,
    private currentTabDataService:CurrentTabDataService,
    private sharedService: SharedService
  ) {

  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { 
    const currentUrl: string = state.url;
    const previousUrl: string = this.currentTabDataService.getPreviousUrl() ?? '';

    const pathSet = state.url.split('?')[0]; 
    if(pathSet.indexOf('/login') > -1) {
      if(this.authService.IsloggedIn()) {
        window.location.href = '/#/dashboard'; 
      return false;
      } 
      else return true;
    }
  if(pathSet == '/globalconfig'){ 
    if(this.authService.IsloggedIn()) {
      window.location.href = '/#/dashboard'; 
    return false;
    } 
    if(this.authService.IsConfigLogin()) {
       if(this.router.url.split('?')[0].indexOf('report-view') > -1){
        return false;
    }else{
        window.location.href = '/#/globalconfig/home'; 
        return false;
      }
    }  
    else{
      return true;
    } 
  }
    if(pathSet.indexOf('/globalconfig') > -1){
      if((pathSet.indexOf('/globalconfig/') <= -1))    { this.router.navigate(['/globalconfig']);}  
      if(this.authService.IsConfigLogin()) return true; else return false;
    }
    if (!this.ConfigJson?.length) {
      let Storagepermission = JSON.parse(localStorage.getItem('Permission') ??  '[]');
      if (Storagepermission?.length) {
        this.ConfigJson = Storagepermission;
      } else {
        this.http.get('assets/json/GlobalConfigrations.json').subscribe((res: any) => {
          if (res) {
            this.ConfigJson = res;
            localStorage.setItem('Permission', JSON.stringify(this.ConfigJson));
          }
        });
      }
    }
    const userPermission = this.authService.userPermission(); 
    if (this.ConfigJson?.length) {
      
      let permission = this.ConfigJson.find(x => x.path.toLowerCase() == pathSet.toLowerCase());
      if(permission.Permission) return true;
      
      else if (userPermission.filter(x => x.toLowerCase() == permission.Permission.toLowerCase()).length > 0) {
        const isProceed = this.currentTabDataService.CheckTabOnRoute(currentUrl, previousUrl);
        if (isProceed) 
        {
          this.currentTabDataService.setPreviousUrl(currentUrl);    
          return true;
        }          
        else
          {
            this.sharedService.resetSidebar();
            
            return this.router.navigate(['/dashboard'], { queryParams: { error: 'multipletab'} });
          }
      } else{ 
        window.location.href = '/#/login';
        return false;
      }
    } else if (!this.ConfigJson?.length && this.authService.IsloggedIn()) {
      return true;
    }
    localStorage.clear();
    window.location.href = '/#/login';
    return false;
  }
}