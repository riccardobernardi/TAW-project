import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {UserHttpService} from './user-http.service';
import { environment } from "../environments/environment";

@Injectable()
export class SocketioService {

  private socket;

  constructor( private us: UserHttpService ) {
    this.socket = io(environment.base_url);
  }

  get() {
    return this.socket;
  }
}
