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

  get_tables() {
    return this.http.get<Table[]>(this.endpoint);
  }

  get_table(num: number) {
    return this.http.get<Table[]>(this.endpoint + '/' + num);
  }

  change_table(newTable/*: Table*/, associated_ticket: string) {
    newTable.associated_ticket = associated_ticket
    return this.http.patch<Table>(this.endpoint + '/' + newTable.number, newTable);
  }
}
