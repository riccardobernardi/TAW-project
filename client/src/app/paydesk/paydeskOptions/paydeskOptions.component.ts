import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserHttpService} from '../../services/user-http.service';
import {TicketHttpService} from '../../services/ticket-http.service';
import {SocketioService} from '../../services/socketio.service';
import {TicketOrder} from '../../interfaces/TicketOrder';
import {Table, states} from '../../interfaces/Table';
import {Ticket} from '../../interfaces/Ticket';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {TableHttpService} from '../../services/table-http.service';
import {map} from 'rxjs/operators';
import { Report } from '../../interfaces/Report';
import { User } from "../../interfaces/User";
import { ToastrService } from 'ngx-toastr';
import { HttpReportService } from "../../services/http-report.service";
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-paydesk-options',
  templateUrl: './paydeskOptions.component.html',
  styleUrls: ['./paydeskOptions.component.css']
})

export class PaydeskOptionsComponent implements OnInit {

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
  private gainofday = 0;
  private totalgain: Promise<any> | null = null;
  private reportSelected : Report;

  private disableUserButtons;
  private disableTableButtons;
  private disableTicketsButtons;

  constructor(private us: UserHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService, private router: Router,
              private table: TableHttpService, private toastr: ToastrService, private report: HttpReportService) {}

  private signalSuccess(message : string) {
    this.toastr.success(message, 'Success!', {
      timeOut: 3000
    });
  }

  private signalError(message: string) {
    this.toastr.error(message, 'Failure!', {
      timeOut: 3000
    });
  }

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
    this.disableUserButtons = false;
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
      
      this.tables.sort((table1: Table, table2 : Table) => table1.number - table2.number);
    })
  }

  send(name, password) {
    this.user.username = name;
    this.user.password = password;
    this.user.role = this.newRoleSelected;
    this.disableUserButtons = true;
    //console.log(this.user);
    this.us.register(this.user).subscribe((d) => {
      //console.log('Registration ok: ' + JSON.stringify(d));
      this.signalSuccess("Changing OK!");
      this.disableUserButtons = false;
    }, (err) => {
      //console.log('Signup error: ' + JSON.stringify(err.error.errormessage));
      let errmessage = err.error.errormessage || err.error.message;
      //console.log(err);
      this.signalError('Registration not OK: ' + errmessage);
      this.disableUserButtons = false;
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
      this.signalError('Parameters have to be positive!');
    else {
      console.log(number, max_people);
      this.disableTableButtons = true;
      this.table.add_table(parseInt(number), parseInt(max_people)).subscribe(() => {
        this.signalSuccess('Add table OK');
        this.disableTableButtons = false;
      }, (err) => {
        let errmessage = err.error.errormessage || err.error.message;
        this.signalError('Changing not OK : ' + errmessage);
        this.disableTableButtons = false;
      })
    }
  }

  close_ticket() {
    //console.log(this.emitReceipt())
    //console.log(this.selTicket._id);
    this.disableTicketsButtons = true;
    this.ticket.close_ticket(this.selTicket._id, this.emitReceipt()).toPromise().then(() => {
      return this.table.change_table({number: this.selTicket.table, state: states[0]}, undefined).toPromise();
    })
    .then((data) => {
      this.signalSuccess('Close ticket OK');
      this.disableTicketsButtons = false;
    })
    .catch((err) => {
      let errmessage = err.error.errormessage || err.error.message;
      this.signalError('Changing not OK : ' + errmessage);
      this.disableTicketsButtons = false;
    });
  }

  create_daily_report() {
    const date = new Date(this.year_insert, this.month_insert - 1, this.day_insert, 0, 0, 0, 0);
    this.disableTicketsButtons = true;
    this.report.create_report({start: date, state: 'closed'})
      .then(() => {
        this.signalSuccess("Report created!");
        this.disableTicketsButtons = false;
      })
      .catch((err) => {
        let errmessage = err.error.errormessage || err.error.message;
        this.signalError("Error: " + errmessage);
        this.disableTicketsButtons = false;
      });
  }

  createScontrino() {
    console.log("AAAAA");
  }

  getReport() {
    const date = new Date(this.year_delete, this.month_delete - 1, this.day_delete, 0, 0, 0, 0);
    this.report.get_reports({start: date, end: date}).toPromise().then((data) => {
      this.reportSelected = data[0];
    }).catch((err) => {
      let errmessage = err.error.errormessage || err.error.message;
      this.signalError("Error: " + errmessage);
    })
  }

  delete_daily_report() {
    const date = new Date(this.year_delete, this.month_delete - 1, this.day_delete, 0, 0, 0, 0);
    if(this.reportSelected) {
      this.disableTicketsButtons = true;
      this.report.delete_report(this.reportSelected._id).toPromise()
      .then(() => {
        this.signalSuccess("Report deleted!");
        this.reportSelected = null;
        this.disableTicketsButtons = false;
      })
      .catch((err) => {
        let errmessage = err.error.errormessage || err.error.message;
        this.signalError(errmessage);
        this.disableTicketsButtons = false;
      });
    } else this.signalError("Report not selected!");
  }

  changePasswordUser(selChangePwdUser : User, newPwd: string) {
    this.savetext();
    console.log(selChangePwdUser.username, newPwd);
    this.disableUserButtons = true;
    this.us.changePasswordUser(selChangePwdUser, newPwd).subscribe(() => {
      this.signalSuccess('Changing OK');
      this.disableUserButtons = false;
      this.selChangePwdUser = null;
    },(err) => {
      let errmessage = err.error.errormessage || err.error.message;
      this.signalError('Changing not OK : ' + errmessage);
      this.disableUserButtons = false;
    });
  }

  deleteUser(selDelUser : User) {
    this.disableUserButtons = true;
    this.us.deleteUser(selDelUser.username).subscribe(() => {
      this.signalSuccess('Deletion OK');
      this.selDelUser = null;
      this.disableUserButtons = false;
    }, (err) => {
      let errmessage = err.error.errormessage || err.error.message;
      this.signalError('Deletion not OK: ' + errmessage);
      this.disableUserButtons = false;
    })
  }

  deleteTable(number: number) {
    console.log(number);
    this.disableTableButtons = true;
    this.table.delete_table(number).subscribe(() => {
      this.signalSuccess('Deletion OK');
      this.disableTableButtons = false;
    }, (err) => {
      let errmessage = err.error.errormessage || err.error.message;
      this.signalError("Error: " + errmessage);
      this.disableTableButtons = false;
    });
  }

  savetext() {
    saveAs(new Blob(["AAAAAAA"], { type: "text/plain" }), 'prova.txt');
  }
}
