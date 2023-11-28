import { Component } from '@angular/core';

@Component({
  selector: 'app-ste-services',
  templateUrl: './ste-services.component.html',
  styleUrls: []
})
export class SteServicesComponent  {
  sideBarOpen: boolean = true;
  
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
