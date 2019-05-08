import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public orders = [];
  private id = 2;

  constructor() {
    this.orders.push({id: 1, nick : '--' , selTable : '--' , selMenuEntry : '--'});
  }

  send(nick: any, selTable: any, selMenuEntry: any) {
    this.orders.push({id: this.id, nick , selTable, selMenuEntry});
    this.id += 1;
    console.log('you have sent to server your order from ' + nick + ' by table ' + selTable + ' with ' + selMenuEntry);
  }

  get(val) {
    return this.orders.filter(obj => (obj.selTable === val || obj.selTable === '--'));
  }

  orders_size() {
    return this.orders.length;
  }

  arrayRemove(arr, value) {

    return arr.filter((ele) => {
      if (ele.id == 1) {
        return true;
      }
      return ele.id != value;
    });

  }

  delete(value) {
    /*this.orders.forEach( (item, index) => {
      if (item.id == id) {this.orders.splice(index, 1 ); }
    });*/
    this.orders = this.arrayRemove(this.orders, value );
    console.log('you have deleted to server your order num ' + value);
  }
}
