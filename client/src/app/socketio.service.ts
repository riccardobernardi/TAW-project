import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';
import {UserHttpService} from './user-http.service';
import { environment } from "../environments/environment";

@Injectable()
export class SocketioService {

  private socket;

  constructor( private us: UserHttpService ) {
    this.socket = io(/*this.us.url*/environment.base_url);
  }

  get() {
    return this.socket;
  }
}
