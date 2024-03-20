import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkCountComponent } from './bulk-count.component';
import { ConfirmationGuard } from 'src/app/common/guard/confirmation-guard.guard';

const routes: Routes = [
  {
    path:'',
    component:BulkCountComponent,
    canDeactivate: [ConfirmationGuard],
    data: {title: 'Bulk Count'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkCountRoutingModule { }
