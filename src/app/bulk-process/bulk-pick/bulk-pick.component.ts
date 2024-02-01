import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bulk-pick',
  templateUrl: './bulk-pick.component.html',
  styleUrls: ['./bulk-pick.component.scss']
})
export class BulkPickComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  }
  pick1: boolean =true;
  pickProcess(){
    this.pick1 = !this.pick1;
  }

}

