import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.css']
})
export class WaiterComponent implements OnInit {

  private errmessage = undefined;
  constructor( private us: UserService, private router: Router, private order: OrderService  ) { }
  private tables = [1, 2];
  private menu = ['pasta', 'riso'];
  private selTable = undefined;
  private selMenuEntry = undefined;
  private deleteOrder = undefined;

  ngOnInit() {
    if (this.us.get_token() === undefined || this.us.get_token() === '') {
      this.logout();
    }
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

  send() {
    this.order.send(this.us.get_nick(), this.selTable, this.selMenuEntry);
  }

  delete() {
    this.order.delete(this.deleteOrder);
  }
}
