import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationGuard } from 'src/app/common/guard/confirmation-guard.guard';
import { BulkTransactionComponent } from './bulk-transaction.component';

const routes: Routes = [
  {
    path:'',
    component:BulkTransactionComponent,
    canDeactivate: [ConfirmationGuard],
    data: {title: 'Bulk Count'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkTransactionRoutingModule { }
