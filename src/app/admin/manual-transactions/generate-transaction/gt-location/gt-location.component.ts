import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gt-location',
  templateUrl: './gt-location.component.html',
  styleUrls: ['./gt-location.component.scss']
})
export class GtLocationComponent {
  @Input() zone: any;
  @Input() row: any;
  @Input() shelf: any;
  @Input() carousel: any;
  @Input() bin: any;
  @Input() quantityAllocatedPick: any;
  @Input() totalQuantity: any;
  @Input() invMapID: any;
  
}
