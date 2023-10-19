import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableContextMenuComponentComponent } from './table-context-menu-component/table-context-menu-component.component';
import { GeneralModule } from 'src/app/gen-module';
import { MaterialModule } from 'src/app/material-module';
import { IconHeadingComponentComponent } from './icon-heading-component/icon-heading-component.component';
import { InfoCardComponentComponent } from './info-card-component/info-card-component.component';
import { ColumnFilterComponentComponent } from './column-filter-component/column-filter-component.component';
import { SortPipe } from 'src/app/init/sort.pipe';



@NgModule({
  declarations: [
    TableContextMenuComponentComponent,
    IconHeadingComponentComponent,
    InfoCardComponentComponent,
    IconHeadingComponentComponent,
    ColumnFilterComponentComponent,
    SortPipe
  ],
  exports: [
    TableContextMenuComponentComponent,
    IconHeadingComponentComponent,
    InfoCardComponentComponent,
    ColumnFilterComponentComponent,
    SortPipe
  ],
  imports: [
    CommonModule,
    GeneralModule,
    MaterialModule
  ]
})
export class SharedComponentsModule { }
