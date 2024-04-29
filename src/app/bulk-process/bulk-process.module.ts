import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { BulkProcessRoutingModule } from './bulk-process-routing.module'; 
import { MaterialModule } from '../material-module';
import { GeneralModule } from '../gen-module';
import { SharedComponentsModule } from '../common/globalComponents/shared-components.module';
import { BulkProcessComponent } from './bulk-process.component';  
import { PreferencesComponent } from './preferences/preferences.component'; 


@NgModule({
  declarations: [
    BulkProcessComponent, 
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
