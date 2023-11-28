import { Component} from '@angular/core';
import { GlobalService } from 'src/app/common/services/global.service';
import {  Column } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-wp-pod-setup',
  templateUrl: './wp-pod-setup.component.html',
  styleUrls: ['./wp-pod-setup.component.scss']
})
export class WpPodSetupComponent{

  constructor(private global:GlobalService) { }
  displayedColumns: string[] = [Column.TransType, 'scanSequence','actions'];
  dataSource:any

  

}
