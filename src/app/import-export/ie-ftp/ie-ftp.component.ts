import { Component } from '@angular/core';
import { DialogConstants } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { IeFtpSettingsComponent } from 'src/app/dialogs/ie-ftp-settings/ie-ftp-settings.component';

@Component({
  selector: 'app-ie-ftp',
  templateUrl: './ie-ftp.component.html',
  styleUrls: ['./ie-ftp.component.scss']
})
export class IeFtpComponent {

  constructor(
    private global:GlobalService
  ) { }

  openIeFtpSettings() {
    const dialogRef:any = this.global.OpenDialog(IeFtpSettingsComponent, {
      height: DialogConstants.auto,
      width: '1424px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => console.log(result));
  }
}
