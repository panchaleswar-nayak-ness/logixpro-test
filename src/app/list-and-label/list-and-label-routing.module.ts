import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrdFrontendComponent } from './wrd-frontend/wrd-frontend.component';
import { WrvFrontendComponent } from './wrv-frontend/wrv-frontend.component';
import { ListAndLabelComponent } from './list-and-label.component';

const routes: Routes = [
  { path: '', component: ListAndLabelComponent },

  { path: 'report', component: WrdFrontendComponent },
  { path: 'report-view', component: WrvFrontendComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListAndLabelRoutingModule { }
