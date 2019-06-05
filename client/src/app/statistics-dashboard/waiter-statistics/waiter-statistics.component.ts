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
import { Report } from "../../Report";
import {roles} from "../../User";
import {NgbDate, NgbDatepicker} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-waiter-statistics',
  templateUrl: './waiter-statistics.component.html',
  styleUrls: ['./waiter-statistics.component.css']
})
export class WaiterStatisticsComponent implements OnInit {

  private totalgain: Promise<number | any[] | never>;

  private userStatistics;
  private statisticsXRoles;
  //private roles = roles;
  private roles = ["waiters", "cookers", "bartenders"];
  private selRole = roles[0];

  private min_date : Date;
  private max_date : Date;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService, private router: Router, private order: OrderHttpService,
              private table: TableHttpService, private toastr: ToastrService) { }

  onMinDateSelect($event : NgbDate) {
    this.min_date = new Date($event.year, $event.month - 1, $event.day, 0, 0, 0, 0);
  }

  onMaxDateSelect($event : NgbDate) {
    this.max_date = new Date($event.year, $event.month - 1, $event.day, 0, 0, 0, 0);
  }

  ngOnInit() {
    
    /*this.resultWaiter = this.waiterStatistics();
    console.log(this.getStats());

    this.socketio.get().on('waiters', () => {
      this.resultWaiter = this.waiterStatistics();
      this.resultCook = this.executerStatistics();
      this.allResults = this.getStats();
    });*/

  }

  /*waiterStatistics() {
    return this.ticket.get_tickets({}).pipe(
      map((dd) => {
        const waiters = {};
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
        console.log(waiters);
        return waiters;
      })
    );
  }


  executerStatistics() {
    return this.ticket.get_tickets({}).pipe(
      map((dd) => {
        const waiters = {};
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
        console.log(waiters);
        return waiters;
      })
    );
  }

  getStats() {

    const mm = [];

    this.executerStatistics().pipe(
      map((x) => {
        const a = [];
        console.log(x);
        console.log(Object.keys(x));

        Object.keys(x).forEach( (y) => {
          console.log(y);
          a.push({name: y, num: x[y], role: 'executer'});
        });

        console.log(a);
        return a;

      })
    ).subscribe( (x) => {
      x.forEach( (y) => {
        mm.push(y);
      });
    });

    this.waiterStatistics().pipe(
      map((x) => {
        const a = [];
        console.log(x);
        console.log(Object.keys(x));

        Object.keys(x).forEach( (y) => {
          a.push({name: y, num: x[y], role: 'waiter'});
        });

        console.log(a);
        return a;

      })
    ).subscribe( (x) => {
      x.forEach( (y) => {
        mm.push(y);
      });
    });

    return mm;
  }*/

  private getStats() {
    if(this.min_date && this.max_date) {
      this.ticket.get_reports({start: this.min_date.toISOString(), end: this.max_date.toISOString()}).toPromise().then((reports) => {
        console.log(reports);
        if(reports.length != 0) {
          this.statisticsXRoles = reports.map((report: Report) => {
            return report.users_reports;
          })/*.map((user_report) => {
            let statistics = {};
            for(let role in user_report) {
              statistics[role] = {}
              user_report[role].forEach((dependant) => {
                if(!statistics[role][dependant.username])
                  statistics[role][dependant.username] = {}
                for(let stat in dependant) {
                  if(stat != "username")
                    statistics[role][dependant.username][stat] = dependant[stat]
                }
              });
            }
            return statistics;
          }).reduce((statistics1, statistics2) => {
            for(let role in statistics1) {
              for(let user in statistics1[role])
                for(let stat in statistics1[role][user])
                statistics1[role][user][stat] += statistics2[role][user][stat]
            }
            return statistics1;
          });*/.reduce((user_report1, user_report2) => {
            for(let role in user_report1) {
              if(role == "waiters") {
                user_report1[role].forEach((dependant1) =>  {
                  let dep = user_report2[role].filter((dependant2) => dependant1.username == dependant2.username);
                  if(dep[0]) {
                    dependant1.customers_served += dep[0].customers_served;
                    dependant1.orders_served += dep[0].orders_served;
                  }
                });
              } else {
                user_report1[role].forEach((dependant1) =>  {
                  let dep = user_report2[role].filter((dependant2) => dependant1.username == dependant2.username);
                  if(dep[0]) {
                    dependant1.items_served += dep[0].items_served;
                  }
                });
              }
            }
            return user_report1;
          });
          //this.userStatistics = [];
          /*for(var role in stats) {
            this.userStatistics.push(stats[role])
          }*/
          //this.userStatistics.sort((dep1, dep2) => (dep1.username < dep2.username) ? -1 : 1)
          /*for(var role in stats) {
            stats[role].sort((a, b) => (a))
          }*/
          console.log(this.statisticsXRoles);
          this.toastr.success('Done! Select a role!', 'Success!', {
            timeOut: 3000
          });
      } else {
        this.statisticsXRoles = [];
        this.toastr.error('No reports found!', 'Failure!', {
          timeOut: 3000
        });
      }
      }, (err) => {
        let errmessage = err.error.errormessage || err.error.message;
        this.toastr.error('Registration not OK: ' + errmessage, 'Failure!', {
          timeOut: 3000
        });
      })
    } else {
      this.statisticsXRoles = undefined;
      this.toastr.error('You have to specify a date range!', 'Failure!', {
        timeOut: 3000
      });
    }
  }

  filterRoles() {
    if(this.selRole) {

    }
  }
}
