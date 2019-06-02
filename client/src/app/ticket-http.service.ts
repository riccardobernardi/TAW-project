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

  public endpoint = 'tickets';

  constructor(private us: UserHttpService, private http: HttpClient) { }

  private create_options( params = {} ) {
    return  {
      /*headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),*/
      params : new HttpParams( {fromObject: params} )
    };
  }

  open_ticket(waiter: string, table: number, people_number: number) {
    return this.http.post<Ticket>(/*this.url*/ this.endpoint, {waiter, table, start: Date(), people_number}, this.create_options());
  }

  close_ticket(ticketId: string, total: number) {
    console.log(total);
    return this.http.patch<Ticket>(/*this.url + */this.endpoint + '/' + ticketId, {state: 'closed', end: Date(), total: total}, this.create_options());
  }

  get_tickets(filters) {
    return this.http.get<Ticket[]>(/*this.url*/this.endpoint, this.create_options(filters));
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
      username_executer: undefined,
      _id: null,
      type_item: item.type,
      required_time: item.required_time
    };
    console.log(ticketId, order);
    return this.http.post(/*this.url +*/ this.endpoint + "/" + ticketId + '/' + 'orders', order, this.create_options());
  }

  changeOrderState(ticketId, orderId, state, name) {
    console.log(ticketId, orderId);
    return this.http.patch(/*this.url + */this.endpoint + '/' + ticketId + '/' + 'orders' + '/' + orderId, {state, username_executer: name}, this.create_options());
  }

  create_report(filters) {
    const today = new Date();
    return this.get_tickets(filters).toPromise().then((data: Ticket[]) => {
      if(data.length != 0) {
      console.log(data);
        const report: Report = {
          date : today,
          total : 0,
          total_customers : 0,
          total_orders : {dish: 0, beverage: 0},
          average_stay : 0
        };

        let ticketCount = 0;

        console.log(report);


        data.forEach((ticket) => {
          report.total += ticket.total;
          report.total_customers += ticket.people_number;
          ticket.orders.forEach((order: TicketOrder) => {
            report.total_orders[order.type_item] += 1;
          });
          ticketCount++;
          report.average_stay += Math.floor((new Date(ticket.end).getTime() - new Date(ticket.start).getTime()) / 60000);
          console.log(report);
        });

        report.average_stay = Math.floor(report.average_stay / ticketCount);
        console.log(report);
        return this.http.post(/*'http://localhost:8080' +*/ "reports", report, this.create_options()).toPromise();
      } else {
        throw new Error("Impossibile to generate the report: zero tickets");
      };
    })
  }

  get_reports(filter) {
    return this.http.get<Report[]>(/*'http://localhost:8080' + */"reports", this.create_options(filter));
  }

}
