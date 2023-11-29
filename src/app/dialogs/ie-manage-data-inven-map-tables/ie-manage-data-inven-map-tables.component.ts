import { Component } from '@angular/core';
import {  zoneType ,TableConstant,ColumnDef} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-ie-manage-data-inven-map-tables',
  templateUrl: './ie-manage-data-inven-map-tables.component.html',
  styleUrls: ['./ie-manage-data-inven-map-tables.component.scss'],
})
export class IeManageDataInvenMapTablesComponent {
  elementData: any[] = [{ inv_map_id: '1202122' }];
  displayedColumns: string[] = [
    'inv_map_id',
    'transaction_type',
    'location_id',
    TableConstant.WareHouse,
    'cell_size',
    'golden_zone',
    TableConstant.zone,
    zoneType.carousel,
    'putaway',
    'maxqty',
    ColumnDef.Revision,
    's_no',
    'lot_no',
    'e_date',
    'uf1',
    'uf2',
  ];
  tableData = this.elementData;
  dataSourceList: any;
}
