import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkPutAwayComponent } from './bulk-put-away.component';

const routes: Routes = [
  {
    path:'',
    component:BulkPutAwayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkPutAwayRoutingModule { }
