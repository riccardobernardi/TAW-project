import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.css']
})
export class WaiterComponent implements OnInit {
  constructor( private us: UserService, private router: Router, private order: OrderService  ) { }
  private tables = [1, 2];
  private menu = ['pasta', 'riso'];
  private selTable = undefined;
  private selMenuEntry = undefined;
  private deleteOrder = undefined;
  // private socket = io('http://localhost:4200');

  // @Output() posted = new EventEmitter<string>();

  ngOnInit() {
    if (this.us.get_token() === undefined || this.us.get_token() === '') {
      this.logout();
    }
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

  send() {
    const o = {nick: this.us.get_nick(), selTable: this.selTable, selMenuEntry: this.selMenuEntry,
      ready: false, id: this.order.get_id(), in_progress: false, timestamp: Date.now()};
    this.order.send(o);
    // this.posted.emit('broadcast');
    console.log('event emitted');
    /*const socket = io('http://localhost:4200');
    socket.emit('broadcast');*/
    // this.socket.emit('broadcast');
  }

  delete() {
    this.order.delete(this.deleteOrder);
  }

}
