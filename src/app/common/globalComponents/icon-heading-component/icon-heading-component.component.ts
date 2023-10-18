import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-heading-component',
  templateUrl: './icon-heading-component.component.html',
  styleUrls: ['./icon-heading-component.component.scss']
})
export class IconHeadingComponentComponent implements OnInit {

  @Input() headingClass : string = 'card-header-title mb-0 d-flex align-items-center';
  @Input() icon: string;
  @Input() heading: string;
  constructor() { }

  ngOnInit(): void {
  }

}
