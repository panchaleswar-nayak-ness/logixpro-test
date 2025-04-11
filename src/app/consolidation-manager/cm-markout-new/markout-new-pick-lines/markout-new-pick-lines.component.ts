import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MarkoutNewPickLinesDC, MarkoutNewPickLinesKeys } from 'src/app/common/constants/strings.constants';
import { Placeholders } from 'src/app/common/constants/strings.constants';
import { TableHeaderDefinitions } from 'src/app/common/types/CommonTypes';
import { PickLines } from '../models/cm-markout-new-models';

@Component({
  selector: 'app-markout-new-pick-lines',
  templateUrl: './markout-new-pick-lines.component.html',
  styleUrls: ['./markout-new-pick-lines.component.scss']
})
export class MarkoutNewPickLinesComponent implements OnInit {

  placeholders = Placeholders;
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  ItemNumber: string = this.fieldMappings.itemNumber;
  displayedColumns: string[] = [
    MarkoutNewPickLinesKeys.Item,
    MarkoutNewPickLinesKeys.Qty,
    MarkoutNewPickLinesKeys.LocID,
    MarkoutNewPickLinesKeys.Status,
    MarkoutNewPickLinesKeys.StatusDate,
    MarkoutNewPickLinesKeys.CompQty,
    MarkoutNewPickLinesKeys.CompBy,
    MarkoutNewPickLinesKeys.ShortReason
  ];
  tableColumns: TableHeaderDefinitions[] = [
    { colHeader: MarkoutNewPickLinesKeys.Item, colDef: MarkoutNewPickLinesDC.Item },
    { colHeader: MarkoutNewPickLinesKeys.Qty, colDef: MarkoutNewPickLinesDC.Qty },
    { colHeader: MarkoutNewPickLinesKeys.LocID, colDef: MarkoutNewPickLinesDC.LocID },
    { colHeader: MarkoutNewPickLinesKeys.Status, colDef: MarkoutNewPickLinesDC.Status },
    { colHeader: MarkoutNewPickLinesKeys.StatusDate, colDef: MarkoutNewPickLinesDC.StatusDate },
    { colHeader: MarkoutNewPickLinesKeys.CompQty, colDef: MarkoutNewPickLinesDC.CompQty },
    { colHeader: MarkoutNewPickLinesKeys.CompBy, colDef: MarkoutNewPickLinesDC.CompBy },
    { colHeader: MarkoutNewPickLinesKeys.ShortReason, colDef: MarkoutNewPickLinesDC.ShortReason }
  ];
  searchColumn: string;
  searchValue: string;
  dataSource: MatTableDataSource<PickLines> = new MatTableDataSource<PickLines>();

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<PickLines>([
      { item: 1725, qty: 100, locID: 'PK40409C05', status: 'Completed', statusDate: '2023-05-30, 10:02:27', compQty: '1', compBy: '10015', shortReason: 'PTLShort' },
      { item: 1725, qty: 100, locID: 'PK40409C05', status: 'Completed', statusDate: '2023-05-30, 10:02:27', compQty: '1', compBy: '10015', shortReason: 'PTLShort' },
      { item: 1725, qty: 100, locID: 'PK40409C05', status: 'Completed', statusDate: '2023-05-30, 10:02:27', compQty: '1', compBy: '10015', shortReason: 'PTLShort' },
      { item: 1725, qty: 100, locID: 'PK40409C05', status: 'Completed', statusDate: '2023-05-30, 10:02:27', compQty: '1', compBy: '10015', shortReason: 'PTLShort' },
      { item: 1725, qty: 100, locID: 'PK40409C05', status: 'Completed', statusDate: '2023-05-30, 10:02:27', compQty: '1', compBy: '10015', shortReason: 'PTLShort' },
      { item: 1725, qty: 100, locID: 'PK40409C05', status: 'Completed', statusDate: '2023-05-30, 10:02:27', compQty: '1', compBy: '10015', shortReason: 'PTLShort' },
      { item: 1725, qty: 100, locID: 'PK40409C05', status: 'Completed', statusDate: '2023-05-30, 10:02:27', compQty: '1', compBy: '10015', shortReason: 'PTLShort' },
      { item: 1725, qty: 100, locID: 'PK40409C05', status: 'Completed', statusDate: '2023-05-30, 10:02:27', compQty: '1', compBy: '10015', shortReason: 'PTLShort' },
    ]);
  }

}
