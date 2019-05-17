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
// import { UserHttpService } from './user-http.service';
import { UserLoginComponent } from './user-login/user-login.component';
import { AppRoutingModule } from './app-routing.module';
import { UserHttpService } from './user-http.service';
import { WaiterComponent } from './waiter/waiter.component';
import { PaydeskComponent } from './paydesk/paydesk.component';
import { CookComponent } from './cook/cook.component';
import { BarmanComponent } from './barman/barman.component';
import {SocketioService} from './socketio.service';
import {OrderService} from './order.service';
import {OrderHttpService} from './order-http.service';
import {ItemService} from "./item-http.service"
// import { SocketioService } from './socketio.service';


@NgModule({
  declarations: [
    AppComponent,
    // MessageEditorComponent,
    // MessageListComponent,
    UserLoginComponent,
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
  ],
  providers: [
    {provide: UserHttpService, useClass: UserHttpService },
    {provide: SocketioService, useClass: SocketioService },
    {provide: OrderService, useClass: OrderHttpService },
    // {provide: MessageService, useClass: MessageHttpService /* Here we can select the specifc service instance */}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
