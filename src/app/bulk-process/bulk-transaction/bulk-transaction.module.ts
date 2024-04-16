import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkTransactionRoutingModule } from './bulk-transaction-routing.module';
import { BulkTransactionComponent } from './bulk-transaction.component';
import { OrderSelectionListComponent } from './order-selection-list/order-selection-list.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SelectedOrdersComponent } from './selected-orders/selected-orders.component';
import { StatusComponent } from './status/status.component';
import { VerifyBulkComponent } from './verify-bulk/verify-bulk.component';
import { GeneralModule } from 'src/app/gen-module';
import { MaterialModule } from 'src/app/material-module';
import { SharedComponentsModule } from 'src/app/common/globalComponents/shared-components.module';
import { PickRemainingComponent } from './pick-remaining/pick-remaining.component';


@NgModule({
  declarations: [
    BulkTransactionComponent,
    OrderSelectionListComponent,
    SearchBarComponent,
    SelectedOrdersComponent,
    StatusComponent,
    VerifyBulkComponent,
    PickRemainingComponent
  ],
  imports: [
    CommonModule,
    BulkTransactionRoutingModule,
    MaterialModule,
    GeneralModule,
    SharedComponentsModule,
  ]
})
export class BulkTransactionModule { }
