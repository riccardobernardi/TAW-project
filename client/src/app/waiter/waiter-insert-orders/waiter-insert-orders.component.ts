import { Component, OnInit } from '@angular/core';
import {OrderHttpService} from '../../order-http.service';
import {ItemHttpService} from '../../item-http.service'
import {Item} from '../../Item';
import {UserHttpService} from '../../user-http.service';


@Component({
  selector: 'app-waiter-insert-orders',
  templateUrl: './waiter-insert-orders.component.html',
  styleUrls: ['./waiter-insert-orders.component.css']
})
export class WaiterInsertOrdersComponent implements OnInit {

  private tables = [1, 2];
  private items: Item[] = [];
  private selTable = undefined;
  private selMenuEntry = undefined;
  private deleteOrder = undefined;

  constructor(private us: UserHttpService, private item: ItemHttpService) { }

  ngOnInit() {
    if (this.us.get_token() == undefined || this.us.get_token() == '') {
      this.us.logout();
    }
    this.item.get_Items().subscribe((data: Item[] ) => {
      this.items = data;
      console.log(this.items);
    });
  }

  send() {
    console.log('stai inviando un ordine');
  }

  a() {
    console.log('stai cambiando option');
  }
}
