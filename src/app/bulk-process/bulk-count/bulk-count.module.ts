import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkCountRoutingModule } from './bulk-count-routing.module';
import { BulkCountComponent } from './bulk-count.component';
import { VerifyBulkCountComponent } from './verify-bulk-count/verify-bulk-count.component';
import { SharedComponentsModule } from 'src/app/common/globalComponents/shared-components.module';
import { GeneralModule } from 'src/app/gen-module';
import { MaterialModule } from 'src/app/material-module';
import { OrderSelectionListComponent } from './order-selection-list/order-selection-list.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SelectedOrdersComponent } from './selected-orders/selected-orders.component';
import { StatusComponent } from './status/status.component';


@NgModule({
  declarations: [
    OrderSelectionListComponent,
    SearchBarComponent,
    SelectedOrdersComponent,
    StatusComponent,
    VerifyBulkCountComponent,
    BulkCountComponent
  ],
  imports: [
    CommonModule,
    BulkCountRoutingModule,
    MaterialModule,
    GeneralModule,
    SharedComponentsModule,

  ]
})
export class BulkCountModule { }
