import { Component, OnInit, Input } from '@angular/core';
import {ItemHttpService} from '../services/item-http.service';
import {UserHttpService} from '../services/user-http.service';
import {Item, types} from '../interfaces/Item';
import { TicketHttpService } from 'src/app/services/ticket-http.service';
import {SocketioService} from '../services/socketio.service';
import {Ticket} from '../interfaces/Ticket';
import { ToastrService } from 'ngx-toastr';
import { TicketOrder } from "../interfaces/TicketOrder";


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
  private disableSend = false;

  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService,
              private socketio: SocketioService, private toastr: ToastrService) 
  {
    for(var type in types) 
      this.items[type] = null; 
  }

  get_items() {
    this.item.get_Items().toPromise().then( (dd : Item[]) => {
      //console.log(types.length);
      for(var i = 0; i < types.length; i++) {
        //console.log(types[i]);
        this.items[types[i]] = dd.filter((item: Item) => {
          return item.type == types[i];
        }).sort((item1: Item, item2: Item) => (item1.name < item2.name) ? -1 : 1);
      }
      //console.log(this.items);
      this.error = false;
    }).catch((err) => {
      //console.log(err);
      this.error = true;
    });
  }

  get_tickets() {
    this.tickets = null;
    let filter = {state: "open"};
    if(this.us.get_role() != "desk")
      filter["waiter"] = this.us.get_nick();
    this.ticket.get_tickets(filter).toPromise().then((dd) => {
      dd.sort((ticket1: Ticket, ticket2 : Ticket) => (ticket1.table < ticket2.table) ? -1 : 1);
      this.tickets = dd;
      this.error = false;
    }).catch((err) => {
      //console.log(err);
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
    //console.log(this.selTicket);
    //console.log(ticketId, waiterUsername, orders);
    this.disableSend = true;
    const promises = [];
    orders.forEach((order) => {
      promises.push(this.ticket.addOrders(ticketId, waiterUsername, order.item, order.added, order.addedPrice).toPromise());
    });
    Promise.all(promises).then((data) => {
      //console.log('Evasione riuscita!')
      this.ordersSelected = [];
      this.error = false;
      this.disableSend = false;
      this.toastr.success("Orders sended!", 'Success!', {
        timeOut: 3000
      });
    }).catch((err) => {
      //console.log(err);
      this.error = true;
      this.disableSend = false;
      this.toastr.error("Error: " + err, "Failure!", {
        timeOut: 3000
      });
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
    //console.log(this.ordersSelected[i].added);
  }

  addPrice(i, added) {
    this.ordersSelected[i].addedPrice = added;
    //console.log(this.ordersSelected[i].addedPrice);
  }


}

