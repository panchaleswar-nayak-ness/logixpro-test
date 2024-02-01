import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkProcessRoutingModule } from './bulk-process-routing.module';
import { BulkPickComponent } from './bulk-pick/bulk-pick.component';
import { MaterialModule } from '../material-module';
import { GeneralModule } from '../gen-module';
import { SharedComponentsModule } from '../common/globalComponents/shared-components.module';
import { BulkProcessComponent } from './bulk-process.component';
import { BulkPutAwayComponent } from './bulk-put-away/bulk-put-away.component';
import { BpSearchBarComponent } from './bulk-pick/bp-search-bar/bp-search-bar.component';
import { BpStatusComponent } from './bulk-pick/bp-status/bp-status.component';
import { BpOrderSelectionListComponent } from './bulk-pick/bp-order-selection-list/bp-order-selection-list.component';
import { BpSelectedOrdersComponent } from './bulk-pick/bp-selected-orders/bp-selected-orders.component';


@NgModule({
  declarations: [
    BulkProcessComponent,
    BulkPickComponent,
    BulkPutAwayComponent,
    BpSearchBarComponent,
    BpStatusComponent,
    BpOrderSelectionListComponent,
    BpSelectedOrdersComponent
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
