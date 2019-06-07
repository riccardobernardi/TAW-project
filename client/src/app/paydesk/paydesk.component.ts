import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserHttpService} from '../user-http.service';
import {ItemHttpService} from '../item-http.service';
import {TicketHttpService} from '../ticket-http.service';
import {SocketioService} from '../socketio.service';
import {TicketOrder} from '../TicketOrder';
import {Table, states} from '../Table';
import {Ticket} from '../Ticket';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {TableHttpService} from '../table-http.service';
import {map} from 'rxjs/operators';
import { Report } from '../Report';
import { User } from "../User";
import { ToastrService } from 'ngx-toastr';
import { HttpReportService } from "../http-report.service";

@Component({
  selector: 'app-paydesk',
  templateUrl: './paydesk.component.html',
  styleUrls: ['./paydesk.component.css']
})

export class PaydeskComponent implements OnInit {

  private roles: string[] = ['waiter', 'cook', 'bartender', 'admin'];
  private newRoleSelected: string = undefined;

  private errmessage = undefined;
  private user = {username: '', password: '', role: ''};
  private selDelUser: any;
  private selTable: any;
  private selDelTable : Table;
  private users : User[];
  private selChangePwdUser: any;
  private socket;
  private tickets: Ticket[] = [];
  private tables: Table[] = [];

