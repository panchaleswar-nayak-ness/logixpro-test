import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkPutAwayRoutingModule } from './bulk-put-away-routing.module';
import { MaterialModule } from 'src/app/material-module';
import { GeneralModule } from 'src/app/gen-module';
import { SharedComponentsModule } from 'src/app/common/globalComponents/shared-components.module';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { StatusComponent } from './status/status.component';
import { OrderSelectionListComponent } from './order-selection-list/order-selection-list.component';
import { SelectedOrdersComponent } from './selected-orders/selected-orders.component';
import { BulkPutAwayComponent } from './bulk-put-away.component';
import { VerifyBulkPutAwayComponent } from './verify-bulk-put-away/verify-bulk-put-away.component';


@NgModule({
  declarations: [
    SearchBarComponent,
    StatusComponent,
    OrderSelectionListComponent,
    SelectedOrdersComponent,
    BulkPutAwayComponent,
    VerifyBulkPutAwayComponent
  ],
  imports: [
    CommonModule,
    BulkPutAwayRoutingModule,
    MaterialModule,
    GeneralModule,
    SharedComponentsModule,

  ]
})
export class BulkPutAwayModule { }
