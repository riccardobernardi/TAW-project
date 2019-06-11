import { Injectable } from '@angular/core';
import { UserHttpService } from './user-http.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Ticket } from '../interfaces/Ticket';
import { TicketOrder } from '../interfaces/TicketOrder';

@Injectable({
  providedIn: 'root'
})
export class TicketHttpService {

  public endpoint = 'tickets';

  constructor(private us: UserHttpService, private http: HttpClient) { }

  private create_options( params = {} ) {
    return  {
      params : new HttpParams( {fromObject: params} )
    };
  }

  open_ticket(waiter: string, table: number, people_number: number) {
    return this.http.post<Ticket>(this.endpoint, {waiter, table, start: Date(), people_number}, this.create_options());
  }

  close_ticket(ticketId: string, total: number) {
    // console.log(total);
    return this.http.patch<Ticket>(this.endpoint + '/' + ticketId, {state: 'closed', end: Date(), total}, this.create_options());
  }

  get_tickets(filters) {
    return this.http.get<Ticket[]>(this.endpoint, this.create_options(filters));
  }

  get_ticket(ticket_id) {
    return this.http.get<Ticket>(this.endpoint + '/' + ticket_id);
  }

  addOrders(ticketId, usernameWaiter, item, added, addedPrice) {
    // console.log(addedPrice);
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
    // console.log(ticketId, order);
    return this.http.post(this.endpoint + '/' + ticketId + '/' + 'orders', order, this.create_options());
  }

  changeOrderState(ticketId, orderId, state, username_executer) {
    // console.log(ticketId, orderId);
    return this.http.patch(this.endpoint + '/' + ticketId + '/' + 'orders' + '/' + orderId, {state, username_executer}, this.create_options());
  }

}
