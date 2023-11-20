import { Component } from '@angular/core'; 

@Component({
  selector: 'app-ie-invent-map-export',
  templateUrl: './ie-invent-map-export.component.html',
  styleUrls: [],
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
    'actions',
  ];
  tableData = this.elementData;
  dataSourceList: any;

  constructor() {}
}
