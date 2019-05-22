import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserHttpService } from './user-http.service';
import { observable } from 'rxjs';
import io = require('socket.io-client');

@Injectable({
  providedIn: 'root'
})
export class WaiterSocketioService {

  private socket;
  private observable;
  constructor( private us: UserHttpService, private sio : WaiterSocketioService ) { }

  connect()/*: Observable< any >*/ {

    this.socket = io(this.us.url);

    this.observable = new Observable( (observer) => {

      // The observer object must have two functions: next and error.
      // the first is invoked by our observable when new data is available. The
      // second is invoked if an error occurred

      this.socket.on('waiters', (m) => {
        console.log('Socket.io message for waiter received: ' + JSON.stringify(m) );
        observer.next( m );

      });

      this.socket.on('error', (err) => {
        console.log('Socket.io error: ' + err );
        observer.error( err );
      });

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return { unsubscribe() {
          this.socket.disconnect();
        } };

    });

  }

  getObserver() : Observable<any> {
    return this.observable;
  }
}
