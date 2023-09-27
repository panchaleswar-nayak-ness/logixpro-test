import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ie-inv-fields',
  templateUrl: './ie-inv-fields.component.html',
  styleUrls: ['./ie-inv-fields.component.scss']
})
export class IeInvFieldsComponent {

  ELEMENT_DATA: any[] =[
    {table_name: 'Active'},
    {table_name: 'Avg Piece Weight'},
    {table_name: 'Bulk Cell Size'},
    {table_name: 'Bulk Max Qty'},
    {table_name: 'Bulk Min Qty'},
    {table_name: 'Bulk Velocity'},
    {table_name: 'Case Quantity'},
    {table_name: 'Category'},
    {table_name: 'Cell Size'},
    {table_name: 'CF Cell Size'},
    {table_name: 'CF Max Qty'},
    {table_name: 'CF Min Qty'},
    {table_name: 'CF Velocity'},
    {table_name: 'Data Sensitive'},
    {table_name: 'Description'},
    {table_name: 'FIFO'},
    {table_name: 'Golden Zone'},
    {table_name: 'Include in Auto RTS Update'},
    {table_name: 'Kanban Replenisment Level'}
  ]

    displayedColumns: string[] = ['table_name','modify'];
    tableData = this.ELEMENT_DATA
    dataSourceList:any

  constructor(
    private dialog: MatDialog,
  ) { }


}
