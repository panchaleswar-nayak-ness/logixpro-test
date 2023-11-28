import { Component} from '@angular/core';
import {  Column } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-scan-verification-defaults',
  templateUrl: './scan-verification-defaults.component.html',
  styleUrls: ['./scan-verification-defaults.component.scss']
})
export class ScanVerificationDefaultsComponent {
  displayedColumns: string[] = [Column.TransType, 'scanSequence', 'field', 'verifyType', 'verifyStringStart','verifyStringLength','actions'];
  

}
