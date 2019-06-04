import {Component, OnInit} from '@angular/core';
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
import {Table, states} from '../Table';
import {Ticket} from '../Ticket';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {TableHttpService} from '../table-http.service';
import {of, from} from 'rxjs';
import {map} from 'rxjs/operators';
import { Report } from '../Report';
import { User } from "../User";
import { ToastrService } from 'ngx-toastr';



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
              private socketio: SocketioService, private router: Router, private order: OrderHttpService,
              private table: TableHttpService, private toastr: ToastrService) {}

  get_tickets() {
    this.ticket.get_tickets({state: 'open'}).subscribe((dd) => {
      this.tickets.splice(0, this.tickets.length);
      console.log(dd);
      dd.forEach((ss) => {
        this.tickets.push(ss);
        ss.orders.sort((a: TicketOrder, b: TicketOrder) => {
          return (a.name_item < b.name_item) ? -1 : 1;
        });
      });
      console.log(this.tickets);
    });
    console.log(this.tickets);
  }

  ngOnInit() {
    if (this.us.get_token() == undefined || this.us.get_token() == '') {
      this.us.logout();
    } else {
      console.log('your token is: [' + this.us.get_token() + ']');
    }
    this.get_tickets();
    this.socketio.get().on('waiters', () => {this.get_tickets()});
    this.socketio.get().on('desks', () => {
      this.get_tickets();
      this.get_users();
    });
    this.get_users();
    
  }

  get_users() {
    this.us.get_users().subscribe((data : User[]) => {
      this.users = data.sort((user1: User, user2: User) => {
        return (user1.username < user2.username) ? -1 : 1;
      })
      console.log(this.users);
    });
  }

  send(name, password) {
    this.user.username = name;
    this.user.password = password;
    this.user.role = this.newRoleSelected;
    console.log(this.user);
    this.us.register(this.user).subscribe((d) => {
      console.log('Registration ok: ' + JSON.stringify(d));
      this.errmessage = undefined;
      this.toastr.success('Success!', 'Registration OK', {
        timeOut: 3000
      });
    }, (err) => {
      console.log('Signup error: ' + JSON.stringify(err.error.errormessage));
      this.errmessage = err.error.errormessage || err.error.message;
      this.toastr.error('Failure!', 'Registration not OK :(', {
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
      map((dd) => {
        const ticketSup = [];

        dd.forEach((ss) => {
          ticketSup.push(ss);
        });

        let a = ticketSup.filter((oneTicket) => {
          return new Date(oneTicket.start).getDate() === this.day_insert
            && (new Date(oneTicket.start).getMonth() + 1) === this.month_insert
            && new Date(oneTicket.start).getFullYear() === this.year_insert;
        });

        if (a.length === 0) {
          return 0;
        }

        a = a.map((oneTicket) => {
          return (oneTicket.orders.length != 0 ) ? oneTicket.orders.map((oneOrder) => {
            return oneOrder.price;
          }).reduce((total, onePrice) => total + onePrice) : 0;
        }).reduce((total, nPrices) => total + nPrices);

        return a;
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

  close_ticket() {
    console.log(this.emitReceipt())
    this.ticket.close_ticket(this.selTicket._id, this.emitReceipt()).toPromise().then(() => {
      return this.table.change_table({number: this.selTicket.table, state: states[0]}, undefined).toPromise();
    })
      .then()
      .catch((err) => console.log(err));
  }

  create_daily_report() {
    console.log(this.year_insert + "-" + ((this.month_insert > 9) ? this.month_insert : "0" + this.month_insert) + "-" + ((this.day_insert > 9) ? this.day_insert : "0" + this.day_insert) + 'T' + "00:00:00");
    const date = new Date(this.year_insert, this.month_insert - 1, this.day_insert, 0, 0, 0, 0);
    console.log(date);
    this.ticket.create_report({start: date, state: 'closed'})
      .then()
      .catch((err) => console.log(err));
  }

  getReport() {
    const date = new Date(this.year_delete, this.month_delete - 1, this.day_delete, 0, 0, 0, 0);
    this.ticket.get_reports({start: date, end: date}).toPromise().then((data) => {
      this.reportSelected = data[0];
    }).catch((err) => {
      console.log(err);
      //this.error = true;
    })
  }

  delete_daily_report() {
    const date = new Date(this.year_delete, this.month_delete - 1, this.day_delete, 0, 0, 0, 0);
    if(this.reportSelected)
      this.ticket.delete_report(this.reportSelected._id).toPromise()
      .then(() => this.reportSelected = null)
      .catch((err) => console.log(err));
  }

  changePasswordUser(selChangePwdUser : User, newPwd: string) {
    console.log(selChangePwdUser.username, newPwd);
    this.us.changePasswordUser(selChangePwdUser, newPwd).subscribe(() => {
      this.toastr.success('Success!', 'Changing OK', {
        timeOut: 3000
      });
    },(err) => {
      this.toastr.error('Failure!', 'Changing not OK :(', {
        timeOut: 3000
      });
    });
  }

  deleteUser(selDelUser : User) {
    this.us.deleteUser(selDelUser.username).subscribe(() => {
      this.toastr.success('Success!', 'Deletion OK', {
        timeOut: 3000
      });
    }, (err) => {
      this.toastr.error('Failure!', 'Deletion not OK :(', {
        timeOut: 3000
      });
    })
  }
}
