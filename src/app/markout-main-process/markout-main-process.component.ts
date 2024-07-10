import { Component, OnInit } from '@angular/core';
import { SharedService } from '../common/services/shared.service';
import { AuthService } from '../common/init/auth.service';

@Component({
  selector: 'app-markout-main-process',
  templateUrl: './markout-main-process.component.html',
  styleUrls: ['./markout-main-process.component.scss']
})
export class MarkoutMainProcessComponent  {

  tab_hover_color:string = '#cf9bff3d';

  constructor(
      private sharedService: SharedService,
      public authService: AuthService
    ) {}


    updateMenu(menu = '', route = '') {
      this.sharedService.updateMarkoutMenu({menu , route});
    }
  
    isAuthorized(controlName:any) {
      return !this.authService.isAuthorized(controlName);
    }
}
