
// @Injectable({
//   providedIn: 'root'
// })

import { Injectable } from '@angular/core';
import * as jwtdecode from 'jsonwebtoken';
import {Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
// import jwtdecode = require('jwt-decode');
// import { of } from 'rxjs/observable/of';
// import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  constructor() { }

  private token = '';
  public url = '';

  login( mail: string, password: string, remember: boolean ): Observable<any> {
    console.log('Login: ' + mail + ' ' + password );

    // tslint:disable-next-line:max-line-length
    this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiQURNSU4iLCJNT0RFUkFUT1IiXSwibWFpbCI6ImFkbWluQHBvc3RtZXNzYWdlcy5pdCIsImlkIjoiNWFjNGRkYzcxMWUwMzYwYmEyZGYzZjQ4IiwiaWF0IjoxNTIyODU2MjU3LCJleHAiOjE1MjI4NTk4NTd9.3p6TmJAMqL19h4-b_r2pBdyerdbHh_l3zA87ZTfqeYk';
    return of( {} );
  }

  renew(): Observable<any> {
    return of( {} );
  }

  register( user ): Observable<any> {
    return of( {} );
  }

  logout() {
    this.token = '';
  }

  get_token() {
    return this.token;
  }

  get_username() {
    return jwtdecode(this.token).username;
  }

  get_mail() {
    return jwtdecode(this.token).mail;
  }

  get_id() {
    return jwtdecode(this.token).id;
  }

  is_admin(): boolean {
    const roles = jwtdecode(this.token).roles;
    for ( let idx = 0; idx < roles.length; ++idx ) {
      if ( roles[idx] === 'ADMIN' ) {
        return true;
      }
    }
    return false;
  }

  is_moderator(): boolean {
    const roles = jwtdecode(this.token).roles;
    for ( let idx = 0; idx < roles.length; ++idx ) {
      if ( roles[idx] === 'MODERATOR' ) {
        return true;
      }
    }
    return false;
  }

}
