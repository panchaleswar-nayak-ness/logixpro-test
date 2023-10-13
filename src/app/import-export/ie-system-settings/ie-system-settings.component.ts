import { Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/common/services/global.service';
import { IeFtpSettingsComponent } from 'src/app/dialogs/ie-ftp-settings/ie-ftp-settings.component';
import { IeInventMapExportComponent } from 'src/app/dialogs/ie-invent-map-export/ie-invent-map-export.component';
import { IeTransFieldMappingComponent } from 'src/app/dialogs/ie-trans-field-mapping/ie-trans-field-mapping.component';
import { OpenTransPickMappingComponent } from 'src/app/dialogs/open-trans-pick-mapping/open-trans-pick-mapping.component';
import { TransferFilePathComponent } from 'src/app/dialogs/transfer-file-path/transfer-file-path.component';

@Component({
  selector: 'app-ie-system-settings',
  templateUrl: './ie-system-settings.component.html',
  styleUrls: []
})
export class IeSystemSettingsComponent {

  constructor(
    private global:GlobalService,
  ) { }

 
  IeTransFieldMappingDialog() {
     this.global.OpenDialog(IeTransFieldMappingComponent, {
      height: 'auto',
      width: '100vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });

  }
  XMLFieldMappingDialog() {
     this.global.OpenDialog(OpenTransPickMappingComponent, {
      height: 'auto',
      width: '100vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });

  }

  TransFilePathDialog() {
     this.global.OpenDialog(TransferFilePathComponent, {
      height: 'auto',
      width: '100vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });

  }

  IeFTPSettingsDialog(){
     this.global.OpenDialog(IeFtpSettingsComponent, {
      height: 'auto',
      width: '100vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });

  }

  IeInventMapExportDialog(){
     this.global.OpenDialog(IeInventMapExportComponent, {
      height: 'auto',
      width: '100vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });

  }
}
