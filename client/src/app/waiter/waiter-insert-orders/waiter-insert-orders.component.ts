import { Component, OnInit, Input } from '@angular/core';
import {ItemHttpService} from '../../item-http.service';
import {UserHttpService} from '../../user-http.service';
import {Item} from '../../Item';


@Component({
  selector: 'app-waiter-insert-orders',
  templateUrl: './waiter-insert-orders.component.html',
  styleUrls: ['./waiter-insert-orders.component.css']
})
export class WaiterInsertOrdersComponent implements OnInit {

  private tables = [1,2]
  private items : Item[] = [];
  //@Input() tables: Table[] = [];
  private selTable = undefined;
  private selMenuEntry = undefined;
  private deleteOrder = undefined;

  constructor(private us: UserHttpService, private item: ItemHttpService) { }

  ngOnInit() {
    this.item.get_Items().subscribe((data : Item[] ) => {
      this.items = data;
      console.log(this.items);
      /*return this.ticket.get_Tickets({
        waiter: this.us.get_username(),
        state: "open" 
      })
    }).then((data : Ticket[]) => {
      this.tickets = data;
      tickets.forEach(element => {
        this.tables.push(element.table);
      });*/
    }).catch((err) => {
      console.log(err);
    });
  }

}
