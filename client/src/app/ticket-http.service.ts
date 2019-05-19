import { Injectable } from '@angular/core';
import { UserHttpService } from "./user-http.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ticket } from './Ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketHttpService {

  public url = 'http://localhost:8080' + "/tickets";

  constructor(private us: UserHttpService, private http: HttpClient) { }

  private create_options( params = {} ) {
    return  {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
    };
  }

  open_ticket(waiter : string, table : number) {
    return this.http.post<Ticket>(this.url, {waiter: waiter, table: table, start: Date()}, this.create_options())
  }
}
