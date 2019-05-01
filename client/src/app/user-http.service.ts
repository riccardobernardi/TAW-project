import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';

import { throwError } from 'rxjs';


import * as jwt_decode from 'jwt-decode';



// import { Observable } from 'rxjs/Observable';
// import jwt_decode = require('jwt-decode');
// import { ErrorObservable } from 'rxjs/observable';

import 'rxjs/observable/';
import {Observable} from 'rxjs';

@Injectable()
export class UserHttpService {

  constructor( private http: HttpClient ) {
    console.log('User service instantiated');

  }

  public token = '';
  public url = 'http://localhost:8080';

  login( mail: string, password: string, remember: boolean ): Observable<any> {

    console.log('Login: ' + mail + ' ' + password );
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa( mail + ':' + password),
        'cache-control': 'no-cache',
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };

    return this.http.get( this.url + '/login',  options, ).pipe(
      tap( (data) => {
        console.log(JSON.stringify(data));
        this.token = data.token;
        if ( remember ) {
          localStorage.setItem('postmessages_token', this.token );
        }
      }));
  }

  renew(): Observable<any> {

    const tk = localStorage.getItem('postmessages_token');
    if ( !tk || tk.length < 1 ) {
      return throwError({error: {errormessage: 'No token found in local storage'}});
    }

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + tk,
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      })
    };

    console.log('Renewing token');
    return this.http.get( this.url + '/renew',  options, ).pipe(
      tap( (data) => {
        console.log(JSON.stringify(data));
        this.token = data.token;
        localStorage.setItem('postmessages_token', this.token );
      }));
  }

  logout() {
    console.log('Logging out');
    this.token = '';
    localStorage.setItem('postmessages_token', this.token);
  }

  register( user ): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      })
    };

    return this.http.post( this.url + '/users', user, options ).pipe(
      tap( (data) => {
        console.log(JSON.stringify(data) );
      })
    );

  }

  get_token() {
    return this.token;
  }

  get_username() {
    return jwt_decode(this.token).username;
  }

  get_mail() {
    return jwt_decode(this.token).mail;
  }

  get_id() {
    return jwt_decode(this.token).id;
  }

  is_admin(): boolean {
    const roles = jwt_decode(this.token).roles;
    for ( let idx = 0; idx < roles.length; ++idx ) {
      if ( roles[idx] === 'ADMIN' ) {
        return true;
      }
    }
    return false;
  }

  is_moderator(): boolean {
    const roles = jwt_decode(this.token).roles;
    for ( let idx = 0; idx < roles.length; ++idx ) {
      if ( roles[idx] === 'MODERATOR' ) {
        return true;
      }
    }
    return false;
  }
}
