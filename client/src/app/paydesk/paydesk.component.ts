import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserHttpService} from '../user-http.service';
import {OrderService} from '../order.service';
import {Order} from '../Order';
import {mockorders} from '../mock-orders';
import {OrderHttpService} from '../order-http.service';
import * as io from 'socket.io-client';
import {ItemHttpService} from '../item-http.service';
import {TicketHttpService} from '../ticket-http.service';
import {SocketioService} from '../socketio.service';
import {TicketOrder} from '../TicketOrder';
import {Table} from '../Table';
import {Ticket} from '../Ticket';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { TableHttpService } from '../table-http.service';

@Component({
  selector: 'app-paydesk',
  templateUrl: './paydesk.component.html',
  styleUrls: ['./paydesk.component.css']
})
export class PaydeskComponent implements OnInit {

  private roles: string[] = ['waiter', 'cook', 'bartender', 'admin'];
  private newRoleSelected: string = undefined;

  private errmessage = undefined;
  private user = { username: '', password: '', role: '' };
  private selDelUser: any;
  private selTable: any;
  private users = [];
  private selChangePwdUser: any;
  private socket;
  private tickets: Ticket[] = [];
  private tables: Table[] = [];

  private dd;
  private selTicket: any;
  day: number;
  month: number;
  year: number;
  gainofday = 0;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService, private router: Router, private order: OrderHttpService, private table: TableHttpService  ) {
    const ticketSup = this.tickets;
    this.dd = () => {
      ticket.get_tickets({state: 'open'}).subscribe( (dd) => {
        ticketSup.splice(0, ticketSup.length);
        console.log(dd);
        dd.forEach( (ss) => {
          ticketSup.push(ss);
          ss.orders.sort((a: TicketOrder, b: TicketOrder) => {
            return a.price - b.price;
          });
        });
        console.log(ticketSup);
      });
      console.log(ticketSup);
    };

    this.us.get_users().subscribe((data) => {
      const a: any = data;
      a.forEach( (d) => this.users.push(d) );
    });
    console.log('ricarica');
  }

  ngOnInit() {
    if (this.us.get_token() == undefined || this.us.get_token() == '') {
      this.us.logout();
    } else {
      console.log('your token is: [' + this.us.get_token() + ']');
    }
    this.dd()
    this.socketio.get().on('waiters', this.dd);
    this.socketio.get().on('desks', this.dd);
  }

  send(name, password) {
    this.user.username = name;
    this.user.password = password;
    this.user.role = this.newRoleSelected;
    console.log(this.user);
    this.us.register( this.user ).subscribe( (d) => {
      console.log('Registration ok: ' + JSON.stringify(d) );
      this.errmessage = undefined;
      // this.router.navigate(['/login']);
    }, (err) => {
      console.log('Signup error: ' + JSON.stringify(err.error.errormessage) );
      this.errmessage = err.error.errormessage || err.error.message;
    });
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

  emitReceipt() {
    return this.selTicket.orders.map( (x) => {
      return x.price;
    }).reduce( (total, amount) => {
      return total + amount;
    });
  }

  allGain() {
    return this.tickets.map( (x) => x.orders.map( (y) => y.price)
      .reduce( (total, amount) => total + amount ))
      .reduce( (total, amount) => total + amount);
  }

  allGainOfDay() {
    /*console.log(this.day + '/' + this.month + '/' + this.year);
    if (this.day === undefined) {
      this.day = 5;
      this.month = 5;
      this.year = 2019;
    }*/

    /*this.tickets.forEach( (oneTicket) => {
      console.log('ghe sboro' + oneTicket.start.getDay());
    })*/

    console.log('ghe sboro' + this.tickets[0].start.getDay());

    /*const a = this.tickets.filter( (oneTicket) => {
      console.log(oneTicket.start.getDay());
      return oneTicket.start.getDay() == 5;
    });

    console.log(a);
    /!*.map( (oneTicket) => {
      return oneTicket.orders.map( (oneOrder) => {
        return oneOrder.price;
      }).reduce( (total, onePrice) => total + onePrice);
    }).reduce( (total, nPrices) => total + nPrices);*!/

    return a.map( (oneTicket) => {
      return oneTicket.orders.map( (x) => x.price).reduce( (c, b) => c + b);
    }).reduce( (c, d) => c + d );*/
  }

  onDateSelect($event: NgbDate) {
    this.month = $event.month;
    this.day = $event.day;
    this.year = $event.year;
  }

  close_ticket() {
    console.log("AAAAAAAAA" + this.emitReceipt());
    this.ticket.close_ticket(this.selTicket._id, this.emitReceipt()).toPromise().then(() => {
      return this.table.change_table({number: this.selTicket.table, state: undefined}).toPromise()
    })
    .then()
    .catch((err) => console.log(err));
  }

  create_daily_report() {
    var today = new Date();
    this.ticket.create_report({start: today, state: "closed"})
    .then()
    .catch((err) => console.log(err));
  }
}
