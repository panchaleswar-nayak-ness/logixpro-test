import { Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScanVerificationDefaultsComponent } from 'src/app/admin/dialogs/scan-verification-defaults/scan-verification-defaults.component';

@Component({
  selector: 'app-sp-scan-verification-setup',
  templateUrl: './sp-scan-verification-setup.component.html',
  styleUrls: ['./sp-scan-verification-setup.component.scss']
})
export class SpScanVerificationSetupComponent  {

  constructor(private dialog: MatDialog) { }
  displayedColumns: string[] = ['transType', 'scanSequence', 'field', 'verifyType', 'verifyStringStart','verifyStringLength','actions'];
  dataSource:any
  dataSource1: string[] = ['location', 'locationName', 'zone', 'carousel', 'row','shelf','bin','warehouse','cellSize','velocityCode','carouselLocation','cartonLocation','itemNumber','description','serialNo','lotNo','expriationDate','UM','maxQty','qtyAllocatedPick','itemQty','putAwayDate','dateSensitive','shipVia','shipToName','dedicated','masterLocation','InvMapID'];
 

  openScanVerification(){
    let dialogRef = this.dialog.open(ScanVerificationDefaultsComponent, {
      height: 'auto',
      width: '96vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe(result => {
     
    })
  }

}
