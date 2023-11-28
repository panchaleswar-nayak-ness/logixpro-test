import { Component} from '@angular/core';
import {  Column } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-wp-bulk-zones',
  templateUrl: './wp-bulk-zones.component.html',
  styleUrls: ['./wp-bulk-zones.component.scss']
})
export class WpBulkZonesComponent  {

  
  displayedColumns: string[] = [Column.TransType, 'scanSequence','actions'];
  dataSource:any



}
