import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserHttpService} from '../user-http.service';
import {OrderService} from '../order.service';
import {Order} from '../Order';
import {mockorders} from '../mock-orders';
import {OrderHttpService} from '../order-http.service';
import * as io from 'socket.io-client';
import {TicketHttpService} from '../ticket-http.service';
import {Ticket} from '../Ticket';
import {SocketioService} from '../socketio.service';
import {HttpClient} from '@angular/common/http';
import {TicketOrder} from '../TicketOrder';

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
  selDelUser: any;
  selTable: any;
  users = [];
  selChangePwdUser: any;
  private socket;
  private tickets: Ticket[] = [];

  constructor(private sio: SocketioService, private us: UserHttpService, private router: Router, private http: HttpClient, private socketio: SocketioService, private ticket: TicketHttpService  ) {
    // tslint:disable-next-line:variable-name
    const ticket_sup = this.tickets;
    this.dd = () => {
      ticket.get_tickets({state: 'open'}).subscribe( (dd) => {
        ticket_sup.splice(0, ticket_sup.length);
        dd.forEach( (ss) => {
          ticket_sup.push(ss);
          ss.orders.sort((a: TicketOrder, b: TicketOrder) => {
            return a.price - b.price;
          });
        });
      });
    };
  }

  ngOnInit() {
    if (this.us.get_token() == undefined || this.us.get_token() == '') {
      this.us.logout();
    } else {
      console.log('your token is: [' + this.us.get_token() + ']');
    }

    console.log(this.users);

    this.dd();
    this.socket = io('http://localhost:8080');
    // this.socket.connect()
    this.socket.on('paydesks', this.dd );
  }

  dd() {
    this.us.get_users().subscribe((data) => {
      const a: any = data;
      a.forEach( (d) => this.users.push(d) );
    });
    console.log('ricarica');
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
}
