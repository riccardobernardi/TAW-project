import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';
import * as io from 'socket.io-client';
import {Order} from '../Order';
import {SocketioService} from '../socketio.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {mockorders} from '../mock-orders';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.css']
})
export class WaiterComponent implements OnInit {
  constructor( private sio: SocketioService, private us: UserService, private router: Router) { }
  private tables = [1, 2];
  private menu = ['pasta', 'riso'];
  private selTable = undefined;
  private selMenuEntry = undefined;
  private deleteOrder = undefined;
  private id = 1;
  private orders: Order[] = [];

  ngOnInit() {
    const o = {nick: '--', selTable: -1, selMenuEntry: '--',
      ready: false, id: this.get_id(), in_progress: false, timestamp: Date.now()};
    this.orders.unshift(o);
    if (this.us.get_token() === undefined || this.us.get_token() === '') {
      this.logout();
    }
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

  orders_size() {
    return this.orders.length;
  }

  get_id() {
    this.id += 1;
    return (this.id - 1);
  }

  send() {
    const o = {nick: this.us.get_nick(), selTable: this.selTable, selMenuEntry: this.selMenuEntry,
      ready: false, id: this.get_id(), in_progress: false, timestamp: Date.now()};
    this.orders.unshift(o);
  }

  arrayRemove(arr, value) {
    return arr.filter((ele) => {
      if (ele.id == 1) {
        return true;
      }
      return ele.id != value;
    });
  }

  delete() {
    this.orders = this.arrayRemove(this.orders, this.deleteOrder );
    console.log(this.orders);
  }

}
