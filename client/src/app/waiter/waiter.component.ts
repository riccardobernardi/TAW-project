import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';
import {Order} from '../Order';

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

  @Output() posted = new EventEmitter<Order>();

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
    const o = {nick: this.us.get_nick(), selTable: this.selTable, selMenuEntry: this.selMenuEntry,
      ready: false, id: this.order.get_id(), in_progress: false, timestamp: Date.now()};
    this.order.send(o);
    this.posted.emit(o);
  }

  delete() {
    this.order.delete(this.deleteOrder);
  }

  get_data() {
    let m = this.order.get(this.selTable).subscribe((data) => data);
    console.log(m)
    return this.order.get(this.selTable).subscribe((data) => data);
  }
}
