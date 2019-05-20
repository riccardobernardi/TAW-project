import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Paydesk2DashboardComponent } from './paydesk2Dashboard.component';
import { WaiterTablesComponent } from '../waiter-tables/waiter-tables.component';
import { WaiterInsertOrdersComponent } from '../waiter-insert-orders/waiter-insert-orders.component';
import {WaiterServedComponent} from '../waiter-served/waiter-served.component';
import {PaydeskComponent} from '../paydesk/paydesk.component';
import {UserHttpService} from '../user-http.service';
import {LogoutComponent} from '../logout/logout.component';


const routes: Routes = [
  { path: '',
    component: Paydesk2DashboardComponent,
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
      {
        path: 'paydesk',
        component: PaydeskComponent
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class Paydesk2RoutingModule {}
