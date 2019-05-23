import { Component, OnInit, Input } from '@angular/core';
import { Ticket } from '../Ticket';
import { Item } from '../Item';
import {ItemHttpService} from '../item-http.service';
import {UserHttpService} from '../user-http.service';
import { TicketHttpService } from 'src/app/ticket-http.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-orders-served',
  templateUrl: './orders-served.component.html',
  styleUrls: ['./orders-served.component.css']
})
export class OrdersServedComponent implements OnInit {

  private tickets: Ticket[] = [];
  socketObserver: Observable<any>;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService) { }

  ngOnInit() {
    /*this.socketObserver = this.sio.getObserver();
    this.ticket.get_tickets({state: "open"}).toPromise().then((data : Ticket[] ) => {
      this.tickets = data;
      console.log(this.tickets);
      this.socketObserver.subscribe(() => {
        this.ticket.get_tickets({state : "open"}).toPromise().then((data : Ticket[]) => {
          this.tickets = data;
          console.log("Evento ricevuto "+ this.tickets);
        })
      });
    }).catch((err) => console.log(err));*/

  }

  deliver(ticket_index: number, order_index: number, state: string) {
    const ticket = this.tickets[ticket_index];
    this.ticket.changeOrderState(ticket._id, ticket.orders[order_index]._id, 'delivered').toPromise().then((data) => {
      // faccio nulla dato che poi dovrebbe arrivare l'evento dal socket
    }).catch((err) => console.log(err));
  }

}
