import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderManagerRoutingModule } from './order-manager-routing.module';
import { EventLogComponent } from './event-log/event-log.component';
import { CdkTableModule} from '@angular/cdk/table';
import { MaterialModule } from '../material-module';
import { GeneralModule } from '../gen-module';
import { OmOrderManagerComponent } from './om-order-manager/om-order-manager.component';
import { OmPreferencesComponent } from './om-preferences/om-preferences.component';
import { SharedComponentsModule } from '../common/globalComponents/shared-components.module';

@NgModule({
  declarations: [
    EventLogComponent,
    OmOrderManagerComponent,
    OmPreferencesComponent
   
    
  ],
  imports: [
    CommonModule,
    OrderManagerRoutingModule,
    MaterialModule,
    GeneralModule,
    CdkTableModule,
    SharedComponentsModule
  ]
})
export class OrderManagerModule { }
