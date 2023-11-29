import { Component} from '@angular/core';
import {  ColumnDef } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-wp-pick-levels',
  templateUrl: './wp-pick-levels.component.html',
  styleUrls: ['./wp-pick-levels.component.scss']
})
export class WpPickLevelsComponent{

  displayedColumns: string[] = ['pickLevel','startShelf','endShelf',ColumnDef.Actions];
  dataSource:any = [ {},{},{},{},{},{},]
  


}
