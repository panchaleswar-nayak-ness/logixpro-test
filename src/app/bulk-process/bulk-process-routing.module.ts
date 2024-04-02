import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkProcessComponent } from './bulk-process.component';
import { BulkPickComponent } from './bulk-pick/bulk-pick.component';
import { AuthGuardGuard } from '../common/guard/auth-guard.guard';
import { BulkPutAwayComponent } from './bulk-put-away/bulk-put-away.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { BulkCountComponent } from './bulk-count/bulk-count.component';
import { ConfirmationGuard } from '../common/guard/confirmation-guard.guard';

const routes: Routes = [
{ 
  path: '', 
  component: BulkProcessComponent, 
  canActivate: [AuthGuardGuard],

},
{
  path: 'BulkPick12',
  component: BulkPickComponent,
  canActivate: [AuthGuardGuard], 
  canDeactivate: [ConfirmationGuard],
  data: {title: 'Bulk Pick'}
},
{
  path: 'BulkPutAway12',
  loadChildren: () =>
    import('./bulk-put-away/bulk-put-away.module').then((m) => m.BulkPutAwayModule),
  canActivate: [AuthGuardGuard],

},
{
  path: 'BulkCount12',
  loadChildren: () =>
    import('./bulk-count/bulk-count.module').then((m) => m.BulkCountModule),
  canActivate: [AuthGuardGuard], 
},  
{
  path: 'Preferences',
  component: PreferencesComponent,
  canActivate: [AuthGuardGuard],
},
{
  path: 'BulkCount',
  loadChildren: () =>
    import('./bulk-transaction/bulk-transaction.module').then((m) => m.BulkTransactionModule),
  canActivate: [AuthGuardGuard], 
  data: {title: 'Bulk Count'}
},  
{
  path: 'BulkPick',
  loadChildren: () =>
    import('./bulk-transaction/bulk-transaction.module').then((m) => m.BulkTransactionModule),
  canActivate: [AuthGuardGuard], 
  data: {title: 'Bulk Pick'}
},  
{
  path: 'BulkPutAway',
  loadChildren: () =>
    import('./bulk-transaction/bulk-transaction.module').then((m) => m.BulkTransactionModule),
  canActivate: [AuthGuardGuard], 
  data: {title: 'Bulk Put Away'}
},  
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkProcessRoutingModule { 
 


}
