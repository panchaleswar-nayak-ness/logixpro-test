import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkoutMainProcessComponent } from './markout-main-process.component';
import { MarkoutMainModuleComponent } from './markout-main-module/markout-main-module.component';
import { AuthGuardGuard } from '../common/guard/auth-guard.guard';
import { MarkoutMainPreferencesComponent } from './markout-main-preferences/markout-main-preferences.component';

const routes: Routes = [
  { 
    path: '', 
    component: MarkoutMainProcessComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'Preferences',
    component: MarkoutMainPreferencesComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'Markout',
    component: MarkoutMainModuleComponent,
    canActivate: [AuthGuardGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkoutMainProcessRoutingModule { }
