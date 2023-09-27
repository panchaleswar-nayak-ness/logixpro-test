import { Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-wp-pod-setup',
  templateUrl: './wp-pod-setup.component.html',
  styleUrls: ['./wp-pod-setup.component.scss']
})
export class WpPodSetupComponent{

  constructor(private dialog: MatDialog) { }
  displayedColumns: string[] = ['transType', 'scanSequence','actions'];
  dataSource:any

  

}
