import { Component, OnInit, Input } from '@angular/core';
import {ItemHttpService} from '../item-http.service';
import {UserHttpService} from '../user-http.service';
import {Item} from '../Item';
import { TicketHttpService } from 'src/app/ticket-http.service';
import { Ticket } from 'src/app/Ticket';
import {TableHttpService} from '../table-http.service';
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
    }).then((tickets: Ticket[]) => {
        tickets.forEach((ticket: Ticket) => {
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

    console.log(this.tickets);
    this.item.get_Items().subscribe( (dd) => {
      dd.forEach( (ss) => {
        this.items.push(ss);
      });
    });

    this.ticket.get_tickets({waiter: this.us.get_nick(), state: 'open'}).subscribe((dd) => {
      dd.forEach( (ss) => {
        this.tickets.push(ss);
      });
    });
    /*this.tt.get_tables().subscribe((dd) => {
      dd.forEach( (ss) => {
        this.tables.push(ss);
        console.log(ss);
      });
    });*/
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
    let promises = [];
    items.forEach((item: Item) => {
      promises.push(this.ticket.addOrders(ticketId, waiterUsername, item).toPromise());
    });
    Promise.all(promises).then((data) => {
      console.log('Evasione riuscita!')
      this.itemsSelected = []
    }).catch((err) => {
      console.log(err);
    });
  }
}

