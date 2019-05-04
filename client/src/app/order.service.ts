import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  public orders = [];
  private id = 0;

  send(nick: any, selTable: any, selMenuEntry: any) {
    this.orders.push({id: this.id, nick , selTable, selMenuEntry});
    this.id += 1;
    console.log('you have sent to server your order from ' + nick + ' by table ' + selTable + ' with ' + selMenuEntry);
  }

  get(val) {
    return this.orders.filter(obj => obj.selTable === val);
  }

  delete(id) {
    if(id == undefined){
      id = 0;
    }
    this.orders.forEach( (item, index) => {
      if (item.id == id) {this.orders.splice(index, 1 ); }
    });
    console.log('you have deleted to server your order num ' + id);
  }
}
