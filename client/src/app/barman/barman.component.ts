import { Component, OnInit } from '@angular/core';
import {Order} from '../Order';
import {mockorders} from '../mock-orders';
import {SocketioService} from '../socketio.service';
import {Router} from '@angular/router';
import {OrderService} from '../order.service';
import {UserHttpService} from '../user-http.service';

@Component({
  selector: 'app-barman',
  templateUrl: './barman.component.html',
  styleUrls: ['./barman.component.css']
})
export class BarmanComponent implements OnInit {

  constructor(private sio: SocketioService, private us: UserHttpService, private router: Router, private order: OrderService  ) { }

  private orders: Order[] = mockorders.filter((data) => (data.type === 'beverage'));

  ngOnInit() {
    if (this.us.get_token() === undefined || this.us.get_token() === '') {
      this.us.logout();
    }
    // this.get_orders();

    /*this.sio.connect().subscribe( (m) => {
      this.get_orders();
    });*/
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

  get_orders() {
    console.log('received an emit');
    /*this.orders = this.order.get();*/
    /*console.log(this.orders)*/
    console.log('event received');

    this.order.get().subscribe(
      ( messages ) => {
        this.orders = messages;

      } , (err) => {

        // Try to renew the token
        this.us.renew().subscribe( () => {
          // Succeeded
          this.get_orders();
        }, (err2) => {
          // Error again, we really need to logout
          this.logout();
        } );
      }
    );
  }

}
