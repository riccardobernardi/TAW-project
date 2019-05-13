import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';
import * as io from 'socket.io-client';
import {Order} from '../Order';
import {SocketioService} from '../socketio.service';
import { BehaviorSubject } from 'rxjs';
import {mockorders} from '../mock-orders';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.css']
})
export class WaiterComponent implements OnInit {
  constructor( private sio: SocketioService, private us: UserService, private router: Router, private order: OrderService  ) { }
  private tables = [1, 2];
  private menu = ['pasta', 'riso'];
  private selTable = undefined;
  private selMenuEntry = undefined;
  private deleteOrder = undefined;
  private orders: Order[] = [];

  @Output() posted = new EventEmitter<Order>();

  ngOnInit() {
    if (this.us.get_token() === undefined || this.us.get_token() === '') {
      this.logout();
    }
    this.get_orders();

    this.sio.connect().subscribe( (m) => {
      this.get_orders();
    });
    // tslint:disable-next-line:forin
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

  send() {
    const o = {nick: this.us.get_nick(), selTable: this.selTable, selMenuEntry: this.selMenuEntry,
      ready: false, id: this.order.get_id(), in_progress: false, timestamp: Date.now()};

    this.order.post_order(o).subscribe( (m) => {
      console.log('Message posted');
      this.posted.emit( m );
    }, (error) => {
      console.log('Error occurred while posting: ' + error);
    });
  }

  public get_orders() {
    console.log('received an emit');
    /*this.orders = this.order.get();*/
    console.log(this.orders);
    console.log('event received');

    this.order.get().subscribe(
      ( messages ) => {
        this.orders = messages;

      } , (err) => {

        // Try to renew the token
        this.us.renew().subscribe( () => {
          // Succeeded
          this.get_orders();
        }, (err2) => {
          // Error again, we really need to logout
          this.logout();
        } );
      }
    );
  }

  delete() {
    this.order.delete(this.deleteOrder);
  }

}
