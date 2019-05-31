import { Injectable } from '@angular/core';
import { UserHttpService } from './user-http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Table } from './Table';

@Injectable({
  providedIn: 'root'
})
export class TableHttpService {

  public endpoint = 'tables';

  constructor(private us: UserHttpService, private http: HttpClient) {}

  /*private create_options( params = {} ) {
    return  {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
    };
  }*/

  get_tables() {
    return this.http.get<Table[]>(/*this.url,*/this.endpoint/*, this.create_options()*/);
  }

  get_table(num: number) {
    return this.http.get<Table[]>(/*this.url + */this.endpoint + '/' + num/*, this.create_options()*/);
  }

  change_table(newTable/*: Table*/, associated_ticket: string) {
    newTable.associated_ticket = associated_ticket
    return this.http.patch<Table>(/*this.url +*/ this.endpoint + '/' + newTable.number, newTable/*, this.create_options()*/);
  }
}
