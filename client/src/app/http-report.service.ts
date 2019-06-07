import { Injectable } from '@angular/core';
import { Report } from './Report';
import { Ticket } from './Ticket';
import { TicketOrder } from './TicketOrder';
import { types } from './Item';
import { roles } from './User';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TicketHttpService } from "./ticket-http.service"

@Injectable({
  providedIn: 'root'
})
export class HttpReportService {

  constructor(private http: HttpClient, private ticket: TicketHttpService ) { }

  private create_options( params = {} ) {
    return  {
      params : new HttpParams( {fromObject: params} )
    };
  }

  create_report(filters) {
    const today = new Date();
    return this.ticket.get_tickets(filters).toPromise().then((data: Ticket[]) => {
      if(data.length != 0) {
      //console.log(data);
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

        //console.log(report);

        data.forEach((ticket) => {
          report.total += ticket.total;
          report.total_customers += ticket.people_number;
          ticket.orders.forEach((order: TicketOrder) => {
            report.total_orders[order.type_item] += 1;
          });
          ticketCount++;
          report.average_stay += Math.floor((new Date(ticket.end).getTime() - new Date(ticket.start).getTime()) / 60000);
          //console.log(ticket.waiter);
          if(!sup_dependants["waiter"][ticket.waiter]) {
            //console.log("New " + ticket.waiter)
            sup_dependants["waiter"][ticket.waiter] = {};
            sup_dependants["waiter"][ticket.waiter].customers_served = 0;
            sup_dependants["waiter"][ticket.waiter].orders_served = 0;
          }
          sup_dependants["waiter"][ticket.waiter].customers_served += ticket.people_number
          sup_dependants["waiter"][ticket.waiter].orders_served += ticket.orders.length
          //console.log(sup_dependants["waiter"][ticket.waiter])
          var role;
          ticket.orders.forEach((order : TicketOrder) => {
            //console.log(order.username_executer);
            role = (order.type_item == types[0]) ? "bartender" : "cook";
            if(!sup_dependants[role][order.username_executer]) {
              sup_dependants[role][order.username_executer] = {};
              sup_dependants[role][order.username_executer].items_served = 0;
            }
            sup_dependants[role][order.username_executer].items_served++;  
          });
        });

        //console.log(sup_dependants);
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
        //console.log(report);
        return this.http.post("reports", report, this.create_options()).toPromise();
      } else {
        throw new Error("Impossibile to generate the report: zero tickets");
      };
    })
  }

  get_reports(filter) {
    return this.http.get<Report[]>("reports", this.create_options(filter));
  }

  delete_report(report_id : string) {
    return this.http.delete<Report>("reports" + "/" + report_id);
  }

}
