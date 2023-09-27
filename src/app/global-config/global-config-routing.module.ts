import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalDashboardComponent } from './dashboard/dashboard.component';
import { DatabaseConnectionsComponent } from './database-connections/database-connections.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: GlobalDashboardComponent,
  },
  {
    path: 'database-connections',
    component: DatabaseConnectionsComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalConfigRoutingModule {}
