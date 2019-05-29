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
import { of, from } from 'rxjs';
import { map } from 'rxjs/operators';


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
  totalgain: Promise<any>|null = null;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService, private router: Router, private order: OrderHttpService,
              private table: TableHttpService  ) {
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
    this.dd();
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

  async allGainOfDay() {

    //let amm;

    this.totalgain = this.ticket.get_tickets({}).pipe(
      map((dd) => {
        const ticketSup = [];

      dd.forEach( (ss) => {
        ticketSup.push(ss);
      });

      /*if (this.day === undefined) {
        return ticketSup.map( (oneTicket) => {
          return oneTicket.orders.map( (oneOrder) => {
            return oneOrder.price;
          }).reduce( (total, onePrice) => total + onePrice);
        }).reduce( (total, nPrices) => total + nPrices);
      }
*/
      const a =  ticketSup.filter( (oneTicket) => {
        return new Date(oneTicket.start).getDate() === this.day
          && new Date(oneTicket.start).getMonth() === this.month
          && new Date(oneTicket.start).getFullYear() === this.year;
      });

      console.log(a);

      /*.map( (oneTicket) => {
        return oneTicket.orders.map( (oneOrder) => {
          return oneOrder.price;
        }).reduce( (total, onePrice) => total + onePrice);
      }).reduce( (total, nPrices) => total + nPrices);*/

      return 3;
      //amm = a ;
      })
    ).toPromise();

    //return amm;
  }

  onDateSelect($event: NgbDate) {
    this.month = $event.month;
    this.day = $event.day;
    this.year = $event.year;
  }

  close_ticket() {
    console.log('AAAAAAAAA' + this.emitReceipt());
    this.ticket.close_ticket(this.selTicket._id, this.emitReceipt()).toPromise().then(() => {
      return this.table.change_table({number: this.selTicket.table, state: undefined}).toPromise();
    })
    .then()
    .catch((err) => console.log(err));
  }

  create_daily_report() {
    let today = new Date();
    this.ticket.create_report({start: today, state: 'closed'})
    .then()
    .catch((err) => console.log(err));
  }
}
