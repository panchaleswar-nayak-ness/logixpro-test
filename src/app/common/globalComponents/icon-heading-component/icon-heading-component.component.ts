import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-heading-component',
  templateUrl: './icon-heading-component.component.html',
  styleUrls: ['./icon-heading-component.component.scss']
})
export class IconHeadingComponentComponent implements OnInit {

  @Input() icon: string;
  @Input() heading: string;
  constructor() { }

  ngOnInit(): void {
  }

}
