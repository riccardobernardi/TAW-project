import { Component, OnInit } from '@angular/core';
import {Order} from '../Order';
import {mockorders} from '../mock-orders';
import {SocketioService} from '../socketio.service';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';
import {UserHttpService} from '../user-http.service';
import {HttpClient} from '@angular/common/http';
import { Ticket } from '../Ticket';
import {TicketOrder } from '../TicketOrder';
import { TicketHttpService } from '../ticket-http.service';


@Component({
  selector: 'app-barman',
  templateUrl: './barman.component.html',
  styleUrls: ['./barman.component.css']
})
export class BarmanComponent implements OnInit {

  private tickets: Ticket[] = [];
  private dd;

  constructor(private sio: SocketioService, private us: UserHttpService, private router: Router, private http: HttpClient, private socketio: SocketioService, private ticket: TicketHttpService  ) {}

  get_tickets() {
    this.ticket.get_tickets({state: 'open'}).subscribe( (dd) => {
      this.tickets.splice(0, this.tickets.length);
      console.log(dd);
      dd.forEach( (ss) => {
        console.log(ss.orders);
        let orders = ss.orders.filter((order: TicketOrder) => order.state != 'ready' && order.state != 'delivered' && (order.state == "preparation" && order.username_executer == this.us.get_nick()) && order.state != 'preparation' && order.type_item != 'dish');
        if (orders.length != 0) {
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
    this.socketio.get().on('bartenders', () => { this.get_tickets() });
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

  setOrderinProgress(ticketid: string, orderid: string) {
    console.log(ticketid, orderid);
    this.ticket.changeOrderState(ticketid, orderid, 'preparation', undefined).toPromise().then(() => {
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
