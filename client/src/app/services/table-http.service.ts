import { Injectable } from '@angular/core';
import { UserHttpService } from './user-http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Table } from '../interfaces/Table';

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

  add_table(number: number, max_people: number) {
    return this.http.post<Table>(this.endpoint, {number: number, max_people: max_people});
  }

  delete_table(number: number) {
    console.log(number);
    return this.http.delete(this.endpoint + "/" + number);
  }
}
