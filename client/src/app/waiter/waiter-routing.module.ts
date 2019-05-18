import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WaiterDashboardComponent } from './waiterDashboard.component';
import { WaiterTablesComponent } from './waiter-tables/waiter-tables.component';


const routes: Routes = [
  { path: '', 
    component: WaiterDashboardComponent,
    children: [
      {
        path: 'tables',
        component:  WaiterTablesComponent
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WaiterRoutingModule {}
