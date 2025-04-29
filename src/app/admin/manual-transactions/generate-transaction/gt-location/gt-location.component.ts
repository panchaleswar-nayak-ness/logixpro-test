import { Component, Input } from '@angular/core';
import { ColumnAlias } from 'src/app/common/types/CommonTypes';

@Component({
  selector: 'app-gt-location',
  templateUrl: './gt-location.component.html',
  styleUrls: []
})
export class GtLocationComponent {
  @Input() fieldNames: ColumnAlias;
  @Input() zone: any;
  @Input() row: any;
  @Input() shelf: any;
  @Input() carousel: any;
  @Input() bin: any;
  @Input() quantityAllocatedPick: any;
  @Input() quantityAllocatedPutAway: any;
  @Input() totalQuantity: any;
  @Input() invMapID: any;
  
}
