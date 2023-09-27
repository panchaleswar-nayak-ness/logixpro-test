import { Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-wp-bulk-zones',
  templateUrl: './wp-bulk-zones.component.html',
  styleUrls: ['./wp-bulk-zones.component.scss']
})
export class WpBulkZonesComponent  {

  constructor(private dialog: MatDialog) { }
  displayedColumns: string[] = ['transType', 'scanSequence','actions'];
  dataSource:any



}
