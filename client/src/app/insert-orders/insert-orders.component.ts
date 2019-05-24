import { Component, OnInit, Input } from '@angular/core';
import {ItemHttpService} from '../item-http.service';
import {UserHttpService} from '../user-http.service';
import {Item} from '../Item';
import { TicketHttpService } from 'src/app/ticket-http.service';
import {SocketioService} from '../socketio.service';
import {Ticket} from '../Ticket';


@Component({
  selector: 'app-insert-orders',
  templateUrl: './insert-orders.component.html',
  styleUrls: ['./insert-orders.component.css']
})
export class InsertOrdersComponent implements OnInit {

  private tickets = [];
  private items: Item[] = [];
  private selTicket: Ticket;
  private itemsSelected: Item[] = [];
  private counter = 0;
  private selMenuEntry: Item;
  private dd;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService) {
    const ticketsSup = this.tickets;
    const itemsSup = this.items;
    this.dd = () => {
      itemsSup.splice(0, itemsSup.length);
      console.log('received an emit');
      console.log(itemsSup);
      item.get_Items().subscribe( (dd) => {
        dd.forEach( (ss) => {
          itemsSup.push(ss);
        });
      });

      ticketsSup.splice(0, itemsSup.length);
      ticket.get_tickets({waiter: us.get_nick(), state: 'open'}).subscribe((dd) => {
        dd.forEach( (ss) => {
          ticketsSup.push(ss);
        });
      });
    };
  }

  ngOnInit() {
    this.dd();
    this.socketio.get().on('waiters', this.dd);
  }

  insertItem(item: Item, quantity: number) {
    for (let i = 0; i < quantity; i++) {
      this.itemsSelected.push(item);
    }
  }

  deleteItemFromSelected(i: number) {
    this.itemsSelected.splice(i, 1);
  }

  sendOrders(ticketId, waiterUsername, items) {
    console.log(this.selTicket);
    console.log(ticketId, waiterUsername, items);
    const promises = [];
    items.forEach((item: Item) => {
      promises.push(this.ticket.addOrders(ticketId, waiterUsername, item).toPromise());
    });
    Promise.all(promises).then((data) => {
      console.log('Evasione riuscita!')
      this.itemsSelected = [];
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
}

