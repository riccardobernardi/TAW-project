import { Component, OnInit } from '@angular/core';
import {map, tap} from 'rxjs/operators';
import {UserHttpService} from '../../user-http.service';
import {ItemHttpService} from '../../item-http.service';
import {TicketHttpService} from '../../ticket-http.service';
import {SocketioService} from '../../socketio.service';
import {Router} from '@angular/router';
import {OrderHttpService} from '../../order-http.service';
import {TableHttpService} from '../../table-http.service';
import {Order} from '../../Order';
import {Ticket} from '../../Ticket';

@Component({
  selector: 'app-waiter-statistics',
  templateUrl: './waiter-statistics.component.html',
  styleUrls: ['./waiter-statistics.component.css']
})
export class WaiterStatisticsComponent implements OnInit {
  private totalgain: Promise<number | any[] | never>;
  private resultWaiter = this.waiterStatistics();
  private resultCook = this.cookStatistics();

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService, private router: Router, private order: OrderHttpService,
              private table: TableHttpService) { }

  ngOnInit() {
    this.resultWaiter = this.waiterStatistics();
  }

  async waiterStatistics() {

    const waiters = {};

    this.ticket.get_tickets({}).pipe(
      tap((dd) => {
        const ticketSup: Ticket[] = [];

        dd.forEach((ss) => {
          ticketSup.push(ss);
        });

        console.log(ticketSup);

        ticketSup.map( (x) => {
          console.log(x);
          return x.orders.map( (y) => {
            console.log(y);
            return y.username_waiter;
          }).forEach( (z) => {
            console.log(z);
            if ( !(z in waiters)) {
              waiters[z] = 0;
            }
            waiters[z] += 1;
          });
        });
      })
    ).subscribe();

    console.log(waiters);
    return waiters;
  }

  async cookStatistics() {

    const waiters = {};

    this.ticket.get_tickets({}).pipe(
      tap((dd) => {
        const ticketSup: Ticket[] = [];

        dd.forEach((ss) => {
          ticketSup.push(ss);
        });

        console.log(ticketSup);

        ticketSup.map( (x) => {
          console.log(x);
          return x.orders.map( (y) => {
            console.log(y);
            return y.username_cook;
          }).forEach( (z) => {
            console.log(z);
            if ( !(z in waiters)) {
              waiters[z] = 0;
            }
            waiters[z] += 1;
          });
        });
      })
    ).subscribe();

    console.log(waiters);
    return waiters;
  }

/*  async cookStatistics() {

    const waiters = {};

    this.ticket.get_tickets({}).pipe(
      tap((dd) => {
        const ticketSup: Ticket[] = [];

        dd.forEach((ss) => {
          ticketSup.push(ss);
        });

        console.log(ticketSup);

        ticketSup.map( (x) => {
          console.log(x);
          return x.orders.map( (y) => {
            console.log(y);
            return y.username_bartender;
          }).forEach( (z) => {
            console.log(z);
            if ( !(z in waiters)) {
              waiters[z] = 0;
            }
            waiters[z] += 1;
          });
        });
      })
    ).subscribe();

    console.log(waiters);
    return waiters;
  }*/
}
