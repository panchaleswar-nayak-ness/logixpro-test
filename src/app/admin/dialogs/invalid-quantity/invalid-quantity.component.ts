import { Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invalid-quantity',
  templateUrl: './invalid-quantity.component.html',
  styleUrls: []
})
export class InvalidQuantityComponent  {

  constructor(public dialogRef: MatDialogRef<any>) { }
}
