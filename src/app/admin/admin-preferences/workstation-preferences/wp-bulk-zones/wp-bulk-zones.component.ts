import { Component} from '@angular/core';

@Component({
  selector: 'app-wp-bulk-zones',
  templateUrl: './wp-bulk-zones.component.html',
  styleUrls: ['./wp-bulk-zones.component.scss']
})
export class WpBulkZonesComponent  {

  
  displayedColumns: string[] = ['transType', 'scanSequence','actions'];
  dataSource:any



}
