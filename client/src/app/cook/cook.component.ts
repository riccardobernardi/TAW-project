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

  constructor(private sio: SocketioService, private us: UserHttpService, private router: Router,
              private http: HttpClient, private socketio: SocketioService, private ticket: TicketHttpService  ) {}

  get_tickets() {
    this.ticket.get_tickets({state: 'open'}).subscribe( (dd) => {
      this.tickets.splice(0, this.tickets.length);
      dd.forEach( (ss) => {
        console.log(ss.orders);
        const orders = ss.orders.filter((order: TicketOrder) =>
          order.state !== 'ready' && order.state !== 'delivered' && ((order.state == "preparation") ? order.username_executer === this.us.get_nick() : true ) && order.type_item !== 'beverage');
        console.log(orders);
        if (orders.length !== 0) {
          this.tickets.push(ss);
          orders.sort((a: TicketOrder, b: TicketOrder) => {
            return a.price - b.price;
          });
          ss.orders = orders;
        }
      });
      console.log(this.tickets);
    });
  }

  ngOnInit() {
    if (this.us.get_token() === undefined || this.us.get_token() === '') {
      this.us.logout();
    }

    this.get_tickets();
    this.socketio.get().on('cooks', () => {this.get_tickets();});
  }


  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

  setOrderinProgress(ticketid: string, orderid: string) {
    console.log(ticketid, orderid);
    this.ticket.changeOrderState(ticketid, orderid, 'preparation', this.us.get_nick()).toPromise().then(() => {
      console.log('Changing state to preparation OK');
    }).catch((err) => {
      console.log('Changing state to prepation failed: ' + err);
    });
  }

  setOrderCompleted(ticketid: string, orderid: string) {
    this.ticket.changeOrderState(ticketid, orderid, 'ready', undefined).toPromise().then(() => {
      console.log('Changing state to ready OK');
    }).catch((err) => {
      console.log('Changing state to ready failed: ' + err);
    });
  }
}
