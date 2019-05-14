import {EventEmitter, Injectable, Output} from '@angular/core';
import {Order} from './Order';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {ErrorObservable} from 'rxjs-compat/observable/ErrorObservable';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {mockorders} from './mock-orders';
import {UserHttpService} from './user-http.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public orders: Order[] = [];
  private id = 2;

  /*private messageSource = new BehaviorSubject(this.orders);
  currentMessage = this.messageSource.asObservable();*/

  constructor(private us: UserHttpService, private router: Router, private http: HttpClient  ) {
    this.orders.push({id: 1, nick : '--' , selTable : -1 , selMenuEntry : '--', in_progress: false, ready: false, timestamp: Date.now(), type: ''});
    console.log('Message service instantiated');
    console.log('User service token: ' + us.get_token() );
  }

  @Output() posted: EventEmitter<Order> = new EventEmitter();

  /*changeMessage(o: Order[]) {
    this.messageSource.next(o);
  }*/

  /*send(o: any) {
    this.orders.push(o);
    console.log('you have sent to server your order from ' + o.nick + ' by table ' + o.selTable + ' with ' + o.selMenuEntry);
  }*/

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
    let m ;
    if (val === undefined) {
      m = this.orders;
    } else {
      m = this.orders.filter(obj => (obj.selTable === val || obj.selTable === -1));
    }

    /*return this.http.get<Order[]>( this.us.url + '/messages', this.create_options( {limit: '10', skip: '0'} ) ).pipe(
      tap( (data) => console.log(JSON.stringify(data))) ,
      catchError( this.handleError )
    );*/
    // return new Observable(m);
    console.log(m);
    return of(m);
  }

/*  private create_options( params = {} ) {
    return  {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
      params: new HttpParams( {fromObject: params} )
    };

  }*/

  /*private handleError(error: HttpErrorResponse) {
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
    return new ErrorObservable('Something bad happened; please try again later.');
  }*/

/*  get_orders(): Observable<Order[]> {
    return this.http.get<Order[]>( this.us.url + '/Orders', this.create_options( {limit: '10', skip: '0'} ) ).pipe(
      tap( (data) => console.log(JSON.stringify(data))) ,
      catchError( this.handleError )
    );
  }*/

  orders_size() {
    return this.orders.length;
  }

  get_id() {
    this.id += 1;
    return (this.id - 1);
  }

  post_order(o: Order): Observable<Order>  {
    this.orders.unshift(o);
    this.posted.emit(o);
    return of(o);
  }
}
