import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { CookComponent} from './cook/cook.component';
import { PaydeskOptionsComponent } from './paydesk/paydeskOptions/paydeskOptions.component';
import { BarmanComponent } from './barman/barman.component';
import { WaiterDashboardComponent } from './waiter/waiterDashboard.component';
import { OrdersServedComponent } from './orders-served/orders-served.component';
import { InsertOrdersComponent } from './insert-orders/insert-orders.component';
import { TablesViewComponent } from './tables-view/tables-view.component';
import { LogoutComponent } from './logout/logout.component';
import { PaydeskDashboardComponent } from './paydesk/paydeskDashboard.component';
import { StatisticsDashboardComponent } from './paydesk/statistics-dashboard/statistics-dashboard.component';
import {EmployeesStatisticsComponent} from './paydesk/statistics-dashboard/employees-statistics/employees-statistics.component';
import { StatsChartsComponent } from "./paydesk/statistics-dashboard/stats-charts/stats-charts.component"

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  { path: 'waiter',
    component: WaiterDashboardComponent,
    children: [
      {
        path:'',
        redirectTo: 'tables',
        pathMatch: 'full' 
      },
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
  { path: 'bartender', component:  BarmanComponent},
  { path: 'desk',
    component: PaydeskDashboardComponent,
    children: [
      {
        path:'',
        redirectTo: 'tables',
        pathMatch: 'full' 
      },
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
        component: PaydeskOptionsComponent
      },
      {
        path: 'statistics',
        component: StatisticsDashboardComponent,
        children: [
          {
            path:'',
            redirectTo: 'total charts',
            pathMatch: 'full' 
          },
          {
            path: 'total charts',
            component: StatsChartsComponent
          },
          {
            path: 'employees-statistics',
            component: EmployeesStatisticsComponent
          }
        ]
      },
      {
        path: 'logout',
        component: LogoutComponent
      }
    ],
  }
];

@NgModule({
  imports: [ 
    RouterModule.forRoot(routes),
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

