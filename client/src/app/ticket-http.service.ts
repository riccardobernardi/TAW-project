import { Injectable } from '@angular/core';
import { UserHttpService } from './user-http.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Ticket } from './Ticket';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { TicketOrder } from './TicketOrder';
import { Item } from './Item';

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

  get_tickets(filters) {
    return this.http.get<Ticket[]>(this.url, this.create_options(filters))/*.pipe(
      map((data: Ticket[]) => {
        let tables : number[];
        data.forEach((elem : Ticket) => tables.push(elem.table))
        return of(tables);
      })
    )*/;
  }

  addOrders(ticket_id, username_waiter, item) {
    let orders : TicketOrder;
    orders = {
      name_item : item.name,
      added: [],
      price: item.price,
      state: null,
      username_waiter,
      _id: null
    }
    console.log(ticket_id, orders);
    return this.http.post(this.url + '/' + ticket_id + '/' + 'orders', orders, this.create_options());
  }

  changeOrderState(ticket_id, order_id, state) {
    return this.http.patch(this.url + '/' + ticket_id + '/' + order_id, {state}, this.create_options());
  }
}