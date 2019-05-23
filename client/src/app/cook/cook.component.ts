import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';
import * as io from 'socket.io-client';
import {SocketioService} from '../socketio.service';
import {Order} from '../Order';
import {mockorders} from '../mock-orders';
import {UserHttpService} from '../user-http.service';
import { Ticket } from '../Ticket';
import {TicketOrder } from '../TicketOrder';
import { TicketHttpService } from '../ticket-http.service';
import { Item } from '../Item';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.css']
})
export class CookComponent implements OnInit {
  private tickets: Ticket[] = [];
  private url = 'http://localhost:8080';

  constructor(private sio: SocketioService, private us: UserHttpService, private router: Router, private ticket: TicketHttpService, private http: HttpClient, private socketio: SocketioService  ) { }

  ngOnInit() {
    if (this.us.get_token() === undefined || this.us.get_token() === '') {
      this.us.logout();
    }

    this.dd();
    this.socketio.get().on('cooks', this.dd);
  }

  dd() {
    console.log('received an emit');
    this.ticket.get_tickets({state: 'open'}).toPromise().then((data: Ticket[]) => {
      console.log(data);
      this.tickets = data;
      this.tickets.forEach((ticket: Ticket) => {
        ticket.orders.sort((a : TicketOrder, b : TicketOrder) => {
          return a.price - b.price;
        });
      });
    }).catch((err) => console.log(err));
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

  private create_options( params = {} ) {
    return  {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
      params : new HttpParams( {fromObject: params} )
    };
  }

  open_ticket(waiter: string, table: number) {
    return this.http.post<Ticket>(this.url, {waiter, table, start: Date()}, this.create_options());
  }

  inProgress(ticket: Ticket, orderid: string) {
    console.log(this.url + '/tickets/' + ticket._id + '/orders/' + orderid);
    this.http.patch(this.url + '/tickets/' + ticket._id + '/orders/' + orderid, {state: 'in_progress'}, this.create_options()).subscribe( (dd) => {
      console.log(dd);
    });
  }
}
