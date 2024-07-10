import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkoutMainProcessRoutingModule } from './markout-main-process-routing.module';
import { MarkoutMainProcessComponent } from './markout-main-process.component';
import { MarkoutMainModuleComponent } from './markout-main-module/markout-main-module.component';
import { MarkoutMainPreferencesComponent } from './markout-main-preferences/markout-main-preferences.component';
import { MarkoutListComponent } from './markout-main-module/markout-list/markout-list.component';
import { MarkoutStatusComponent } from './markout-main-module/markout-status/markout-status.component';
import { MarkoutSearchComponent } from './markout-main-module/markout-search/markout-search.component';
import { SharedComponentsModule } from '../common/globalComponents/shared-components.module';
import { GeneralModule } from '../gen-module';
import { CdkTableModule } from '@angular/cdk/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from '../material-module';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    MarkoutMainPreferencesComponent,
    MarkoutMainProcessComponent,
    MarkoutListComponent,
    MarkoutStatusComponent,
    MarkoutSearchComponent,
    MarkoutMainModuleComponent
  ],
  imports: [
    SharedComponentsModule,
    CommonModule,
    GeneralModule,
    CdkTableModule,
    DragDropModule,
    MatInputModule,
    MaterialModule,
    MarkoutMainProcessRoutingModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      extendedTimeOut: 0,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning',
      },
    }),

  ]
})
export class MarkoutMainProcessModule { }
