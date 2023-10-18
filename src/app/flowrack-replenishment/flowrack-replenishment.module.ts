import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlowrackReplenishmentRoutingModule } from './flowrack-replenishment-routing.module';
import { FlowrackReplenishmentComponent } from './flowrack-replenishment.component';
import { FrPreferencesComponent } from './fr-preferences/fr-preferences.component';
import { MaterialModule } from '../material-module';
import { GeneralModule } from '../gen-module';
import { FrFlowrackReplenishmentComponent } from './fr-flowrack-replenishment/fr-flowrack-replenishment.component';
import { IconHeadingComponentComponent } from '../common/globalComponents/icon-heading-component/icon-heading-component.component';
import { SharedComponentsModule } from '../common/globalComponents/shared-components.module';

@NgModule({
  declarations: [
    FlowrackReplenishmentComponent,
    FrPreferencesComponent,
    FrFlowrackReplenishmentComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    GeneralModule,
    FlowrackReplenishmentRoutingModule,
    SharedComponentsModule
  ]
})
export class FlowrackReplenishmentModule { }
