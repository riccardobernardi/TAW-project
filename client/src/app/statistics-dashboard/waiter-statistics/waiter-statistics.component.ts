import { Component, OnInit } from '@angular/core';
import {UserHttpService} from '../../user-http.service';
import {ItemHttpService} from '../../item-http.service';
import {TicketHttpService} from '../../ticket-http.service';
import {SocketioService} from '../../socketio.service';
import {Router} from '@angular/router';
import {TableHttpService} from '../../table-http.service';
import { Report } from "../../Report";
import {roles} from "../../User";
import {NgbDate, NgbDatepicker} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpReportService } from 'src/app/http-report.service';


@Component({
  selector: 'app-waiter-statistics',
  templateUrl: './waiter-statistics.component.html',
  styleUrls: ['./waiter-statistics.component.css']
})
export class WaiterStatisticsComponent implements OnInit {

  //private totalgain: Promise<number | any[] | never>;

  //private userStatistics;
  private statisticsXRoles;
  private roles = ["waiters", "cookers", "bartenders"];
  private selRole = roles[0];

  private min_date : Date;
  private max_date : Date;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService, private router: Router,
              private table: TableHttpService, private toastr: ToastrService, private report: HttpReportService) { }

  onMinDateSelect($event : NgbDate) {
    this.min_date = new Date($event.year, $event.month - 1, $event.day, 0, 0, 0, 0);
  }

  onMaxDateSelect($event : NgbDate) {
    this.max_date = new Date($event.year, $event.month - 1, $event.day, 0, 0, 0, 0);
  }

  ngOnInit() {}

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
      this.report.get_reports({start: this.min_date.toISOString(), end: this.max_date.toISOString()}).toPromise().then((reports) => {
        //console.log(reports);
        if(reports.length != 0) {
          this.statisticsXRoles = reports.map((report: Report) => {
            return report.users_reports;
          }).reduce((user_report1, user_report2) => {
            for(let role in user_report1) {
              if(role == "waiters") {
                user_report1[role].forEach((dependant1) =>  {
                  let dep = user_report2[role].filter((dependant2) => dependant1.username == dependant2.username);
                  if(dep[0]) {
                    dependant1.customers_served += dep[0].customers_served;
                    dependant1.orders_served += dep[0].orders_served;
                    var i = user_report2[role].indexOf(dep[0]);
                    if(i != -1) {
                      user_report2[role].splice(i, 1);
                    }
                  }
                });
                user_report2[role].forEach((dependant2) => {
                  user_report1[role].push({
                    username: dependant2.username,
                    customers_served: dependant2.customers_served,
                    orders_served: dependant2.orders_served
                  })
                });
              } else {
                user_report1[role].forEach((dependant1) =>  {
                  let dep = user_report2[role].filter((dependant2) => dependant1.username == dependant2.username);
                  if(dep[0]) {
                    dependant1.items_served += dep[0].items_served;
                    var i = user_report2[role].indexOf(dep[0]);
                    if(i != -1) {
                      user_report2[role].splice(i, 1);
                    }
                  }
                });
                user_report2[role].forEach((dependant2) => {
                  user_report1[role].push({
                    username: dependant2.username,
                    items_served: dependant2.items_served
                  })
                });
              }
              
            }
            return user_report1;
          });
          //console.log(this.statisticsXRoles);
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

}
