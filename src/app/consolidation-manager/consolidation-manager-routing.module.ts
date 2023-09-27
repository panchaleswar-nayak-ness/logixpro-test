import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '../guard/auth-guard.guard';
import { ConsolidationManagerComponent } from './consolidation-manager.component';
import { ConsolidationComponent } from './consolidation/consolidation.component';
import { ConsolidationPreferencesComponent } from './consolidation-preferences/consolidation-preferences.component';
import { CmStagingLocationComponent } from './cm-staging-location/cm-staging-location.component';
import { TransactionComponent } from '../admin/transaction/transaction.component';
import { ReportsComponent } from '../admin/reports/reports.component';

const routes: Routes = [{ path: '', component: ConsolidationManagerComponent,
canActivate: [AuthGuardGuard] },
{
  path: 'Consolidation',
  component: ConsolidationComponent,
  canActivate: [AuthGuardGuard],
},
{ path: 'Preferences', 
component: ConsolidationPreferencesComponent, 
canActivate: [AuthGuardGuard], 
},
{ path: 'StagingLocations', 
component: CmStagingLocationComponent, 
canActivate: [AuthGuardGuard], 
},
{ path: 'OrderStatus', 
component: TransactionComponent, 
canActivate: [AuthGuardGuard], 
},
{ path: 'Reports', 
component: ReportsComponent, 
canActivate: [AuthGuardGuard], 
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsolidationManagerRoutingModule { }
