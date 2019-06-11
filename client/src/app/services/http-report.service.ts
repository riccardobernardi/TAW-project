import { Injectable } from '@angular/core';
import { Report } from '../interfaces/Report';
import { Ticket } from '../interfaces/Ticket';
import { TicketOrder } from '../interfaces/TicketOrder';
import { types } from '../interfaces/Item';
import { roles } from '../interfaces/User';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TicketHttpService } from './ticket-http.service';

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
    today.setHours(0, 0, 0, 0);
    return this.ticket.get_tickets(filters).toPromise().then((data: Ticket[]) => {
      if (data.length != 0) {
      // console.log(data);

        // initial report
        const report: Report = {
          date : today,
          total : 0,
          total_customers : 0,
          total_orders : {dish: 0, beverage: 0},
          average_stay : 0,
          users_reports: {}
        };
        // support variable for users_reports
        const sup_dependants = {};

        // for each role, prepare the field in the support object for users_reports
        roles.forEach((role) => {
          if (role != 'desk') {
            report.users_reports[role] = [];
            sup_dependants[role] = {};
            
          }
        });

        let ticketCount = 0;

        // console.log(report);

        // work for every ticket
        data.forEach((ticket) => {
          report.total += ticket.total; // increment total in the range of dates
          report.total_customers += ticket.people_number; // increment people_number in the range of dates
          ticket.orders.forEach((order: TicketOrder) => {
            report.total_orders[order.type_item] += 1; // increment total_orders in the range of dates
          });
          ticketCount++; // ticketCounter for average_stay calc
          report.average_stay += Math.floor((new Date(ticket.end).getTime() - new Date(ticket.start).getTime()) / 60000); // calc minutes for average_stay
          // console.log(ticket.waiter);
          if (ticket.waiter) {
            if (!sup_dependants["waiter"][ticket.waiter]) { // if the waiter doesn't exist in the support object, insert
              // console.log("New " + ticket.waiter)
              sup_dependants["waiter"][ticket.waiter] = {};
              sup_dependants["waiter"][ticket.waiter].customers_served = 0;
              sup_dependants["waiter"][ticket.waiter].orders_served = 0;
            }
            // increment stats for waiter based on ticket numbers
            sup_dependants["waiter"][ticket.waiter].customers_served += ticket.people_number;
            sup_dependants["waiter"][ticket.waiter].orders_served += ticket.orders.length;
            // console.log(sup_dependants["waiter"][ticket.waiter])
          }
          let role;

          // create or increments stats for bartenders and cookers based of orders fields
          ticket.orders.forEach((order: TicketOrder) => {
            // console.log(order.username_executer);
            role = (order.type_item == types[0]) ? 'cook' : 'bartender';
            if (order.username_executer) {
              if (!sup_dependants[role][order.username_executer]) {
                sup_dependants[role][order.username_executer] = {};
                sup_dependants[role][order.username_executer].items_served = 0;
              }
              sup_dependants[role][order.username_executer].items_served++;
            }
          });
        });

        // console.log(sup_dependants);
        // create mini-arrays for users_reports format
        for (const waiter in sup_dependants["waiter"]) {
          report.users_reports["waiter"].push({
            username: waiter,
            customers_served: sup_dependants["waiter"][waiter].customers_served,
            orders_served: sup_dependants["waiter"][waiter].orders_served
          });
        }

        // create mini-arrays for users_reports format
        for (const cook in sup_dependants["cook"]) {
          report.users_reports["cook"].push({
            username: cook,
            items_served: sup_dependants["cook"][cook].items_served,
          });
        }

        // create mini-arrays for users_reports format
        for (const bartender in sup_dependants["bartender"]) {
          report.users_reports["bartender"].push({
            username: bartender,
            items_served: sup_dependants["bartender"][bartender].items_served,
          });
        }

        report.average_stay = Math.floor(report.average_stay / ticketCount);
        console.log(report);
        return this.http.post('reports', report, this.create_options()).toPromise();
      } else {
        throw new Error('Impossibile to generate the report: zero tickets');
      }
    });
  }

  get_reports(filter) {
    return this.http.get<Report[]>('reports', this.create_options(filter));
  }

  delete_report(report_id: string) {
    return this.http.delete<Report>('reports' + '/' + report_id);
  }

}
