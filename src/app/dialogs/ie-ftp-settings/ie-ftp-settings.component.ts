import { Component } from '@angular/core';
import {  ColumnDef } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-ie-ftp-settings',
  templateUrl: './ie-ftp-settings.component.html',
  styleUrls: ['./ie-ftp-settings.component.scss'],
})
export class IeFtpSettingsComponent {
  elementData: any[] = [
    { import_export: 'Export' },
    { import_export: 'Import' },
    { import_export: 'Export' },
    { import_export: 'Import' },
    { import_export: 'Export' },
    { import_export: 'Import' },
  ];

  displayedColumns: string[] = [
    'import_export',
    'type',
    'ftp_checkbox',
    'ftp_location',
    'ftp_username',
    'ftp_password',
    'ftp_file',
    'ftp_extension',
    'ftp_readyfile',
    ColumnDef.Actions,
  ];
  tableData = this.elementData;
  dataSourceList: any;
}
