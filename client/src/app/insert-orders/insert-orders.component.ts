import { Component, OnInit, Input } from '@angular/core';
import {ItemHttpService} from '../item-http.service';
import {UserHttpService} from '../user-http.service';
import {Item} from '../Item';
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

  private tickets = [];
  private items: Item[] = [];
  private selTicket: Ticket;
  private ordersSelected = [];
  private counter = 0;
  private selMenuEntry: Item;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService) {}

  get_items() {
    this.items.splice(0, this.items.length);
    console.log(this.items);
    this.item.get_Items().subscribe( (dd) => {
      dd.forEach( (ss) => {
        this.items.push(ss);
      });
    });
  }

  get_tickets() {
    this.tickets.splice(0, this.tickets.length);
      this.ticket.get_tickets({waiter: this.us.get_nick(), state: 'open'}).subscribe((dd) => {
        dd.forEach( (ss) => {
          this.tickets.push(ss);
        });
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
    }).catch((err) => {
      console.log(err);
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

