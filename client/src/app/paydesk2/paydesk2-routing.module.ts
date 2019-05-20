import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Paydesk2DashboardComponent } from './paydesk2Dashboard.component';
import { TablesViewComponent } from '../tables-view/tables-view.component';
import { InsertOrdersComponent } from '../insert-orders/insert-orders.component';
import {OrdersServedComponent} from '../orders-served/orders-served.component';
import {PaydeskComponent} from '../paydesk/paydesk.component';
import {UserHttpService} from '../user-http.service';
import {LogoutComponent} from '../logout/logout.component';


const routes: Routes = [
  { path: '',
    component: Paydesk2DashboardComponent,
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
