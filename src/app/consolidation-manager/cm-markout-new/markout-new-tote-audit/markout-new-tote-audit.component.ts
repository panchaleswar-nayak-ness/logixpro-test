import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MarkoutNewToteAuditDC, MarkoutNewToteAuditKeys, } from 'src/app/common/constants/strings.constants';
import { Placeholders } from 'src/app/common/constants/strings.constants';
import { TableHeaderDefinitions } from 'src/app/common/types/CommonTypes';
import { ToteAudit } from '../models/cm-markout-new-models';

@Component({
  selector: 'app-markout-new-tote-audit',
  templateUrl: './markout-new-tote-audit.component.html',
  styleUrls: ['./markout-new-tote-audit.component.scss']
})
export class MarkoutNewToteAuditComponent implements OnInit {

  placeholders = Placeholders;
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  ItemNumber: string = this.fieldMappings.itemNumber;
  displayedColumns: string[] = [
    MarkoutNewToteAuditKeys.Time,
    MarkoutNewToteAuditKeys.Type,
    MarkoutNewToteAuditKeys.Scanner,
    MarkoutNewToteAuditKeys.Divert,
    MarkoutNewToteAuditKeys.Location,
    MarkoutNewToteAuditKeys.Status,
    MarkoutNewToteAuditKeys.StatusDate,
    MarkoutNewToteAuditKeys.DivertReason
  ];
  tableColumns: TableHeaderDefinitions[] = [
    { colHeader: MarkoutNewToteAuditKeys.Time, colDef: MarkoutNewToteAuditDC.Time },
    { colHeader: MarkoutNewToteAuditKeys.Type, colDef: MarkoutNewToteAuditDC.Type },
    { colHeader: MarkoutNewToteAuditKeys.Scanner, colDef: MarkoutNewToteAuditDC.Scanner },
    { colHeader: MarkoutNewToteAuditKeys.Divert, colDef: MarkoutNewToteAuditDC.Divert },
    { colHeader: MarkoutNewToteAuditKeys.Location, colDef: MarkoutNewToteAuditDC.Location },
    { colHeader: MarkoutNewToteAuditKeys.Status, colDef: MarkoutNewToteAuditDC.Status },
    { colHeader: MarkoutNewToteAuditKeys.StatusDate, colDef: MarkoutNewToteAuditDC.StatusDate },
    { colHeader: MarkoutNewToteAuditKeys.DivertReason, colDef: MarkoutNewToteAuditDC.DivertReason }
  ];
  searchColumn: string;
  searchValue: string;
  dataSource: MatTableDataSource<ToteAudit> = new MatTableDataSource<ToteAudit>();

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<ToteAudit>([
      { time: 1233, type: 1, scanner: 9001, divert: 4, location: 'PTLMarkout', status: 'Exported', statusDate: '2023-05-30, 10:02:27', divertReason: 'UW SH' },
      { time: 1233, type: 1, scanner: 9001, divert: 4, location: 'PTLMarkout', status: 'Created', statusDate: '2023-05-30, 10:02:27', divertReason: 'UW SH' },
      { time: 1233, type: 1, scanner: 9001, divert: 4, location: 'PTLMarkout', status: 'Created', statusDate: '2023-05-30, 10:02:27', divertReason: 'UW SH' },
      { time: 1233, type: 1, scanner: 9001, divert: 4, location: 'PTLMarkout', status: 'Created', statusDate: '2023-05-30, 10:02:27', divertReason: 'UW SH' },
      { time: 1233, type: 1, scanner: 9001, divert: 4, location: 'PTLMarkout', status: 'Created', statusDate: '2023-05-30, 10:02:27', divertReason: 'UW SH' },
      { time: 1233, type: 1, scanner: 9001, divert: 4, location: 'PTLMarkout', status: 'Created', statusDate: '2023-05-30, 10:02:27', divertReason: 'UW SH' },
      { time: 1233, type: 1, scanner: 9001, divert: 4, location: 'PTLMarkout', status: 'Created', statusDate: '2023-05-30, 10:02:27', divertReason: 'UW SH' },
      { time: 1233, type: 1, scanner: 9001, divert: 4, location: 'PTLMarkout', status: 'Created', statusDate: '2023-05-30, 10:02:27', divertReason: 'UW SH' }
    ]);
  }

}
