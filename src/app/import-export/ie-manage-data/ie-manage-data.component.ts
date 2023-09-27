import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IeManageDataInvenMapTablesComponent } from 'src/app/dialogs/ie-manage-data-inven-map-tables/ie-manage-data-inven-map-tables.component';
import { IeManageDataTransFieldMapComponent } from 'src/app/dialogs/ie-manage-data-trans-field-map/ie-manage-data-trans-field-map.component';

@Component({
  selector: 'app-ie-manage-data',
  templateUrl: './ie-manage-data.component.html',
  styleUrls: []
})
export class IeManageDataComponent  {

  constructor(
    private dialog: MatDialog,
  ) { }

  IeTransFieldMappingDialog() {
     this.dialog.open(IeManageDataTransFieldMapComponent,{
      height: 'auto',
      width: '100vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });

  }

  IeInventMappingDialog() {
     this.dialog.open(IeManageDataInvenMapTablesComponent,{
      height: 'auto',
      width: '100vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });

  }
  
}
