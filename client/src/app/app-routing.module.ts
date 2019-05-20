import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { AppComponent } from './app.component';
import {TablesViewComponent} from './tables-view/tables-view.component';
import {CookComponent} from './cook/cook.component';
import {PaydeskComponent} from './paydesk/paydesk.component';
import {BarmanComponent} from './barman/barman.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  { path: 'waiter', loadChildren: './waiter/waiterDashboard.module#WaiterDashboardModule'},
  { path: 'cook', component:  CookComponent},
  { path: 'paydesk2', loadChildren: './paydesk2/paydesk2Dashboard.module#Paydesk2DashboardModule' },
  { path: 'desk', loadChildren: './paydesk2/paydesk2Dashboard.module#Paydesk2DashboardModule'},
  { path: 'barman', component:  BarmanComponent},
  { path: 'bartender', component:  BarmanComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

