import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendOrderService {

  constructor() { }

  static send(nick: any, selTable: any, selMenuEntry: any) {
    console.log('you have sent to server your order from ' + nick + ' by table ' + selTable + ' with ' + selMenuEntry);
  }
}
