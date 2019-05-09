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
  }

  public get_orders() {
    this.order.get().subscribe(
      ( orders ) => {
        this.orders = orders;

      } , (err) => {

        // Try to renew the token
        this.us.renew().subscribe( () => {
          // Succeeded
          this.order.get();
        }, (err2) => {
          // Error again, we really need to logout
          this.us.logout();
        } );
      }
    );
  }

}
