import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { AppRoutingModule } from './app-routing.module';
import { CookComponent } from './cook/cook.component';
import { BarmanComponent } from './barman/barman.component';
import { SocketioService } from './services/socketio.service';
import { ItemHttpService } from './services/item-http.service';
import { TableHttpService } from './services/table-http.service';
import { TicketHttpService } from './services/ticket-http.service';
import { UserHttpService } from './services/user-http.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from './logout/logout.component';
import { OrdersServedComponent } from "./orders-served/orders-served.component";
import { InsertOrdersComponent } from "./insert-orders/insert-orders.component";
import { TablesViewComponent } from "./tables-view/tables-view.component";
import { WaiterDashboardComponent } from './waiter/waiterDashboard.component';
import { PaydeskDashboardComponent } from "./paydesk/paydeskDashboard.component";
import { PaydeskOptionsComponent } from './paydesk/paydeskOptions/paydeskOptions.component';
import { ChartsModule } from "ng2-charts";
import { StatisticsDashboardComponent } from './paydesk/statistics-dashboard/statistics-dashboard.component';
import { WaiterStatisticsComponent } from './paydesk/statistics-dashboard/waiter-statistics/waiter-statistics.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HistogramWithDatesComponent } from './paydesk/statistics-dashboard/histogram-with-dates/histogram-with-dates.component';
import { StatsChartsComponent } from './paydesk/statistics-dashboard/stats-charts/stats-charts.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    CookComponent,
    BarmanComponent,
    WaiterDashboardComponent,
    PaydeskDashboardComponent,
    PaydeskOptionsComponent,
    OrdersServedComponent,
    InsertOrdersComponent,
    TablesViewComponent,
    LogoutComponent,
    StatisticsDashboardComponent,
    WaiterStatisticsComponent,
    HistogramWithDatesComponent,
    StatsChartsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ChartsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    {provide: SocketioService, useClass: SocketioService },
    {provide: ItemHttpService, useClass: ItemHttpService},
    {provide: TableHttpService, useClass: TableHttpService},
    {provide: TicketHttpService, useClass: TicketHttpService},
    {provide: UserHttpService, useClass: UserHttpService},
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
