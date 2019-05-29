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
  private dd;

  constructor(private sio: SocketioService, private us: UserHttpService, private router: Router,
              private http: HttpClient, private socketio: SocketioService, private ticket: TicketHttpService  ) {
    // tslint:disable-next-line:variable-name
    const ticket_sup = this.tickets;
    this.dd = () => {
      ticket.get_tickets({state: 'open'}).subscribe( (dd) => {
        ticket_sup.splice(0, ticket_sup.length);
        dd.forEach( (ss) => {
          console.log(ss.orders);
          const orders = ss.orders.filter((order: TicketOrder) =>
            order.state !== 'ready' && order.state !== 'delivered' && order.type_item !== 'beverage');
          console.log(orders);
          if (orders.length !== 0) {
            ticket_sup.push(ss);
            orders.sort((a: TicketOrder, b: TicketOrder) => {
              return a.price - b.price;
            });
            ss.orders = orders;
          }
        });
        console.log(ticket_sup);
      });
    };
  }

  ngOnInit() {
    if (this.us.get_token() === undefined || this.us.get_token() === '') {
      this.us.logout();
    }

    this.dd();
    this.socketio.get().on('cooks', this.dd);
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

  /*open_ticket(waiter: string, table: number) {
    return this.http.post<Ticket>(this.url, {waiter, table, start: Date()}, this.create_options());
  }*/

  setOrderinProgress(ticketid: string, orderid: string) {
    /*console.log(this.url + '/tickets/' + ticketid + '/orders/' + orderid);
    this.http.patch(this.url + '/tickets/' + ticketid + '/orders/' + orderid, {state: 'in_progress'},
     this.create_options()).subscribe( (dd) => {
      console.log(dd);
    });*/
    console.log(ticketid, orderid);
    this.ticket.changeOrderState(ticketid, orderid, 'preparation', this.us.get_nick()).toPromise().then(() => {
      console.log('Changing state to preparation OK');
    }).catch((err) => {
      console.log('Changing state to prepation failed: ' + err);
    });
  }

  setOrderCompleted(ticketid: string, orderid: string) {
    this.ticket.changeOrderState(ticketid, orderid, 'ready', this.us.get_nick()).toPromise().then(() => {
      console.log('Changing state to ready OK');
    }).catch((err) => {
      console.log('Changing state to ready failed: ' + err);
    });
  }
}
