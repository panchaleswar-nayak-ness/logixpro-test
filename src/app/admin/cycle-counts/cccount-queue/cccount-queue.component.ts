import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImportFieldMappingComponent } from '../import-field-mapping/import-field-mapping.component';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 11009, name: '119', weight: 500, symbol: '2541'},
  {position: 11009, name: '10086', weight: 300, symbol: '3021'},
  {position: 11009, name: '6521', weight: 500, symbol: '1234'},
  {position: 11009, name: '5213', weight: 2000, symbol: '90000'},
  ];

@Component({
  selector: 'app-cccount-queue',
  templateUrl: './cccount-queue.component.html',
  styleUrls: ['./cccount-queue.component.scss']
})
export class CCCountQueueComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'ex', 'srno', 'action'];
  tableData = ELEMENT_DATA;


  constructor(private dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  importFieldMapping(){
    let dialogRef = this.dialog.open(ImportFieldMappingComponent, {
      height: '650px',
      width: '800px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'addInvMapLocation',
        //itemList : this.itemList,
      //  detailData : event
      }
    })
    dialogRef.afterClosed().subscribe(result => {

    })
  }

}
