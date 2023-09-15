import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ToastrModule } from 'ngx-toastr'; 
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
// import { EmployeesComponent } from './employees/employees.component';
import { HeaderComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MainComponent } from './main/main.component';
// import { EmployeesLookupComponent } from './employees/employees-lookup/employees-lookup.component';
// import { EmployeePickupLevelComponent } from './employees/employee-pickup-level/employee-pickup-level.component';
// import { GroupsAllowedComponent } from './employees/groups-allowed/groups-allowed.component';
// import { GroupsLookupComponent } from './employees/groups-lookup/groups-lookup.component';
// import { AssignedFunctionsComponent } from './employees/assigned-functions/assigned-functions.component';
// import { UnassignedFunctionsComponent } from './employees/unassigned-functions/unassigned-functions.component';
// import { StatisticsLookupComponent } from './employees/statistics-lookup/statistics-lookup.component';
// import { AddNewEmployeeComponent } from './dialogs/add-new-employee/add-new-employee.component';
// import { AddZoneComponent } from './dialogs/add-zone/add-zone.component';
// import { DeleteConfirmationComponent } from './dialogs/delete-confirmation/delete-confirmation.component';
// import { AddLocationComponent } from './dialogs/add-location/add-location.component';
// import { AddPickuplevelsComponent } from './dialogs/add-pickuplevels/add-pickuplevels.component';
// import { AddGroupAllowedComponent } from './dialogs/add-group-allowed/add-group-allowed.component';
// import { AddNewGroupComponent } from './dialogs/add-new-group/add-new-group.component';
// import { FunctionAllocationComponent } from './dialogs/function-allocation/function-allocation.component';
import { MaterialModule } from '../material-module';
import { GeneralModule } from '../gen-module';



@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    SideNavComponent,
    // EmployeesComponent,
    MainComponent,
    // EmployeesLookupComponent,
    // EmployeePickupLevelComponent,
    // GroupsAllowedComponent,
    // GroupsLookupComponent,
    // AssignedFunctionsComponent,
    // UnassignedFunctionsComponent,
    // StatisticsLookupComponent,
    // AddNewEmployeeComponent,
    // AddZoneComponent,
    // DeleteConfirmationComponent,
    // AddLocationComponent,
    // AddPickuplevelsComponent,
    // AddGroupAllowedComponent,
    // AddNewGroupComponent,
    // FunctionAllocationComponent,
    

  ],
  imports: [
    CommonModule,
    //  RouterModule,
    // FormsModule,
    BrowserModule, 
    HttpClientModule,
    // ReactiveFormsModule,
    MaterialModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      extendedTimeOut: 0,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning',
      }
    }),
    GeneralModule


  ],
  exports:[
    // RouterModule
    HeaderComponent,
    SideNavComponent,
  ]
})
export class DashboardModule { }
