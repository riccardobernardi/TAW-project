import { Injectable } from '@angular/core';
import {UserHttpService} from './user-http.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Item} from '../interfaces/Item';

@Injectable({
  providedIn: 'root'
})
export class ItemHttpService {

  public endpoint = 'items';

  constructor( private http: HttpClient, private us: UserHttpService ) {
  }

  get_Items() {
    return this.http.get<Item[]>(this.endpoint);
  }
}
