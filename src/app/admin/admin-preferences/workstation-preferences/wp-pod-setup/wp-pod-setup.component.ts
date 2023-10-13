import { Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-wp-pod-setup',
  templateUrl: './wp-pod-setup.component.html',
  styleUrls: ['./wp-pod-setup.component.scss']
})
export class WpPodSetupComponent{

  constructor(private global:GlobalService) { }
  displayedColumns: string[] = ['transType', 'scanSequence','actions'];
  dataSource:any

  

}
