import { Component} from '@angular/core';
import { ScanVerificationDefaultsComponent } from 'src/app/admin/dialogs/scan-verification-defaults/scan-verification-defaults.component';
import { GlobalService } from 'src/app/common/services/global.service';
import {  zoneType ,DialogConstants,TableConstant} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-sp-scan-verification-setup',
  templateUrl: './sp-scan-verification-setup.component.html',
  styleUrls: ['./sp-scan-verification-setup.component.scss']
})
export class SpScanVerificationSetupComponent  {

  constructor(private global:GlobalService) { }
  displayedColumns: string[] = ['transType', 'scanSequence', 'field', 'verifyType', 'verifyStringStart','verifyStringLength','actions'];
  dataSource:any
  dataSource1: string[] = ['location', 'locationName', TableConstant.zone, zoneType.carousel, 'row','shelf','bin','warehouse','cellSize','velocityCode','carouselLocation','cartonLocation','itemNumber','description','serialNo','lotNo','expriationDate','UM','maxQty','qtyAllocatedPick','itemQty','putAwayDate','dateSensitive','shipVia','shipToName','dedicated','masterLocation','InvMapID'];
 

  openScanVerification(){
    let dialogRef:any = this.global.OpenDialog(ScanVerificationDefaultsComponent, {
      height: 'auto',
      width: '96vw',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe(result => {});
  }

}
