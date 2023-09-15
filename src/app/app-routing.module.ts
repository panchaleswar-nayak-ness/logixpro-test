import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { EmployeesComponent } from './dashboard/employees/employees.component';
import { MainComponent } from './dashboard/main/main.component';
import { GlobalConfigComponent } from './global-config/global-config.component';
import { AuthGuardGuard } from './guard/auth-guard.guard';
import { LoginComponent } from './login/login.component';
import { GlobalDashboardComponent } from './global-config/dashboard/dashboard.component';
import { DatabaseConnectionsComponent } from './global-config/database-connections/database-connections.component';
import { PrintersComponent } from './global-config/printers/printers.component';
import { WorkstationComponent } from './global-config/workstation/workstation.component';
import { LicensingComponent } from './global-config/licensing/licensing.component';
import { CcsifComponent } from './global-config/ccsif/ccsif.component';
import { SteComponent } from './global-config/ste/ste.component';
import { SteServicesComponent } from './global-config/ste-services/ste-services.component';
import { FlowrackReplenishmentComponent } from './flowrack-replenishment/flowrack-replenishment.component';
import { ImportExportComponent } from './import-export/import-export.component';

import { WrdComponent } from './list-and-label/wrd/wrd.component';
import { WrvComponent } from './list-and-label/wrv/wrv.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent,canActivate: [AuthGuardGuard] },
  {
    path: 'globalconfig',
    component: GlobalConfigComponent,canActivate: [AuthGuardGuard],
    children: []
    
  },
  {
    path: 'globalconfig/home',
    component: GlobalDashboardComponent,
    canActivate:[AuthGuardGuard]
    
  },
  {
    path: 'globalconfig/printers',
    component: PrintersComponent,
    canActivate:[AuthGuardGuard]
    
  },
  {
    path: 'globalconfig/workstation',
    component: WorkstationComponent,
    canActivate:[AuthGuardGuard]
    
  },
  {
    path: 'globalconfig/database-connections',
    component: DatabaseConnectionsComponent,
    canActivate:[AuthGuardGuard]
  },
  {
    path: 'globalconfig/licensing',
    component: LicensingComponent,
    canActivate:[AuthGuardGuard]
  },
  {
    path: 'globalconfig/ccsif',
    component: CcsifComponent,
    canActivate:[AuthGuardGuard]
  },{
    path: 'globalconfig/ste',
    component: SteComponent,
    canActivate:[AuthGuardGuard]
  },
  {
    path: 'globalconfig/steServices',
    component: SteServicesComponent,
    canActivate:[AuthGuardGuard]
  },
  
  { path: 'report-view-iframe', component: WrvComponent },
  { path: 'report-iframe', component: WrdComponent },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'dashboard',
        component: MainComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'ImportExport',
        component: ImportExportComponent,
        canActivate: [AuthGuardGuard] 
      },
      // {
      //   path: 'FlowrackReplenishment',
      //   component: FlowrackReplenishmentComponent,
      //   canActivate: [AuthGuardGuard] 
      // },
      // {
      //   path: 'globalconfig/dashboard',
      //   component: MainComponent,
      //   // canActivate:[AuthGuardGuard]
      // },

      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
        canActivate: [AuthGuardGuard],
      },
      { 
        path: 'InductionManager', 
        loadChildren: () => import('./induction-manager/induction-manager.module').then(m => m.InductionManagerModule),
        canActivate:[AuthGuardGuard]
      },
      { 
        path: 'ConsolidationManager', 
        loadChildren: () => import('./consolidation-manager/consolidation-manager.module').then(m => m.ConsolidationManagerModule),
        canActivate:[AuthGuardGuard]
      },
      { 
        path: 'OrderManager', 
        loadChildren: () => import('./order-manager/order-manager.module').then(m => m.OrderManagerModule),
        canActivate:[AuthGuardGuard]
      },
      { 
        path: 'FlowrackReplenishment', 
        loadChildren: () => import('./flowrack-replenishment/flowrack-replenishment.module').then(m => m.FlowrackReplenishmentModule),
        canActivate:[AuthGuardGuard]
      },
      { 
        path: '', 
        loadChildren: () => import('./list-and-label/list-and-label.module').then(m => m.ListAndLabelModule),
        // canActivate:[AuthGuardGuard]
      },
    ]

  },  

  // {
  //   path:'dashboard',
  //   component:DashboardComponent,
  //   children: [
  //     // {
  //     //   path:''
  //     // },
  //     // {
  //     //   path:'all-employees',
  //     //   component:AllEmployeesComponentComponent
  //     // }

  //   ]
  // },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
