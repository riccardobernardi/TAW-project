import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';
import * as io from 'socket.io-client';
import {Order} from '../Order';
import {SocketioService} from '../socketio.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {mockorders} from '../mock-orders';
import {UserHttpService} from '../user-http.service';

@Component({
  selector: 'app-waiter',
  templateUrl: './paydesk2Dashboard.component.html',
  styleUrls: ['./paydesk2Dashboard.component.css']
})
export class Paydesk2DashboardComponent implements OnInit {
  constructor(private sio: SocketioService, private us: UserHttpService, private router: Router) { }

  private socket;
  private users = [];

  ngOnInit() {
    if (this.us.get_token() == undefined || this.us.get_token() == '') {
      this.us.logout();
    }
    this.socket = io('http://localhost:8080');
    // this.socket.connect()
    this.socket.on('paydesks', this.dd );
  }

  dd() {
    /*this.us.get_users().subscribe((data) => {
      const a: any = data;
      a.forEach( (d) => this.users.push(d) );
    });*/
    console.log('ricarica');
  }

}
