import { Injectable } from '@angular/core';
import {UserHttpService} from './user-http.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Item} from './Item';

@Injectable({
  providedIn: 'root'
})
export class ItemHttpService {

  public endpoint = 'items';

  constructor( private http: HttpClient, private us: UserHttpService ) {
  }

  /*private create_options( ) {
    return  {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      })
    };
  }*/


  // lo userservice.getToken() si può cambiare con httpinterceptor e aggiungere in ogni richiesta l'header con il token

  get_Items() {
    return this.http.get<Item[]>( /*this.url + '/*/this.endpoint/*, this.create_options()*/ );
  }
}
