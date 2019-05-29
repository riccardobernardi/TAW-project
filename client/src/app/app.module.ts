import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { AppRoutingModule } from './app-routing.module';
import { UserHttpService } from './user-http.service';
import { CookComponent } from './cook/cook.component';
import { BarmanComponent } from './barman/barman.component';
import { SocketioService } from './socketio.service';
import { OrderHttpService } from './order-http.service';
import { ItemHttpService } from './item-http.service';
import { TableHttpService } from './table-http.service';
import { TicketHttpService } from './ticket-http.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from './logout/logout.component';
import { OrdersServedComponent } from "./orders-served/orders-served.component";
import { InsertOrdersComponent } from "./insert-orders/insert-orders.component";
import { TablesViewComponent } from "./tables-view/tables-view.component";
import { WaiterDashboardComponent } from './waiter/waiterDashboard.component';
import { Paydesk2DashboardComponent } from "./paydesk2/paydesk2Dashboard.component";
import { PaydeskComponent } from './paydesk/paydesk.component';
import { HistTotalComponent } from './statistics-dashboard/HistTotalComponent/histtotal.component';
import { ChartsModule } from "ng2-charts";
import { StatisticsDashboardComponent } from './statistics-dashboard/statistics-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    CookComponent,
    BarmanComponent,
    WaiterDashboardComponent,
    Paydesk2DashboardComponent,
    PaydeskComponent,
    OrdersServedComponent,
    InsertOrdersComponent,
    TablesViewComponent,
    LogoutComponent,
    HistTotalComponent,
    StatisticsDashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ChartsModule
  ],
  providers: [
    {provide: UserHttpService, useClass: UserHttpService },
    {provide: SocketioService, useClass: SocketioService },
    {provide: OrderHttpService, useClass: OrderHttpService},
    {provide: ItemHttpService, useClass: ItemHttpService},
    {provide: TableHttpService, useClass: TableHttpService},
    {provide: TicketHttpService, useClass: TicketHttpService}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
