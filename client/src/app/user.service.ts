
// @Injectable({
//   providedIn: 'root'
// })

import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import {Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
// import jwt_decode = require('jwt-decode');
// import { of } from 'rxjs/observable/of';
// import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  constructor() { }

  private token = '';
  public url = '';

  login( nick: string, password: string ): Observable<any> {
    console.log('Login: ' + nick + ' ' + password );

    // tslint:disable-next-line:max-line-length
    if (nick == "") {
      //waiter
      this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxMjM0NTY3ODkiLCJ1c2VybmFtZ' +
        'SI6ImFkbWluIiwicm9sZSI6IndhaXRlciIsIm5pY2siOiJwYW9sbyIsImlhdCI6MTUyMjg1NjI1NywiZXhwIjoxNTIyO' +
        'DU5ODU3fQ._sB89biEzNjcOK4a-MI2QeKKwK_IzrxQLHkriGarebg';

    } else {
      //cook
      this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxMjM0NTY3ODkiLCJ1c2VybmFtZSI6Im' +
        'FkbWluIiwicm9sZSI6ImNvb2siLCJuaWNrIjoiZnJhbmNvIiwiaWF0IjoxNTIyODU2MjU3LCJleHAiOjE1MjI4NTk4NTd9.h' +
        'aFknqthmLTUXdRaAIBHeSUfRlvvxcsui09hemsIpmY';

    }
    return of( {} );
  }

  renew(): Observable<any> {
    return of( {} );
  }

  register(user ): Observable<any> {
    return of( {} );
  }

  logout() {
    this.token = '';
  }

  get_token() {
    return this.token;
  }

  get_role() {
    console.log('lollo cazzaro: ' + jwt_decode(this.token).role);
    console.log('lollo cazzaro: ' + (this.token));
    return jwt_decode(this.token).roles[0];
  }

  get_nick() {
    return jwt_decode(this.token).nick;
  }

  get_id() {
    return jwt_decode(this.token).id;
  }
}
