import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  adminMenus: any = [
    { icon: 'arrow_back', title: 'Admin', route: '/dashboard', class: 'back-class' ,permission: 'Dashboard'},
    { icon: 'assignment_ind', title: 'Employees', route: '/admin/employees' ,permission: 'Employees'},
    { icon: 'tune', title: 'Preferences', route: '#' ,permission: 'Preferences'},
    { icon: 'published_with_changes', title: 'System Replenishment', route: '#' ,permission: 'Replenishment'},
    { icon: 'directions_alt', title: 'Inventory Map', route: '/admin/inventoryMap' ,permission: 'Inventory Map'},
    { icon: 'list_alt', title: 'Batch Manager', route: '/admin/batchManager' ,permission: 'Batch Manager'},
    { icon: 'analytics', title: 'Reports', route: '/admin/reports' ,permission: 'Reports'},
    { icon: 'my_location', title: 'Location Assignment', route: '/admin/locationAssignment' ,permission: 'Location Assignment'},
    { icon: 'low_priority', title: 'Cycle Count', route: '/admin/cycleCounts' ,permission: 'Cycle Count Manager'},
    { icon: 'trolley', title: 'Move Items', route: '#' ,permission: 'Move Items'},
    { icon: 'dvr', title: 'Transactions', route: '#' ,permission: 'Transaction Journal'},
    { icon: 'ads_click', title: 'Manual Transactions', route: '#' ,permission: 'Manual Transactions'},
    { icon: 'event_note', title: 'Event Log', route: '#' ,permission: 'Event Log Manager'},
    { icon: 'airline_stops', title: 'De-Allocate Orders', route: '#' ,permission: 'De-Allocate Orders'},
    { icon: 'dashboard', title: 'Inventory', route: '/admin/inventoryMaster',permission: 'Inventory' }, 
    
  ];
  constructor(private http: HttpClient,private pLocation: PlatformLocation) { }
  
  IsloggedIn(){
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    return !!user._token;
  }
  IsConfigLogin(){
    let user = JSON.parse(localStorage.getItem('userConfig') || '{}');
    return !!user._token;
  }

  userData(){
    if(this.isConfigUser()){
      return JSON.parse(localStorage.getItem('userConfig') || '{}');
    }
    else{
      return JSON.parse(localStorage.getItem('user') || '{}');
    }
  }

  
  isConfigUser(){
    return localStorage.getItem('isConfigUser') ;
  }

  isUserRights(){
    if(!localStorage.getItem('userRights')){
      return false;
    }
    return true;
  }
  public UserPermissonByFuncName(FuncName:any){
    var userRights = this.userPermission()?.includes(FuncName);
    if(userRights) return true;
    else  return false;
  }
  public userPermission(){
    if(localStorage.getItem('userRights')){
      return JSON.parse(localStorage.getItem('userRights') || '{}');
    }
  }


  getUrl() {
    return (this.pLocation as any).location.href;
  }

  isAuthorized(perm:any){
    // console.log(this.userPermission());
    return this.userPermission()?.includes(perm)
    // console.log(this.userPermission().includes('Admin Menu'))
  }
  isAllowedUrl(){
    
  }

  

 
  
}
