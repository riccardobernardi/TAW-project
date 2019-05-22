import { Component, OnInit, Input } from '@angular/core';
import {ItemHttpService} from '../item-http.service';
import {UserHttpService} from '../user-http.service';
import {Item} from '../Item';
import { TicketHttpService } from 'src/app/ticket-http.service';
import { Ticket } from 'src/app/Ticket';
import { Observable } from 'rxjs/Observable';
import { WaiterSocketioService } from '../waiter-socketio.service';


@Component({
  selector: 'app-insert-orders',
  templateUrl: './insert-orders.component.html',
  styleUrls: ['./insert-orders.component.css']
})
export class InsertOrdersComponent implements OnInit {

  private tickets = [];
  private items: Item[] = [];
  private selTicket = undefined;
  private itemsSelected: Item[] = [];
  private socketObserver : Observable<any>; 


  constructor(private us: UserHttpService, private item: ItemHttpService, private ticket: TicketHttpService, private sio : WaiterSocketioService) { }

  ngOnInit() {
    this.socketObserver = this.sio.getObserver();
    this.item.get_Items().toPromise().then((data : Item[] ) => {
      this.items = data;
      console.log(this.items);
      return this.ticket.get_tickets({waiter: this.us.get_nick(), state: "open"}).toPromise()
    }).then((tickets : Ticket[]) => {
        tickets.forEach((ticket : Ticket) => {
          console.log(ticket);
          this.tickets.push({
            id: ticket._id,
            table: ticket.table
          });
        });
        this.socketObserver.subscribe(() => {
          this.ticket.get_tickets({waiter: this.us.get_nick(), state: "open"}).toPromise().then((ticket: Ticket[]) => {
            tickets.forEach((ticket : Ticket) => {
              console.log(ticket);
              this.tickets.push({
                id: ticket._id,
                table: ticket.table
              });
            });
          });
        });
    }).catch((err) => {
      console.log(err);
    });
  }

  insertItem(item : Item, quantity : number) {
    for(let i = 0; i < quantity; i++)
      this.itemsSelected.push(item);
  }

  deleteItemFromSelected(i: number) {
    this.itemsSelected.splice(i, 1);
  }

  sendOrders(ticket_id, waiter_username, items) {
    console.log(this.selTicket);
    console.log(ticket_id, waiter_username, items);
    let promises = []
    items.forEach((item : Item) => {
      promises.push(this.ticket.addOrders(ticket_id, waiter_username, item).toPromise());
    });
    Promise.all(promises).then((data) => {
      console.log("Evasione riuscita!")
      this.itemsSelected = []
    }).catch((err) => {
      console.log(err);
    });
  }
}

