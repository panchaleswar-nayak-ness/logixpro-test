import { Component} from '@angular/core';
import {  Column ,ColumnDef, Placeholders} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-scan-verification-defaults',
  templateUrl: './scan-verification-defaults.component.html',
  styleUrls: ['./scan-verification-defaults.component.scss']
})
export class ScanVerificationDefaultsComponent {
  placeholders = Placeholders;
  displayedColumns: string[] = [Column.TransType, 'scanSequence', 'field', 'verifyType', 'verifyStringStart','verifyStringLength',ColumnDef.Actions];
  

}
