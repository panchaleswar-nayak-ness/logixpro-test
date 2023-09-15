import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule} from '@angular/cdk/table';
import { GlobalConfigComponent } from './global-config.component';
import { MaterialModule } from '../material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalConfigRoutingModule } from './global-config-routing.module';
import { GlobalDashboardComponent } from './dashboard/dashboard.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { DatabaseConnectionsComponent } from './database-connections/database-connections.component';
import { PrintersComponent } from './printers/printers.component';
import { WorkstationComponent } from './workstation/workstation.component';
import { UserAccountComponent } from './dashboard/user-account/user-account.component';
import { ConnectedUsersComponent } from './dashboard/connected-users/connected-users.component';
import { ConfigDatabaseComponent } from './database-connections/config-database/config-database.component';
import { ConnectionStringsComponent } from './database-connections/connection-strings/connection-strings.component';
import { LicensingComponent } from './licensing/licensing.component';
import { GeneralModule } from '../gen-module';
import { CcsifComponent } from './ccsif/ccsif.component';
import { SteComponent } from './ste/ste.component';
import { SteServicesComponent } from './ste-services/ste-services.component';

@NgModule({
  declarations: [
    GlobalConfigComponent,
    GlobalDashboardComponent,
    DatabaseConnectionsComponent,
    PrintersComponent,
    WorkstationComponent,
    UserAccountComponent,
    ConnectedUsersComponent,
    ConfigDatabaseComponent,
    ConnectionStringsComponent,
    LicensingComponent,
    CcsifComponent,
    SteComponent,
    SteServicesComponent,
    
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    GlobalConfigRoutingModule,
    DashboardModule,
    FormsModule,
    CdkTableModule,
    GeneralModule
  ],
})
export class GlobalConfigModule {}
