import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  public orders = [];

  send(nick: any, selTable: any, selMenuEntry: any) {
    this.orders.push({nick , selTable, selMenuEntry});
    console.log('you have sent to server your order from ' + nick + ' by table ' + selTable + ' with ' + selMenuEntry);
  }

  get() {
    return this.orders;
  }
}
