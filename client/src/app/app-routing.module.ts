import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { AppComponent } from './app.component';
import {TablesViewComponent} from './tables-view/tables-view.component';
import {CookComponent} from './cook/cook.component';
import {PaydeskComponent} from './paydesk/paydesk.component';
import {BarmanComponent} from './barman/barman.component';
import {WaiterDashboardComponent} from './waiter/waiterDashboard.component';
import {Paydesk2DashboardComponent} from './paydesk2/paydesk2Dashboard.component';
import {InsertOrdersComponent} from './insert-orders/insert-orders.component';
import {LogoutComponent} from './logout/logout.component';
import {OrdersServedComponent} from './orders-served/orders-served.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  { path: 'waiter', component: WaiterDashboardComponent},
  { path: 'cook', component:  CookComponent},
  { path: 'paydesk2', component: Paydesk2DashboardComponent},
  { path: 'desk', component: Paydesk2DashboardComponent},
  { path: 'barman', component:  BarmanComponent},
  { path: 'bartender', component:  BarmanComponent},
  { path: 'desk/insertOrders', component:  InsertOrdersComponent},
  { path: 'desk/logout', component:  LogoutComponent},
  { path: 'desk/viewOrders', component:  TablesViewComponent},
  { path: 'desk/servedOrders', component:  OrdersServedComponent},
  { path: 'desk/paydesk', component:  PaydeskComponent},
  { path: 'waiter/insertOrders', component:  InsertOrdersComponent},
  { path: 'waiter/logout', component:  LogoutComponent},
  { path: 'waiter/viewOrders', component:  TablesViewComponent},
  { path: 'waiter/servedOrders', component:  OrdersServedComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

