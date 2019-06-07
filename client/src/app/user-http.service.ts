import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { throwError, of } from 'rxjs';

import * as jwt_decode from 'jwt-decode';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class UserHttpService {

  public token = '';
  public endpoint = 'users';
  private renew_clock;
  private renew_clock_interval;

  constructor( private http: HttpClient, private router: Router ) {
    //console.log('User service instantiated');
    //console.log(sessionStorage.getItem("restaurant_token"));
    //console.log(this.token = sessionStorage.getItem("restaurant_token"));
    setTimeout(() => {
      this.refreshAll()
    }, 50)
  }

  private set_token(token) {
    this.token = token;
    sessionStorage.setItem('restaurant_token', this.token );
    let decoded_token = jwt_decode(this.token)
    let exp_date = decoded_token.iat*1000 + Math.floor((decoded_token.exp - decoded_token.iat)*1000*0.9);
    let now = new Date().getTime();
    if(exp_date - now > 0) {
      this.renew_clock_interval = exp_date - now;
      this.renew_clock = setInterval(() => {this.renew().subscribe((data) => {
        let decoded_token = jwt_decode(data.token)
        //console.log(new Date());
        //console.log(new Date(decoded_token.iat*1000 + Math.floor((decoded_token.exp - decoded_token.iat)*1000)));
        this.token = data.token;
        sessionStorage.setItem("restaurant_token", data.token);
      }, () => {this.logout();})}, this.renew_clock_interval);
    } else this.logout();
  }

  private refreshAll() {
    this.renew().subscribe((data) => {
      //console.log("Renew in refreshAll")
      this.set_token(data.token)
    }, () => {this.logout()});
  }

  login( nick: string, password: string ): Observable<any> {

    //console.log('Login: ' + nick + ' ' + password );
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa( nick + ':' + password),
      })
    };

    return this.http.get( /*this.url + */'login',  options ).pipe(
      tap( (data) => {
        //console.log(JSON.stringify(data));
        this.set_token(data.token);
      })
    );
  }

  public renew(): Observable<any> {

    const tk = sessionStorage.getItem('restaurant_token');
    if ( !tk || tk.length < 1 ) {
      return throwError({error: {errormessage: 'No token found in local storage'}});
    }

    //console.log("Renewing token");
    return this.http.get('renew');

  }

  logout() {
    //console.log('Logging out');
    this.token = '';
    sessionStorage.removeItem('restaurant_token');
    clearInterval(this.renew_clock);
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    clearInterval(this.renew_clock);
  }

  register( user ): Observable<any> {

    return this.http.post(this.endpoint, user)/*.pipe(
      tap( (data) => {
        console.log(JSON.stringify(data) );
      })
    )*/;

  }

  get_token() {
    this.token = sessionStorage.getItem('restaurant_token');
    //console.log(this.token);
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

    return this.http.get(this.endpoint);
  }

  deleteUser(selDelUser) {
    //console.log('deleted:' + selDelUser);

    return this.http.delete(this.endpoint + "/" + selDelUser);/*.pipe(
      tap( (data) => {
        console.log(JSON.stringify(data) );
      })
    )*/
  }

  changePasswordUser(selUser, newPwd) {
    //console.log('new pwd is : ' + newPwd + 'for user : ' + selUser);

    const user = { username: selUser.username, password: newPwd, role: selUser.role };

    //console.log(this.endpoint + '/' + selUser);

    //console.log(user.role)
    return this.http.put(this.endpoint + '/' + selUser.username, user);/*.pipe(
      tap( (data) => {
        console.log(options);
        console.log(JSON.stringify(data) );
      }));*/
  }
}
