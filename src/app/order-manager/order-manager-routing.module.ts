import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderManagerComponent } from './order-manager.component';
import { EventLogComponent } from './event-log/event-log.component';
import { AuthGuardGuard } from '../guard/auth-guard.guard';
import { OmOrderManagerComponent } from './om-order-manager/om-order-manager.component';
import { OmPreferencesComponent } from './om-preferences/om-preferences.component';
import { OmCreateOrdersComponent } from '../dialogs/om-create-orders/om-create-orders.component';
import { TransactionComponent } from '../admin/transaction/transaction.component';
import { InventoryMasterComponent } from '../admin/inventory-master/inventory-master.component';
import { InventoryMapComponent } from '../admin/inventory-map/inventory-map.component';
import { ReportsComponent } from '../admin/reports/reports.component';

const routes: Routes = [{ path: '', component: OrderManagerComponent, 
canActivate: [AuthGuardGuard],  },
{ path: 'EventLog', 
component: EventLogComponent, 
canActivate: [AuthGuardGuard],
},

{ path: 'Preferences', 
component: OmPreferencesComponent, 
canActivate: [AuthGuardGuard], 
},

{ path: 'OmCreateOrders', 
component: OmCreateOrdersComponent,
canActivate: [AuthGuardGuard],  },

{ path: 'OrderManager', 
component: OmOrderManagerComponent, 
canActivate: [AuthGuardGuard], 
},
 
{ path: 'OrderStatus', 
component: TransactionComponent  ,
canActivate: [AuthGuardGuard], 
 },

{ path: 'InventoryMaster', 
component: InventoryMasterComponent,
canActivate: [AuthGuardGuard],  },

{ path: 'InventoryMap', 
component: InventoryMapComponent,
canActivate: [AuthGuardGuard],  },

{ path: 'Reports', 
component: ReportsComponent,
canActivate: [AuthGuardGuard],  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderManagerRoutingModule { }
