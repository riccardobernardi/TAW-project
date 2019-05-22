import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';
import * as io from 'socket.io-client';
import {SocketioService} from '../socketio.service';
import {Order} from '../Order';
import {mockorders} from '../mock-orders';
import {UserHttpService} from '../user-http.service';
import { Ticket } from "../Ticket";
import {TicketOrder } from "../TicketOrder";
import { TicketHttpService } from "../ticket-http.service";

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.css']
})
export class CookComponent implements OnInit {
  //private orders: Order[] = mockorders.filter((data) => (data.type === 'food'));
  // private socket = io('http://localhost:4200');
  private tickets : Ticket[] = [];

  constructor(private sio: SocketioService, private us: UserHttpService, private router: Router, private ticket: TicketHttpService  ) { }

  ngOnInit() {
    if (this.us.get_token() === undefined || this.us.get_token() === '') {
      this.us.logout();
    } else {
      this.ticket.get_tickets({state: "open"}).toPromise().then((data : Ticket[]) => {
        console.log(data);
        this.tickets = data;
        this.tickets.forEach((ticket: Ticket) => {
          ticket.orders.sort((a : TicketOrder, b : TicketOrder) => {
            return a.price - b.price;
          })
        });
      }).catch((err) => console.log(err));
    }
    // this.get_orders();

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

    /*this.order.get().subscribe(
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
    );*/
  }

}
