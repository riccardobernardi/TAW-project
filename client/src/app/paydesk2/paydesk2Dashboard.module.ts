import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserHttpService } from '../user-http.service';
import { Paydesk2DashboardComponent } from './paydesk2Dashboard.component';
import { SocketioService } from '../socketio.service';
import { OrderHttpService } from '../order-http.service';
import { ItemHttpService } from '../item-http.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WaiterTablesComponent } from '../waiter-tables/waiter-tables.component';
import { WaiterRoutingModule } from '../waiter/waiter-routing.module';
import { WaiterServedComponent } from '../waiter-served/waiter-served.component';
import { WaiterInsertOrdersComponent} from '../waiter-insert-orders/waiter-insert-orders.component';
import { TableHttpService } from '../table-http.service';
import { TicketHttpService } from '../ticket-http.service';
import {Paydesk2RoutingModule} from './paydesk2-routing.module';
import {PaydeskComponent} from '../paydesk/paydesk.component';
import {LogoutComponent} from '../logout/logout.component';

@NgModule({
  declarations: [
    Paydesk2DashboardComponent,
    WaiterTablesComponent,
    WaiterServedComponent,
    WaiterInsertOrdersComponent,
    PaydeskComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    Paydesk2RoutingModule,
    NgbModule
  ],
  providers: [
    {provide: OrderHttpService, useClass: OrderHttpService},
    {provide: ItemHttpService, useClass: ItemHttpService},
    {provide: TableHttpService, useClass: TableHttpService},
    {provide: TicketHttpService, useClass: TicketHttpService}
  ]
})

export class Paydesk2DashboardModule { }
