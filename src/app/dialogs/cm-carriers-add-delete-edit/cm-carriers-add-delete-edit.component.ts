import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
];

@Component({
  selector: 'app-cm-carriers-add-delete-edit',
  templateUrl: './cm-carriers-add-delete-edit.component.html',
  styleUrls: ['./cm-carriers-add-delete-edit.component.scss']
})
export class CmCarriersAddDeleteEditComponent{

  displayedColumns: string[] = ['select', 'action'];
  tableData = ELEMENT_DATA;

}
