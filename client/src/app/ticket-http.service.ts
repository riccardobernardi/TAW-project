import { Injectable } from '@angular/core';
import { UserHttpService } from './user-http.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Ticket } from './Ticket';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { TicketOrder } from './TicketOrder';
import { Item } from './Item';
import { Report } from './Report';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketHttpService {

  public url = 'http://localhost:8080' + '/tickets';

  constructor(private us: UserHttpService, private http: HttpClient) { }

  private create_options( params = {} ) {
    return  {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
      params : new HttpParams( {fromObject: params} )
    };
  }

  open_ticket(waiter: string, table: number) {
    return this.http.post<Ticket>(this.url, {waiter, table, start: Date()}, this.create_options());
  }

  close_ticket(ticketId: string) {
    return this.http.patch<Ticket>(this.url + '/' + ticketId, {state: 'closed', end: Date()}, this.create_options());
  }

  get_tickets(filters) {
    return this.http.get<Ticket[]>(this.url, this.create_options(filters));
  }

  addOrders(ticketId, usernameWaiter, item, added, addedPrice) {
    console.log(addedPrice);
    let order: TicketOrder;
    order = {
      name_item : item.name,
      added,
      price: item.price + parseInt(addedPrice),
      state: null,
      username_waiter: usernameWaiter,
      _id: null,
      type_item: item.type
    }
    console.log(ticketId, order);
    return this.http.post(this.url + '/' + ticketId + '/' + 'orders', order, this.create_options());
  }

  changeOrderState(ticketId, orderId, state) {
    console.log(ticketId, orderId);
    return this.http.patch(this.url + '/' + ticketId + '/' + 'orders' + '/' + orderId, {state}, this.create_options());
  }

  create_report(filters) {
    let today = new Date();
    return from(this.get_tickets(filters).toPromise().then((data: Ticket[]) => {
      var report : Report;
      report.date = today;

      var ticket_count = 0;
      report.total = 0
      report.total_customers = 0;
      report.total_orders = {dish: 0, beverage: 0};
      report.average_stay = 0;

      data.forEach((ticket) => {
        report.total += ticket.total;
        report.total_customers += ticket.people_number;
        ticket.orders.forEach((order : TicketOrder) => {
          report.total_orders[order.type_item] += 1;
        });
        ticket_count++;
        report.average_stay += (ticket.end.getTime() - ticket.start.getTime())/60000
      });

      report.average_stay /= ticket_count;
      return from(this.http.post<Report>(this.url + "/" + "reports", report)); 
    }).catch((err) => err));
  }

}
