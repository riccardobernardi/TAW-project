import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { AppComponent } from './app.component';
import { CookComponent} from './cook/cook.component';
import { PaydeskComponent } from './paydesk/paydesk.component';
import { BarmanComponent } from './barman/barman.component';
import { WaiterDashboardComponent } from './waiter/waiterDashboard.component';
import { OrdersServedComponent } from "./orders-served/orders-served.component";
import { InsertOrdersComponent } from "./insert-orders/insert-orders.component";
import { TablesViewComponent } from "./tables-view/tables-view.component";
import { LogoutComponent } from "./logout/logout.component";
import { Paydesk2DashboardComponent } from "./paydesk2/paydesk2Dashboard.component";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  { path: 'waiter', 
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
  },
  { path: 'cook', component:  CookComponent},
  { path: 'paydesk2', 
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
  },
  { path: 'desk',
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
  },
  { path: 'barman', component:  BarmanComponent},
  { path: 'bartender', component:  BarmanComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

