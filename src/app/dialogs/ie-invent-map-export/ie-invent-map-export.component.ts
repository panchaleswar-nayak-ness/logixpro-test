import { Component } from '@angular/core';
import {  ColumnDef } from 'src/app/common/constants/strings.constants'; 

@Component({
  selector: 'app-ie-invent-map-export',
  templateUrl: './ie-invent-map-export.component.html',
  styleUrls: ['./ie-invent-map-export.component.scss'],
})
export class IeInventMapExportComponent {
  elementData: any[] = [
    { mon: '' },
    { mon: '' },
    { mon: '' },
    { mon: '' },
    { mon: '' },
  ];

  displayedColumns: string[] = [
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun',
    'export_hour',
    'export_minute',
    'am_pm',
    ColumnDef.Actions,
  ];
  tableData = this.elementData;
  dataSourceList: any;

  constructor() {}
}
