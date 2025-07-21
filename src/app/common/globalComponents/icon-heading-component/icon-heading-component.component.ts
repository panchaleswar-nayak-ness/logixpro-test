import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-icon-heading-component',
  templateUrl: './icon-heading-component.component.html',
  styleUrls: []
})
export class IconHeadingComponentComponent {
  @Input() headingClass : string = 'card-header-title mb-0 d-flex align-items-center';
  @Input() icon: string;
  @Input() heading: string;
  @Input('data-automation-id') automationId: string;
}
