import { Component, OnInit } from '@angular/core';
import {UserHttpService} from '../../../services/user-http.service';
import {ItemHttpService} from '../../../services/item-http.service';
import {TicketHttpService} from '../../../services/ticket-http.service';
import {SocketioService} from '../../../services/socketio.service';
import {Router} from '@angular/router';
import {TableHttpService} from '../../../services/table-http.service';
import { Report } from '../../../interfaces/Report';
import {roles} from '../../../interfaces/User';
import {NgbDate, NgbDatepicker} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpReportService } from 'src/app/services/http-report.service';


@Component({
  selector: 'app-employees-statistics',
  templateUrl: './employees-statistics.component.html',
  styleUrls: ['./employees-statistics.component.css']
})
export class EmployeesStatisticsComponent implements OnInit {

  // private totalgain: Promise<number | any[] | never>;

  // private userStatistics;
  private statisticsXRoles;
  private roles = ['waiters', 'cookers', 'bartenders'];
  private selRole = roles[0];

  private min_date: Date;
  private max_date: Date;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService, private router: Router,
              private table: TableHttpService, private toastr: ToastrService, private report: HttpReportService) { }

  onMinDateSelect($event: NgbDate) {
    this.min_date = new Date($event.year, $event.month - 1, $event.day, 0, 0, 0, 0);
  }

  onMaxDateSelect($event: NgbDate) {
    this.max_date = new Date($event.year, $event.month - 1, $event.day, 0, 0, 0, 0);
  }

  ngOnInit() {}

  private getStats() {
    if (this.min_date && this.max_date && this.min_date <= this.max_date) { // if dates range is valid
      this.report.get_reports({start: this.min_date.toISOString(), end: this.max_date.toISOString()}).toPromise().then((reports) => {
        // console.log(reports);
        // if reports exist
        if (reports.length !== 0) {
          this.statisticsXRoles = reports.map((report: Report) => {
            return report.users_reports; // take the user_reports
          }).reduce((user_report1, user_report2) => {
            for (const role in user_report1) {
              if (role === 'waiters') { // if the role is waiters, change a little the computation
                user_report1[role].forEach((dependant1) =>  {
                  // find in the sequent report the waiter, if exists
                  const dep = user_report2[role].filter((dependant2) => dependant1.username == dependant2.username);
                  if (dep[0]) { // update the stats for the waiter and remove
                    dependant1.customers_served += dep[0].customers_served;
                    dependant1.orders_served += dep[0].orders_served;
                    const i = user_report2[role].indexOf(dep[0]);
                    if (i !== -1) {
                      user_report2[role].splice(i, 1);
                    }
                  }
                });
                // for each waiter not in the report1, change
                user_report2[role].forEach((dependant2) => {
                  user_report1[role].push({
                    username: dependant2.username,
                    customers_served: dependant2.customers_served,
                    orders_served: dependant2.orders_served
                  });
                });
              } else {
                // same logic as waiter but with different stats
                user_report1[role].forEach((dependant1) =>  {
                  const dep = user_report2[role].filter((dependant2) => dependant1.username == dependant2.username);
                  if (dep[0]) {
                    dependant1.items_served += dep[0].items_served;
                    const i = user_report2[role].indexOf(dep[0]);
                    if (i != -1) {
                      user_report2[role].splice(i, 1);
                    }
                  }
                });
                user_report2[role].forEach((dependant2) => {
                  user_report1[role].push({
                    username: dependant2.username,
                    items_served: dependant2.items_served
                  });
                });
              }

            }
            return user_report1;
          });
          // console.log(this.statisticsXRoles);
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
        const errmessage = err.error.errormessage || err.error.message;
        this.toastr.error('Registration not OK: ' + errmessage, 'Failure!', {
          timeOut: 3000
        });
      });
    } else {
      this.statisticsXRoles = undefined;
      this.toastr.error('You have to specify a date range!', 'Failure!', {
        timeOut: 3000
      });
    }
  }

}
