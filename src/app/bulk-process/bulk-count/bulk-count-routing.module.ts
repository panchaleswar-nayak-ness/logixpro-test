import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkCountComponent } from './bulk-count.component';

const routes: Routes = [
  {
    path:'',
    component:BulkCountComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkCountRoutingModule { }
