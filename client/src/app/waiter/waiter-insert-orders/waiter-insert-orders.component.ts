import { Component, OnInit } from '@angular/core';
import {OrderHttpService} from '../../order-http.service';
import {ItemHttpService} from '../../item-http.service'
import {Item} from '../../Item';


@Component({
  selector: 'app-waiter-insert-orders',
  templateUrl: './waiter-insert-orders.component.html',
  styleUrls: ['./waiter-insert-orders.component.css']
})
export class WaiterInsertOrdersComponent implements OnInit {

  private tables = [1, 2];
  private items : Item[] = [];
  private selTable = undefined;
  private selMenuEntry = undefined;
  private deleteOrder = undefined;

  constructor(private item: ItemHttpService) { }

  ngOnInit() {
    this.item.get_Items().subscribe((data : Item[] ) => {
      this.items = data;
      console.log(this.items);
    });
  }

}
