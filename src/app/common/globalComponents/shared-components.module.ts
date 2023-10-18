import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableContextMenuComponentComponent } from './table-context-menu-component/table-context-menu-component.component';
import { GeneralModule } from 'src/app/gen-module';
import { MaterialModule } from 'src/app/material-module';
import { IconHeadingComponentComponent } from './icon-heading-component/icon-heading-component.component';



@NgModule({
  declarations: [
    TableContextMenuComponentComponent,
    IconHeadingComponentComponent,
  ],
  exports: [
    TableContextMenuComponentComponent,
    IconHeadingComponentComponent
  ],
  imports: [
    CommonModule,
    GeneralModule,
    MaterialModule
  ]
})
export class SharedComponentsModule { }
