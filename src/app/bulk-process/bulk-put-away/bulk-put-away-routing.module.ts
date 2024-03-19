import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkPutAwayComponent } from './bulk-put-away.component';
import { ConfirmationGuard } from 'src/app/common/guard/confirmation-guard.guard';

const routes: Routes = [
  {
    path:'',
    component:BulkPutAwayComponent,
    canDeactivate: [ConfirmationGuard],
    data: {title: 'Bulk Put Away'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkPutAwayRoutingModule { }
