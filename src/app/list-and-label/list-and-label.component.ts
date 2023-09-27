import { Component } from '@angular/core';

@Component({
  selector: 'app-list-and-label',
  templateUrl: './list-and-label.component.html',
  styleUrls: []
})
export class ListAndLabelComponent {
  env:string;
  constructor() {
     
    this.env = location.protocol + '//' + location.host; 
 
   }

}
