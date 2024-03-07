import { Component, OnInit } from '@angular/core';
import { SharedService } from '../common/services/shared.service';
import { AuthService } from '../common/init/auth.service';

@Component({
  selector: 'app-bulk-process',
  templateUrl: './bulk-process.component.html',
  styleUrls: ['./bulk-process.component.scss']
})
export class BulkProcessComponent implements OnInit {
 

  tabHoverColor:string = '#cf9bff3d';

  constructor(
    private sharedService: SharedService,
    public authService: AuthService
    ) { }
  ngOnInit(): void {
  }
  
  updateMenu(menu = '', route = ''){   
    this.sharedService.updateBulkProcessMenu({menu , route});
  }

  isAuthorized(controlName:any) {
    return !this.authService.isAuthorized(controlName);
  }
}
