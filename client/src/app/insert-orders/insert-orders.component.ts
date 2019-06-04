import { Component, OnInit, Input } from '@angular/core';
import {ItemHttpService} from '../item-http.service';
import {UserHttpService} from '../user-http.service';
import {Item, types} from '../Item';
import { TicketHttpService } from 'src/app/ticket-http.service';
import {SocketioService} from '../socketio.service';
import {Ticket} from '../Ticket';
import { TicketOrder } from "../TicketOrder";


@Component({
  selector: 'app-insert-orders',
  templateUrl: './insert-orders.component.html',
  styleUrls: ['./insert-orders.component.css']
})
export class InsertOrdersComponent implements OnInit {

  private items = {}
  private tickets = null;
  private selTicket: Ticket;
  private ordersSelected = [];
  private counter = 0;
  private selMenuEntry: Item;
  private error = false;
  private types = types;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService) 
  {
    for(var type in types) 
      this.items[type] = null; 
  }

  get_items() {
    this.item.get_Items().toPromise().then( (dd : Item[]) => {
      console.log(types.length);
      for(var i = 0; i < types.length; i++) {
        console.log(types[i]);
        this.items[types[i]] = dd.filter((item: Item) => {
          return item.type == types[i];
        }).sort((item1: Item, item2: Item) => (item1.name < item2.name) ? -1 : 1);
      }
      console.log(this.items);
      this.error = false;
    }).catch((err) => {
      console.log(err);
      this.error = true;
    });
  }

  get_tickets() {
    //this.tickets.splice(0, this.tickets.length);
    this.tickets = null;
    let filter = {state: "open"};
    if(this.us.get_role() != "desk")
      filter["waiter"] = this.us.get_nick();
    this.ticket.get_tickets(filter).toPromise().then((dd) => {
      /*dd.forEach( (ss) => {
        this.tickets.push(ss);
      });*/
      dd.sort((ticket1: Ticket, ticket2 : Ticket) => (ticket1.table < ticket2.table) ? -1 : 1);
      this.tickets = dd;
      this.error = false;
    }).catch((err) => {
      console.log(err);
      this.error = true;
    });
  }

  ngOnInit() {
    this.get_tickets();
    this.get_items();
    this.socketio.get().on('waiters', () => {
      this.get_items();
      this.get_tickets();
    });
  }

  insertItem(item: Item, quantity: number) {
    for (let i = 0; i < quantity; i++) {
      this.ordersSelected.push({
        item: item,
        added: [],
        addedPrice: 0
      });
    }
  }

  deleteItemFromSelected(i: number) {
    this.ordersSelected.splice(i, 1);
  }

  sendOrders(ticketId, waiterUsername, orders) {
    console.log(this.selTicket);
    console.log(ticketId, waiterUsername, orders);
    const promises = [];
    orders.forEach((order) => {
      promises.push(this.ticket.addOrders(ticketId, waiterUsername, order.item, order.added, order.addedPrice).toPromise());
    });
    Promise.all(promises).then((data) => {
      console.log('Evasione riuscita!')
      this.ordersSelected = [];
      this.error = false;
    }).catch((err) => {
      console.log(err);
      this.error = true;
    });
  }

  add() {
    this.counter++;
  }

  sub() {
    this.counter--;
  }

  attachAdded(i, text) {
    this.ordersSelected[i].added = text.split(",");
    console.log(this.ordersSelected[i].added);
  }

  addPrice(i, added) {
    this.ordersSelected[i].addedPrice = added;
    console.log(this.ordersSelected[i].addedPrice);
  }


}

