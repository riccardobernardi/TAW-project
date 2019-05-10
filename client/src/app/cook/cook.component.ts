import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.css']
})
export class CookComponent implements OnInit {
  private orders: any;

  constructor(private us: UserService, private router: Router, private order: OrderService  ) { }

  ngOnInit() {
    this.get_orders();
  }

  public get_orders() {
    console.log('received an emit');
    this.order.get();
    const socket = io('http://localhost:4200');
    socket.on('broadcast', this.order.get);
    console.log('event received');
  }

}
