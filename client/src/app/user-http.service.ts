import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';

import { throwError } from 'rxjs';

import * as jwt_decode from 'jwt-decode';

// import { Observable } from 'rxjs/Observable';
// import jwt_decode = require('jwt-decode');
// import { ErrorObservable } from 'rxjs/observable';

/*import 'rxjs/observable/';*/
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import { LogoutComponent } from './logout/logout.component';

@Injectable()
export class UserHttpService {

  public token = '';
  public endpoint = 'users';
  public users = [];
  private renew_clock;
  private renew_clock_interval;

  constructor( private http: HttpClient, private router: Router ) {
    console.log('User service instantiated');
  }

  login( nick: string, password: string ): Observable<any> {

    console.log('Login: ' + nick + ' ' + password );
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa( nick + ':' + password),
        /*'cache-control': 'no-cache',
        'Content-Type':  'application/x-www-form-urlencoded',*/
      })
    };

    return this.http.get( /*this.url + */'login',  options ).pipe(
      tap( (data) => {
        //console.log(JSON.stringify(data));
        this.token = data.token;
        sessionStorage.setItem('restaurant_token', this.token );
        let decoded_token = jwt_decode(this.token)
        let exp_date = decoded_token.iat*1000 + Math.floor((decoded_token.exp - decoded_token.iat)*1000*0.9);
        let now = new Date().getTime();
        if(exp_date - now > 0) {
          this.renew_clock_interval = exp_date - now;
          this.renew_clock = setInterval(() => {this.renew()}, this.renew_clock_interval);
        }
          else this.logout();
      }));
  }

  private renew(): Observable<any> {

    const tk = sessionStorage.getItem('restaurant_token');
    if ( !tk || tk.length < 1 ) {
      return throwError({error: {errormessage: 'No token found in local storage'}});
    }

    /*const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + tk,
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      })
    };*/

    console.log('Renewing token');
    //return this.http.get( /*this.url + '/*/'renew'/*,  options,*/ ).pipe(
      //tap( (data) => {
      //  console.log(data/*JSON.stringify(data)*/);
      /*  this.token = data.token;
        sessionStorage.setItem('restaurant_token', this.token );
      }));*/
      this.http.get( /*this.url + '/*/'renew'/*,  options,*/ ).subscribe((data) => {
        console.log(data/*JSON.stringify(data)*/);
        this.token = data.token;
        sessionStorage.setItem('restaurant_token', this.token );
      });

  }

  logout() {
    console.log('Logging out');
    this.token = '';
    sessionStorage.removeItem('restaurant_token');
    clearInterval(this.renew_clock);
    this.router.navigate(['/']);
  }

  register( user ): Observable<any> {
    /*const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }).append('Authorization', 'Bearer ' + this.get_token())
    };

    console.log(options);*/

    return this.http.post( /*this.url + '/*/this.endpoint, user/*, options */).pipe(
      tap( (data) => {
        console.log(JSON.stringify(data) );
      })
    );

  }

  get_token() {
    this.token = sessionStorage.getItem('restaurant_token');
    // console.log(this.token);
    return this.token;
  }

  get_nick() {
    return jwt_decode(this.token).username;
  }

  get_role() {
    // console.log('lollo cazzaro: ' + jwt_decode(this.token).roles[0]);
    // console.log('lollo cazzaro: ' + (this.token));
    return jwt_decode(this.token).role.toLowerCase();
  }

  get_id() {
    return jwt_decode(this.token).id;
  }

  get_users() {
    // return [{username : 'paolo', role: 'WAITER'}, {username : 'gianni', role: 'WAITER'}];

    /*const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }).append('Authorization', 'Bearer ' + this.get_token())
    };*/

    return this.http.get( /*this.url + '/*/this.endpoint/*, options*/ );
  }

  deleteUser(selDelUser) {
    console.log('deleted:' + selDelUser);

    /*const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
        username: selDelUser,
      }).append('Authorization', 'Bearer ' + this.get_token())
    };*/

    return this.http.delete( /*this.url + */this.endpoint + "/" + selDelUser/*, options */).pipe(
      tap( (data) => {
        console.log(JSON.stringify(data) );
      })
    ).subscribe();
  }

  changePasswordUser(selUser, newPwd) {
    console.log('new pwd is : ' + newPwd + 'for user : ' + selUser);

    const user = { username: selUser, password: newPwd, role: '' };
    user.role = this.users.filter((u) => u.username == selUser)[0].role;

    /*const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }).append('Authorization', 'Bearer ' + this.get_token())
    };*/

    console.log(/*this.url + '/*/this.endpoint + '/' + selUser );

    return this.http.put( /*this.url + '/*/this.endpoint + '/' + selUser, user/*, options*/ ).pipe(
      tap( (data) => {
        //console.log(options);
        console.log(JSON.stringify(data) );
      })).subscribe();
  }
}
