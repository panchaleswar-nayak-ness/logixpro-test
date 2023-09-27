import { Component} from '@angular/core';

@Component({
  selector: 'app-scan-verification-defaults',
  templateUrl: './scan-verification-defaults.component.html',
  styleUrls: ['./scan-verification-defaults.component.scss']
})
export class ScanVerificationDefaultsComponent {
  displayedColumns: string[] = ['transType', 'scanSequence', 'field', 'verifyType', 'verifyStringStart','verifyStringLength','actions'];
  

}
