import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserHttpService } from '../user-http.service';
import { WaiterDashboardComponent } from './waiterDashboard.component';
import { SocketioService } from '../socketio.service';
import { OrderHttpService } from '../order-http.service';
import { ItemHttpService } from '../item-http.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TablesViewComponent } from '../tables-view/tables-view.component';
// import { WaiterRoutingModule } from './waiter-routing.module';
import { OrdersServedComponent } from '../orders-served/orders-served.component';
import { InsertOrdersComponent} from '../insert-orders/insert-orders.component';
import { TableHttpService } from '../table-http.service';
import { TicketHttpService } from '../ticket-http.service';
import { LogoutComponent } from '../logout/logout.component';

@NgModule({
  declarations: [
    WaiterDashboardComponent,
    TablesViewComponent,
    OrdersServedComponent,
    InsertOrdersComponent,
    LogoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    // WaiterRoutingModule,
    NgbModule
  ],
  providers: [
    /*{provide: OrderHttpService, useClass: OrderHttpService},
    {provide: ItemHttpService, useClass: ItemHttpService},
    {provide: TableHttpService, useClass: TableHttpService},
    {provide: TicketHttpService, useClass: TicketHttpService}*/
  ]
})

export class WaiterDashboardModule { }
