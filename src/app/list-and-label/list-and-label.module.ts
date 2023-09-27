import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListAndLabelRoutingModule } from './list-and-label-routing.module';
import { ListAndLabelComponent } from './list-and-label.component';
import { WrdComponent } from './wrd/wrd.component';
import { WrvComponent } from './wrv/wrv.component';
import { WrvFrontendComponent } from './wrv-frontend/wrv-frontend.component';
import { WrdFrontendComponent } from './wrd-frontend/wrd-frontend.component';
import { FormsModule } from '@angular/forms';
import { GeneralModule } from '../gen-module';


@NgModule({
  declarations: [
    ListAndLabelComponent,
    WrdComponent,
    WrvComponent,
    WrvFrontendComponent,
    WrdFrontendComponent
  ],
  imports: [
    // BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule, 
    FormsModule,
    GeneralModule,
    ListAndLabelRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ListAndLabelModule { }
