import { Component, OnInit } from '@angular/core';
import { Ticket } from "../Ticket"
import { Item } from "../Item"
import {ItemHttpService} from '../item-http.service';
import {UserHttpService} from '../user-http.service';
import { TicketHttpService } from 'src/app/ticket-http.service';

@Component({
  selector: 'app-waiter-served',
  templateUrl: './waiter-served.component.html',
  styleUrls: ['./waiter-served.component.css']
})
export class WaiterServedComponent implements OnInit {

  private items : Item[] = [];
  private tickets : Ticket[] = []

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService) { }

  ngOnInit() {
    this.ticket.get_tickets({state: "open"}).toPromise().then((data : Ticket[] ) => {
      this.tickets = data;
      console.log(this.tickets);
    }).catch((err) => console.log(err));
  }

  deliver(ticket_index : number, order_index : number, state : string) {
    let ticket = this.tickets[ticket_index];
    this.ticket.changeOrderState(ticket._id, ticket.orders[order_index]._id, "delivered").toPromise().then((data) => {
      //faccio nulla dato che poi dovrebbe arrivare l'evento dal socket
    }).catch((err) => console.log(err));
  }

}
