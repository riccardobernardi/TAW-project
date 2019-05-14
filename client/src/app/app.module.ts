import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
// import { MessageEditorComponent } from './message-editor/message-editor.component';
// import { MessageListComponent } from './message-list/message-list.component';

// Services
// import { MessageService } from './message.service';
// import { MessageHttpService } from './message-http.service';
import { UserService } from './user.service';
// import { UserHttpService } from './user-http.service';
import { UserLoginComponent } from './user-login/user-login.component';
import { AppRoutingModule } from './app-routing.module';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { UserHttpService } from './user-http.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WaiterComponent } from './waiter/waiter.component';
import { PaydeskComponent } from './paydesk/paydesk.component';
import { CookComponent } from './cook/cook.component';
import { BarmanComponent } from './barman/barman.component';
import {SocketioService} from './socketio.service';
import {OrderService} from './order.service';
// import { SocketioService } from './socketio.service';
import {MatButtonToggleModule, MatIconModule} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    // MessageEditorComponent,
    // MessageListComponent,
    UserLoginComponent,
    UserSignupComponent,
    DashboardComponent,
    WaiterComponent,
    PaydeskComponent,
    CookComponent,
    BarmanComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatButtonToggleModule, MatIconModule,
  ],
  providers: [
    {provide: UserService, useClass: UserHttpService },
    {provide: SocketioService, useClass: SocketioService },
    {provide: OrderService, useClass: OrderService },
    // {provide: MessageService, useClass: MessageHttpService /* Here we can select the specifc service instance */}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
