import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsolidationManagerRoutingModule } from './consolidation-manager-routing.module';
import { ConsolidationManagerComponent } from './consolidation-manager.component';
import { GeneralModule } from '../gen-module';
import { MaterialModule } from '../material-module';
import { ConsolidationPreferencesComponent } from './consolidation-preferences/consolidation-preferences.component';
import { ConsolidationComponent } from './consolidation/consolidation.component';
import { CmStagingLocationComponent } from './cm-staging-location/cm-staging-location.component';
import { PreferencesShippingComponent } from './consolidation-preferences/preferences-shipping/preferences-shipping.component';
import { PreferencesConsolidationComponent } from './consolidation-preferences/preferences-consolidation/preferences-consolidation.component';
import { SharedComponentsModule } from "../common/globalComponents/shared-components.module";
import { SLSearchOrderNumberToteComponent } from './cm-staging-location/sl-search-order-number-tote/sl-search-order-number-tote.component';
import { UnverifiedItemComponent } from './consolidation/unverified-item/unverified-item.component';
import { VerifiedItemComponent } from './consolidation/verified-item/verified-item.component';
import { CmMarkoutComponent } from './cm-markout/cm-markout.component';
import { MarkoutListComponent } from './cm-markout/markout-list/markout-list.component';
import { MarkoutSearchComponent } from './cm-markout/markout-search/markout-search.component';
import { MarkoutStatusComponent } from './cm-markout/markout-status/markout-status.component';
import { PreferencesMarkoutComponent } from './consolidation-preferences/preferences-markout/preferences-markout.component';


@NgModule({
    declarations: [
        ConsolidationManagerComponent,
        ConsolidationPreferencesComponent,
        ConsolidationComponent,
        CmStagingLocationComponent,
        PreferencesShippingComponent,
        PreferencesConsolidationComponent,
        SLSearchOrderNumberToteComponent,
        UnverifiedItemComponent,
        VerifiedItemComponent,
        CmMarkoutComponent,
        MarkoutSearchComponent,
        MarkoutStatusComponent,
        MarkoutListComponent,
        PreferencesMarkoutComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        GeneralModule,
        ConsolidationManagerRoutingModule,
        SharedComponentsModule
    ]
})
export class ConsolidationManagerModule { }
