import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-card-component',
  templateUrl: './info-card-component.component.html',
  styleUrls: ['./info-card-component.component.scss']
})
export class InfoCardComponentComponent {

  @Input() title : string= '';
  @Input() value : string= '-';
  @Input() colorClass : string;

  constructor() { }



}

