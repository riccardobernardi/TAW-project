import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { AppComponent } from './app.component';
// import { MessageListComponent } from './message-list/message-list.component';
import {WaiterComponent} from './waiter/waiter.component';
import {CookComponent} from './cook/cook.component';
import {PaydeskComponent} from './paydesk/paydesk.component';
import {BarmanComponent} from './barman/barman.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  { path: 'waiter', component:  WaiterComponent},
  { path: 'cook', component:  CookComponent},
  { path: 'paydesk', component:  PaydeskComponent},
  { path: 'desk', component:  PaydeskComponent},
  { path: 'barman', component:  BarmanComponent},
  { path: 'bartender', component:  BarmanComponent},
  // { path: 'messages', component: MessageListComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

