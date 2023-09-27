import { Component, Inject} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-licensing-invalid',
  templateUrl: './licensing-invalid.component.html',
  styleUrls: []
})
export class LicensingInvalidComponent{

  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }



}
