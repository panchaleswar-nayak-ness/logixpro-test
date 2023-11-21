import { Component } from '@angular/core';
import { DialogConstants } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { IeManageDataInvenMapTablesComponent } from 'src/app/dialogs/ie-manage-data-inven-map-tables/ie-manage-data-inven-map-tables.component';
import { IeManageDataTransFieldMapComponent } from 'src/app/dialogs/ie-manage-data-trans-field-map/ie-manage-data-trans-field-map.component';

@Component({
  selector: 'app-ie-md-export-invertory-map',
  templateUrl: './ie-md-export-invertory-map.component.html',
  styleUrls: ['./ie-md-export-invertory-map.component.scss']
})
export class IeMdExportInvertoryMapComponent {

  constructor(
    private global:GlobalService
  ) { }

  IeTransFieldMappingDialog() {
    this.global.OpenDialog(IeManageDataTransFieldMapComponent,{
     height: DialogConstants.auto,
     width: '100vw',
     autoFocus: DialogConstants.autoFocus,
     disableClose: true,
   });
 }

 IeInventMappingDialog() {
    this.global.OpenDialog(IeManageDataInvenMapTablesComponent,{
     height: DialogConstants.auto,
     width: '100vw',
     autoFocus: DialogConstants.autoFocus,
     disableClose:true,
   });
 }
}
