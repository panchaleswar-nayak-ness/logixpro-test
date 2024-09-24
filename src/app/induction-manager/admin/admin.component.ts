import { Component } from '@angular/core';
import { AuthService } from 'src/app/common/init/auth.service';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent  {

  tab_hover_color:string = '#cf9bff3d';

  constructor(private sharedService: SharedService,    private authService: AuthService,) { }

  updateMenu(menu = '', route = '') {    
    this.sharedService.updateInductionAdminMenu({menu , route});
  }

  isAuthorized(controlName:any) {
    return !this.authService.isAuthorized(controlName);
 }

}
