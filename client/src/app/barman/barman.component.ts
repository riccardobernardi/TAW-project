import { Component, OnInit } from '@angular/core';
import {SocketioService} from '../socketio.service';
import {Router} from '@angular/router';
import {UserHttpService} from '../user-http.service';
import {HttpClient} from '@angular/common/http';
import { Ticket } from '../Ticket';
import { types } from "../Item";
import { order_states } from "../TicketOrder"
import {TicketOrder } from '../TicketOrder';
import { TicketHttpService } from '../ticket-http.service';


@Component({
  selector: 'app-barman',
  templateUrl: './barman.component.html',
  styleUrls: ['./barman.component.css']
})
export class BarmanComponent implements OnInit {

  private tickets: Ticket[] = [];

  constructor(private sio: SocketioService, private us: UserHttpService, private router: Router, private http: HttpClient, private socketio: SocketioService, private ticket: TicketHttpService  ) {}

  get_tickets() {
    this.ticket.get_tickets({state: 'open'}).subscribe( (tickets: Ticket[]) => {
      this.tickets.splice(0, this.tickets.length);
      //console.log(tickets);
      tickets.forEach( (ticket) => {
        //console.log(ticket.orders);
        let orders = ticket.orders.filter((order: TicketOrder) => order.state != order_states[2] && order.state != order_states[3] && order.type_item != types[0]);
        if (orders.length != 0) {
          this.tickets.push(ticket);
          orders.sort((order1: TicketOrder, order2: TicketOrder) => {
            return order1.required_time - order2.required_time;
          });
          ticket.orders = orders;
        }
      });
      //console.log(this.tickets);
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
