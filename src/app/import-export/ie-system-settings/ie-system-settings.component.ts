import { Component} from '@angular/core';
import { DialogConstants ,Style} from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { IeFtpSettingsComponent } from 'src/app/dialogs/ie-ftp-settings/ie-ftp-settings.component';
import { IeInventMapExportComponent } from 'src/app/dialogs/ie-invent-map-export/ie-invent-map-export.component';
import { IeTransFieldMappingComponent } from 'src/app/dialogs/ie-trans-field-mapping/ie-trans-field-mapping.component';
import { OpenTransPickMappingComponent } from 'src/app/dialogs/open-trans-pick-mapping/open-trans-pick-mapping.component';
import { TransferFilePathComponent } from 'src/app/dialogs/transfer-file-path/transfer-file-path.component';

@Component({
  selector: 'app-ie-system-settings',
  templateUrl: './ie-system-settings.component.html',
  styleUrls: ['./ie-system-settings.component.scss']
})
export class IeSystemSettingsComponent {

  constructor(
    private global:GlobalService,
  ) { }

  IeTransFieldMappingDialog() {
     this.global.OpenDialog(IeTransFieldMappingComponent, {
      height: DialogConstants.auto,
      width: Style.w100vw,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });

  }
  XMLFieldMappingDialog() {
     this.global.OpenDialog(OpenTransPickMappingComponent, {
      height: DialogConstants.auto,
      width: Style.w100vw,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });

  }

  TransFilePathDialog() {
     this.global.OpenDialog(TransferFilePathComponent, {
      height: DialogConstants.auto,
      width: Style.w100vw,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });

  }

  IeFTPSettingsDialog(){
     this.global.OpenDialog(IeFtpSettingsComponent, {
      height: DialogConstants.auto,
      width: Style.w100vw,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });

  }

  IeInventMapExportDialog(){
     this.global.OpenDialog(IeInventMapExportComponent, {
      height: DialogConstants.auto,
      width: Style.w100vw,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });

  }
}
