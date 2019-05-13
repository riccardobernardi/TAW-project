import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';
import * as io from 'socket.io-client';
import {SocketioService} from '../socketio.service';
import {Order} from '../Order';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.css']
})
export class CookComponent implements OnInit {
  private orders: Order[] = [];
  // private socket = io('http://localhost:4200');

  constructor(private sio: SocketioService, private us: UserService, private router: Router, private order: OrderService  ) { }

  ngOnInit() {
    if (this.us.get_token() === undefined || this.us.get_token() === '') {
      this.logout();
    }
    this.get_orders();

    /*this.sio.connect().subscribe( (m) => {
      this.get_orders();
    });*/
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

  get_orders() {
    console.log('received an emit');
    /*this.orders = this.order.get();*/
    /*console.log(this.orders)*/
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

  print() {
    console.log(this.orders);
  }

}
