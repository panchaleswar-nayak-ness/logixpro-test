import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrPreferencesComponent } from './fr-preferences/fr-preferences.component';
import { FlowrackReplenishmentComponent } from './flowrack-replenishment.component';
import { AuthGuardGuard } from '../guard/auth-guard.guard';
import { FrFlowrackReplenishmentComponent } from './fr-flowrack-replenishment/fr-flowrack-replenishment.component';

const routes: Routes = [
  { 
    path: '', 
    component: FlowrackReplenishmentComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'Preferences',
    component: FrPreferencesComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'Flowrack',
    component: FrFlowrackReplenishmentComponent,
    canActivate: [AuthGuardGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlowrackReplenishmentRoutingModule { }
