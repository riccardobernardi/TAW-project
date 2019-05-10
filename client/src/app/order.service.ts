import {EventEmitter, Injectable, Output} from '@angular/core';
import {Order} from './Order';
import {catchError, tap} from 'rxjs/operators';
import {UserService} from './user.service';
import {Router} from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {ErrorObservable} from 'rxjs-compat/observable/ErrorObservable';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public orders = [];
  private id = 2;

  constructor(private us: UserService, private router: Router, private order: OrderService, private http: HttpClient  ) {
    this.orders.push({id: 1, nick : '--' , selTable : '--' , selMenuEntry : '--'});
    console.log('Message service instantiated');
    console.log('User service token: ' + us.get_token() );
  }

  send(o: any) {
    this.orders.push(o);
    console.log('you have sent to server your order from ' + o.nick + ' by table ' + o.selTable + ' with ' + o.selMenuEntry);
  }

/*  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        'body was: ' + JSON.stringify(error.error));
    }

    // return an ErrorObservable with a user-facing error message
    return new Error('Something bad happened; please try again later.');
  }*/

  get(val?) {
    let m;
    if (val == undefined) {
      m = this.orders;
    } else{
      m = this.orders.filter(obj => (obj.selTable === val || obj.selTable === '--'));
    }

    /*return this.http.get<Order[]>( this.us.url + '/messages', this.create_options( {limit: '10', skip: '0'} ) ).pipe(
      tap( (data) => console.log(JSON.stringify(data))) ,
      catchError( this.handleError )
    );*/
    return m;
  }

  orders_size() {
    return this.orders.length;
  }

  arrayRemove(arr, value) {

    return arr.filter((ele) => {
      if (ele.id == 1) {
        return true;
      }
      return ele.id != value;
    });

  }

  delete(value) {
    /*this.orders.forEach( (item, index) => {
      if (item.id == id) {this.orders.splice(index, 1 ); }
    });*/
    this.orders = this.arrayRemove(this.orders, value );
    console.log('you have deleted to server your order num ' + value);
  }

  get_id() {
    this.id += 1;
    return (this.id - 1);
  }
}
