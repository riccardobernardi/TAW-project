import { Injectable } from '@angular/core';
import { UserHttpService } from './user-http.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Ticket } from './Ticket';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { TicketOrder } from './TicketOrder';
import { Item, types } from './Item';
import { Report } from './Report';
import { from } from 'rxjs';
import { createOptional } from '@angular/compiler/src/core';
import { roles } from './User';

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

  get_ticket(ticket_id) {
    return this.http.get<Ticket>(/*this.url*/this.endpoint + "/" + ticket_id);
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
          average_stay : 0,
          users_reports: {}
        };
        var sup_dependants = {}

        roles.forEach((role) => {
          if(role != "desk") {
            report.users_reports[role] = [];
            sup_dependants[role] = {};
          }
        });


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
          console.log(ticket.waiter);
          if(!sup_dependants["waiter"][ticket.waiter]) {
            console.log("New " + ticket.waiter)
            sup_dependants["waiter"][ticket.waiter] = {};
            sup_dependants["waiter"][ticket.waiter].customers_served = 0;
            sup_dependants["waiter"][ticket.waiter].orders_served = 0;
          }
          sup_dependants["waiter"][ticket.waiter].customers_served += ticket.people_number
          sup_dependants["waiter"][ticket.waiter].orders_served += ticket.orders.length
          console.log(sup_dependants["waiter"][ticket.waiter])
          var role;
          ticket.orders.forEach((order : TicketOrder) => {
            console.log(order.username_executer);
            role = (order.type_item == types[0]) ? "bartender" : "cook";
            if(!sup_dependants[role][order.username_executer]) {
              sup_dependants[role][order.username_executer] = {};
              sup_dependants[role][order.username_executer].items_served = 0;
            }
            sup_dependants[role][order.username_executer].items_served++;  
          });
        });

        console.log(sup_dependants);
        for(let waiter in sup_dependants["waiter"]) {
          report.users_reports["waiter"].push({
            username: waiter,
            customers_served: sup_dependants["waiter"][waiter].customers_served,
            orders_served: sup_dependants["waiter"][waiter].orders_served
          })
        }

        for(let cook in sup_dependants["cook"]) {
          report.users_reports["cook"].push({
            username: cook,
            customers_server: sup_dependants["cook"][cook].items_served,
          });
        }

        for(let bartender in sup_dependants["bartender"]) {
          report.users_reports["bartender"].push({
            username: bartender,
            customers_server: sup_dependants["bartender"][bartender].items_served,
          });
        }

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

  delete_report(report_id : string) {
    return this.http.delete<Report>(/*'http://localhost:8080' + */"reports" + "/" + report_id);
  }

}
