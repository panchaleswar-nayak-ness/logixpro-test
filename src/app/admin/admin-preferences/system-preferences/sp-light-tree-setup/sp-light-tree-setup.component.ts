import { Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sp-light-tree-setup',
  templateUrl: './sp-light-tree-setup.component.html',
  styleUrls: []
})
export class SpLightTreeSetupComponent{

  constructor(private dialog: MatDialog) { }



  ELEMENT_DATA: any[] =[

    {shelf: '12', alternate_light_positions_no: '22' },
    {shelf: '12', alternate_light_positions_no: '22' },

  ];

  displayedColumns: string[] = ['shelf', 'alternate_light_positions_no','other'];
  tableData = this.ELEMENT_DATA
  dataSourceList:any

  selectRow(row: any) {
    this.ELEMENT_DATA.forEach(element => {
      if(row != element){
        element.selected = false;
      }
    });
    const selectedRow = this.ELEMENT_DATA.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }

}
