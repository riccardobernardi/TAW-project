import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';
import * as io from 'socket.io-client';
import {Order} from '../Order';
import {SocketioService} from '../socketio.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {mockorders} from '../mock-orders';
import {UserHttpService} from '../user-http.service';
import { WaiterSocketioService } from '../waiter-socketio.service';
import { SinglePropOffsetValuesIndex } from '@angular/core/src/render3/interfaces/styling';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiterDashboard.component.html',
  styleUrls: ['./waiterDashboard.component.css']
})
export class WaiterDashboardComponent implements OnInit {

  private waiterObserver : Observable<any>

  constructor(private sio: WaiterSocketioService, private us: UserHttpService, private router: Router) {
    this.sio.connect();
  }

  ngOnInit() {
    if (this.us.get_token() == undefined || this.us.get_token() == '') {
      this.us.logout();
    }
  }

}
