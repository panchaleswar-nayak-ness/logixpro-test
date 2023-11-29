import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {  ColumnDef } from 'src/app/common/constants/strings.constants'; 

@Component({
  selector: 'app-ie-trans-field-mapping',
  templateUrl: './ie-trans-field-mapping.component.html',
  styleUrls: ['./ie-trans-field-mapping.component.scss'],
})
export class IeTransFieldMappingComponent {
  elementData: any[] = [
    { fields: '1202122' },
    { fields: '1202123' },
    { fields: '1202124' },
    { fields: '1202125' },
    { fields: '1202126' },
    { fields: '1202127' },
  ]; 
  displayedColumns: string[] = [
    'fields',
    'start_position',
    'field_length',
    'end_position',
    'pad_char',
    'export_format',
    'field_type',
    'pad_field_left',
    ColumnDef.Actions,
  ];
  tableData = this.elementData;
  dataSourceList: any;

  constructor( ) {}
  @ViewChild(MatSort) sort: MatSort;
}
