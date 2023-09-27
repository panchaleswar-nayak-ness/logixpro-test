import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../init/auth.service';

@Component({
  selector: 'app-consolidation-manager',
  templateUrl: './consolidation-manager.component.html',
  styleUrls: []
})
export class ConsolidationManagerComponent {

  tab_hover_color:string = '#cf9bff3d';

  constructor(private sharedService: SharedService,
              public authService: AuthService,) { }



  updateMenu(menu = '', route = ''){   
    this.sharedService.updateInductionAdminMenu({menu , route});

  }
  isAuthorized(controlName:any) {
    return !this.authService.isAuthorized(controlName);
 }

}
