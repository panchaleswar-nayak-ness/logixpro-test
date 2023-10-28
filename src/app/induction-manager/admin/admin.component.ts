import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: []
})
export class AdminComponent  {

  tab_hover_color:string = '#cf9bff3d';

  constructor(private sharedService: SharedService) { }

  

  updateMenu(menu = '', route = '') {    
    this.sharedService.updateInductionAdminMenu({menu , route});
  }

}
