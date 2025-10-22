import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InductionManagerRoutingModule } from './induction-manager-routing.module';
import { InductionManagerComponent } from './induction-manager.component';
import { MaterialModule } from '../material-module';
import { GeneralModule } from '../gen-module';
import { SuperBatchComponent } from './super-batch/super-batch.component';
import { RequiredDateStatusComponent } from '../dialogs/required-date-status/required-date-status.component';
import { ProcessPutAwaysComponent } from './process-put-aways/process-put-aways.component';
import { ProcessPicksComponent } from './process-picks/process-picks.component';
import { AdminComponent } from './admin/admin.component';
import { AdminPrefrencesComponent } from './admin-prefrences/admin-prefrences.component';
import { PalletReceivingComponent } from './pallet-receiving/pallet-receiving.component';
import { MarkEmptyReelsComponent } from './mark-empty-reels/mark-empty-reels.component';
import { ToteTransactionManagerComponent } from './tote-transaction-manager/tote-transaction-manager.component';
import { ImToteManagerComponent } from './im-tote-manager/im-tote-manager.component';
import { CompletePickBatchComponent } from './complete-pick-batch/complete-pick-batch.component';
import { SharedComponentsModule } from "../common/globalComponents/shared-components.module";
import { ProcessPickBatchesComponent } from './process-picks/process-pick-batches/process-pick-batches.component';
import { ProcessPickTotesComponent } from './process-picks/process-pick-totes/process-pick-totes.component';
import { PpaTsBatchSetupComponent } from './process-put-aways/ppa-ts-batch-setup/ppa-ts-batch-setup.component';
import { PpaTsTotesComponent } from './process-put-aways/ppa-ts-totes/ppa-ts-totes.component';
import { FilterOrderNumberComponent } from './pick-tote-induction/filter-order-number/filter-order-number.component';
import { FilterTotalQuantityComponent } from './pick-tote-induction/filter-total-quantity/filter-total-quantity.component';
import { PickToteInFilterComponent } from './pick-tote-induction/pick-tote-in-filter/pick-tote-in-filter.component';
import { PickToteInductionComponent } from './pick-tote-induction/pick-tote-induction.component';
import { NonSuperBatchOrdersComponent } from './pick-tote-induction/non-super-batch-orders/non-super-batch-orders.component';
import { SuperBatchOrdersComponent } from './pick-tote-induction/super-batch-orders/super-batch-orders.component';
import { CartManagementComponent } from './cart-management/cart-management.component';
import { BuildNewCartComponent } from './cart-management/dialogs/build-new-cart/build-new-cart.component';
import { CartSearchComponent } from './cart-management/cart-search/cart-search.component';
import { CartStatusSummaryComponent } from './cart-management/cart-status-summary/cart-status-summary.component';
import { CartGridComponent } from './cart-management/cart-grid/cart-grid.component';
import { InductCartComponent } from './cart-management/induct-cart/induct-cart.component';
import { AddNewCartComponent } from './cart-management/add-new-cart/add-new-cart.component';

@NgModule({
    declarations: [
        InductionManagerComponent,
        SuperBatchComponent,
        RequiredDateStatusComponent,
        ProcessPutAwaysComponent,
        ProcessPicksComponent,
        AdminComponent,
        AdminPrefrencesComponent,
        PalletReceivingComponent,
        MarkEmptyReelsComponent,
        ToteTransactionManagerComponent,
        ImToteManagerComponent,
        CompletePickBatchComponent,
        ProcessPickBatchesComponent,
        ProcessPickTotesComponent,
        PpaTsBatchSetupComponent,
        PpaTsTotesComponent,
        FilterOrderNumberComponent,
        FilterTotalQuantityComponent,
        PickToteInFilterComponent,
        PickToteInductionComponent,
        NonSuperBatchOrdersComponent,
        SuperBatchOrdersComponent,
        CartManagementComponent,
        BuildNewCartComponent,
        CartSearchComponent,
        CartStatusSummaryComponent,
        CartGridComponent,
        InductCartComponent,
        AddNewCartComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        GeneralModule,
        InductionManagerRoutingModule,
        SharedComponentsModule
    ]
})
export class InductionManagerModule { }
