import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {UserHttpService} from './user-http.service';
import {Order} from './Order';
import {mockorders} from './mock-orders';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderHttpService {
  /*public items: any = [];*/

  constructor(private us: UserHttpService, private router: Router, private http: HttpClient  ) {
    /*this.orders.push({id: 1, nick : '--' , selTable : -1 , selMenuEntry : '--',
      in_progress: false, ready: false, timestamp: Date.now(), type: ''});*/
    console.log('Order service instantiated');
    // console.log('User service token: ' + us.get_token() );
    // this.get_items();
    // console.log(JSON.stringify(this.items));
  }

  /*public orders: Order[] = mockorders;*/
  private id = 2;

  public url = 'http://localhost:8080';

  get_items() {
    // return [{username : 'paolo', role: 'WAITER'}, {username : 'gianni', role: 'WAITER'}];

    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }).append('Authorization', 'Bearer ' + this.us.get_token())
    };

    // console.log('qui gli items');

    return this.http.get( this.url + '/items', options )/*.pipe(
      tap( (data) => {
        this.items.push(data);
        // console.log(data);
      })
    );*/
  }

  /*private messageSource = new BehaviorSubject(this.orders);
  currentMessage = this.messageSource.asObservable();*/

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

  /*get(val?) {
    let m ;
    if (val === undefined) {
      m = this.orders;
    } else {
      m = this.orders.filter(obj => (obj.selTable == val || obj.selTable == -1));
    }*/

    /*return this.http.get<Order[]>( this.us.url + '/messages', this.create_options( {limit: '10', skip: '0'} ) ).pipe(
      tap( (data) => console.log(JSON.stringify(data))) ,
      catchError( this.handleError )
    );*/
    // return new Observable(m);
    // console.log(m);
    //return m;
  //}

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

  /*orders_size() {
    return this.orders.length;
  }*/

  /*get_id() {
    this.id += 1;
    return (this.id - 1);
  }*/

  post_order(o: Order)/*: Observable<Order>*/  {
    /*this.orders.unshift(o);
    this.posted.emit(o);
    return of(o);*/
  }
}
