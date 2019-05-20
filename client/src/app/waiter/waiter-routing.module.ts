import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WaiterDashboardComponent } from './waiterDashboard.component';
import { TablesViewComponent } from '../tables-view/tables-view.component';
import { OrdersServedComponent } from '../orders-served/orders-served.component';
import { InsertOrdersComponent } from '../insert-orders/insert-orders.component'
import {LogoutComponent} from '../logout/logout.component';


const routes: Routes = [
  { path: '',
    component: WaiterDashboardComponent,
    children: [
      {
        path: 'tables',
        component:  TablesViewComponent
      },
      {
        path: 'served',
        component: OrdersServedComponent
      },
      {
        path: 'insertOrders',
        component: InsertOrdersComponent
      },
      {
        path: 'logout',
        component: LogoutComponent
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WaiterRoutingModule {}
