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
import { BpVerifyBulkPickComponent } from './bulk-pick/bp-verify-bulk-pick/bp-verify-bulk-pick.component';
import { StatusComponent } from './bulk-put-away/status/status.component';
import { OrderSelectionListComponent } from './bulk-put-away/order-selection-list/order-selection-list.component';
import { SelectedOrdersComponent } from './bulk-put-away/selected-orders/selected-orders.component'; 
import { SearchBarComponent } from './bulk-put-away/search-bar/search-bar.component'; 
import { VerifyBulkPutAwayComponent } from './bulk-put-away/verify-bulk-put-away/verify-bulk-put-away.component';
import { PreferencesComponent } from './preferences/preferences.component';


@NgModule({
  declarations: [
    BulkProcessComponent,
    BulkPickComponent,
    BulkPutAwayComponent,
    BpSearchBarComponent,
    BpStatusComponent,
    BpOrderSelectionListComponent,
    BpSelectedOrdersComponent,
    BpVerifyBulkPickComponent,
    SearchBarComponent,
    StatusComponent,
    OrderSelectionListComponent,
    SelectedOrdersComponent,
    VerifyBulkPutAwayComponent,
    PreferencesComponent
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
