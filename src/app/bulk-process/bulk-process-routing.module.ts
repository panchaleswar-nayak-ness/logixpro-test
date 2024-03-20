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
  path: 'BulkPick',
  component: BulkPickComponent,
  canActivate: [AuthGuardGuard], 
  canDeactivate: [ConfirmationGuard],
  data: {title: 'Bulk Pick'}
},
{
  path: 'BulkPutAway',
  loadChildren: () =>
    import('./bulk-put-away/bulk-put-away.module').then((m) => m.BulkPutAwayModule),
  canActivate: [AuthGuardGuard],

},
{
  path: 'BulkCount',
  loadChildren: () =>
    import('./bulk-count/bulk-count.module').then((m) => m.BulkCountModule),
  canActivate: [AuthGuardGuard], 
}, 
 
{
  path: 'Preferences',
  component: PreferencesComponent,
  canActivate: [AuthGuardGuard],
},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkProcessRoutingModule { 
 


}
