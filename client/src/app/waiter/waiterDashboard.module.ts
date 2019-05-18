import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserHttpService } from '../user-http.service';
import { WaiterDashboardComponent } from './waiterDashboard.component';
import {SocketioService} from '../socketio.service';
import {OrderHttpService} from '../order-http.service';
import {ItemHttpService} from "../item-http.service"
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { WaiterTablesComponent } from './waiter-tables/waiter-tables.component'
import {WaiterRoutingModule} from "./waiter-routing.module";

@NgModule({
  declarations: [WaiterDashboardComponent, WaiterTablesComponent],
  imports: [
    WaiterRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    {provide: OrderHttpService, useClass: OrderHttpService},
    {provide: ItemHttpService, useClass: ItemHttpService}
  ]
})

export class WaiterDashboardModule { }
