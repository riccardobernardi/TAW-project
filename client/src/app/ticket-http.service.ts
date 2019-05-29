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
import { createOptional } from '@angular/compiler/src/core';

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

  open_ticket(waiter: string, table: number, people_number: number) {
    return this.http.post<Ticket>(this.url, {waiter, table, start: Date(), people_number: people_number}, this.create_options());
  }

  close_ticket(ticketId: string, total: number) {
    console.log(total);
    return this.http.patch<Ticket>(this.url + '/' + ticketId, {state: 'closed', end: Date(), total: total}, this.create_options());
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
      username_cook: undefined,
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
    return this.get_tickets(filters).toPromise().then((data: Ticket[]) => {
      console.log(data);
      var report : Report = {
        date : today,
        total : 0,
        total_customers : 0,
        total_orders : {dish: 0, beverage: 0},
        average_stay : 0
      };

      var ticket_count = 0;
      
      console.log(report);


      data.forEach((ticket) => {
        report.total += ticket.total;
        report.total_customers += ticket.people_number;
        ticket.orders.forEach((order : TicketOrder) => {
          report.total_orders[order.type_item] += 1;
        });
        ticket_count++;
        report.average_stay += Math.floor((new Date(ticket.end).getTime() - new Date(ticket.start).getTime())/60000)
        console.log(report);
      });

      report.average_stay = Math.floor(report.average_stay / ticket_count);
      console.log(report);
      return this.http.post<Report>("http://localhost:8080" + "/" + "report", report, this.create_options()).toPromise(); 
    }).catch((err) => err);
  }

  get_reports(filter) {
    return this.http.get<Report[]>("http://localhost:8080" + "/" + "report", this.create_options(filter));
  }

}
