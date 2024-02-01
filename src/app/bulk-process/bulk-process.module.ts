import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkProcessRoutingModule } from './bulk-process-routing.module';
import { BulkPickComponent } from './bulk-pick/bulk-pick.component';
import { MaterialModule } from '../material-module';
import { GeneralModule } from '../gen-module';
import { SharedComponentsModule } from '../common/globalComponents/shared-components.module';
import { BulkProcessComponent } from './bulk-process.component';
import { BulkPutAwayComponent } from './bulk-put-away/bulk-put-away.component';


@NgModule({
  declarations: [
    BulkProcessComponent,
    BulkPickComponent,
    BulkPutAwayComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    GeneralModule,
    BulkProcessRoutingModule,
    SharedComponentsModule
  ]
})
export class BulkProcessModule { }
