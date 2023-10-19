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
        ProcessPickTotesComponent
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