  private selTicket: any;
  private day_insert: number;
  private month_insert: number;
  private year_insert: number;
  private day_delete: number;
  private month_delete: number;
  private year_delete: number;
  gainofday = 0;
  totalgain: Promise<any> | null = null;
  private reportSelected : Report;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService, private router: Router,
              private table: TableHttpService, private toastr: ToastrService, private report: HttpReportService) {}

  get_tickets() {
    this.ticket.get_tickets({state: 'open'}).subscribe((tickets: Ticket[]) => {
      this.tickets = tickets;
      tickets.sort((ticket1 : Ticket, ticket2: Ticket) => {
        return ticket1.table - ticket2.table;
      });
      //console.log(dd);
      tickets.forEach((ss) => {
        ss.orders.sort((a: TicketOrder, b: TicketOrder) => {
          return (a.name_item < b.name_item) ? -1 : 1;
        });
      });
      //console.log(this.tickets);
      this.selTicket = this.tickets[0]
    });
    //console.log(this.tickets);
  }

  ngOnInit() {
    if (this.us.get_token() == undefined || this.us.get_token() == '') {
      this.us.logout();
    } else {
      console.log('your token is: [' + this.us.get_token() + ']');
    }
    this.get_tickets();
    this.get_users();
    this.get_tables();
    this.socketio.get().on('waiters', () => {this.get_tickets()});
    this.socketio.get().on('desks', () => {
      this.get_tickets();
      this.get_users();
      this.get_tables();
    });
  }

  get_users() {
    this.us.get_users().subscribe((data : User[]) => {
      this.users = data.sort((user1: User, user2: User) => {
        return (user1.username < user2.username) ? -1 : 1;
      })
      //console.log(this.users);
    });
  }

  get_tables() {
    this.table.get_tables().subscribe((data: Table[]) => {
      this.tables = data;
      this.tables.sort((table1: Table, table2 : Table) => table1.number - table1.number);
    })
  }

  send(name, password) {
    this.user.username = name;
    this.user.password = password;
    this.user.role = this.newRoleSelected;
    //console.log(this.user);
    this.us.register(this.user).subscribe((d) => {
      //console.log('Registration ok: ' + JSON.stringify(d));
      this.errmessage = undefined;
      this.toastr.success('Registration OK', 'Success!', {
        timeOut: 3000
      });
    }, (err) => {
      //console.log('Signup error: ' + JSON.stringify(err.error.errormessage));
      let errmessage = err.error.errormessage || err.error.message;
      //console.log(err);
      this.toastr.error('Registration not OK: ' + errmessage, 'Failure!', {
        timeOut: 3000
      });
    });
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

  emitReceipt() {
    return (this.selTicket.orders.length != 0) ? this.selTicket.orders.map((x) => {
      return x.price;
    }).reduce((total, amount) => {
      return total + amount;
    }) : 0;
  }

  allGain() {
    return this.tickets.map((x) => x.orders.map((y) => y.price)
      .reduce((total, amount) => total + amount))
      .reduce((total, amount) => total + amount);
  }

  async allGainOfDay() {

    this.totalgain = this.ticket.get_tickets({}).pipe(
      map((tickets : Ticket[] ) => {
        const ticketSup = [];

        tickets.forEach((ss) => {
          ticketSup.push(ss);
        });

        let tickets_on_date = ticketSup.filter((oneTicket) => {
          return new Date(oneTicket.start).getDate() === this.day_insert
            && (new Date(oneTicket.start).getMonth() + 1) === this.month_insert
            && new Date(oneTicket.start).getFullYear() === this.year_insert;
        });

        if (tickets_on_date.length === 0) {
          return 0;
        }

        tickets_on_date = tickets_on_date.map((oneTicket) => {
          return (oneTicket.orders.length != 0 ) ? oneTicket.orders.map((oneOrder) => {
            return oneOrder.price;
          }).reduce((total, onePrice) => total + onePrice) : 0;
        }).reduce((total, nPrices) => total + nPrices);

        return tickets_on_date;
      })
    ).toPromise().then((x) => x);
  }

  onDateInsertSelect($event: NgbDate) {
    this.month_insert = $event.month;
    this.day_insert = $event.day;
    this.year_insert = $event.year;
  }

  onDateDeleteSelect($event: NgbDate) {
    this.month_delete = $event.month;
    this.day_delete = $event.day;
    this.year_delete = $event.year;
    this.getReport();
  }

  add_Table(number: string, max_people: string) {
    if(parseInt(number) <= 0 || parseInt(max_people) <= 0)
      this.toastr.error('Parameters have to be positive!', 'Failure!', {
        timeOut: 3000}
      );
    else {
      console.log(number, max_people);
      this.table.add_table(parseInt(number), parseInt(max_people)).subscribe(() => {
        this.toastr.success( 'Add table OK', 'Success!', {
          timeOut: 3000
        });
      }, (err) => {
        let errmessage = err.error.errormessage || err.error.message;
        this.toastr.error('Changing not OK : ' + errmessage, 'Failure!', {
          timeOut: 3000
        });
      })
    }
  }

  close_ticket() {
    //console.log(this.emitReceipt())
    //console.log(this.selTicket._id);
    this.ticket.close_ticket(this.selTicket._id, this.emitReceipt()).toPromise().then(() => {
      return this.table.change_table({number: this.selTicket.table, state: states[0]}, undefined).toPromise();
    })
    .then((data) => {
      //console.log(data);
    })
    .catch((err) => console.log(err));
  }

  create_daily_report() {
    //console.log(this.year_insert + "-" + ((this.month_insert > 9) ? this.month_insert : "0" + this.month_insert) + "-" + ((this.day_insert > 9) ? this.day_insert : "0" + this.day_insert) + 'T' + "00:00:00");
    const date = new Date(this.year_insert, this.month_insert - 1, this.day_insert, 0, 0, 0, 0);
    //console.log(date);
    this.report.create_report({start: date, state: 'closed'})
      .then()
      .catch((err) => console.log(err));
  }

  getReport() {
    const date = new Date(this.year_delete, this.month_delete - 1, this.day_delete, 0, 0, 0, 0);
    this.report.get_reports({start: date, end: date}).toPromise().then((data) => {
      this.reportSelected = data[0];
    }).catch((err) => {
      console.log(err);
      //this.error = true;
    })
  }

  delete_daily_report() {
    const date = new Date(this.year_delete, this.month_delete - 1, this.day_delete, 0, 0, 0, 0);
    if(this.reportSelected)
      this.report.delete_report(this.reportSelected._id).toPromise()
      .then(() => this.reportSelected = null)
      .catch((err) => console.log(err));
  }

  changePasswordUser(selChangePwdUser : User, newPwd: string) {
    console.log(selChangePwdUser.username, newPwd);
    this.us.changePasswordUser(selChangePwdUser, newPwd).subscribe(() => {
      this.toastr.success( 'Changing OK', 'Success!', {
        timeOut: 3000
      });
    },(err) => {
      let errmessage = err.error.errormessage || err.error.message;
      this.toastr.error('Changing not OK : ' + errmessage, 'Failure!', {
        timeOut: 3000
      });
    });
  }

  deleteUser(selDelUser : User) {
    this.us.deleteUser(selDelUser.username).subscribe(() => {
      this.toastr.success('Deletion OK', 'Success!', {
        timeOut: 3000
      });
    }, (err) => {
      let errmessage = err.error.errormessage || err.error.message;
      this.toastr.error('Deletion not OK: ' + errmessage, 'Failure!', {
        timeOut: 3000
      });
    })
  }

  deleteTable(number: number) {
    console.log(number);
    this.table.delete_table(number).subscribe(() => this.toastr.success('Deletion OK', 'Success!', {
      timeOut: 3000
    }), (err) => {
      let errmessage = err.error.errormessage || err.error.message;
      this.toastr.error('Deletion not OK: ' + errmessage, 'Failure!', {
      timeOut: 3000})
    })
  }
}
