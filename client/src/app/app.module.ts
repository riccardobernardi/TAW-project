import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { AppRoutingModule } from './app-routing.module';
import { UserHttpService } from './user-http.service';
import { WaiterDashboardModule } from './waiter/waiterDashboard.module';
import { CookComponent } from './cook/cook.component';
import { BarmanComponent } from './barman/barman.component';
import {SocketioService} from './socketio.service';
import {OrderService} from './order.service';
import {OrderHttpService} from './order-http.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    CookComponent,
    BarmanComponent,
    LogoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
  ],
  providers: [
    {provide: UserHttpService, useClass: UserHttpService },
    {provide: SocketioService, useClass: SocketioService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
