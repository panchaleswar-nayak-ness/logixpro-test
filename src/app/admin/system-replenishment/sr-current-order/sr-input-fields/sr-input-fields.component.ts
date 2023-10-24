import { Component , Input} from '@angular/core';

@Component({
  selector: 'app-sr-input-fields',
  templateUrl: './sr-input-fields.component.html',
  styleUrls: ['./sr-input-fields.component.scss']
})
export class SrInputFieldsComponent {
  @Input() noOfPicks: number; 
  @Input() noOfPutAways: number; 

}
