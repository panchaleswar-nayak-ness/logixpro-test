import { Component } from '@angular/core';

@Component({
  selector: 'app-ie-ftp-settings',
  templateUrl: './ie-ftp-settings.component.html',
  styleUrls: ['./ie-ftp-settings.component.scss']
})
export class IeFtpSettingsComponent {
  ELEMENT_DATA: any[] =[
    {import_export: 'Export'},
    {import_export: 'Import'},
    {import_export: 'Export'},
    {import_export: 'Import'},
    {import_export: 'Export'},
    {import_export: 'Import'},
    
  ]

    displayedColumns: string[] = ['import_export','type','ftp_checkbox','ftp_location','ftp_username','ftp_password','ftp_file','ftp_extension','ftp_readyfile','actions'];
    tableData = this.ELEMENT_DATA
    dataSourceList:any

}
