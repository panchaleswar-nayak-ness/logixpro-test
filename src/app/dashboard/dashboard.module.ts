import { NgModule, APP_INITIALIZER, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr'; 
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../material-module';
import { GeneralModule } from '../gen-module';
import { FieldMappingService } from '../common/services/field-mapping/field-mapping.service';
import { initializeFieldMappings } from '../common/services/field-mappings-initializer/field-mappings-initializer.service';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    SideNavComponent,
    MainComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule, 
    GeneralModule,
    MaterialModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      extendedTimeOut: 0,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning',
      }
    })
  ],
  providers: [
    FieldMappingService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFieldMappings,
      deps: [FieldMappingService],
      multi: true,
    },
],
schemas: [NO_ERRORS_SCHEMA],
exports:[
    HeaderComponent,
    SideNavComponent,
  ]
})
export class DashboardModule { }
