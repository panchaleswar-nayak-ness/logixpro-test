import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pick-tote-in-filter',
  templateUrl: './pick-tote-in-filter.component.html',
  styleUrls: ['./pick-tote-in-filter.component.scss']
})
export class PickToteInFilterComponent implements OnInit {

  constructor() { }

  displayedColumns: string[] = ["select", "field", "fieldValue", "actions"];
  elementData = [
    { field: 'Zone 1'},
    { field: 'Zone 2'},
    { field: 'Zone 3' }
  ];
  dataSource = new MatTableDataSource(this.elementData);

  ngOnInit(): void {
  }

}
