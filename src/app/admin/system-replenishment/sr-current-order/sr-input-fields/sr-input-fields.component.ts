import { Component , Input} from '@angular/core';

@Component({
  selector: 'app-sr-input-fields',
  templateUrl: './sr-input-fields.component.html',
  styleUrls: []
})
export class SrInputFieldsComponent {
  @Input() noOfPicks: number; 
  @Input() noOfPutAways: number; 

}
