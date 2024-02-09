import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  zoneOptions= ['01','02','03','04'];
  displayedColumns: string[] = ['Zone'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);

  constructor() { }

  ngOnInit(): void {
  }

}

export interface PeriodicElement {
  
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
];
