import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';
import {UserHttpService} from './user-http.service';

@Injectable()
export class SocketioService {

  private socket;
  constructor( private us: UserHttpService ) { }

  connect(){
    this.socket = io(this.us.url);
  }

  get() {
    return this.socket;
  }
}
