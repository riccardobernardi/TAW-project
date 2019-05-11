import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.css']
})
export class CookComponent implements OnInit {
  private orders = [];
  // private socket = io('http://localhost:4200');

  constructor(private us: UserService, private router: Router, private order: OrderService  ) { }

  ngOnInit() {
    if (this.us.get_token() === undefined || this.us.get_token() === '') {
      this.logout();
    }
    this.get_orders();
    // this.socket.on('broadcast', this.order.get);
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

  public get_orders() {
    console.log('received an emit');
    this.orders = this.order.get();
    /*const socket = io.connect('http://localhost:4200');
    socket.on('broadcast', this.order.get);*/
    console.log('event received');
  }

}
