import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkProcessComponent } from './bulk-process.component';
import { BulkPickComponent } from './bulk-pick/bulk-pick.component';
import { AuthGuardGuard } from '../common/guard/auth-guard.guard';
import { BulkPutAwayComponent } from './bulk-put-away/bulk-put-away.component';
import { PreferencesComponent } from './preferences/preferences.component';

const routes: Routes = [
{ 
  path: '', 
  component: BulkProcessComponent,
  canActivate: [AuthGuardGuard]
},
{
  path: 'BulkPick',
  component: BulkPickComponent,
  canActivate: [AuthGuardGuard],
},
{
  path: 'BulkPutAway',
  component: BulkPutAwayComponent,
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
