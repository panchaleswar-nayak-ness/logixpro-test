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


@NgModule({
    declarations: [
        ConsolidationManagerComponent,
        ConsolidationPreferencesComponent,
        ConsolidationComponent,
        CmStagingLocationComponent,
        PreferencesShippingComponent,
        PreferencesConsolidationComponent
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
