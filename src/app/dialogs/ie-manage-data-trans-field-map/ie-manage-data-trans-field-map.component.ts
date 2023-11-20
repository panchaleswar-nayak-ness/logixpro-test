import { Component, ElementRef, ViewChild } from '@angular/core'; 

@Component({
  selector: 'app-ie-manage-data-trans-field-map',
  templateUrl: './ie-manage-data-trans-field-map.component.html',
  styleUrls: [],
})
export class IeManageDataTransFieldMapComponent {
  @ViewChild('autoFocusField') autoFocusField: ElementRef;
  elementData: any[] = [
    { container_id: '1202122' },
    { container_id: '1202123' },
    { container_id: '1202124' },
    { container_id: '1202125' },
    { container_id: '1202126' },
    { container_id: '1202127' },
  ];

  displayedColumns: string[] = ['container_id', 'field_type', 'actions'];
  tableData = this.elementData;
  dataSourceList: any;

  constructor() {}

  ngAfterViewInit(): void {
    this.autoFocusField.nativeElement.focus();
  }
}
