import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { BulkProcessRoutingModule } from './bulk-process-routing.module';
import { BulkPickComponent } from './bulk-pick/bulk-pick.component';
import { MaterialModule } from '../material-module';
import { GeneralModule } from '../gen-module';
import { SharedComponentsModule } from '../common/globalComponents/shared-components.module';
import { BulkProcessComponent } from './bulk-process.component'; 
import { BpSearchBarComponent } from './bulk-pick/bp-search-bar/bp-search-bar.component';
import { BpStatusComponent } from './bulk-pick/bp-status/bp-status.component';
import { BpOrderSelectionListComponent } from './bulk-pick/bp-order-selection-list/bp-order-selection-list.component';
import { BpSelectedOrdersComponent } from './bulk-pick/bp-selected-orders/bp-selected-orders.component';
import { BpVerifyBulkPickComponent } from './bulk-pick/bp-verify-bulk-pick/bp-verify-bulk-pick.component'; 
import { PreferencesComponent } from './preferences/preferences.component'; 


@NgModule({
  declarations: [
    BulkProcessComponent,
    BulkPickComponent, 
    BpSearchBarComponent,
    BpStatusComponent,
    BpOrderSelectionListComponent,
    BpSelectedOrdersComponent,
    BpVerifyBulkPickComponent, 
    PreferencesComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    GeneralModule,
    BulkProcessRoutingModule,
    SharedComponentsModule,


 
  ]
})
export class BulkProcessModule { }
