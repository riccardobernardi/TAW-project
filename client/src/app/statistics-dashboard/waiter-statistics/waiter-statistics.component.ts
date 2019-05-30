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
  private resultCook = this.executerStatistics();
  private allResults = this.getStats();

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService, private router: Router, private order: OrderHttpService,
              private table: TableHttpService) { }

  ngOnInit() {
    this.resultWaiter = this.waiterStatistics();
    console.log(this.getStats());
  }

  async waiterStatistics() {
    const waiters = {};
    this.ticket.get_tickets({}).pipe(
      tap((dd) => {
        const ticketSup: Ticket[] = [];
        dd.forEach((ss) => {
          ticketSup.push(ss);
        });
        ticketSup.map( (x) => {
          return x.orders.map( (y) => {
            return y.username_waiter;
          }).forEach( (z) => {
            if ( !(z in waiters)) {
              waiters[z] = 0;
            }
            waiters[z] += 1;
          });
        });
      })
    ).subscribe();
    return waiters;
  }

  async executerStatistics() {
    const waiters = {};
    this.ticket.get_tickets({}).pipe(
      tap((dd) => {
        const ticketSup: Ticket[] = [];
        dd.forEach((ss) => {
          ticketSup.push(ss);
        });
        ticketSup.map( (x) => {
          return x.orders.map( (y) => {
            return y.username_executer;
          }).forEach( (z) => {
            if ( !(z in waiters)) {
              waiters[z] = 0;
            }
            waiters[z] += 1;
          });
        });
      })
    ).subscribe();
    return waiters;
  }

  getStats() {
    let a = [];

    this.waiterStatistics().then( (x) => {
      // console.log('aaaaa');
      // console.log(x);

      /*Object.keys(x).forEach( (mm) =>{
        console.log(mm);
      });*/

      console.log(x);

      a.push(x);

      /*.forEach( (y) => {
        a.push({name: y, num: x[y]});
        console.log('bbbbbbb');
        console.log({name: y, num: x[y]});
      });*/
    });

    /*this.executerStatistics().then( (x) => {
      Object.keys(x).forEach( (y) => {
        a.push({name: y, num: x[y]});
      });
    });*/

    if (a.length === 0) {
      // console.log('porco dio');
    }

    return a;
  }
}
