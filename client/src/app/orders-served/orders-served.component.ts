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

  private tickets: Ticket[];
  private error = false;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService, private socketio: SocketioService) {}

  get_tickets() {
    let mm;
    if (this.us.get_role() === 'desk') {
      mm = this.ticket.get_tickets({state: 'open'});
    } else {
      mm = this.ticket.get_tickets({state: 'open', waiter: this.us.get_nick()});
    }
    mm.subscribe( (dd) => {
      //this.tickets.splice(0, this.tickets.length);
      console.log(dd);
      this.tickets = dd;
      dd.forEach( (ss) => {
        ss.orders.sort((a: TicketOrder, b: TicketOrder) => {
          return (a.name_item < b.name_item) ? -1 : 1;
        });
      });
      console.log(this.tickets);
      this.error = false;
    }, (err) => {
      console.log(err);
      this.error = true;
    });
    console.log(this.tickets);
  }

  ngOnInit() {
    this.get_tickets();
    this.socketio.get().on('waiters', () => {
      console.log("Orders served event received");
      this.get_tickets()
    });
  }

  deliver(ticketIndex: number, orderIndex: number, state: string) {
    const ticket = this.tickets[ticketIndex];
    this.ticket.changeOrderState(ticket._id, ticket.orders[orderIndex]._id, 'delivered', this.us.get_nick()).toPromise().then((data) => {
      ticket.orders[orderIndex].state = 'delivered';
      this.error = false;
    }).catch((err) => {
      console.log(err);
      this.error = true;
    });
  }

}
