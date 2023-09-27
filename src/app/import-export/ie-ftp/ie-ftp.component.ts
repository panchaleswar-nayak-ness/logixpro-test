import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IeFtpSettingsComponent } from 'src/app/dialogs/ie-ftp-settings/ie-ftp-settings.component';

@Component({
  selector: 'app-ie-ftp',
  templateUrl: './ie-ftp.component.html',
  styleUrls: ['./ie-ftp.component.scss']
})
export class IeFtpComponent {

  constructor(private dialog: MatDialog) { }


  openIeFtpSettings() {
    const dialogRef = this.dialog.open(IeFtpSettingsComponent, {
      height: 'auto',
      width: '1424px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)      
    }
    );
  }
}
