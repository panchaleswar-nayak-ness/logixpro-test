import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bp-status',
  templateUrl: './bp-status.component.html',
  styleUrls: ['./bp-status.component.scss']
})
export class BpStatusComponent implements OnInit {

  @Input() status:any;

  constructor() { }

  ngOnInit(): void {
  }

}
