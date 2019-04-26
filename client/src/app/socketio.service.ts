import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';
import io = require('socket.io-client');

@Injectable()
export class SocketioService {

  private socket;
  constructor( private us: UserService ) { }

  connect(): Observable< any > {

    this.socket = io(this.us.url);

    return new Observable( (observer) => {

      // The observer object must have two functions: next and error.
      // the first is invoked by our observable when new data is available. The
      // second is invoked if an error occurred

      this.socket.on('broadcast', (m) => {
        console.log('Socket.io message received: ' + JSON.stringify(m) );
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

}
