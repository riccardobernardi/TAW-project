import { Component, OnInit, Input } from '@angular/core';
import { Ticket } from '../interfaces/Ticket';
import { TicketOrder, order_states } from '../interfaces/TicketOrder';
import { types } from '../interfaces/Item';
import { roles } from '../interfaces/User';
import {ItemHttpService} from '../services/item-http.service';
import {UserHttpService} from '../services/user-http.service';
import { TicketHttpService } from 'src/app/services/ticket-http.service';
import {SocketioService} from '../services/socketio.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-orders-served',
  templateUrl: './orders-served.component.html',
  styleUrls: ['./orders-served.component.css']
})
export class OrdersServedComponent implements OnInit {

  private tickets: Ticket[];
  private error = false;
  private role
  private order_states = order_states;


  constructor(private us: UserHttpService, private ticket: TicketHttpService, private socketio: SocketioService, private toastr: ToastrService) {
    this.role = us.get_role();
  }

  get_tickets() {
    this.ticket.get_tickets((this.us.get_role() === roles[2]) ? {state: 'open'} : {state: 'open', waiter: this.us.get_nick()})
    .subscribe( (tickets: Ticket[]) => {
      //console.log(tickets);
      this.tickets = tickets;
      tickets.sort((ticket1: Ticket, ticket2: Ticket) => {
        return ticket1.table - ticket2.table;
      });
      tickets.forEach( (ss) => {
        ss.orders.sort((ticket1: TicketOrder, ticket2: TicketOrder) => {
          if((ticket1.type_item == types[1] && ticket2.type_item == types[1]) || (ticket1.type_item != types[1] && ticket2.type_item != types[1])) {
            if((ticket1.state == order_states[2] && ticket2.state == order_states[2]) || (ticket1.state != order_states[2] && ticket2.state != order_states[2]))
              return (ticket1.name_item < ticket2.name_item) ? -1 : 1;
            else if(ticket1.state == order_states[2] && ticket2.state != order_states[2])
              return -1;
            else return 1;
          } else if (ticket1.type_item == types[1] && ticket2.type_item == types[0])
            return -1
          else 1;
        });
      });
      //console.log(this.tickets);
      this.error = false;
    }, (err) => {
      //console.log(err);
      this.error = true;
    });
    //console.log(this.tickets);
  }

  ngOnInit() {
    this.get_tickets();
    this.socketio.get().on('waiters', () => {
      //console.log("Orders served event received");
      this.get_tickets()
    });
  }

  deliver(ticketIndex: number, orderIndex: number, state: string) {
    const ticket = this.tickets[ticketIndex];
    this.ticket.changeOrderState(ticket._id, ticket.orders[orderIndex]._id, 'delivered', null).toPromise().then((data) => {
      ticket.orders[orderIndex].state = 'delivered';
      this.error = false;
    }).catch((err) => {
      //console.log(err);
      this.error = true;
      this.toastr.error('Error: ' + err, 'Failure!', {
        timeOut: 3000
      });
    });
  }

}
