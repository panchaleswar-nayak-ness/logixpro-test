import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalService } from 'src/app/common/services/global.service';
import { DialogConstants, MarkoutNewPickTotesDC, MarkoutNewPickTotesKeys, Style } from 'src/app/common/constants/strings.constants';
import { Placeholders } from 'src/app/common/constants/strings.constants';
import { TableHeaderDefinitions } from 'src/app/common/types/CommonTypes';
import { ToteIdDetailsComponent } from '../dialogs/tote-id-details/tote-id-details.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { PickTotes } from '../models/cm-markout-new-models';

@Component({
  selector: 'app-markout-new-pick-totes',
  templateUrl: './markout-new-pick-totes.component.html',
  styleUrls: ['./markout-new-pick-totes.component.scss']
})
export class MarkoutNewPickTotesComponent implements OnInit {

  placeholders = Placeholders;
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  ItemNumber: string = this.fieldMappings.itemNumber;
  displayedColumns: string[] = [
    MarkoutNewPickTotesKeys.ToteID,
    MarkoutNewPickTotesKeys.Status,
    MarkoutNewPickTotesKeys.StatusDate,
    MarkoutNewPickTotesKeys.RouteID,
    MarkoutNewPickTotesKeys.DivertReason,
    MarkoutNewPickTotesKeys.Location,
    MarkoutNewPickTotesKeys.Destination,
    MarkoutNewPickTotesKeys.Details
  ];
  tableColumns: TableHeaderDefinitions[] = [
    { colHeader: MarkoutNewPickTotesKeys.ToteID, colDef: MarkoutNewPickTotesDC.ToteID },
    { colHeader: MarkoutNewPickTotesKeys.Status, colDef: MarkoutNewPickTotesDC.Status },
    { colHeader: MarkoutNewPickTotesKeys.StatusDate, colDef: MarkoutNewPickTotesDC.StatusDate },
    { colHeader: MarkoutNewPickTotesKeys.RouteID, colDef: MarkoutNewPickTotesDC.RouteID },
    { colHeader: MarkoutNewPickTotesKeys.DivertReason, colDef: MarkoutNewPickTotesDC.DivertReason },
    { colHeader: MarkoutNewPickTotesKeys.Location, colDef: MarkoutNewPickTotesDC.Location },
    { colHeader: MarkoutNewPickTotesKeys.Destination, colDef: MarkoutNewPickTotesDC.Destination }
  ];
  searchColumn: string;
  searchValue: string;
  dataSource: MatTableDataSource<PickTotes> = new MatTableDataSource<PickTotes>();
  clickTimeout: ReturnType<typeof setTimeout>;

  constructor(
    private readonly global: GlobalService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.dataSource = new MatTableDataSource<PickTotes>([
      { toteId: 526542, status: 'Exception', statusDate: '2023-05-30, 10:02:27', routeID: '00099999999', divertReason: 'UW SH', location: 'PTLMarkout', destination: '-', selected:false },
      { toteId: 526542, status: 'Exception', statusDate: '2023-05-30, 10:02:27', routeID: '00099999999', divertReason: 'UW SH', location: 'PTLMarkout', destination: '-', selected:false},
      { toteId: 526542, status: 'Exception', statusDate: '2023-05-30, 10:02:27', routeID: '00099999999', divertReason: 'UW SH', location: 'PTLMarkout', destination: '-', selected:false},
      { toteId: 526542, status: 'Exception', statusDate: '2023-05-30, 10:02:27', routeID: '00099999999', divertReason: 'UW SH', location: 'PTLMarkout', destination: '-', selected:false},
      { toteId: 526542, status: 'Exception', statusDate: '2023-05-30, 10:02:27', routeID: '00099999999', divertReason: 'UW SH', location: 'PTLMarkout', destination: '-', selected:false},
      { toteId: 526542, status: 'Exception', statusDate: '2023-05-30, 10:02:27', routeID: '00099999999', divertReason: 'UW SH', location: 'PTLMarkout', destination: '-', selected:false},
      { toteId: 526542, status: 'Exception', statusDate: '2023-05-30, 10:02:27', routeID: '00099999999', divertReason: 'UW SH', location: 'PTLMarkout', destination: '-', selected:false},
      { toteId: 526542, status: 'Exception', statusDate: '2023-05-30, 10:02:27', routeID: '00099999999', divertReason: 'UW SH', location: 'PTLMarkout', destination: '-', selected:false},
    ]);
    this.dataSource.filteredData[0].selected = true;
  }

  refresh(){
    this.getData();
  }

  selectRow(row: PickTotes) {
    this.clickTimeout = setTimeout(() => {
      this.dataSource.filteredData.forEach(element => {
        if (row != element) {
          element.selected = false;
        }
      });
      const selectedRow = this.dataSource.filteredData.find((x: PickTotes) => x === row);
      if (selectedRow) {
        selectedRow.selected = !selectedRow.selected;
      }
    }, 250);
  }

  toteIdDetails() {
    this.global.OpenDialog(ToteIdDetailsComponent, {
      height: DialogConstants.auto,
      width: Style.w786px,
      data: {
        FilterColumnName: `Quantity`,
        dynamicText: 'Update Quantity',
        butttonText: 'Update',
        inputType: 'number',
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });
  }

  resolved() {
    this.dialog.open(ConfirmationDialogComponent, {
      width: '560px',
      data: {
        heading: 'Resolve Tote ID',
        message: `Are you sure you want to mark this Tote ID as resolved? This will remove this Tote ID from the Markout.`,
        message2: 'This action cannot be undone.',
        customButtonText: true,
        btn1Text: 'Resolved',
        btn2Text: 'Cancel',
        checkBox: true
      }
    });
  }
}
