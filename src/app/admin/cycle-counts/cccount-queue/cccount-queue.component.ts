import { Component } from '@angular/core';
import { ImportFieldMappingComponent } from '../import-field-mapping/import-field-mapping.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { MatDialog } from '@angular/material/dialog';
import {  DialogConstants ,UniqueConstants,ColumnDef} from 'src/app/common/constants/strings.constants';
import { ImportCountBatchesComponent } from '../import-count-batches/import-count-batches.component';


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
export class CCCountQueueComponent{

  displayedColumns: string[] = [UniqueConstants.position, 'name', 'weight', 'symbol', 'ex', 'srno', ColumnDef.Action];
  tableData = ELEMENT_DATA;

  constructor(private global:GlobalService, private dialog: MatDialog) { }

  importFieldMapping(){
    let dialogRef:any = this.global.OpenDialog(ImportFieldMappingComponent, {
      height: '650px',
      width: '800px',
      autoFocus: DialogConstants.autoFocus,
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

  onActionChange(event: any): void {
    const selectedValue = event.value;
    if (selectedValue === '2') { // Value 2 corresponds to "Import Count Batches"
      this.openImportCountBatchesDialog();
    }
  }

  openImportCountBatchesDialog(): void {
    const dialogRef = this.dialog.open(ImportCountBatchesComponent, {
     
      width: '1400px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        mode: 'addInvMapLocation'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle dialog close result if needed
    });
  }


}
