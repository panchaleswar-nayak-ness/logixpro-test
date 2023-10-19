import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { IeManageDataInvenMapTablesComponent } from 'src/app/dialogs/ie-manage-data-inven-map-tables/ie-manage-data-inven-map-tables.component';
import { IeManageDataTransFieldMapComponent } from 'src/app/dialogs/ie-manage-data-trans-field-map/ie-manage-data-trans-field-map.component';

@Component({
  selector: 'app-ie-md-export-invertory-map',
  templateUrl: './ie-md-export-invertory-map.component.html',
  styleUrls: ['./ie-md-export-invertory-map.component.scss']
})
export class IeMdExportInvertoryMapComponent implements OnInit {

  constructor(
    private global:GlobalService
  ) { }

  ngOnInit(): void {
  }

  IeTransFieldMappingDialog() {
    this.global.OpenDialog(IeManageDataTransFieldMapComponent,{
     height: 'auto',
     width: '100vw',
     autoFocus: '__non_existing_element__',
     disableClose:true,
   });

 }

 IeInventMappingDialog() {
    this.global.OpenDialog(IeManageDataInvenMapTablesComponent,{
     height: 'auto',
     width: '100vw',
     autoFocus: '__non_existing_element__',
     disableClose:true,
   });

 }

}
