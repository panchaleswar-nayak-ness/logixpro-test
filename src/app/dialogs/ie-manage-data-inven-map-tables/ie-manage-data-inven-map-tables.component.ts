import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ie-manage-data-inven-map-tables',
  templateUrl: './ie-manage-data-inven-map-tables.component.html',
  styleUrls: []
})
export class IeManageDataInvenMapTablesComponent {
  ELEMENT_DATA: any[] =[
    {inv_map_id: '1202122'},
    // {inv_map_id: '1202123'},
    // {inv_map_id: '1202124'},
    // {inv_map_id: '1202125'},
    // {inv_map_id: '1202126'},
    // {inv_map_id: '1202127'},
    
  ]

    displayedColumns: string[] = ['inv_map_id','transaction_type','location_id','warehouse','cell_size','golden_zone','zone','carousel','putaway','maxqty','revision','s_no','lot_no','e_date','uf1','uf2'];
    tableData = this.ELEMENT_DATA
    dataSourceList:any

  constructor(
    private dialog: MatDialog,
  ) { }


}
