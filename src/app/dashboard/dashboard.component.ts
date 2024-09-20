import { Component } from '@angular/core';
import { SharedService } from '../common/services/shared.service';
import {
  ToasterTitle,
  ToasterType,
} from '../common/constants/strings.constants';
import { GlobalService } from '../common/services/global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  sideBarOpen: boolean = true;
  isMenuHide: any = false;

  constructor(
    private sharedService: SharedService,
    private global: GlobalService
  ) {
    this.sharedService.SideBarMenu.subscribe(
      (menu) => (this.sideBarOpen = menu)
    );
    this.sharedService.sideMenuHideObserver.subscribe(
      (menu) => (this.isMenuHide = menu)
    );
  }

  ngAfterViewInit() {
    //ADLDS password expiry alert message.
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      var alertmsg = userData.alertmsg;
      if (alertmsg) {
        this.global.ShowToastr(ToasterType.Info, alertmsg, ToasterTitle.Alert);
        
        delete userData.alertmsg;
        localStorage.setItem('user', JSON.stringify(userData));
      }
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  ngOnDestroy() {
    this.sharedService.sideMenuHideObserver.unsubscribe();
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
