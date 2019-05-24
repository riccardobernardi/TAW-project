import { Component, OnInit, Input } from '@angular/core';
import { Ticket } from '../Ticket';
import { Item } from '../Item';
import {ItemHttpService} from '../item-http.service';
import {UserHttpService} from '../user-http.service';
import { TicketHttpService } from 'src/app/ticket-http.service';
import { Observable } from 'rxjs/Observable';
import {SocketioService} from '../socketio.service';
import { TicketOrder } from '../TicketOrder';

@Component({
  selector: 'app-orders-served',
  templateUrl: './orders-served.component.html',
  styleUrls: ['./orders-served.component.css']
})
export class OrdersServedComponent implements OnInit {

  private tickets: Ticket[] = [];
  //socketObserver: Observable<any>;
  private dd;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService, private socketio: SocketioService) { 
    const ticket_sup = this.tickets;
    this.dd = () => {
      ticket.get_tickets({state: 'open', waiter: this.us.get_nick()}).subscribe( (dd) => {
        ticket_sup.splice(0, ticket_sup.length);
        console.log(dd);
        dd.forEach( (ss) => {
          ticket_sup.push(ss);
          ss.orders.sort((a: TicketOrder, b: TicketOrder) => {
            return a.price - b.price;
          });
        });
        console.log(ticket_sup);
      });
      console.log(ticket_sup);
    };
  }

  ngOnInit() {
    this.dd()
    this.socketio.get().on('waiters', this.dd);
  }

  /*dd() {
    this.ticket.get_tickets({state : 'open'}).subscribe( (dd) => {
      dd.forEach( (ss) => {
        this.tickets.push(ss);
      });
    });
  }*/

  deliver(ticketIndex: number, orderIndex: number, state: string) {
    const ticket = this.tickets[ticketIndex];
    this.ticket.changeOrderState(ticket._id, ticket.orders[orderIndex]._id, 'delivered').toPromise().then((data) => {
      ticket.orders[orderIndex].state = 'delivered';
    }).catch((err) => console.log(err));
  }

}
