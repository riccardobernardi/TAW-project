import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WaiterDashboardComponent } from './waiterDashboard.component';
import { WaiterTablesComponent } from '../waiter-tables/waiter-tables.component';
import { WaiterServedComponent } from '../waiter-served/waiter-served.component';
import { WaiterInsertOrdersComponent } from '../waiter-insert-orders/waiter-insert-orders.component'
import {LogoutComponent} from '../logout/logout.component';


const routes: Routes = [
  { path: '',
    component: WaiterDashboardComponent,
    children: [
      {
        path: 'tables',
        component:  WaiterTablesComponent
      },
      {
        path: 'served',
        component: WaiterServedComponent
      },
      {
        path: 'insertOrders',
        component: WaiterInsertOrdersComponent
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WaiterRoutingModule {}
