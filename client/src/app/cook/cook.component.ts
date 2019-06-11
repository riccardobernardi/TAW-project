import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {SocketioService} from '../services/socketio.service';
import {UserHttpService} from '../services/user-http.service';
import { Ticket } from '../interfaces/Ticket';
import {TicketOrder } from '../interfaces/TicketOrder';
import { TicketHttpService } from '../services/ticket-http.service';
import {HttpClient} from '@angular/common/http';
import { order_states } from '../interfaces/TicketOrder';
import { types } from '../interfaces/Item';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.css']
})
export class CookComponent implements OnInit {
  private tickets: Ticket[] = [];
  private error;

  constructor(private us: UserHttpService, private router: Router, private socketio: SocketioService, private ticket: TicketHttpService, private toastr: ToastrService  ) {}

  get_tickets() {
    this.ticket.get_tickets({state: 'open'}).subscribe( (tickets: Ticket[]) => {
      this.tickets.splice(0, this.tickets.length);
      tickets.forEach( (ticket) => {
        const orders = ticket.orders.filter((order: TicketOrder) =>
          order.state !== order_states[2] && order.state !== order_states[3] &&
          ((order.state === order_states[1]) ? order.username_executer === this.us.get_nick() : true ) &&
          order.type_item !== types[1]);
        if (orders.length !== 0) {
          this.tickets.push(ticket);
          orders.sort((order1: TicketOrder, order2: TicketOrder) => {
            return order1.required_time - order2.required_time;
          });
          ticket.orders = orders;
        }
      });
      this.tickets.sort((ticket1: Ticket, ticket2: Ticket) => {
        return ticket1.table - ticket2.table;
      });
    }, () => {
      this.error = true;
    });
  }

  ngOnInit() {
    if (this.us.get_token() === undefined || this.us.get_token() === '' || this.us.get_role() != 'cook') {
      this.us.logout();
    }
    this.error = false;
    this.get_tickets();
    this.socketio.get().on('cooks', () => {this.get_tickets(); });
  }


  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

  setOrderinProgress(ticketid: string, orderid: string, button: HTMLButtonElement, spinner: HTMLElement) {
    // console.log(ticketid, orderid);
    button.disabled = true;
    spinner.hidden = false;
    this.ticket.changeOrderState(ticketid, orderid, 'preparation', this.us.get_nick()).toPromise().then(() => {
      // console.log('Changing state to preparation OK');
    }).catch((err) => {
      this.toastr.error('Error: ' + err, 'Failure!', {
        timeOut: 3000
      });
      button.disabled = false;
      spinner.hidden = true;
      // console.log('Changing state to prepation failed: ' + err);
    });
  }

  setOrderCompleted(ticketid: string, orderid: string, button: HTMLButtonElement, spinner: HTMLElement) {
    button.disabled = true;
    spinner.hidden = false;
    this.ticket.changeOrderState(ticketid, orderid, 'ready', undefined).toPromise().then(() => {
      // console.log('Changing state to ready OK');
    }).catch((err) => {
      this.toastr.error('Error: ' + err, 'Failure!', {
        timeOut: 3000
      });
      button.disabled = false;
      spinner.hidden = true;
      // console.log('Changing state to ready failed: ' + err);
    });
  }
}
