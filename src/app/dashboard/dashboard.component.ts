import { Component} from '@angular/core';
import { SharedService } from '../common/services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  {
  sideBarOpen: boolean = true;
  isMenuHide: any = false;
  
  constructor(
    private sharedService:SharedService
  ) {
    this.sharedService.SideBarMenu.subscribe(menu => this.sideBarOpen = menu);
    this.sharedService.sideMenuHideObserver.subscribe(menu => this.isMenuHide = menu);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  ngOnDestroy(){
    this.sharedService.sideMenuHideObserver.unsubscribe();
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
